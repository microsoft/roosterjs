import isPowerPointDesktopDocument from '../../../lib/plugins/Paste/sourceValidations/isPowerPointDesktopDocument';
import { getSourceInputParams } from '../../../lib/plugins/Paste/sourceValidations/getPasteSource';
import { POWERPOINT_ATTRIBUTE_VALUE } from '../pasteTestUtils';

describe('isPowerPointDesktopDocument |', () => {
    it('Is a PPT document 1', () => {
        const htmlAttributes: Record<string, string> = {
            ProgId: POWERPOINT_ATTRIBUTE_VALUE,
        };

        const result = isPowerPointDesktopDocument(<getSourceInputParams>{ htmlAttributes });

        expect(result).toBeTrue();
    });

    it('Is not a PPT Document', () => {
        const result = isPowerPointDesktopDocument(<getSourceInputParams>{ htmlAttributes: {} });

        expect(result).toBeFalse();
    });
});
