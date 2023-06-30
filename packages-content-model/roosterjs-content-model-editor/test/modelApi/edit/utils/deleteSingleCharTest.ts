import { deleteSingleChar } from '../../../../lib/modelApi/edit/utils/deleteSingleChar';

describe('deleteSingleChar', () => {
    const tests = ['', 'a', '\u200b', '好', '👩‍💻', '🎉', '🛏', '🎉', '👩‍❤️‍💋‍👩'];

    it('Delete from start', () => {
        tests.forEach(test => {
            const result = deleteSingleChar(test, true);

            expect(result).toBe('', test);
        });
    });

    it('Delete from end', () => {
        tests.forEach(test => {
            const result = deleteSingleChar(test, false);

            expect(result).toBe('', test);
        });
    });

    it('Delete from start with another string', () => {
        tests.forEach(test => {
            const str = 'test';
            const result = deleteSingleChar(test + str, true);

            expect(result).toBe(test == '' ? 'est' : str, test);
        });
    });

    it('Delete from start with another string', () => {
        tests.forEach(test => {
            const str = 'test';
            const result = deleteSingleChar(str + test, false);

            expect(result).toBe(test == '' ? 'tes' : str, test);
        });
    });

    it('Delete joint emoji', () => {
        // Temporary result: we don't have a good solution for this kind of joint emoji yet, current result seems acceptable
        const result1 = deleteSingleChar('🇫🇷', true);
        expect(result1).toBe('🇷');

        const result2 = deleteSingleChar('🇫🇷', false);
        expect(result2).toBe('🇫');
    });
});
