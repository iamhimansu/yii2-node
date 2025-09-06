const BaseObject = require("../object/BaseObject");

class BaseModule extends BaseObject {
    constructor(app) {
        super(app);
        this.application = app;
        this.controllerPath = null;
        this.viewPath = null;
        this.defaultRoute = null;
    }
}

module.exports = BaseModule;