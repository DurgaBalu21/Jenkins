const { setWorldConstructor, World } = require("@cucumber/cucumber");

class CustomWorld extends World {
    constructor(options) {
        super(options);
        this.browser = null;
        this.context = null;
        this.page = null;

        // pages (POM instances)
        this.loginPage = null;
        this.productsPage = null;
    }
}

setWorldConstructor(CustomWorld);
