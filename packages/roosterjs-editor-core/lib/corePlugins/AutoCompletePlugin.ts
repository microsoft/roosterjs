import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import { Keys } from '../interfaces/ContentEditFeature';
import { PluginEvent, PluginEventType, PluginKeyboardEvent, Wrapper } from 'roosterjs-editor-types';

/**
 * Auto complete Component helps handle the undo operation for an auto complete action
 */
export default class AutoCompletePlugin implements EditorPlugin {
    constructor(private readonly snapshotWrapper: Wrapper<string>) {}

    getName() {
        return 'AutoComplete';
    }

    initialize(editor: Editor) {
        editor.addContentEditFeature({
            keys: [Keys.BACKSPACE],
            shouldHandleEvent: () => this.snapshotWrapper.value !== null,
            handleEvent: (event: PluginKeyboardEvent, editor: Editor) => {
                event.rawEvent.preventDefault();
                editor.setContent(this.snapshotWrapper.value);
            },
        });
    }

    dispose() {}

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.ContentChanged:
            case PluginEventType.MouseDown:
            case PluginEventType.KeyDown:
                this.snapshotWrapper.value = null;
                break;
        }
    }
}
