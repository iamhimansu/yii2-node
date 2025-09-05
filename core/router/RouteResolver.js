const path = require("path");
const ModuleNotFound = require("../exceptions/ModuleNotFound");
const ModulePathNotFound = require("../exceptions/ModulePathNotFound");
const BaseObject = require("../object/BaseObject");
const CoreModuleClass = require("../module/Module")
const ControllerPathNotFound = require("../exceptions/ControllerPathNotFound");
const DefaultRouteNotFound = require("../exceptions/DefaultRouteNotFound");
const CoreControllerClass = require("../controller/Controller");
const RouteNotFound = require("../exceptions/RouteNotFound");
const ActionNotFound = require("../exceptions/ActionNotFound");

class RouteResolver {
    constructor(router, routeParser) {
        this.router = router;
        this.routeParser = routeParser;
    }

    async init() {
        const ROOT = this.router.basePath;
        const configs = this.router.configs;
        const moduleId = this.routeParser.getModuleId();

        /**
         * If module is not configured in configs
         */
        if (!configs.modules[moduleId]) {
            throw new ModuleNotFound(moduleId);
        }

        /**
         * If module is found but path is not declared
         */
        if (!configs.modules[moduleId].class) {
            throw new ModulePathNotFound(moduleId);
        }

        //Get module class
        const moduleClass = require(path.join(ROOT, configs.modules[moduleId].class));

        const baseObject = new BaseObject(this.router);
        /**
         * Ensure inheritance of Module from BaseModule
         * @type {Module|{init(): void}}
         */
        const Module = baseObject.ensureInheritance(moduleClass, CoreModuleClass);

        Module.init();

        //Set module controller path if it is null
        if (!Module.controllerPath) {
            Module.controllerPath = path.join(
                path.dirname(configs.modules[moduleId].class),
                "controllers"
            );
        }

        let controllerId = this.routeParser.getControllerId();
        /**
         * Check if defaultRoute is empty
         */
        if (!controllerId) {
            if (!Module.defaultRoute) {
                throw new RouteNotFound(controllerId);
            }
            controllerId = Module.defaultRoute;
        }

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
         * @type {Controller|{init(): void}}
         */
        const Controller = baseObject.ensureInheritance(controllerClass, CoreControllerClass);

        Controller.init();

        let actionId = this.routeParser.getActionId();

        /**
         * Check if defaultAction is empty
         */
        if (!actionId) {
            if (!Controller.defaultAction) {
                throw new RouteNotFound(Controller.defaultAction);
            }
            actionId = Controller.defaultAction;
        }

        const actionMethod = [
            'action',
            this.routeParser.capitalize(actionId)
        ].join('');

        /**
         * Check if action is defined
         */
        if (!Controller[actionMethod]) {
            throw new ActionNotFound(actionId);
        }

        return await Controller[actionMethod](this.router.request);
    }
}

module.exports = RouteResolver;