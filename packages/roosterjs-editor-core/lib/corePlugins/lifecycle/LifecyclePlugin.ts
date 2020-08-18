import createWrapper from '../utils/createWrapper';
import { Browser, Position } from 'roosterjs-editor-dom';
import {
    DocumentCommand,
    EditorOptions,
    IEditor,
    LifecyclePluginState,
    NodePosition,
    PluginEventType,
    PluginWithState,
    PositionType,
    Wrapper,
} from 'roosterjs-editor-types';

const CONTENT_EDITABLE_ATTRIBUTE_NAME = 'contenteditable';
const COMMANDS: {
    [command: string]: any;
} = Browser.isFirefox
    ? {
          /**
           * Disable these object resizing for firefox since other browsers don't have these behaviors
           */
          [DocumentCommand.EnableObjectResizing]: false,
          [DocumentCommand.EnableInlineTableEditing]: false,
      }
    : Browser.isIE
    ? {
          /**
           * Change the default paragraph separater to DIV. This is mainly for IE since its default setting is P
           */
          [DocumentCommand.DefaultParagraphSeparator]: 'div',

          /**
           * Disable auto link feature in IE since we have our own implementation
           */
          [DocumentCommand.AutoUrlDetect]: false,
      }
    : {};

/**
 * Lifecycle plugin handles editor initialization and disposing
 */
export default class LifecyclePlugin implements PluginWithState<LifecyclePluginState> {
    private editor: IEditor;
    private state: Wrapper<LifecyclePluginState>;
    private initialContent: string;
    private startPosition: NodePosition;
    private initializer: () => void;
    private disposer: () => void;

    /**
     * Construct a new instance of LifecyclePlugin
     * @param options The editor options
     * @param contentDiv The editor content DIV
     */
    constructor(options: EditorOptions, contentDiv: HTMLDivElement) {
        this.initialContent = options.initialContent || contentDiv.innerHTML || '';
        this.startPosition = new Position(contentDiv, PositionType.Begin);

        // Make the container editable and set its selection styles
        if (contentDiv.getAttribute(CONTENT_EDITABLE_ATTRIBUTE_NAME) === null) {
            this.initializer = () => {
                contentDiv.contentEditable = 'true';
                this.setSelectStyle(contentDiv, 'text');
            };
            this.disposer = () => {
                this.setSelectStyle(contentDiv, '');
                contentDiv.removeAttribute(CONTENT_EDITABLE_ATTRIBUTE_NAME);
            };
        }

        this.state = createWrapper({
            customData: {},
            defaultFormat: options.defaultFormat || null,
        });
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Lifecycle';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;

        // Calculate default format
        this.editor.calcDefaultFormat();

        // Ensure initial content and its format
        this.editor.setContent(this.initialContent, false /*triggerContentChangedEvent*/);

        // Set content DIV to be editable
        this.initializer?.();

        // Do proper change for browsers to disable some browser-specified behaviors.
        this.adjustBrowserBehavior();

        // Let other plugins know that we are ready
        this.editor.triggerPluginEvent(
            PluginEventType.EditorReady,
            {
                startPosition: this.editor.getFocusedPosition() || this.startPosition,
            },
            true /*broadcast*/
        );
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor.triggerPluginEvent(PluginEventType.BeforeDispose, {}, true /*broadcast*/);

        Object.keys(this.state.value.customData).forEach(key => {
            const data = this.state.value.customData[key];

            if (data && data.disposer) {
                data.disposer(data.value);
            }

            delete this.state.value.customData[key];
        });

        if (this.disposer) {
            this.disposer();
            this.disposer = null;
            this.initializer = null;
        }

        this.editor = null;
    }

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    private adjustBrowserBehavior() {
        Object.keys(COMMANDS).forEach(command => {
            // Catch any possible exception since this should not block the initialization of editor
            try {
                this.editor.getDocument().execCommand(command, false, COMMANDS[command]);
            } catch {}
        });
    }

    private setSelectStyle(node: HTMLElement, value: string) {
        node.style.userSelect = value;
        node.style.msUserSelect = value;
        node.style.webkitUserSelect = value;
    }
}
