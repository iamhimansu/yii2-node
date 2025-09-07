const RouteParser = require("./RouteParser");
const path = require("path");
const RouteResolver = require("../router/RouteResolver");
const Response = require("../response/BaseResponse");
const ErrorHandler = require("../error/ErrorHandler");

class Router {
    constructor(application) {
        this.application = application;
        this.router = this.application.coreExpress.Router();
    }

    handle() {
        const router = this.router;

        router.use('/bootstrap', this.application.coreExpress.static(path.join(Yii.App.basePath, 'node_modules/bootstrap/dist')));
        router.use('/icons', this.application.coreExpress.static(path.join(Yii.App.basePath, 'node_modules/bootstrap-icons/font')));

        router.use(async (req, res, next) => {

            try {
                /**
                 * Set request and response in App
                 */
                Yii.App.request = req;
                Yii.App.response = res;
                
                /**
                 *
                 * @type {RouteParser}
                 */
                const routeParser = new RouteParser(this, req.path);
                const moduleId = routeParser.getModuleId();

                /**
                 * If no module is found
                 */

                if (!moduleId) {
                    const fallbackPage = path.join(Yii.App.basePath, "web/site/index.html");
                    return res.sendFile(fallbackPage, (err) => {
                        if (err) {
                            next(err);
                        }
                    });
                }

                const routeResolver = new RouteResolver(routeParser);

                const content = await routeResolver.init();

                await Response.dispatch(content);

                next();

            } catch (e) {
                next(e);
            }
        })

        /**
         * Link router with express
         */
        this.application.express.use(router);

        // /**
        //  * Global error handler
        //  */
        // this.application.express.use((err, req, res, next) => {
        //     const configs = Yii.App.configs;

        //     if (configs.debug) {
        //         throw err;
        //     }

        //     return res.status(500).send(err.toString());

        // });

        /**
         * Global error handler
         */
        this.application.express.use((err, req, res, next) => { 
            new ErrorHandler(err, req, res, next);
        
        });
    }
}

module.exports = Router;