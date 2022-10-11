import { isCtrlOrMetaPressed } from 'roosterjs-editor-dom';
import {
    EditPluginState,
    GenericContentEditFeature,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
    PluginWithState,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Edit Component helps handle Content edit features
 */
export default class EditPlugin implements PluginWithState<EditPluginState> {
    private editor: IEditor | null = null;
    private state: EditPluginState;

    /**
     * Construct a new instance of EditPlugin
     * @param options The editor options
     */
    constructor() {
        this.state = {
            features: {},
        };
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
        let features: GenericContentEditFeature<PluginEvent>[] | null = null;
        let ctrlOrMeta = false;

        if (event.eventType == PluginEventType.KeyDown) {
            const rawEvent = event.rawEvent;
            const range = this.editor?.getSelectionRange();

            ctrlOrMeta = isCtrlOrMetaPressed(rawEvent);
            hasFunctionKey = ctrlOrMeta || rawEvent.altKey;
            features =
                this.state.features[rawEvent.which] ||
                (range && !range.collapsed && this.state.features[Keys.RANGE]);
        } else if (event.eventType == PluginEventType.ContentChanged) {
            features = this.state.features[Keys.CONTENTCHANGED];
        }

        for (let i = 0; features && i < features?.length; i++) {
            const feature = features[i];
            if (
                (feature.allowFunctionKeys || !hasFunctionKey) &&
                this.editor &&
                feature.shouldHandleEvent(event, this.editor, ctrlOrMeta)
            ) {
                feature.handleEvent(event, this.editor);
                break;
            }
        }
    }
}
