const { Before, After, Status } = require("@cucumber/cucumber");
const { chromium, firefox, webkit } = require("playwright");
const { config } = require("./env");
const { LoginPage } = require("../pages/LoginPage");
const { ProductsPage } = require("../pages/ProductsPage");

const getLauncher = (name) => ({ chromium, firefox, webkit }[name] || chromium);

Before(async function () {
  const launcher = getLauncher(config.browserName);

  this.browser = await launcher.launch({ headless: config.headless });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  // Create reusable POM objects here (so steps can directly use)
  this.loginPage = new LoginPage(this.page, { timeout: config.timeout });
  this.productsPage = new ProductsPage(this.page, { timeout: config.timeout });

  // Open base url (optional)
  await this.page.goto(config.baseUrl, { waitUntil: "domcontentloaded" });
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const img = await this.page.screenshot({ fullPage: true });
    await this.attach(img, "image/png");
  }

  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
