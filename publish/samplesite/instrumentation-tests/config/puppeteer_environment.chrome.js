const NodeEnvironment = require('jest-environment-node');
const fs = require('fs');
const path = require('path');
const CONSTANTS = require('./constants');

/**
 * Test environment for a running a test in puppeteer-firefox.
 *
 * Re-uses the same chrome instance with new tabs for each test.
 */
class ChromePuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    // get the wsEndpoint we created for the peristent chrome instance
    const wsPath = path.join(CONSTANTS.CHROME_TEMP_DIR, 'wsEndpoint');
    const wsEndpoint = fs.readFileSync(wsPath, 'utf8');
    // connect to exisiting chrome puppeteer (see setup.chrome.js)
    const puppeteer = require('puppeteer');
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = ChromePuppeteerEnvironment
