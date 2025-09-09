const path = require("path");
const ModuleNotFound = require("../exceptions/ModuleNotFound");
const ModulePathNotFound = require("../exceptions/ModulePathNotFound");
const RouteNotFound = require("../exceptions/RouteNotFound");
const ActionNotFound = require("../exceptions/ActionNotFound");
const ControllerPathNotFound = require("../exceptions/ControllerPathNotFound");
const NonInstantiableClass = require("../exceptions/NotInstantiableClass");
const ParameterNotFound = require("../exceptions/ParameterNotFound");

class RouteResolver {
    constructor(routeParser) {
        this.routeParser = routeParser;
    }

    async init() {

        const application = Yii.App;
        const ROOT = application.basePath;
        const configs = application.configs;
        const moduleId = this.routeParser.getModuleId();

        /**
         * If module is not configured in configs
         */
        if (!configs.modules[moduleId]) {
            throw new ModuleNotFound(moduleId);
        }

        //Set module id
        Yii.App.moduleId = moduleId;

        /**
         * If module is found but path is not declared
         */
        if (!configs.modules[moduleId].class) {
            throw new ModulePathNotFound(moduleId);
        }

        let Module;

        try {
            //Get module class
            const moduleClass = require(path.join(ROOT, configs.modules[moduleId].class));

            Module = new moduleClass(application);

            Yii.App.module = Module;

            //Set module controller path if it is null
            if (!Module.controllerPath) {
                Module.controllerPath = path.join(
                    path.dirname(configs.modules[moduleId].class),
                    "controllers"
                );
            }

        } catch (error) {
            throw new NonInstantiableClass(Yii.App.moduleId);
        }


        let controllerId = this.routeParser.getControllerId();

        /**
         * Check if defaultRoute is empty
         */
        if (!controllerId) {
            controllerId = Module.defaultRoute;
            if (!controllerId) {
                throw new RouteNotFound(controllerId);
            }
        }

        //Set controller id
        Yii.App.controllerId = controllerId;

        let Controller;

        try {
            //Get controller class
            const controllerClass = require(
                path.join(
                    ROOT,
                    Module.controllerPath,
                    [
                        this.routeParser.capitalize(controllerId),
                        'Controller',
                        '.js'
                    ].join('')
                )
            );

            /**
             * Ensure inheritance of Controller from BaseController
             * @type {Controller}
             */
            Controller = new controllerClass(application);

        } catch (error) {
            throw new NonInstantiableClass(Yii.App.controllerId);
        }

        Controller.request = Yii.App.request;
        Controller.response = Yii.App.response;

        //Set module controller path if it is null
        if (!Module.viewPath) {
            Module.viewPath = path.join(
                path.dirname(configs.modules[moduleId].class),
                "views"
            );
        }

        let actionId = this.routeParser.getActionId();

        /**
         * Check if defaultAction is empty
         */
        if (!actionId) {
            actionId = Controller.defaultAction;
            if (!actionId) {
                throw new RouteNotFound(actionId);
            }
        }

        //Set action id
        Yii.App.actionId = actionId;

        const actionMethod = [
            'action',
            this.routeParser.capitalize(actionId)
        ].join('');

        /**
         * Check if action is defined
         */
        if (typeof Controller[actionMethod] !== 'function') {
            throw new ActionNotFound(actionId);
        }

        const reqProxy = this.createRequestProxy(Yii.App.request);
        const actionProxy = this.createActionProxy(Controller[actionMethod], reqProxy);

        return actionProxy.call(Controller);
    }
    /**
        * Creates a proxy that intercepts function calls to automatically bind request parameters
        * Works with any function size - no function introspection needed!
        */
    createActionProxy(action, requestProxy) {
        return new Proxy(action, {
            apply(target, thisArg, args) {
                // If caller passed arguments manually, use them as-is
                if (args.length > 0) {
                    return Reflect.apply(target, thisArg, args);
                }

                // For automatic parameter binding, pass the request proxy directly
                // JavaScript destructuring will automatically trigger proxy getters
                console.log("Auto-binding parameters via proxy");

                // This works regardless of function size (10 lines or 10,000 lines)
                // The destructuring happens instantly without parsing function source
                return Reflect.apply(target, thisArg, [requestProxy]);
            }
        });
    }

    /**
     * Creates a proxy that provides request parameters on-demand
     * Checks params, query, and body in that order
     */
    createRequestProxy(req) {
        return new Proxy({}, {
            get(target, prop) {
                // Handle symbol properties
                if (typeof prop === "symbol") return undefined;

                // Convert property to string for consistency
                const propName = String(prop);

                // Check request sources in priority order: params → query → body
                if (req.params && propName in req.params) {
                    return req.params[propName];
                }

                if (req.query && propName in req.query) {
                    return req.query[propName];
                }

                if (req.body && propName in req.body) {
                    return req.body[propName];
                }

                // Parameter not found in any request source
                throw new ParameterNotFound(`Missing required parameter: ${propName}`);
            },

            // Optional: Handle property enumeration (for debugging)
            ownKeys(target) {
                const keys = new Set();

                if (req.params) Object.keys(req.params).forEach(key => keys.add(key));
                if (req.query) Object.keys(req.query).forEach(key => keys.add(key));
                if (req.body) Object.keys(req.body).forEach(key => keys.add(key));

                return Array.from(keys);
            },

            // Optional: Handle property existence checks
            has(target, prop) {
                const propName = String(prop);

                return (req.params && propName in req.params) ||
                    (req.query && propName in req.query) ||
                    (req.body && propName in req.body);
            }
        });
    }
}

module.exports = RouteResolver;