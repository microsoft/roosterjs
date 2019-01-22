// puppeteer_environment.js
const NodeEnvironment = require('jest-environment-node');
const fs = require('fs');
const path = require('path');
const os = require('os');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    // get the wsEndpoint (don't handle failure because wsEndpoint only works in Chrome)
    const wsPath = path.join(DIR, 'wsEndpoint');
    const wsEndpoint = fs.readFileSync(wsPath, 'utf8');
    // connect to exisiting chrome puppeteer
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

module.exports = PuppeteerEnvironment
