const BaseObject = require("../object/BaseObject");

class BaseController extends BaseObject {
    constructor(app) {
        super(app);
        this.application = app;
        this.defaultAction = 'index';
    }
}

module.exports = BaseController;