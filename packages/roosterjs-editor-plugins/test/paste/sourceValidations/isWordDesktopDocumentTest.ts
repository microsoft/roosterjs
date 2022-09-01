import isWordDesktopDocument from '../../../lib/plugins/Paste/sourceValidations/isWordDesktopDocument';
import { KnownSourceType } from '../../../lib/plugins/Paste/sourceValidations/KnownSourceType';

const WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word';
const WORD_PROG_ID = 'Word.Document';

describe('isWordDesktopDocument |', () => {
    it('Is a Word document 1', () => {
        const htmlAttributes: Record<string, string> = {
            ProgId: WORD_PROG_ID,
        };

        const result = isWordDesktopDocument(htmlAttributes);

        expect(result).toEqual(KnownSourceType.WordDesktop);
    });

    it('Is a Word document 2', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:w': WORD_ATTRIBUTE_VALUE,
            ProgId: WORD_PROG_ID,
        };

        const result = isWordDesktopDocument(htmlAttributes);

        expect(result).toEqual(KnownSourceType.WordDesktop);
    });

    it('Is a Word document 3', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:w': WORD_ATTRIBUTE_VALUE,
        };

        const result = isWordDesktopDocument(htmlAttributes);

        expect(result).toEqual(KnownSourceType.WordDesktop);
    });

    it('Is not a Word Document', () => {
        const result = isWordDesktopDocument({});

        expect(result).toEqual(false);
    });
});
