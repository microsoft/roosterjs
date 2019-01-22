// puppeteer_environment.js
const NodeEnvironment = require('jest-environment-node');
const path = require('path');
const os = require('os');
const puppeteer = require('puppeteer-firefox');

class PuppeteerEnvironment extends NodeEnvironment {
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

module.exports = PuppeteerEnvironment
