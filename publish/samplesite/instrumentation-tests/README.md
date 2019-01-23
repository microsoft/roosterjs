# Instrumentation tests

[Puppeteer](https://github.com/GoogleChrome/puppeteer)-based instrumnetaiton tests for the sample site.

## Quick Start

Run absolutely everything (CI entrypoint)

```
yarn run instrumentation
```

Run all tests

```
 ./node_modules/.bin/jest --config ./jest.chrome.config.js

 ./node_modules/.bin/jest --config ./jest.firefox.config.js

```

Run all tests with visible browser (for debugging)

```
 RUN_WITH_DISPLAY=true ./node_modules/.bin/jest --config ./jest.chrome.config.js

 RUN_WITH_DISPLAY=true ./node_modules/.bin/jest --config ./jest.firefox.config.js
```

[Standard jest args](https://jestjs.io/docs/en/cli.html) work, so to run a single test:

```
./node_modules/.bin/jest --config ./jest.firefox.config.js --testPathPattern="your-test.ts"
```

## How it works

The test runner uses `puppeteer` and `puppeteer-firefox` under the hood to run tests against a headless browser.

Because `puppeteer-firefox` does not support reconnection (`browser.wsEndpoint`), each test running under the firefox config will launch it's own puppeteer instance. Tests running under the firefox config will run slower than under the chorome config.

## Potential Improvements

Iteration time on tests is pretty bad because of the webpack devserver startup time.

We should be able to run `jest --watch` against a long-lived devserver to make the iteration time on tests faster.

## Why the separate package.json?

It's to avoid type conflicts between jest and Karma.
Typescript by default includes all types in `node_modules/@types`, which lead to type conflicts between `it`, `describe`, etc which are defined globally in both jest and jasmine.

By declaring the instrumentation tests as its own package, we avoid these type conflicts + the mess that is having separate compilation settings for the same code under different entrypoints.
