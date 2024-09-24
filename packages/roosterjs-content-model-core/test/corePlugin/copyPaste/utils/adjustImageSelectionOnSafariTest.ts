import { adjustImageSelectionOnSafari } from '../../../../lib/corePlugin/copyPaste/utils/adjustImageSelectionOnSafari';
import type { DOMSelection, IEditor } from 'roosterjs-content-model-types';

describe('adjustImageSelectionOnSafari', () => {
    let getEnvironmentSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let editor: IEditor;

    beforeEach(() => {
        getEnvironmentSpy = jasmine.createSpy('getEnvironment');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        editor = ({
            getEnvironment: getEnvironmentSpy,
            setDOMSelection: setDOMSelectionSpy,
        } as any) as IEditor;
    });

    it('should adjustSelection', () => {
        getEnvironmentSpy.and.returnValue({
            isSafari: true,
        });
        const image = document.createElement('img');
        document.body.appendChild(image);
        const selection: DOMSelection = {
            type: 'image',
            image: image,
        };
        const range = new Range();
        range.setStartBefore(image);
        range.setEndAfter(image);

        adjustImageSelectionOnSafari(editor, selection);
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            range: range,
            type: 'range',
            isReverted: false,
        });

        document.body.removeChild(image);
    });

    it('should not adjustSelection - it is not safari', () => {
        getEnvironmentSpy.and.returnValue({
            isSafari: false,
        });
        const image = new Image();
        const selection: DOMSelection = {
            type: 'image',
            image: image,
        };

        adjustImageSelectionOnSafari(editor, selection);
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('should not adjustSelection - it is not image', () => {
        getEnvironmentSpy.and.returnValue({
            isSafari: true,
        });
        const selection: DOMSelection = {
            type: 'range',
            range: new Range(),
            isReverted: false,
        };

        adjustImageSelectionOnSafari(editor, selection);
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });
});
