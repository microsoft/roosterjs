import addContentEditFeatures from '../editor/addContentEditFeatures';
import Editor from '../editor/Editor';
import isCtrlOrMetaPressed from '../eventApi/isCtrlOrMetaPressed';
import PluginWithState from '../interfaces/PluginWithState';
import { PluginEvent, PluginEventType, Wrapper } from 'roosterjs-editor-types';
import {
    ContentEditFeatureArray,
    Keys,
    ContentEditFeatureMap,
} from '../interfaces/ContentEditFeature';

/**
 * Edit Component helps handle Content edit features
 */
export default class EditPlugin implements PluginWithState<ContentEditFeatureMap> {
    private editor: Editor;

    constructor(
        public readonly state: Wrapper<ContentEditFeatureMap>,
        private featuresToAdd: ContentEditFeatureArray
    ) {}

    getName() {
        return 'Edit';
    }

    initialize(editor: Editor) {
        this.editor = editor;
        addContentEditFeatures(this.state.value, this.featuresToAdd);
    }

    dispose() {
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        let hasFunctionKey = false;
        let features: ContentEditFeatureArray;
        let ctrlOrMeta = false;

        if (event.eventType == PluginEventType.KeyDown) {
            let rawEvent = event.rawEvent;
            ctrlOrMeta = isCtrlOrMetaPressed(rawEvent);
            hasFunctionKey = ctrlOrMeta || rawEvent.altKey;
            features = this.state.value[rawEvent.which];
        } else if (event.eventType == PluginEventType.ContentChanged) {
            features = this.state.value[Keys.CONTENTCHANGED];
        }

        for (let i = 0; i < features?.length; i++) {
            const feature = features[i];
            if (
                (feature.allowFunctionKeys || !hasFunctionKey) &&
                feature.shouldHandleEvent(event, this.editor, ctrlOrMeta)
            ) {
                feature.handleEvent(event, this.editor);
                break;
            }
        }
    }
}
