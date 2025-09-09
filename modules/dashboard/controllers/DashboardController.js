class DashboardController extends Yii.Controller {
    actionIndex( {user = "polk"}  ) {
        return this.render('index', {
            message: `Hello, ${user}!`,
            title: 'Dashboard',
        });
    }

    actionHello() {
        return 'hello';
    }
}

module.exports = DashboardController;