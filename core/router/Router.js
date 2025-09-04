const RouteParser = require("./routeParser");
const path = require("path");

class Router {
    constructor(application) {
        this.application = application;
        this.router = this.application.coreExpress.Router();
    }

    handle() {
        const router = this.router;

        router.use(async (req, res, next) => {
            const routeParser = new RouteParser(this, req.url);
            const moduleId = routeParser.getModule();

            /**
             * If no module is found
             */

            if (!moduleId) {
                router.use('/bootstrap', this.application.coreExpress.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
                router.use('/icons', this.application.coreExpress.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));
                const fallbackPage = path.join(__dirname, "../../web/site/index.html");
                return res.sendFile(fallbackPage, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Internal Server Error");
                    }
                });
            }

            /**
             * If module is not configured in this.application.configs
             */
            if (!this.application.configs.modules[moduleId]) {
                return res.status(404).send(`<b>[${moduleId}]</b> module not found ${JSON.stringify(this.application.configs.modules)}`);
            }

            /**
             * If only module is found
             */
            let {controller, action} = [routeParser.getController(), routeParser.getAction()];

            if (!controller && !action) {
                return res.status(404).send(moduleId);
            }
            next();
        })

        this.application.express.use(router);
    }
}

module.exports = Router;