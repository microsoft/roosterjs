import { TouchPlugin } from '../../lib/touch/TouchPlugin';
import { IEditor } from 'roosterjs-content-model-types';
import * as repositionTouchSelection from '../../lib/touch/repositionTouchSelection';

describe('Content Model Touch Plugin Test', () => {
    let editor: IEditor;
    let touchPlugin: TouchPlugin;
    let repositionTouchSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        repositionTouchSelectionSpy = spyOn(repositionTouchSelection, 'repositionTouchSelection');

        editor = ({
            focus: () => {},
            getDOMSelection: () =>
                ({
                    type: 'range',
                    range: {
                        collapsed: true,
                    },
                } as any), // Force return invalid range to go through content model code
            formatContentModel: () => {},
        } as any) as IEditor;

        touchPlugin = new TouchPlugin();

        touchPlugin.initialize(editor);
    });

    afterEach(() => {
        touchPlugin.dispose();
    });

    it('should call repositionTouchSelection pointerUp triggered by touch', () => {
        touchPlugin.onPluginEvent({
            eventType: 'pointerUp',
            rawEvent: {
                pointerType: 'touch',
            } as any,
        });

        expect(repositionTouchSelectionSpy).toHaveBeenCalled();
    });

    it('should call repositionTouchSelection pointerUp triggered by pen', () => {
        touchPlugin.onPluginEvent({
            eventType: 'pointerUp',
            rawEvent: {
                pointerType: 'pen',
            } as any,
        });

        expect(repositionTouchSelectionSpy).toHaveBeenCalled();
    });

    it('should not call repositionTouchSelection pointerUp triggered by mouse or other events', () => {
        touchPlugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {} as any,
        });

        touchPlugin.onPluginEvent({
            eventType: 'mouseUp',
            rawEvent: {} as any,
        });

        expect(repositionTouchSelectionSpy).not.toHaveBeenCalled();
    });
});
