class BaseApplication {
    constructor(configs) {
        this.configs = configs;
        this.expressApp = null;
        this.router = null;
        this.controllerId = null;
        this.moduleId = null;
        this.actionId = null;
        this.basePath = null;
    }
}

module.exports = BaseApplication;