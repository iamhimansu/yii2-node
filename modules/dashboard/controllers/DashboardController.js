class DashboardController extends Yii.Controller {
    actionIndex() {
        return this.render('index', {
            message: 'Hello, World!',
            title: 'Dashboard',
        });
    }

    actionHello() {
        return 'hello';
    }
}

module.exports = DashboardController;