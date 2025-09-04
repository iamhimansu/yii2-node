const {route} = require("express/lib/application");

class RouteParser {
    constructor(router, path) {
        this.path = path;
        this.module = null;
        this.controller = null;
        this.action = null;
        this.#parse();
    }

    getModule() {
        return this.module;
    }

    getController() {
        return this.controller;
    }

    getAction() {
        return this.action;
    }

    #parse() {

        this.path = this.path.replace(/^\/+|\/+$/g, "");
        let split = this.path.split("/").filter(Boolean);

        switch (split.length) {
            case 1:
                this.module = split[0];
                break;
            case 2 :
                this.module = split[0];
                this.controller = split[1];
                break;
            case 3 :
                this.module = split[0];
                this.controller = split[1];
                this.action = split[2];
                break;
            default:
                break;
        }
    }
}

module.exports = RouteParser;