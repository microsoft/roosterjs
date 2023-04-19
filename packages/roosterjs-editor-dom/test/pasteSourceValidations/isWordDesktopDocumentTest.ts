import isWordDesktopDocument from '../../lib/pasteSourceValidations/isWordDesktopDocument';
import { getSourceInputParams } from '../../lib/pasteSourceValidations/getPasteSource';
import { WORD_ATTRIBUTE_VALUE } from './pasteTestUtils';

const WORD_PROG_ID = 'Word.Document';

describe('isWordDesktopDocument |', () => {
    it('Is a Word document 1', () => {
        const htmlAttributes: Record<string, string> = {
            ProgId: WORD_PROG_ID,
        };

        const result = isWordDesktopDocument(<getSourceInputParams>{ htmlAttributes });

        expect(result).toBeTrue();
    });

    it('Is a Word document 2', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:w': WORD_ATTRIBUTE_VALUE,
            ProgId: WORD_PROG_ID,
        };

        const result = isWordDesktopDocument(<getSourceInputParams>{ htmlAttributes });

        expect(result).toBeTrue();
    });

    it('Is a Word document 3', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:w': WORD_ATTRIBUTE_VALUE,
        };

        const result = isWordDesktopDocument(<getSourceInputParams>{ htmlAttributes });

        expect(result).toBeTrue();
    });

    it('Is not a Word Document', () => {
        const result = isWordDesktopDocument(<getSourceInputParams>{ htmlAttributes: {} });

        expect(result).toBeFalse();
    });
});
