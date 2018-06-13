const FILE_ID = 'state',
    core = require('alb3rt-core'),
    logger = core.logger,
    CONFIG = core.config,
    STATUS_CODE = CONFIG.CONSTANTS.HTTP_CODE,
    ENV = process.env;

module.exports = new class Alb3rtSecurityState {
    constructor() {
        this.$state = {
            enabled: false,
            armed: false
        };

        this.armTimeout = null;

        this.arm = this.arm.bind(this);
        this.disarm = this.disarm.bind(this);
        this.enable = this.enable.bind(this);
        this.disable = this.disable.bind(this);
    }

    arm() {
        this.current = {
            armed: true
        };
        logger.log(FILE_ID, 'System armed.');
    }

    disarm() {
        clearTimeout(this.armTimeout);
        this.current = {
            armed: false
        };
        logger.log(FILE_ID, 'System disarmed...');
        return STATUS_CODE.OK;
    }

    disable() {
        this.disarm();
        this.current = {
            enabled: false
        };
        logger.log(FILE_ID, 'System disabled...');
    }

    enable() {
        this.current = {
            enabled: true
        };
        logger.log(FILE_ID, 'System enabled...');
        this.armTimeout = setTimeout(this.arm, ENV.SYSTEM_ARMED_TIMEOUT);
    }

    update(data) {
        const current = this.current.enabled;
        const requested = data.state;
        const status = {
            ok: STATUS_CODE.OK,
            conflict: STATUS_CODE.CONFLICT,
            forbidden: STATUS_CODE.FORBIDDEN
        };

        if (requested === undefined) {
            return status.forbidden;
        }

        if (current === requested) {
            logger.warn(FILE_ID, `Aborting state update, already ${current ? 'enabled' : 'disabled'}`);
            return status.conflict;
        }

        (requested === 'enabled' ? this.enable : this.disable)();
        return status.ok;
    }

    set current(update) {
        this.$state = Object.assign({}, this.current, update);
    }

    get current() {
        return this.$state;
    }
};
