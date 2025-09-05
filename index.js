const webConfigs = require('./app/config/web');
const Application = require('./core/application/WebApplication');
const configs = require("./app/config/web");

configs.basePath = configs.basePath || __dirname;

/**
 * Make it globally
 */
global.App = Application.getInstance(webConfigs);

App.router.handle();

App.run();
