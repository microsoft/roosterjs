import { BrowserInfo } from 'roosterjs-editor-types';
import { getBrowserInfo } from '../../lib/utils/Browser';

function runBrowserDataTest(userAgent: string, appVersion: string, expected: BrowserInfo): void {
    let b = getBrowserInfo(userAgent, appVersion, '');
    expect(b.isChrome).toBe(expected.isChrome);
    expect(b.isEdge).toBe(expected.isEdge);
    expect(b.isFirefox).toBe(expected.isFirefox);
    expect(b.isIE).toBe(expected.isIE);
    expect(b.isMac).toBe(expected.isMac);
    expect(b.isSafari).toBe(expected.isSafari);
    expect(b.isWebKit).toBe(expected.isWebKit);
    expect(b.isWin).toBe(expected.isWin);
}

describe('getBrowserData', () => {
    it('Safrai 9.0.3 on Mac', () => {
        runBrowserDataTest(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/601.4.4 (KHTML, like Gecko) Version/9.0.3 Safari/601.4.4',
            '5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/601.4.4 (KHTML, like Gecko) Version/9.0.3 Safari/601.4.4',
            {
                isChrome: false,
                isEdge: false,
                isFirefox: false,
                isIE: false,
                isIE11OrGreater: false,
                isMac: true,
                isSafari: true,
                isWebKit: true,
                isWin: false,
                isMobileOrTablet: false,
            }
        );
    });

    it('Firefox 50 on Windows 10', () => {
        runBrowserDataTest(
            'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0',
            '5.0 (Windows)',
            {
                isChrome: false,
                isEdge: false,
                isFirefox: true,
                isIE: false,
                isIE11OrGreater: false,
                isMac: false,
                isSafari: false,
                isWebKit: false,
                isWin: true,
                isMobileOrTablet: false,
            }
        );
    });

    it('Chrome 55 on Windows 10', () => {
        runBrowserDataTest(
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            '5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            {
                isChrome: true,
                isEdge: false,
                isFirefox: false,
                isIE: false,
                isIE11OrGreater: false,
                isMac: false,
                isSafari: false,
                isWebKit: true,
                isWin: true,
                isMobileOrTablet: false,
            }
        );
    });

    it('Edge on Windows 10', () => {
        runBrowserDataTest(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
            '5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
            {
                isChrome: false,
                isEdge: true,
                isFirefox: false,
                isIE: false,
                isIE11OrGreater: false,
                isMac: false,
                isSafari: false,
                isWebKit: false,
                isWin: true,
                isMobileOrTablet: false,
            }
        );
    });

    it('IE 11 on Windows 10', () => {
        runBrowserDataTest(
            'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko',
            '5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0)',
            {
                isChrome: false,
                isEdge: false,
                isFirefox: false,
                isIE: true,
                isIE11OrGreater: true,
                isMac: false,
                isSafari: false,
                isWebKit: false,
                isWin: true,
                isMobileOrTablet: false,
            }
        );
    });

    it('IE 9 on Windows 10', () => {
        runBrowserDataTest(
            'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0)',
            '5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0)',
            {
                isChrome: false,
                isEdge: false,
                isFirefox: false,
                isIE: true,
                isIE11OrGreater: false,
                isMac: false,
                isSafari: false,
                isWebKit: false,
                isWin: true,
                isMobileOrTablet: false,
            }
        );
    });
});
