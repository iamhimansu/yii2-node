const BaseObject = require("../object/BaseObject");

class BaseApplication extends BaseObject {
    /** @type {object} */
    configs;

    express;

    /** Core Express app — always present, but null until initialized */
    /** @type {import("express").Express|null} */
    expressApp = null;

    /** Router — created during boot, so guaranteed but initially null */
    /** @type {import("express").Router|null} */
    router = null;

    /** Request-specific identifiers — may not exist */
    /** @type {string|undefined} */
    controllerId;

    /** @type {string|undefined} */
    moduleId;

    /** @type {string|undefined} */
    actionId;

    /** @type {import("../module/BaseModule")|undefined} */
    module;


    /** Base path of the app — known at bootstrap */
    /** @type {string|null} */
    basePath = null;

    /** Express request/response — only set during an active request */
    /** @type {import("express").Request|undefined} */
    request;

    /** @type {import("express").Response|undefined} */
    response;

    constructor(configs) {
        super(configs);
        this.configs = configs;
    }
}

module.exports = BaseApplication;