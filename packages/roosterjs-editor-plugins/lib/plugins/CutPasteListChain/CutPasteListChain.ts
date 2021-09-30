import { experimentCommitListChains } from 'roosterjs-editor-api';
import { VListChain } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

/**
 * Maintain list numbers of list chain when content is modified by cut/paste/drag&drop
 */
export default class CutPasteListChain implements EditorPlugin {
    private chains: VListChain[];
    private expectedChangeSource: ChangeSource;
    private editor: IEditor;
    private disposer: () => void;

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'CutPasteListChain';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = this.editor.addDomEventHandler('drop', this.onDrop);
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
            case PluginEventType.BeforeCutCopy:
                if (event.isCut) {
                    this.cacheListChains(ChangeSource.Cut);
                }
                break;

            case PluginEventType.BeforePaste:
                this.cacheListChains(ChangeSource.Paste);
                break;

            case PluginEventType.ContentChanged:
                if (this.chains?.length > 0 && this.expectedChangeSource == event.source) {
                    experimentCommitListChains(this.editor, this.chains);
                    this.chains = null;
                    this.expectedChangeSource = null;
                }
                break;
        }
    }

    private onDrop = () => {
        this.cacheListChains(ChangeSource.Drop);
    };

    private cacheListChains(source: ChangeSource) {
        this.chains = VListChain.createListChains(this.editor.getSelectedRegions());
        this.expectedChangeSource = source;
    }
}
