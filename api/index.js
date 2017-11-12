const core = require('alb3rt-core'),
    state = require('./resources/state'),
    motion = require('./resources/motion');

module.exports = new class Alb3rtSecurityMasterApi {
    constructor() {
        core.api.extend('motion', motion);
        core.api.extend('state', state);
    }
};
