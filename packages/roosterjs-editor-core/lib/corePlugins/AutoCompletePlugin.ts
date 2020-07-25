import Editor from '../editor/Editor';
import PluginWithState from '../interfaces/PluginWithState';
import { Keys } from '../interfaces/ContentEditFeature';
import { PluginEvent, PluginEventType, PluginKeyboardEvent, Wrapper } from 'roosterjs-editor-types';

/**
 * Auto complete Component helps handle the undo operation for an auto complete action
 */
export default class AutoCompletePlugin implements PluginWithState<string> {
    constructor(public readonly state: Wrapper<string>) {}

    getName() {
        return 'AutoComplete';
    }

    initialize(editor: Editor) {
        editor.addContentEditFeature({
            keys: [Keys.BACKSPACE],
            shouldHandleEvent: () => this.state.value !== null,
            handleEvent: (event: PluginKeyboardEvent, editor: Editor) => {
                event.rawEvent.preventDefault();
                editor.setContent(this.state.value);
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
                this.state.value = null;
                break;
        }
    }
}
