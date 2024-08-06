import { getSafeIdSelector } from '../../lib/domUtils/getSafeIdSelector';

describe('getSafeIdSelector', () => {
    it('emptyString', () => {
        const result = getSafeIdSelector('');

        expect(result).toEqual('');
    });
    it('Valid', () => {
        const result = getSafeIdSelector('Test');

        expect(result).toEqual('#Test');
    });
    it('Invalid with number', () => {
        const result = getSafeIdSelector('0_Test');

        expect(result).toEqual('[id="0_Test"]');
    });
    it('Invalid with dash', () => {
        const result = getSafeIdSelector('-Test');

        expect(result).toEqual('[id="-Test"]');
    });
    it('Invalid with underscore', () => {
        const result = getSafeIdSelector('_Test');

        expect(result).toEqual('[id="_Test"]');
    });
});
