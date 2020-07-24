import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import isCtrlOrMetaPressed from '../eventApi/isCtrlOrMetaPressed';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    ContentEditFeatureArray,
    Keys,
    ContentEditFeatureMap,
} from '../interfaces/ContentEditFeature';

/**
 * Edit Component helps handle Content edit features
 */
export default class EditPlugin implements EditorPlugin {
    private editor: Editor;

    constructor(private readonly featureMap: ContentEditFeatureMap) {}

    getName() {
        return 'Edit';
    }

    initialize(editor: Editor) {
        this.editor = editor;
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
            features = this.featureMap[rawEvent.which];
        } else if (event.eventType == PluginEventType.ContentChanged) {
            features = this.featureMap[Keys.CONTENTCHANGED];
        }

        const currentFeature =
            features &&
            features.filter(
                feature =>
                    (feature.allowFunctionKeys || !hasFunctionKey) &&
                    feature.shouldHandleEvent(event, this.editor, ctrlOrMeta)
            )[0];

        if (currentFeature) {
            currentFeature.handleEvent(event, this.editor);
        }
    }
}
