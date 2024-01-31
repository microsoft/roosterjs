import { getDOMSelection } from '../../lib/coreApi/getDOMSelection';
import { StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('getDOMSelection', () => {
    let core: StandaloneEditorCore;
    let getSelectionSpy: jasmine.Spy;
    let hasFocusSpy: jasmine.Spy;
    let containsSpy: jasmine.Spy;

    beforeEach(() => {
        getSelectionSpy = jasmine.createSpy('getSelection');
        containsSpy = jasmine.createSpy('contains');
        hasFocusSpy = jasmine.createSpy('hasFocus');

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
            api: {
                hasFocus: hasFocusSpy,
            },
        } as any;
    });

    it('no cached selection, no range selection', () => {
        const mockedSelection = {
            rangeCount: 0,
        };

        getSelectionSpy.and.returnValue(mockedSelection);
        hasFocusSpy.and.returnValue(true);

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
        hasFocusSpy.and.returnValue(true);

        const result = getDOMSelection(core);

        expect(result).toBeNull();
    });

    it('no cached selection, range selection is in editor', () => {
        const mockedElement = 'ELEMENT' as any;
        const mockedElementOffset = 'MOCKED_ELEMENT_OFFSET' as any;
        const secondaryMockedElement = 'ELEMENT_2' as any;
        const secondaryMockedElementOffset = 'MOCKED_ELEMENT_OFFSET_2' as any;
        const mockedRange = {
            commonAncestorContainer: mockedElement,
            startContainer: mockedElement,
            startOffset: mockedElementOffset,
            endContainer: secondaryMockedElement,
            endOffset: secondaryMockedElementOffset,
        } as any;
        const setBaseAndExtendSpy = jasmine.createSpy('setBaseAndExtendSpy');
        const mockedSelection = {
            rangeCount: 1,
            getRangeAt: () => mockedRange,
            setBaseAndExtend: setBaseAndExtendSpy,
            focusNode: secondaryMockedElement,
            focusOffset: secondaryMockedElementOffset,
        };

        getSelectionSpy.and.returnValue(mockedSelection);
        containsSpy.and.returnValue(true);
        hasFocusSpy.and.returnValue(true);

        const result = getDOMSelection(core);

        expect(result).toEqual({
            type: 'range',
            range: mockedRange,
            isReverted: false,
        });
    });

    it('no cached selection, range selection is in editor, isReverted', () => {
        const mockedElement = 'ELEMENT' as any;
        const mockedElementOffset = 'MOCKED_ELEMENT_OFFSET' as any;
        const secondaryMockedElement = 'ELEMENT_2' as any;
        const secondaryMockedElementOffset = 'MOCKED_ELEMENT_OFFSET_2' as any;
        const mockedRange = {
            commonAncestorContainer: mockedElement,
            startContainer: mockedElement,
            startOffset: mockedElementOffset,
            endContainer: secondaryMockedElement,
            endOffset: secondaryMockedElementOffset,
            collapsed: false,
        } as any;
        const setBaseAndExtendSpy = jasmine.createSpy('setBaseAndExtendSpy');
        const mockedSelection = {
            rangeCount: 1,
            getRangeAt: () => mockedRange,
            setBaseAndExtend: setBaseAndExtendSpy,
            focusNode: mockedElement,
            focusOffset: mockedElementOffset,
        };

        getSelectionSpy.and.returnValue(mockedSelection);
        containsSpy.and.returnValue(true);
        hasFocusSpy.and.returnValue(true);

        const result = getDOMSelection(core);

        expect(result).toEqual({
            type: 'range',
            range: mockedRange,
            isReverted: true,
        });
    });

    it('has cached selection, editor is in shadowEdit', () => {
        const mockedSelection = 'SELECTION' as any;
        core.selection.selection = mockedSelection;

        core.lifecycle.shadowEditFragment = true as any;
        containsSpy.and.returnValue(true);
        hasFocusSpy.and.returnValue(true);

        const result = getDOMSelection(core);

        expect(result).toBe(null);
    });

    it('has cached table selection, editor has focus', () => {
        const mockedSelection = {
            type: 'table',
        } as any;
        core.selection.selection = mockedSelection;

        hasFocusSpy.and.returnValue(true);
        containsSpy.and.returnValue(true);

        const result = getDOMSelection(core);

        expect(result).toBe(mockedSelection);
    });

    it('has cached image selection, editor has focus', () => {
        const mockedSelection = {
            type: 'image',
        } as any;
        core.selection.selection = mockedSelection;

        hasFocusSpy.and.returnValue(true);
        containsSpy.and.returnValue(true);

        const result = getDOMSelection(core);

        expect(result).toBe(mockedSelection);
    });

    it('has cached range selection, editor has focus', () => {
        const mockedElement = 'ELEMENT' as any;
        const mockedElementOffset = 'MOCKED_ELEMENT_OFFSET' as any;
        const secondaryMockedElement = 'ELEMENT_2' as any;
        const secondaryMockedElementOffset = 'MOCKED_ELEMENT_OFFSET_2' as any;
        const mockedRange = {
            commonAncestorContainer: mockedElement,
            startContainer: mockedElement,
            startOffset: mockedElementOffset,
            endContainer: secondaryMockedElement,
            endOffset: secondaryMockedElementOffset,
        } as any;
        const setBaseAndExtendSpy = jasmine.createSpy('setBaseAndExtendSpy');
        const mockedSelectionObj = {
            rangeCount: 1,
            getRangeAt: () => mockedRange,
            setBaseAndExtend: setBaseAndExtendSpy,
            focusNode: secondaryMockedElement,
            focusOffset: secondaryMockedElementOffset,
        };
        const mockedSelection = {
            type: 'range',
        } as any;

        core.selection.selection = mockedSelection;
        getSelectionSpy.and.returnValue(mockedSelectionObj);

        hasFocusSpy.and.returnValue(true);
        containsSpy.and.returnValue(true);

        const result = getDOMSelection(core);

        expect(result).toEqual({
            type: 'range',
            range: mockedRange,
            isReverted: false,
        });
    });

    it('has cached range selection, editor has focus, reverted', () => {
        const mockedElement = 'ELEMENT' as any;
        const mockedElementOffset = 'MOCKED_ELEMENT_OFFSET' as any;
        const secondaryMockedElement = 'ELEMENT_2' as any;
        const secondaryMockedElementOffset = 'MOCKED_ELEMENT_OFFSET_2' as any;
        const mockedRange = {
            commonAncestorContainer: mockedElement,
            startContainer: mockedElement,
            startOffset: mockedElementOffset,
            endContainer: secondaryMockedElement,
            endOffset: secondaryMockedElementOffset,
            collapsed: false,
        } as any;
        const setBaseAndExtendSpy = jasmine.createSpy('setBaseAndExtendSpy');
        const mockedSelectionObj = {
            rangeCount: 1,
            getRangeAt: () => mockedRange,
            setBaseAndExtend: setBaseAndExtendSpy,
            focusNode: mockedElement,
            focusOffset: mockedElementOffset,
        };
        const mockedSelection = {
            type: 'range',
        } as any;

        core.selection.selection = mockedSelection;
        getSelectionSpy.and.returnValue(mockedSelectionObj);

        hasFocusSpy.and.returnValue(true);
        containsSpy.and.returnValue(true);

        const result = getDOMSelection(core);

        expect(result).toEqual({
            type: 'range',
            range: mockedRange,
            isReverted: true,
        });
    });

    it('has cached range selection, editor does not have focus', () => {
        const mockedSelection = {
            type: 'image',
        } as any;
        core.selection.selection = mockedSelection;

        hasFocusSpy.and.returnValue(false);
        containsSpy.and.returnValue(true);

        const result = getDOMSelection(core);

        expect(result).toBe(mockedSelection);
    });

    it('no cached selection, editor does not have focus', () => {
        const mockedNewSelection = 'NEWSELECTION' as any;

        hasFocusSpy.and.returnValue(false);
        containsSpy.and.returnValue(true);

        getSelectionSpy.and.returnValue({
            rangeCount: 1,
            getRangeAt: () => mockedNewSelection,
        });

        const result = getDOMSelection(core);

        expect(result).toEqual({
            type: 'range',
            range: mockedNewSelection,
            isReverted: false,
        });
    });
});
