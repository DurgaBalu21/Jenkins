const { Given, When, Then } = require("@cucumber/cucumber");
const { config } = require("../support/env");
//const { query } = require("../utils/db");

Given("I am on the login page", async function () {
    // already opened in hook, but if needed:
    // await this.loginPage.open(config.baseUrl);

});

When("I login using env credentials", async function () {
   // const result = await query(this.dbPool, "select CountryCode from world.city where name = 'Kabul';");
   // console.log("Query result:", result);
    await this.loginPage.login(config.username, config.password);
});

Then("I should see the products page", async function () {
    await this.productsPage.verifyLoaded();
});
