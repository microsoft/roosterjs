import { shouldSetValue } from '../../../lib/formatHandlers/utils/shouldSetValue';

describe('shouldSetValue', () => {
    it('no value', () => {
        const result = shouldSetValue(undefined, '', 'existing', '');

        expect(result).toBeFalsy();
    });

    it('Empty string value', () => {
        const result = shouldSetValue('', '', 'existing', '');

        expect(result).toBeFalsy();
    });

    it('Has value, is inherit', () => {
        const result = shouldSetValue('inherit', '', 'existing', '');

        expect(result).toBeFalsy();
    });

    it('value equals normal value', () => {
        const result = shouldSetValue('test', 'test', '', '');

        expect(result).toBeFalsy();
    });

    it('Has value, no existing value', () => {
        const result = shouldSetValue('test', 'test2', '', '');

        expect(result).toBeTruthy();
    });

    it('Has value, value equal to default value', () => {
        const result = shouldSetValue('test', 'test2', '', 'test');

        expect(result).toBeTruthy();
    });

    it('Has value, no normal value, no existing value, no default value', () => {
        const result = shouldSetValue('test', '', '', '');

        expect(result).toBeTruthy();
    });
});
