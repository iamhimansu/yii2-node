class RouteParser {
    constructor(router, path) {
        this.path = path;
        this.moduleId = null;
        this.controllerId = null;
        this.actionId = null;
        this.#parse();
    }

    getModuleId() {
        return this.moduleId;
    }

    getControllerId() {
        return this.controllerId;
    }

    getActionId() {
        return this.actionId;
    }

    #parse() {

        this.path = this.path.replace(/^\/+|\/+$/g, "");
        let split = this.path.split("/").filter(Boolean);

        switch (split.length) {
            case 1:
                this.moduleId = split[0];
                break;
            case 2 :
                this.moduleId = split[0];
                this.controllerId = split[1];
                break;
            case 3 :
                this.moduleId = split[0];
                this.controllerId = split[1];
                this.actionId = split[2];
                break;
            default:
                break;
        }
    }

    capitalize(text){
        return [
            text.charAt(0).toUpperCase(),
            text.slice(1)
        ].join('');
    }
}

module.exports = RouteParser;