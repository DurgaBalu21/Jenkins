const { BasePage } = require("../base/BasePage");

class LoginPage extends BasePage {
    constructor(page, options) {
        super(page, options);

        // selectors
        this.user = "#user-name";
        this.pass = "#password";
        this.loginBtn = "#login-button";
    }

    async login(username, password) {
        await this.type(this.user, username);
        await this.type(this.pass, password);
        await this.click(this.loginBtn);
    }
}

module.exports = { LoginPage };
