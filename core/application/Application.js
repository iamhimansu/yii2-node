const BaseApplication = require('./BaseApplication');

class Application extends BaseApplication {

    run() {
        const port = this.configs.port || 3000;
        this.express.listen(port, () => {
            console.log(`Application listening on port: ${port} http://localhost:${port}`);
        })
    }
}

module.exports = Application;