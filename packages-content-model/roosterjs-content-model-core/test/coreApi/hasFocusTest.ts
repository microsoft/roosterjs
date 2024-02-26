import { EditorCore } from 'roosterjs-content-model-types';
import { hasFocus } from '../../lib/coreApi/hasFocus';

describe('hasFocus', () => {
    let core: EditorCore;
    let containsSpy: jasmine.Spy;
    let mockedElement = 'ELEMENT' as any;

    beforeEach(() => {
        containsSpy = jasmine.createSpy('contains');
        core = {
            physicalRoot: {
                ownerDocument: {},
                contains: containsSpy,
            },
            logicalRoot: {
                ownerDocument: {},
                contains: containsSpy,
            },
        } as any;
    });

    afterEach(() => {
        core = null;
    });

    it('Has active element inside editor', () => {
        (core.physicalRoot.ownerDocument as any).activeElement = mockedElement;
        containsSpy.and.returnValue(true);

        let result = hasFocus(core);

        expect(result).toBe(true);
    });

    it('Has active element outside editor', () => {
        (core.physicalRoot.ownerDocument as any).activeElement = mockedElement;
        containsSpy.and.returnValue(false);

        let result = hasFocus(core);

        expect(result).toBe(false);
    });

    it('No active element', () => {
        let result = hasFocus(core);

        expect(result).toBe(false);
    });
});
