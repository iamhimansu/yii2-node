const configs = {
    port: 3000,
    debug: false,
    modules: {
        dashboard: {
            class: "/modules/dashboard/Module",
        },
        dashboardApp: {
            class: "/app/modules/dashboard/Module",
        }
    },
    routes: {}
};

module.exports = configs;