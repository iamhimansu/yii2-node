const RouteParser = require("./routeParser");
const path = require("path");
const RouteResolver = require("../router/RouteResolver");

class Router {
    constructor(application) {
        this.application = application;
        this.router = this.application.coreExpress.Router();
    }

    handle() {
        const router = this.router;
        const configs = this.application.configs;

        router.use(async (req, res, next) => {
            this.request = req;
            this.response = res;

            const routeParser = new RouteParser(this, req.url);
            const moduleId = await routeParser.getModuleId();

            /**
             * If no module is found
             */
            if (!moduleId) {
                router.use('/bootstrap', this.application.coreExpress.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
                router.use('/icons', this.application.coreExpress.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));
                const fallbackPage = path.join(App.basePath, "web/site/index.html");
                return res.sendFile(fallbackPage, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }

            /**
             * If only module is found
             */

            const M_C_A = new RouteResolver(
                this.application,
                routeParser
            );
            await M_C_A.init();

            return;
            if (!controller && !action) {
                return res.status(404).send(moduleId);
            }
            next();
        })

        /**
         * Link router with express
         */
        this.application.express.use(router);

        /**
         * Global error handler
         */
        this.application.express.use((err, req, res, next) => {
            const configs = this.application.configs;

            if (configs.debug) {
                throw err;
            }

            return res.status(500).send(err.toString());

        });
    }
}

module.exports = Router;