import { ChangeSource, getObjectKeys, setColor } from 'roosterjs-content-model-dom';
import type {
    IEditor,
    LifecyclePluginState,
    PluginEvent,
    PluginWithState,
    EditorOptions,
} from 'roosterjs-content-model-types';

const ContentEditableAttributeName = 'contenteditable';
const DefaultTextColor = '#000000';
const DefaultBackColor = '#ffffff';

/**
 * Lifecycle plugin handles editor initialization and disposing
 */
class LifecyclePlugin implements PluginWithState<LifecyclePluginState> {
    private editor: IEditor | null = null;
    private state: LifecyclePluginState;
    private initializer: (() => void) | null = null;
    private disposer: (() => void) | null = null;
    private adjustColor: () => void;

    /**
     * Construct a new instance of LifecyclePlugin
     * @param options The editor options
     * @param contentDiv The editor content DIV
     */
    constructor(options: EditorOptions, contentDiv: HTMLDivElement) {
        // Make the container editable and set its selection styles
        if (contentDiv.getAttribute(ContentEditableAttributeName) === null) {
            this.initializer = () => {
                contentDiv.contentEditable = 'true';
                contentDiv.style.userSelect = 'text';
            };
            this.disposer = () => {
                contentDiv.style.userSelect = '';
                contentDiv.removeAttribute(ContentEditableAttributeName);
            };
        }
        this.adjustColor = options.doNotAdjustEditorColor
            ? () => {}
            : () => {
                  this.adjustContainerColor(contentDiv);
              };

        this.state = {
            isDarkMode: !!options.inDarkMode,
            shadowEditFragment: null,
            styleElements: {},
            announcerStringGetter: options.announcerStringGetter,
        };
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

        // Set content DIV to be editable
        this.initializer?.();

        // Set editor background color for dark mode
        this.adjustColor();

        // Let other plugins know that we are ready
        this.editor.triggerEvent('editorReady', {}, true /*broadcast*/);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor?.triggerEvent('beforeDispose', {}, true /*broadcast*/);

        getObjectKeys(this.state.styleElements).forEach(key => {
            const element = this.state.styleElements[key];

            element.parentElement?.removeChild(element);
            delete this.state.styleElements[key];
        });

        const announceContainer = this.state.announceContainer;

        if (announceContainer) {
            announceContainer.parentNode?.removeChild(announceContainer);
            delete this.state.announceContainer;
        }

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

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            event.eventType == 'contentChanged' &&
            (event.source == ChangeSource.SwitchToDarkMode ||
                event.source == ChangeSource.SwitchToLightMode)
        ) {
            this.adjustColor();
        }
    }

    private adjustContainerColor(contentDiv: HTMLElement) {
        if (this.editor) {
            const { isDarkMode } = this.state;
            const darkColorHandler = this.editor.getColorManager();

            setColor(
                contentDiv,
                DefaultTextColor,
                false /*isBackground*/,
                isDarkMode,
                darkColorHandler
            );
            setColor(
                contentDiv,
                DefaultBackColor,
                true /*isBackground*/,
                isDarkMode,
                darkColorHandler
            );
        }
    }
}

/**
 * @internal
 * Create a new instance of LifecyclePlugin.
 * @param option The editor option
 * @param contentDiv The editor content DIV element
 */
export function createLifecyclePlugin(
    option: EditorOptions,
    contentDiv: HTMLDivElement
): PluginWithState<LifecyclePluginState> {
    return new LifecyclePlugin(option, contentDiv);
}
