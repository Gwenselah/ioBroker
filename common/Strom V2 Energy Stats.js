// v0.1
//für Zählerstände
const axios = require('axios').default;

const influxDbInstance = 'influxdb.0';
const token = '7K1-P0cSPuV5erxNOS-wYTdzP4rL9qcwgHUMzMcyvfLVnIxbF4dvCwmiaIENKLWvfn6a9QfxVhUD0Lay4jF-ZQ==';
const measurement = 'energy-stats';

const loggingTemplate = {
    '0_userdata.0.energy.contract.electricity.kWhPrice': 'priceIn',
    '0_userdata.0.energy.contract.electricity.kWhPriceExport': 'priceOut',
    'alias.0.PowerMeasurement.TotalImportedEnergy': 'importedWh',
    'alias.0.PowerMeasurement.TotalExportedEnergy': 'exportedWh',   
    '0_userdata.0.energy.electricity.meter.SolarTotal': 'generatedWh',
    'alias.0.PowerMeasurement.WallboxLifeTimeEnergy': 'wallboxWh'
};

const loggingObj = {};

async function start() {
    const influxDbInstanceConfig = await getObjectAsync(`system.adapter.${influxDbInstance}`);

    const protocol = influxDbInstanceConfig.native.protocol;
    const host = influxDbInstanceConfig.native.host;
    const port = influxDbInstanceConfig.native.port;
    const org = influxDbInstanceConfig.native.organization;
    const bucket = influxDbInstanceConfig.native.dbname;

    console.log(`Starting "${measurement}" logging to ${protocol}://${host}:${port} into bucket "${bucket}" by org ${org}`);

    // Init loggingObj with current values
    for (let [objId, key] of Object.entries(loggingTemplate)) {
        const state = await getStateAsync(objId);
        if (state && !isNaN(state.val)) {
            loggingObj[key] = state.val;
        } else {
            loggingObj[key] = 0;
        }
    }

    on({ id: Object.keys(loggingTemplate), change: 'ne' }, async (obj) => {
        // Update value in loggingObj
        const key = loggingTemplate[obj.id];
        loggingObj[key] = obj.state.val;

        // Save Data
        const data = `${measurement} ${Object.keys(loggingObj)
            .filter(key => !isNaN(loggingObj[key]))
            .map((key) => `${key}=${loggingObj[key]}`)
            .join(',')}`;

        if (data) {
            // console.log(`Saving "${data}" to InfluxDB @ ${protocol}://${host}:${port}/`);

            axios.post(`${protocol}://${host}:${port}/api/v2/write?bucket=${bucket}&org=${org}`, data, {
                headers: {
                    'Content-Type': 'text/plain',
                    'Authorization': `Token ${token}`
                }
            }).catch(err => {
                console.error(err);
            });
        }
    });
}
start();

