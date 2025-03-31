import { fixupHiddenProperties } from '../../lib/hiddenProperty/fixupHiddenProperties';

describe('fixupHiddenProperties', () => {
    it('should not throw an error when called', () => {
        const editor: any = {}; // Mocked editor object
        const options: any = {}; // Mocked options object

        expect(() => fixupHiddenProperties(editor, options)).not.toThrow();
    });
});
