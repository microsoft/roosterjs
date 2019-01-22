const os = require('os');
const path = require('path');

module.exports = {
    DEVSERVER_PORT: 9090,
    CHROME_TEMP_DIR: path.join(os.tmpdir(), 'jest_puppeteer_global_setup'),
}

