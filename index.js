const webConfigs = require('./app/config/web');
const Application = require('./core/application/WebApplication');


const app = new Application(webConfigs);

app.router.handle();

app.run();
