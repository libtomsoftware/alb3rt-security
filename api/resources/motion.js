const core = require('alb3rt-core'),
    motion = require('../../motion'),
    CONFIG = core.config,
    STATUS_CODE = CONFIG.CONSTANTS.HTTP_CODE;

module.exports = new class Alb3rtSecurityResourcesMotion {

    constructor() {

    }

    post(request, response) {
        motion.handle(request.body);

        core.api.responder.send(response, {
            status: STATUS_CODE.OK,
            data: {}
        });
    }
};
