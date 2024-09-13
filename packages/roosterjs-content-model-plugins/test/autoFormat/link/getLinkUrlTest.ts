import { getLinkUrl } from '../../../lib/autoFormat/link/getLinkUrl';

describe('getLinkUrl', () => {
    function runTest(
        text: string,
        shouldLink: boolean,
        shouldMatchTel: boolean,
        shouldMatchMailto: boolean,
        expectedResult: string | undefined
    ) {
        const link = getLinkUrl(text, shouldLink, shouldMatchTel, shouldMatchMailto);
        expect(link).toBe(expectedResult);
    }

    it('link', () => {
        runTest('http://www.bing.com', true, false, false, 'http://www.bing.com');
    });

    it('do not return link', () => {
        runTest('wwww.test.com', false, true, true, undefined);
    });

    it('invalid link', () => {
        runTest('www3w.test.com', true, false, false, undefined);
    });

    it('telephone', () => {
        runTest('tel:999999', false, true, false, 'tel:999999');
    });

    it('telephone with T', () => {
        runTest('Tel:999999', false, true, false, 'tel:999999');
    });

    it('do not return telephone', () => {
        runTest('tel:999999', true, false, true, undefined);
    });

    it('invalid telephone', () => {
        runTest('tels:999999', false, true, false, undefined);
    });

    it('mailto', () => {
        runTest('mailto:test', false, false, true, 'mailto:test');
    });

    it('mailto with M', () => {
        runTest('Mailto:test', false, false, true, 'mailto:test');
    });

    it('do not return mailto', () => {
        runTest('mailto:test', true, true, false, undefined);
    });

    it('invalid mailto', () => {
        runTest('mailtos:test', false, false, true, undefined);
    });
});
