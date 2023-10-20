import { GetSourceInputParams } from '../../../../../lib/editor/plugins/PastePlugin/pasteSourceValidations/getPasteSource';
import { isPowerPointDesktopDocument } from '../../../../../lib/editor/plugins/PastePlugin/pasteSourceValidations/isPowerPointDesktopDocument';
import { POWERPOINT_ATTRIBUTE_VALUE } from './pasteTestUtils';

describe('isPowerPointDesktopDocument |', () => {
    it('Is a PPT document 1', () => {
        const htmlAttributes: Record<string, string> = {
            ProgId: POWERPOINT_ATTRIBUTE_VALUE,
        };

        const result = isPowerPointDesktopDocument(<GetSourceInputParams>{ htmlAttributes });

        expect(result).toBeTrue();
    });

    it('Is not a PPT Document', () => {
        const result = isPowerPointDesktopDocument(<GetSourceInputParams>{ htmlAttributes: {} });

        expect(result).toBeFalse();
    });
});
