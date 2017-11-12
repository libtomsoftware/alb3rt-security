const core = require('alb3rt-core'),
    logger = core.logger,
    state = require('../../state'),
    CONFIG = core.config,
    STATUS_CODE = CONFIG.CONSTANTS.HTTP_CODE,
    FILE_ID = 'resources/state';

module.exports = new class Alb3rtSecurityResourcesRegistry {

    constructor() {
        this.validPasscodes = this.getValidPasscodesFromEnv();
    }

    isUnauthorized(data) {
        return !data.passcode || this.validPasscodes.indexOf(data.passcode) === -1;
    }

    getValidPasscodesFromEnv() {
        const env = process.env,
            prefix = 'SECURITY_PASSCODE_',
            suffixes = ['ONE', 'TWO', 'THREE', 'FOUR'],
            keys = suffixes.map(suffix => prefix + suffix),
            passcodes = [];

        keys.forEach(key => {
            if (env[key]) {
                passcodes.push(env[key]);
            }
        });

        return passcodes;
    }

    checkData(data, response) {
        if (!data) {
            logger.error(FILE_ID, 'No required body in request, aborting...');
            core.api.responder.reject(response);
            return null;
        }

        data = this.parseData(data);

        if (this.isUnauthorized(data)) {
            core.api.responder.rejectUnauthorized(response);
            return null;
        }

        return data;
    }

    parseData(data) {
        if (data.json) {
            data = core.api.parser.parsePostData(data.json);
        }
        return data;
    }

    get(request, response) {
        core.api.responder.send(response, {
            status: STATUS_CODE.OK,
            data: state.current
        });
    }

    //enable or arm
    post(request, response) {
        const data = this.checkData(request.body, response);

        if (data) {
            core.api.responder.send(response, {
                status: state.update(data)
            });
        }
    }

    //disarm
    put(request, response) {
        core.api.responder.send(response, {
            status: state.disarm()
        });
    }

    //disable
    delete(request, response) {
        core.api.responder.send(response, {
            status: state.disable()
        });
    }
};
