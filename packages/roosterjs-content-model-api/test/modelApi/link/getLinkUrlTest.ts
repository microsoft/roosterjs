import { AutoLinkOptions } from 'roosterjs-content-model-types';
import { getLinkUrl } from '../../../lib/modelApi/link/getLinkUrl';

describe('getLinkUrl', () => {
    function runTest(text: string, options: AutoLinkOptions, expectedResult: string | undefined) {
        const link = getLinkUrl(text, options);
        expect(link).toBe(expectedResult);
    }

    it('link', () => {
        runTest('http://www.bing.com', { autoLink: true }, 'http://www.bing.com');
    });

    it('do not return link', () => {
        runTest('wwww.test.com', { autoLink: false }, undefined);
    });

    it('invalid link', () => {
        runTest('www3w.test.com', { autoLink: true }, undefined);
    });

    it('telephone', () => {
        runTest('tel:999999', { autoTel: true }, 'tel:999999');
    });

    it('telephone with T', () => {
        runTest('Tel:999999', { autoTel: true }, 'tel:999999');
    });

    it('do not return telephone', () => {
        runTest('tel:999999', { autoTel: false }, undefined);
    });

    it('invalid telephone', () => {
        runTest('tels:999999', { autoTel: true }, undefined);
    });

    it('mailto', () => {
        runTest('mailto:test', { autoMailto: true }, 'mailto:test');
    });

    it('mailto with M', () => {
        runTest('Mailto:test', { autoMailto: true }, 'mailto:test');
    });

    it('do not return mailto', () => {
        runTest('mailto:test', { autoMailto: false }, undefined);
    });

    it('invalid mailto', () => {
        runTest('mailtos:test', { autoMailto: true }, undefined);
    });
});
