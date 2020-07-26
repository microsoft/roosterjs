import Editor from '../editor/Editor';
import PluginWithState from '../interfaces/PluginWithState';
import { Keys } from '../interfaces/ContentEditFeature';
import { PluginEvent, PluginEventType, Wrapper } from 'roosterjs-editor-types';

/**
 * Auto complete Component helps handle the undo operation for an auto complete action
 */
export default class AutoCompletePlugin implements PluginWithState<string> {
    private editor: Editor;

    constructor(public readonly state: Wrapper<string>) {}

    getName() {
        return 'AutoComplete';
    }

    initialize(editor: Editor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    willHandleEventExclusively(event: PluginEvent) {
        return (
            event.eventType == PluginEventType.KeyDown &&
            event.rawEvent.which == Keys.BACKSPACE &&
            !!this.state.value
        );
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.ContentChanged:
            case PluginEventType.MouseDown:
                this.state.value = null;
                break;
            case PluginEventType.KeyDown:
                if (event.rawEvent.which != Keys.BACKSPACE) {
                    this.state.value = null;
                } else if (this.state.value !== null) {
                    event.rawEvent.preventDefault();
                    this.editor.setContent(this.state.value);
                }
                break;
        }
    }
}
