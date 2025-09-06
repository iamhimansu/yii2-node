const BaseObject = require("../object/BaseObject");

class BaseResponse extends BaseObject {

    static dispatch(content) {
        if (typeof content === "string") {
            return Yii.App.response.status(200).send(content);
        }

        return Yii.App.response.status(200).send("");
    }
}

module.exports = BaseResponse;