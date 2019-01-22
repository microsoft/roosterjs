const NodeEnvironment = require('jest-environment-node');
const puppeteer = require('puppeteer-firefox');

/**
 * Test environment for a running a test in puppeteer-firefox.
 *
 * Launches a new firefox instance for every test suite.
 */
class FirefoxPuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    this.global.__BROWSER__ = await puppeteer.launch({
      headless: process.env.RUN_WITH_DISPLAY != 'true'
    });
  }

  async teardown() {
    await super.teardown();
    await this.global.__BROWSER__.close();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = FirefoxPuppeteerEnvironment
