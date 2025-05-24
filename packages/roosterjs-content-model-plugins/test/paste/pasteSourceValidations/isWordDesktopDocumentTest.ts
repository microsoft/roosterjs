import { GetSourceInputParams } from '../../../lib/paste/pasteSourceValidations/getPasteSource';
import { isWordDesktopDocument } from '../../../lib/paste/pasteSourceValidations/isWordDesktopDocument';
import { WORD_ATTRIBUTE_VALUE } from './pasteTestUtils';

const WORD_PROG_ID = 'Word.Document';

describe('isWordDesktopDocument |', () => {
    it('Is a Word document 1', () => {
        const htmlAttributes: Record<string, string> = {
            ProgId: WORD_PROG_ID,
        };

        const result = isWordDesktopDocument(<GetSourceInputParams>{
            htmlAttributes,
            clipboardData: {},
            environment: {},
        });

        expect(result).toBeTrue();
    });

    it('Is a Word document 2', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:w': WORD_ATTRIBUTE_VALUE,
            ProgId: WORD_PROG_ID,
        };

        const result = isWordDesktopDocument(<GetSourceInputParams>{
            htmlAttributes,
            clipboardData: {},
            environment: {},
        });

        expect(result).toBeTrue();
    });

    it('Is a Word document 3', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:w': WORD_ATTRIBUTE_VALUE,
        };

        const result = isWordDesktopDocument(<GetSourceInputParams>{
            htmlAttributes,
            clipboardData: {},
            environment: {},
        });

        expect(result).toBeTrue();
    });

    it('Is a Word document 4 ', () => {
        const htmlAttributes: Record<string, string> = {};

        const result = isWordDesktopDocument(<GetSourceInputParams>{
            htmlAttributes,
            clipboardData: {
                rawHtml: `<html xmlns:o="urn:schemas-microsoft-com:office:office"
                xmlns:w="urn:schemas-microsoft-com:office:word"
                xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
                xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"></head>`,
            },
            environment: {
                isSafari: true,
            },
        });

        expect(result).toBeTrue();
    });

    it('Is a Word document 5 ', () => {
        const htmlAttributes: Record<string, string> = {};

        const result = isWordDesktopDocument(<GetSourceInputParams>{
            htmlAttributes,
            clipboardData: {
                rawHtml: `<html xmlns:o="urn:schemas-microsoft-com:office:office"
                xmlns:w  =  "urn:schemas-microsoft-com:office:word"
                xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
                xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"></head>`,
            },
            environment: {
                isSafari: true,
            },
        });

        expect(result).toBeTrue();
    });

    it('Is not a Word document | Safari scenario but environment is not safari', () => {
        const htmlAttributes: Record<string, string> = {};

        const result = isWordDesktopDocument(<GetSourceInputParams>{
            htmlAttributes,
            clipboardData: {
                rawHtml: `<html xmlns:o="urn:schemas-microsoft-com:office:office"
                xmlns:w="urn:schemas-microsoft-com:office:word"
                xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
                xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"></head>`,
            },
            environment: {},
        });

        expect(result).toBeFalse();
    });

    it('Is not a Word Document', () => {
        const result = isWordDesktopDocument(<GetSourceInputParams>{
            htmlAttributes: {},
            clipboardData: {},
            environment: {},
        });

        expect(result).toBeFalse();
    });
});
