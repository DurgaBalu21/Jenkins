const { expect } = require("playwright/test");

class BasePage {
    /**
     * @param {import('playwright').Page} page
     * @param {{timeout:number}} options
     */
    constructor(page, options = {}) {
        this.page = page;
        this.timeout = options.timeout || 30000;
    }

    // ---------- Navigation ----------
    async open(url) {
        await this.page.goto(url, { waitUntil: "domcontentloaded", timeout: this.timeout });
    }

    async waitForPageReady() {
        await this.page.waitForLoadState("domcontentloaded");
    }

    // ---------- Locators ----------
    locator(selector) {
        return this.page.locator(selector);
    }

    // ---------- Actions ----------
    async click(selector, opts = {}) {
        const loc = this.page.locator(selector);
        await loc.waitFor({ state: "visible", timeout: this.timeout });
        await loc.click({ timeout: this.timeout, ...opts });
    }

    async type(selector, value, opts = {}) {
        const loc = this.page.locator(selector);
        await loc.waitFor({ state: "visible", timeout: this.timeout });
        await loc.fill(""); // clean fill
        await loc.fill(String(value), { timeout: this.timeout, ...opts });
    }

    async press(selector, key) {
        const loc = this.page.locator(selector);
        await loc.waitFor({ state: "visible", timeout: this.timeout });
        await loc.press(key, { timeout: this.timeout });
    }

    async selectByValue(selector, value) {
        const loc = this.page.locator(selector);
        await loc.waitFor({ state: "visible", timeout: this.timeout });
        await loc.selectOption(String(value));
    }

    async uploadFile(selector, filePath) {
        await this.page.setInputFiles(selector, filePath);
    }

    async hover(selector) {
        const loc = this.page.locator(selector);
        await loc.waitFor({ state: "visible", timeout: this.timeout });
        await loc.hover({ timeout: this.timeout });
    }

    // ---------- Wait helpers ----------
    async waitVisible(selector) {
        await this.page.locator(selector).waitFor({ state: "visible", timeout: this.timeout });
    }

    async waitHidden(selector) {
        await this.page.locator(selector).waitFor({ state: "hidden", timeout: this.timeout });
    }

    // ---------- Assertions ----------
    async expectVisible(selector) {
        await expect(this.page.locator(selector)).toBeVisible({ timeout: this.timeout });
    }

    async expectText(selector, text) {
        await expect(this.page.locator(selector)).toHaveText(text, { timeout: this.timeout });
    }

    async expectContainsText(selector, text) {
        await expect(this.page.locator(selector)).toContainText(text, { timeout: this.timeout });
    }

    // ---------- Utilities ----------
    async screenshot(path) {
        await this.page.screenshot({ path, fullPage: true });
    }

    /**
     * Retry a flaky UI action safely (for real-time issues like loading delays)
     */
    async retry(fn, { retries = 2, delayMs = 800 } = {}) {
        let lastErr;
        for (let i = 0; i <= retries; i++) {
            try {
                return await fn();
            } catch (e) {
                lastErr = e;
                if (i < retries) await this.page.waitForTimeout(delayMs);
            }
        }
        throw lastErr;
    }

    // ---------- Popups / New tabs ----------
    async clickAndWaitForNewPage(selector) {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent("page"),
            this.click(selector),
        ]);
        await newPage.waitForLoadState("domcontentloaded");
        return newPage;
    }

    // ---------- Downloads ----------
    async clickAndDownload(selector) {
        const [download] = await Promise.all([
            this.page.waitForEvent("download"),
            this.click(selector),
        ]);
        return download; // download.path() is available in node env
    }
}

module.exports = { BasePage };
