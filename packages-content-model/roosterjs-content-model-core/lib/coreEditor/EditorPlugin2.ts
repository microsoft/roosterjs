import { ContentModelEditor2 } from './ContentModelEditor2';
import { PluginEvent2 } from './PluginEvent2';

export interface EditorPlugin2 {
    getName: () => string;
    initialize: (editor: ContentModelEditor2) => void;
    dispose: () => void;
    onPluginEvent: (event: PluginEvent2) => void;
    willHandleEventExclusively?: (event: PluginEvent2) => boolean;
}
