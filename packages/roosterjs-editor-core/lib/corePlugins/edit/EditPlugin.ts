import addContentEditFeatures from './addContentEditFeatures';
import createWrapper from '../utils/createWrapper';
import Editor from '../../editor/Editor';
import EditorOptions from '../../interfaces/EditorOptions';
import isCtrlOrMetaPressed from '../../eventApi/isCtrlOrMetaPressed';
import PluginWithState from '../../interfaces/PluginWithState';
import { GenericContentEditFeature, Keys } from '../../interfaces/ContentEditFeature';
import { PluginEvent, PluginEventType, Wrapper } from 'roosterjs-editor-types';

/**
 * Edit Component helps handle Content edit features
 */
export default class EditPlugin
    implements PluginWithState<Record<number, GenericContentEditFeature<PluginEvent>[]>> {
    private editor: Editor;
    private state: Wrapper<Record<number, GenericContentEditFeature<PluginEvent>[]>>;

    /**
     * Construct a new instance of EditPlugin
     * @param options The editor options
     */
    constructor(options: EditorOptions) {
        this.state = createWrapper(addContentEditFeatures({}, options.editFeatures));
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
    initialize(editor: Editor) {
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
