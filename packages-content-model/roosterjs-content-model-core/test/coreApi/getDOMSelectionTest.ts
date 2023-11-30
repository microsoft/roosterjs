import { getDOMSelection } from '../../lib/coreApi/getDOMSelection';
import { StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('getDOMSelection', () => {
    let core: StandaloneEditorCore;
    let getSelectionSpy: jasmine.Spy;
    let containsSpy: jasmine.Spy;

    beforeEach(() => {
        getSelectionSpy = jasmine.createSpy('getSelection');
        containsSpy = jasmine.createSpy('contains');

        core = {
            lifecycle: {},
            selection: {},
            contentDiv: {
                ownerDocument: {
                    defaultView: {
                        getSelection: getSelectionSpy,
                    },
                },
                contains: containsSpy,
            },
        } as any;
    });

    it('no cached selection, no range selection', () => {
        const mockedSelection = {
            rangeCount: 0,
        };

        getSelectionSpy.and.returnValue(mockedSelection);

        const result = getDOMSelection(core);

        expect(result).toBeNull();
    });

    it('no cached selection, range selection is out of editor', () => {
        const mockedElement = 'ELEMENT' as any;
        const mockedSelection = {
            rangeCount: 1,
            getRangeAt: () => ({
                commonAncestorContainer: mockedElement,
            }),
        };

        getSelectionSpy.and.returnValue(mockedSelection);
        containsSpy.and.returnValue(false);

        const result = getDOMSelection(core);

        expect(result).toBeNull();
    });

    it('no cached selection, range selection is in editor', () => {
        const mockedElement = 'ELEMENT' as any;
        const mockedRange = {
            commonAncestorContainer: mockedElement,
        } as any;
        const mockedSelection = {
            rangeCount: 1,
            getRangeAt: () => mockedRange,
        };

        getSelectionSpy.and.returnValue(mockedSelection);
        containsSpy.and.returnValue(true);

        const result = getDOMSelection(core);

        expect(result).toEqual({
            type: 'range',
            range: mockedRange,
        });
    });

    it('has cached selection', () => {
        const mockedSelection = 'SELECTION' as any;
        core.selection.selection = mockedSelection;

        containsSpy.and.returnValue(true);

        const result = getDOMSelection(core);

        expect(result).toBe(mockedSelection);
    });
});
