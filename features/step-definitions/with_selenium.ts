import { Given, When, Then, AfterAll } from "cucumber";
import { Builder, By, Capabilities, Key } from "selenium-webdriver";
import { expect } from "chai";
import crypto from "crypto";
import chrome from "selenium-webdriver/chrome";
import fs from "fs";

import "chromedriver";

const capabilities = Capabilities.chrome();
capabilities.set("chromeOptions", { w3c: false });

const chromeOptions = new chrome.Options();

if (process.env.NODE_ENV === "production") {
    chromeOptions.windowSize({
        width: 1920,
        height: 108,
    });
    chromeOptions.headless();
} else {
    chromeOptions.addArguments("start-maximized");
}

const driver = new Builder()
    .setChromeOptions(chromeOptions)
    .withCapabilities(capabilities)
    .build();

Given("I am on the Google search page", async function () {
    await driver.get("http://www.google.com");
});

When("I search for {string}", async function (searchTerm: string) {
    const element = await driver.findElement(By.name("q"));
    element.sendKeys(searchTerm, Key.ENTER);
});

Then(
    "the page title should start with {string}",
    { timeout: 60 * 1000 },
    async function (searchTerm: string) {
        const title = await driver.getTitle();
        const isTitleStartWithCheese =
            title.toLowerCase().lastIndexOf(`${searchTerm}`, 0) === 0;
        getScreenShot(`${searchTerm}.${crypto.randomUUID()}`);
        expect(isTitleStartWithCheese).to.equal(true);
    }
);

AfterAll(async function () {
    await driver.quit();
});

const getScreenShot = async (fileName: string) => {
    let screenShot = await driver.takeScreenshot();
    await fs.writeFileSync(`./images/${fileName}.png`, screenShot, "base64");
};
