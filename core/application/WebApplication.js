const Application = require("./Application");

const express = require("express");
const Router = require("./../router/Router");

class WebApplication extends Application {
    constructor(configs) {
        super(configs);
        this.coreExpress = express;
        this.express = this.coreExpress();
        this.router = new Router(this);
    }
}

module.exports = WebApplication;