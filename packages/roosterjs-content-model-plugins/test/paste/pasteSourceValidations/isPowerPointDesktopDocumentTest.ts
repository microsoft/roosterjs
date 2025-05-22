import { GetSourceInputParams } from '../../../lib/paste/pasteSourceValidations/getPasteSource';
import { isPowerPointDesktopDocument } from '../../../lib/paste/pasteSourceValidations/isPowerPointDesktopDocument';
import { POWERPOINT_ATTRIBUTE_VALUE } from './pasteTestUtils';

describe('isPowerPointDesktopDocument |', () => {
    it('Is a PPT document 1', () => {
        const htmlAttributes: Record<string, string> = {
            ProgId: POWERPOINT_ATTRIBUTE_VALUE,
        };

        const result = isPowerPointDesktopDocument(<GetSourceInputParams>{
            htmlAttributes,
            environment: {},
        });

        expect(result).toBeTrue();
    });

    it('Is not a PPT Document', () => {
        const result = isPowerPointDesktopDocument(<GetSourceInputParams>{
            htmlAttributes: {},
            environment: {},
        });

        expect(result).toBeFalse();
    });
});
