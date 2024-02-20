import { EditorCore } from 'roosterjs-content-model-types';
import { focus } from '../../lib/coreApi/focus';

describe('focus', () => {
    let div: HTMLDivElement;
    let core: EditorCore;
    let hasFocusSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let nativeFocusSpy: jasmine.Spy;
    let mockedSelection1 = {
        type: 'range',
    } as any;
    let mockedSelection2 = {
        type: 'table',
    } as any;

    beforeEach(() => {
        hasFocusSpy = jasmine.createSpy('hasFocus');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        nativeFocusSpy = jasmine.createSpy('focus');

        div = {
            focus: nativeFocusSpy,
        } as any;

        core = {
            lifecycle: {},
            api: {
                hasFocus: hasFocusSpy,
                setDOMSelection: setDOMSelectionSpy,
            },
            selection: {},
            contentDiv: div,
        } as any;
    });

    it('focus - has selection, do not need fallback', () => {
        let hasFocus = false;
        hasFocusSpy.and.callFake(() => {
            const result = hasFocus;
            hasFocus = true;

            return result;
        });

        core.selection.selection = mockedSelection1;

        focus(core);

        expect(setDOMSelectionSpy).toHaveBeenCalledWith(core, mockedSelection1, true);
        expect(nativeFocusSpy).not.toHaveBeenCalled();
    });

    it('focus - has selection,  need fallback', () => {
        let hasFocus = false;
        hasFocusSpy.and.callFake(() => {
            const result = hasFocus;
            hasFocus = false;

            return result;
        });

        core.selection.selection = mockedSelection1;

        focus(core);

        expect(setDOMSelectionSpy).toHaveBeenCalledWith(core, mockedSelection1, true);
        expect(nativeFocusSpy).toHaveBeenCalledTimes(1);
    });

    it('focus - has selection with other type', () => {
        let hasFocus = false;
        hasFocusSpy.and.callFake(() => {
            const result = hasFocus;
            hasFocus = false;

            return result;
        });

        core.selection.selection = mockedSelection2;

        focus(core);

        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        expect(nativeFocusSpy).toHaveBeenCalledTimes(1);
    });

    it('focus - no selection', () => {
        let hasFocus = false;
        hasFocusSpy.and.callFake(() => {
            const result = hasFocus;
            hasFocus = false;

            return result;
        });

        focus(core);

        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        expect(nativeFocusSpy).toHaveBeenCalledTimes(1);
    });

    it('focus - in shadow edit', () => {
        let hasFocus = false;

        core.lifecycle.shadowEditFragment = {} as any;

        hasFocusSpy.and.callFake(() => {
            const result = hasFocus;
            hasFocus = false;

            return result;
        });

        focus(core);

        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        expect(nativeFocusSpy).not.toHaveBeenCalled();
    });
});
