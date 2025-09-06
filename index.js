const webConfigs = require("./app/config/web");
const CoreApplication = require("./core/application/WebApplication");
const CoreController = require("./core/controller/Controller");
const CoreModule = require("./core/module/Module");
const CoreObject = require("./core/object/Object");
webConfigs.basePath = webConfigs.basePath || __dirname;

/**
 * Make it globally
 */
globalThis.Yii = {
    App: CoreApplication.getInstance(webConfigs),
    Controller: CoreController,
    Module: CoreModule,
    Object: CoreObject,
};

Yii.App.router.handle();

Yii.App.run();
