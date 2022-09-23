import UpdateContentPlugin from '../type/UpdateContentPlugin';
import { IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { UpdateMode } from '../type/UpdateMode';

/**
 * A plugin to help get HTML content from editor
 */
class UpdateContentPluginImpl implements UpdateContentPlugin {
    private editor: IEditor | null = null;
    private disposer: (() => void) | null = null;

    /**
     * Create a new instance of UpdateContentPlugin class
     * @param updateMode Mode of automatic update. It can be a combination of multiple UpdateMode values
     * @param onUpdate A callback to be invoked when update happens
     */
    constructor(
        private updateMode: UpdateMode,
        private onUpdate: (html: string, mode: UpdateMode) => void
    ) {}

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'UpdateContent';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = this.editor.addDomEventHandler('blur', this.onBlur);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.disposer?.();
        this.disposer = null;
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.EditorReady:
                this.update(UpdateMode.OnInitialize);
                break;

            case PluginEventType.BeforeDispose:
                this.update(UpdateMode.OnDispose);
                break;

            case PluginEventType.ContentChanged:
                this.update(UpdateMode.OnContentChangedEvent);
                break;

            case PluginEventType.Input:
                this.update(UpdateMode.OnUserInput);
                break;
        }
    }

    /**
     * Trigger a force update. onUpdate callback will be invoked with HTML content of editor
     */
    forceUpdate() {
        this.update(UpdateMode.Force);
    }

    private onBlur = () => {
        this.update(UpdateMode.OnBlur);
    };

    private update(mode: UpdateMode) {
        if (
            this.editor &&
            (mode == UpdateMode.Force || ((this.updateMode || 0) & mode) == mode) &&
            this.onUpdate
        ) {
            const content = this.editor.getContent();
            this.onUpdate(content, mode);
        }
    }
}

/**
 * Create a new instance of UpdateContentPlugin class
 * @param updateMode Mode of automatic update. It can be a combination of multiple UpdateMode values
 * @param onUpdate A callback to be invoked when update happens
 */
export default function createUpdateContentPlugin(
    updateMode: UpdateMode,
    onUpdate: (html: string, mode: UpdateMode) => void
): UpdateContentPlugin {
    return new UpdateContentPluginImpl(updateMode, onUpdate);
}
