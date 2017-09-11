import Editor from './Editor';
import { PluginEvent } from 'roosterjs-types';

interface EditorPlugin {
    initialize: (editor: Editor) => void;
    dispose: () => void;
    willHandleEventExclusively?: (event: PluginEvent) => boolean;
    onPluginEvent?: (event: PluginEvent) => void;
}

export default EditorPlugin;
