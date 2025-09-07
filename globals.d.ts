declare global {
    namespace Yii {
        /** Yii2-Node global application instance */
        const App: typeof import("./core/application/WebApplication").default;

        /** Base Controller class */
        const Controller: typeof import("./core/controller/BaseController").default;

        /** Base Module class */
        const Module: typeof import("./core/module/Module").default;

        /** Base Object class */
        const Object: typeof import("./core/object/Object").default;
    }
}

export {};
