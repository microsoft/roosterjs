import isPowerPointDesktopDocument from '../../../lib/plugins/Paste/sourceValidations/isPowerPointDesktopDocument';
import { KnownSourceType } from '../../../lib/plugins/Paste/sourceValidations/KnownSourceType';

const POWERPOINT_ATTRIBUTE_VALUE = 'PowerPoint.Slide';

describe('isPowerPointDesktopDocument |', () => {
    it('Is a PPT document 1', () => {
        const htmlAttributes: Record<string, string> = {
            ProgId: POWERPOINT_ATTRIBUTE_VALUE,
        };

        const result = isPowerPointDesktopDocument(htmlAttributes);

        expect(result).toEqual(KnownSourceType.PowerPointDesktop);
    });

    it('Is not a PPT Document', () => {
        const result = isPowerPointDesktopDocument({});

        expect(result).toEqual(false);
    });
});
