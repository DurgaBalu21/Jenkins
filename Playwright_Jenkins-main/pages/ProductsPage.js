const { BasePage } = require("../base/BasePage");

class ProductsPage extends BasePage {
    constructor(page, options) {
        super(page, options);
        this.productsList = ".inventory_list";
    }

    async verifyLoaded() {
        await this.expectVisible(this.productsList);
    }
}

module.exports = { ProductsPage };
