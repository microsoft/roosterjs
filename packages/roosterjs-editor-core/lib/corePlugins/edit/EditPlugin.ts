import { createWrapper, isCtrlOrMetaPressed } from 'roosterjs-editor-dom';
import {
    GenericContentEditFeature,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
    PluginWithState,
    Wrapper,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Edit Component helps handle Content edit features
 */
export default class EditPlugin
    implements PluginWithState<Record<number, GenericContentEditFeature<PluginEvent>[]>> {
    private editor: IEditor;
    private state: Wrapper<Record<number, GenericContentEditFeature<PluginEvent>[]>>;

    /**
     * Construct a new instance of EditPlugin
     * @param options The editor options
     */
    constructor() {
        this.state = createWrapper({});
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Edit';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        let hasFunctionKey = false;
        let features: GenericContentEditFeature<PluginEvent>[];
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
