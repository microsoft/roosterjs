import * as TestHelper from '../TestHelper';
import execFormatWithUndo from '../../format/execFormatWithUndo';
import { ContentChangedEvent, PluginEventType } from 'roosterjs-types';
import { Editor } from 'roosterjs-core';

describe('execFormatWithUndo()', () => {
    let testID = 'execFormatWithUndo';
    let editor: Editor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('triggers editor.addUndoSnapshot() twice', () => {
        spyOn(editor, 'addUndoSnapshot').and.callThrough();

        execFormatWithUndo(editor, () => {});

        expect(editor.addUndoSnapshot).toHaveBeenCalledTimes(2);
    });

    it('triggers the input formatter callback', () => {
        let triggered = false;
        execFormatWithUndo(editor, () => {
            triggered = true;
        });

        expect(triggered).toBe(true);
    });

    it('triggers editor.triggerEvent()', () => {
        spyOn(editor, 'triggerEvent').and.callThrough();

        execFormatWithUndo(editor, () => {});

        expect(editor.triggerEvent).toHaveBeenCalledTimes(1);
        let event = (<jasmine.Spy>editor.triggerEvent).calls.argsFor(0)[0] as ContentChangedEvent;
        expect(event.eventType).toBe(PluginEventType.ContentChanged);
        expect(event.source).toBe('Format');
    });
});
