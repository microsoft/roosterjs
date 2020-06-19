import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import { PluginEvent } from 'roosterjs-editor-types';

/**
 * Entity Plugin helps handle all operations related to an entity and generate entity specified events
 */
export default class EntityPlugin implements EditorPlugin {
    getName() {
        return 'Entity';
    }

    initialize(editor: Editor) {}

    dispose() {}

    onPluginEvent(event: PluginEvent) {
        // TODO: Add event handlers
    }
}
