const FILE_ID = 'motion',
    core = require('alb3rt-core'),
    http = core.http,
    state = require('../state'),
    logger = core.logger;

module.exports = new class Alb3rtSecurityMasterMotion {
    constructor() {}

    record(ip, port) {
        http.post({
            url: `http://${ip}:${port}/api/record`,
            body: {
                state: 'on'
            }
        })
        .catch(error => {
            logger.warn(FILE_ID, `Camera record triggering error. Status: ${error}`);
        });
    }

    handle(device) {
        const { ip, port, timestamp } = device,
            event = `motion@${ip}:${port}@${timestamp}`;

        if (state.current.enabled) {
            logger.warn(FILE_ID, `${event}, handling...`);

            if (device.camera_port) {
                logger.log(FILE_ID, 'Device equipped with camera, triggering recording...');
                this.record(ip, parseInt(device.camera_port, 10));
            }

            if (state.current.armed) {
                console.log('ALERT!!!');
            }
        } else {
            logger.log(FILE_ID, `${event}, but security is disabled. Aborting...`);
        }
    }
};
