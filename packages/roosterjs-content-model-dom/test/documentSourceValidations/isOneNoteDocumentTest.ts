import { DocumentPropertyNames } from '../../lib/documentSourceValidations/constants';
import { isOneNoteDesktopDocument } from '../../lib/documentSourceValidations/isOneNoteDocument';

describe('isOneNoteDesktopDocument', () => {
    it('should return true when the PROG_ID_NAME attribute matches OneNote.File', () => {
        const props: any = {
            htmlAttributes: {
                [DocumentPropertyNames.PROG_ID_NAME]: 'OneNote.File',
            },
        };

        const result = isOneNoteDesktopDocument(props);
        expect(result).toBe(true);
    });

    it('should return false when the PROG_ID_NAME attribute does not match OneNote.File', () => {
        const props: any = {
            htmlAttributes: {
                [DocumentPropertyNames.PROG_ID_NAME]: 'SomeOtherValue',
            },
        };

        const result = isOneNoteDesktopDocument(props);
        expect(result).toBe(false);
    });

    it('should return false when the PROG_ID_NAME attribute is missing', () => {
        const props: any = {
            htmlAttributes: {},
        };

        const result = isOneNoteDesktopDocument(props);
        expect(result).toBe(false);
    });
});
