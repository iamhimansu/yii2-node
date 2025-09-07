class BaseObject {
    constructor(application) {
        this.application = application;
        this.init();
    }

    init() {
        console.log('Inside base object');
    }

    /**
     * Wrap a module class (or instance) to ensure it inherits from a base class
     */
    ensureInheritance(sourceClass, targetClass) {

        if (typeof sourceClass === 'function' && targetClass.isPrototypeOf(targetClass)) {
            return sourceClass;
        }

        const baseApplication = this.application;

        return new class extends targetClass {
            constructor(configs) {
                super(configs);

                // Copy instance properties from sourceClass
                const sourceInstance = new sourceClass(baseApplication);
                Object.assign(this, sourceInstance);
            }

            init() {

                // Call sourceClass init
                if (sourceClass.prototype.init) {
                    sourceClass.prototype.init.call(this);
                }
            }
        }
    }
}

module.exports = BaseObject;