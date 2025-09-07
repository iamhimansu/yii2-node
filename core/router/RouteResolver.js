const path = require("path");
const ModuleNotFound = require("../exceptions/ModuleNotFound");
const ModulePathNotFound = require("../exceptions/ModulePathNotFound");
const RouteNotFound = require("../exceptions/RouteNotFound");
const ActionNotFound = require("../exceptions/ActionNotFound");
const ControllerPathNotFound = require("../exceptions/ControllerPathNotFound");
const NonInstantiableClass = require("../exceptions/NotInstantiableClass");

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

        const proxy = this.createRequestProxy(Yii.App.request);

        return Controller[actionMethod](proxy);
    }

    createRequestProxy(req) {

        return new Proxy(function(req){}, {
            get(_, prop) {
                // allow symbols (for console.log, coercion, etc.)
                if (typeof prop === "symbol") return undefined;

                // safely check request parts
                if (req.params && prop in req.params) return req.params[prop];
                if (req.query && prop in req.query) return req.query[prop];
                if (req.body && prop in req.body) return req.body[prop];

                return undefined;
            }
        });
    }
}

module.exports = RouteResolver;