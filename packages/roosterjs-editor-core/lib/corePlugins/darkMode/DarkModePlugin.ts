import createWrapper from '../utils/createWrapper';
import Editor from '../../editor/Editor';
import EditorOptions from '../../interfaces/EditorOptions';
import normalizeContentColor from './normalizeContentColor';
import PluginWithState from '../../interfaces/PluginWithState';
import { Browser } from 'roosterjs-editor-dom';
import { Wrapper } from 'roosterjs-editor-types';

/**
 * The state object for DarkModePlugin
 */
export interface DarkModePluginState {
    /**
     * Whether editor is in dark mode
     */
    isDarkMode: boolean;

    /**
     * External content transform function to help do color transform for existing content
     */
    onExternalContentTransform: (htmlIn: HTMLElement) => void;
}

/**
 * Copy plugin, hijacks copy events to normalize the content to the clipboard.
 */
export default class DarkModePlugin implements PluginWithState<DarkModePluginState> {
    private editor: Editor;
    private eventDisposer: () => void;
    private state: Wrapper<DarkModePluginState>;

    /**
     * Construct a new instance of DarkModePlugin
     * @param options The editor options
     */
    constructor(options: EditorOptions) {
        this.state = createWrapper({
            isDarkMode: options.inDarkMode,
            onExternalContentTransform: options.onExternalContentTransform,
        });
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Copy';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: Editor) {
        this.editor = editor;
        this.eventDisposer =
            !Browser.isIE &&
            editor.addDomEventHandler({
                copy: this.onExtract(false),
                cut: this.onExtract(true),
            });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        if (this.eventDisposer) {
            this.eventDisposer();
            this.eventDisposer = null;
        }
        this.editor = null;
    }

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    private onExtract = (isCut: boolean) => (event: Event) => {
        // if it's dark mode...
        if (this.editor && this.state.value.isDarkMode) {
            // get whatever the current selection range is
            const selectionRange = this.editor.getSelectionRange();
            if (selectionRange && !selectionRange.collapsed) {
                const clipboardEvent = event as ClipboardEvent;
                const copyFragment = this.editor.getSelectionRange().cloneContents();

                const containerDiv = this.editor.getDocument().createElement('div');

                // Leverage script execution policy on CEDs to try and prevent XSS
                containerDiv.contentEditable = 'true';
                containerDiv.appendChild(copyFragment);

                // revert just this selected range to light mode colors
                normalizeContentColor(containerDiv);

                // put it on the clipboard
                clipboardEvent.clipboardData.setData('text/html', containerDiv.innerHTML);
                clipboardEvent.clipboardData.setData('text/plain', containerDiv.innerText);

                // if it's cut, delete the contents
                if (isCut) {
                    this.editor.getSelectionRange().deleteContents();
                }

                event.preventDefault();
            }
        }
    };
}
