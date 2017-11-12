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
            body: {}
        });
    }

    handle(device) {
        const { ip, port, timestamp } = device,
            event = `motion@${ip}:${port}@${timestamp}`;

        if (state.current.enabled) {
            logger.warn(FILE_ID, `${event}, handling...`);
            //this.record(ip, port);

            if (state.current.armed) {
                console.log('ALERT!!!');
            }
        } else {
            logger.log(FILE_ID, `${event}, but security is disabled. Aborting...`);
        }
    }
};
