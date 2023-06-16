import { hasSpacesOnly } from '../../lib/domUtils/stringUtil';

describe('hasSpacesOnly', () => {
    it('Empty string', () => {
        const result = hasSpacesOnly('');
        expect(result).toBeTrue();
    });

    it('Normal space', () => {
        const result = hasSpacesOnly(' ');
        expect(result).toBeTrue();
    });

    it('CR', () => {
        const result = hasSpacesOnly('\r\n');
        expect(result).toBeTrue();
    });

    it('Text', () => {
        const result = hasSpacesOnly('text');
        expect(result).toBeFalse();
    });

    it('&nbsp;', () => {
        const result = hasSpacesOnly('\u00a0');
        expect(result).toBeFalse();
    });

    it('Combination 1', () => {
        const result = hasSpacesOnly('  \r\n\t  ');
        expect(result).toBeTrue();
    });

    it('Combination 2', () => {
        const result = hasSpacesOnly('  test ');
        expect(result).toBeFalse();
    });

    it('Combination 3', () => {
        const result = hasSpacesOnly('  \u00a0  ');
        expect(result).toBeFalse();
    });
});
