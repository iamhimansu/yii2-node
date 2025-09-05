const Application = require("./Application");
const express = require("express");
const Router = require("./../router/Router");

class WebApplication extends Application {
    /**
     * @type {WebApplication|null}
     */
    static instance = null;

    constructor(configs) {

        if (WebApplication.instance) {
            return WebApplication.instance;
        }

        super(configs);

        this.coreExpress = express;
        this.express = this.coreExpress();
        this.router = new Router(this);
        this.basePath = configs.basePath;
        this.ROOT = this.basePath;

        WebApplication.instance = this;
    }

    static getInstance(configs) {
        if (!WebApplication.instance) {
            return new WebApplication(configs);
        }
        return WebApplication.instance;
    }
}

module.exports = WebApplication;