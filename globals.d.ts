import type WebApplication from "./core/application/WebApplication";

declare global {
    /** Yii2-Node global application instance */
    let App: WebApplication;
}

export {};