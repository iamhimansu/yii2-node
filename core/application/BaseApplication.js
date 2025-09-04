class BaseApplication {
    constructor(configs) {
        this.configs = configs;
        this.expressApp = null;
        this.router = null;
        this.controllerId = null;
        this.moduleId = null;
        this.actionId = null;
    }
}

module.exports = BaseApplication;