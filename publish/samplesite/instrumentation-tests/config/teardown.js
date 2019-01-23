const os = require('os');
const rimraf = require('rimraf');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');
module.exports = async function () {
    await Promise.all([
        // Close the browser instance if it exists (e.g. if we are running chrome and recycling an instance)
        global.__BROWSER_GLOBAL__ ? global.__BROWSER_GLOBAL__.close() : Promise.resolve(),
        // Shut down the devserver
        new Promise((resolve, reject) => {
            global.__WEBPACK_DEVSERVER_GLOBAL__.close((err) => {
                err == null ? resolve() : reject(err);
            });
        }),
    ]);

    // clean-up the working tmp dir if it exists
    rimraf.sync(DIR);
};
