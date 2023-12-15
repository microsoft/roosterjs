import { hasFocus } from '../../lib/coreApi/hasFocus';
import { StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('hasFocus', () => {
    let core: StandaloneEditorCore;
    let containsSpy: jasmine.Spy;
    let mockedElement = 'ELEMENT' as any;

    beforeEach(() => {
        containsSpy = jasmine.createSpy('contains');
        core = {
            contentDiv: {
                ownerDocument: {},
                contains: containsSpy,
            },
        } as any;
    });

    afterEach(() => {
        core = null;
    });

    it('Has active element inside editor', () => {
        (core.contentDiv.ownerDocument as any).activeElement = mockedElement;
        containsSpy.and.returnValue(true);

        let result = hasFocus(core);

        expect(result).toBe(true);
    });

    it('Has active element outside editor', () => {
        (core.contentDiv.ownerDocument as any).activeElement = mockedElement;
        containsSpy.and.returnValue(false);

        let result = hasFocus(core);

        expect(result).toBe(false);
    });

    it('No active element', () => {
        let result = hasFocus(core);

        expect(result).toBe(false);
    });
});
