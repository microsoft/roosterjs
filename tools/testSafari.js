const net = require('net');
const path = require('path');
const { randomUUID } = require('crypto');
const { spawn } = require('child_process');

const rootPath = path.resolve(__dirname, '..');
const karmaPort = 9876;
const safariDriverPort = 4444;
const traceId = randomUUID();
const ownedProcesses = new Map();

let cleanupPromise;
let receivedSignal;
let sessionId;

function log(level, operation, details = {}) {
    const output = JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        operation,
        trace_id: traceId,
        ...details,
    });

    (level == 'error' ? console.error : console.log)(output);
}

function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function startProcess(name, command, args) {
    log('info', 'process_start', { name, command, args });

    const child = spawn(command, args, {
        cwd: rootPath,
        env: process.env,
        stdio: 'inherit',
    });
    const completion = new Promise(resolve => {
        child.once('error', error => {
            log('error', 'process_error', { name, error: error.message });
            resolve({ code: null, signal: null, error });
        });
        child.once('close', (code, signal) => {
            log(code == 0 ? 'info' : 'error', 'process_end', { name, code, signal });
            resolve({ code, signal, error: null });
        });
    });

    ownedProcesses.set(name, { child, completion });
    return { child, completion };
}

async function runProcess(name, command, args) {
    const { completion } = startProcess(name, command, args);
    const result = await completion;

    ownedProcesses.delete(name);

    if (result.error) {
        throw result.error;
    } else if (result.code != 0) {
        throw new Error(`${name} exited with code ${result.code} and signal ${result.signal}`);
    }
}

function isPortInUse(port) {
    return new Promise(resolve => {
        const socket = net.createConnection({ host: '127.0.0.1', port });

        socket.once('connect', () => {
            socket.destroy();
            resolve(true);
        });
        socket.once('error', () => {
            socket.destroy();
            resolve(false);
        });
    });
}

async function requireAvailablePort(port, owner) {
    const inUse = await isPortInUse(port);

    if (inUse) {
        throw new Error(`${owner} requires port ${port}, but it is already in use`);
    }
}

async function waitForEndpoint(name, url, process) {
    const deadline = Date.now() + 60000;
    let lastError = 'No request was sent';

    log('info', 'endpoint_wait_start', { name, url });

    while (Date.now() < deadline) {
        if (process.exitCode !== null) {
            throw new Error(`${name} exited before ${url} became available`);
        }

        try {
            const response = await fetch(url, { signal: AbortSignal.timeout(1000) });

            if (response.ok) {
                log('info', 'endpoint_wait_end', { name, url, status: response.status });
                return;
            }

            lastError = `HTTP ${response.status}`;
        } catch (error) {
            lastError = error instanceof Error ? error.message : String(error);
        }

        await delay(100);
    }

    throw new Error(`Timed out waiting for ${name} at ${url}: ${lastError}`);
}

async function webdriverCommand(method, pathName, body) {
    const url = `http://127.0.0.1:${safariDriverPort}${pathName}`;

    log('info', 'webdriver_request_start', { method, path: pathName });

    const response = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });
    const result = await response.json();

    log(response.ok ? 'info' : 'error', 'webdriver_request_end', {
        method,
        path: pathName,
        status: response.status,
    });

    if (!response.ok || result.value?.error) {
        throw new Error(JSON.stringify(result));
    }

    return result.value;
}

async function terminateProcess(name, processInfo) {
    if (processInfo.child.exitCode !== null) {
        ownedProcesses.delete(name);
        return;
    }

    log('info', 'process_terminate_start', { name, signal: 'SIGTERM' });
    processInfo.child.kill('SIGTERM');

    const result = await Promise.race([processInfo.completion, delay(5000).then(() => null)]);

    if (!result && processInfo.child.exitCode === null) {
        log('error', 'process_terminate_timeout', { name, signal: 'SIGKILL' });
        processInfo.child.kill('SIGKILL');
        await processInfo.completion;
    }

    ownedProcesses.delete(name);
    log('info', 'process_terminate_end', { name });
}

async function cleanup(reason) {
    if (cleanupPromise) {
        return cleanupPromise;
    }

    cleanupPromise = (async () => {
        log('info', 'cleanup_start', { reason });

        if (sessionId) {
            try {
                await webdriverCommand('DELETE', `/session/${sessionId}`);
            } catch (error) {
                log('error', 'webdriver_session_cleanup_failed', {
                    error: error instanceof Error ? error.message : String(error),
                });
            }

            sessionId = undefined;
        }

        for (const [name, processInfo] of Array.from(ownedProcesses.entries()).reverse()) {
            await terminateProcess(name, processInfo);
        }

        log('info', 'cleanup_end', { reason });
    })();

    return cleanupPromise;
}

async function main() {
    const forwardedArgs = process.argv.slice(2);

    try {
        await requireAvailablePort(karmaPort, 'Karma');
        await requireAvailablePort(safariDriverPort, 'safaridriver');
        await runProcess('normalize', process.execPath, [
            path.join(rootPath, 'tools/build.js'),
            'normalize',
        ]);

        const karma = startProcess('karma', process.execPath, [
            require.resolve('karma/bin/karma'),
            'start',
            path.join(rootPath, 'karma.fast.conf.js'),
            ...forwardedArgs,
        ]);
        const safariDriver = startProcess('safaridriver', '/usr/bin/safaridriver', [
            '-p',
            String(safariDriverPort),
        ]);

        await Promise.all([
            waitForEndpoint('Karma', `http://127.0.0.1:${karmaPort}/`, karma.child),
            waitForEndpoint(
                'safaridriver',
                `http://127.0.0.1:${safariDriverPort}/status`,
                safariDriver.child
            ),
        ]);

        const session = await webdriverCommand('POST', '/session', {
            capabilities: { alwaysMatch: { browserName: 'safari' } },
        });

        sessionId = session.sessionId;

        await webdriverCommand('POST', `/session/${sessionId}/url`, {
            url: `http://127.0.0.1:${karmaPort}/`,
        });

        log('info', 'karma_completion_wait_start');
        const result = await karma.completion;

        ownedProcesses.delete('karma');
        log(result.code == 0 ? 'info' : 'error', 'karma_completion_wait_end', result);

        if (result.code != 0) {
            throw new Error(`Safari tests exited with code ${result.code}`);
        }

        await cleanup('success');
    } catch (error) {
        log('error', 'safari_test_failed', {
            error: error instanceof Error ? error.message : String(error),
        });
        await cleanup('failure');
        process.exitCode = receivedSignal == 'SIGINT' ? 130 : receivedSignal == 'SIGTERM' ? 143 : 1;
    }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
        receivedSignal = signal;
        log('error', 'signal_received', { signal });
        cleanup(signal).finally(() => {
            process.exitCode = signal == 'SIGINT' ? 130 : 143;
        });
    });
}

main();
