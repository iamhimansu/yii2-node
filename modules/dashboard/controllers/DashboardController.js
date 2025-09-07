class DashboardController extends Yii.Controller {
    actionIndex({user}) {
        
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