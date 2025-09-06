const BaseObject = require("../object/BaseObject");
const fs = require("node:fs");
const path = require("node:path");

class BaseController extends BaseObject {
    constructor(app) {
        super(app);
        this.application = app;
        this.defaultAction = 'index';
        this.request = null;
        this.response = null;
        this.moduleId = Yii.App.moduleId;
    }

    render(filePath, params, format = '.html') {

        const viewPath = path.join(Yii.App.basePath, Yii.App.module.viewPath, Yii.App.controllerId, [filePath, format].join(''));

        // Simple template rendering (progressive replacement)
        let content = fs.readFileSync(viewPath, "utf-8");
        content = content.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, key) => {
            return params[key.trim()] ?? "";
        });

        return content;

    }
}

module.exports = BaseController;