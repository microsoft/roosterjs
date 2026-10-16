import { isUnsafeUrl } from '../../lib/domUtils/isUnsafeUrl';

describe('isUnsafeUrl', () => {
    it('Empty values', () => {
        expect(isUnsafeUrl('')).toBeFalse();
        expect(isUnsafeUrl(null)).toBeFalse();
        expect(isUnsafeUrl(undefined)).toBeFalse();
    });

    it('Safe urls', () => {
        expect(isUnsafeUrl('https://example.com')).toBeFalse();
        expect(isUnsafeUrl('http://example.com')).toBeFalse();
        expect(isUnsafeUrl('mailto:someone@example.com')).toBeFalse();
        expect(isUnsafeUrl('data:image/png;base64,AAAA')).toBeFalse();
        expect(isUnsafeUrl('/relative/path')).toBeFalse();
        expect(isUnsafeUrl('relative/path')).toBeFalse();
    });

    it('Safe urls that look similar to a script protocol', () => {
        expect(isUnsafeUrl('scripting:https://example.com')).toBeFalse();
        expect(isUnsafeUrl('transcript:https://example.com')).toBeFalse();
        expect(isUnsafeUrl('https://example.com/script:.js')).toBeFalse();
        expect(isUnsafeUrl('/redirect?url=javascript:alert(1)')).toBeFalse();
    });

    it('Unsafe protocols', () => {
        expect(isUnsafeUrl('javascript:alert(1)')).toBeTrue();
        expect(isUnsafeUrl('vbscript:msgbox(1)')).toBeTrue();
        expect(isUnsafeUrl('script:alert(1)')).toBeTrue();
        expect(isUnsafeUrl('JaVaScRiPt:alert(1)')).toBeTrue();
    });

    it('Unsafe protocols obfuscated with characters that browsers ignore', () => {
        // Browsers strip TAB, LF and CR from anywhere inside a URL
        expect(isUnsafeUrl('java\tscript:alert(1)')).toBeTrue();
        expect(isUnsafeUrl('javascr\ript:alert(1)')).toBeTrue();
        expect(isUnsafeUrl('javascr\nipt:alert(1)')).toBeTrue();
        expect(isUnsafeUrl('j\ta\nv\ra\ts\nc\rr\ti\np\rt:alert(1)')).toBeTrue();

        // Cases previously covered by checkXss
        expect(isUnsafeUrl('s\nc\nr\ni\np\nt:https://example.com')).toBeTrue();
        expect(isUnsafeUrl('S\nC\nr\ni\nP\nt:https://example.com')).toBeTrue();

        // Browsers ignore leading control characters and spaces
        expect(isUnsafeUrl('   javascript:alert(1)')).toBeTrue();
        expect(isUnsafeUrl('\u0001javascript:alert(1)')).toBeTrue();
        expect(isUnsafeUrl(' java\tscript:alert(1)')).toBeTrue();
    });
});
