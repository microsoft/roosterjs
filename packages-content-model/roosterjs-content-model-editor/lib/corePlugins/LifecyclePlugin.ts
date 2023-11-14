import { ChangeSource, PluginEventType } from 'roosterjs-editor-types';
import { getObjectKeys, setColor } from 'roosterjs-editor-dom';
import type {
    EditorOptions,
    IEditor,
    LifecyclePluginState,
    PluginWithState,
    PluginEvent,
} from 'roosterjs-editor-types';

const CONTENT_EDITABLE_ATTRIBUTE_NAME = 'contenteditable';

const DARK_MODE_DEFAULT_FORMAT = {
    backgroundColors: {
        darkModeColor: 'rgb(51,51,51)',
        lightModeColor: 'rgb(255,255,255)',
    },
    textColors: {
        darkModeColor: 'rgb(255,255,255)',
        lightModeColor: 'rgb(0,0,0)',
    },
};

/**
 * Lifecycle plugin handles editor initialization and disposing
 */
class LifecyclePlugin implements PluginWithState<LifecyclePluginState> {
    private editor: IEditor | null = null;
    private state: LifecyclePluginState;
    private initialContent: string;
    private initializer: (() => void) | null = null;
    private disposer: (() => void) | null = null;
    private adjustColor: () => void;

    /**
     * Construct a new instance of LifecyclePlugin
     * @param options The editor options
     * @param contentDiv The editor content DIV
     */
    constructor(options: EditorOptions, contentDiv: HTMLDivElement) {
        this.initialContent = options.initialContent || contentDiv.innerHTML || '';

        // Make the container editable and set its selection styles
        if (contentDiv.getAttribute(CONTENT_EDITABLE_ATTRIBUTE_NAME) === null) {
            this.initializer = () => {
                contentDiv.contentEditable = 'true';
                contentDiv.style.userSelect = 'text';
            };
            this.disposer = () => {
                contentDiv.style.userSelect = '';
                contentDiv.removeAttribute(CONTENT_EDITABLE_ATTRIBUTE_NAME);
            };
        }
        this.adjustColor = options.doNotAdjustEditorColor
            ? () => {}
            : () => {
                  const { textColors, backgroundColors } = DARK_MODE_DEFAULT_FORMAT;
                  const { isDarkMode } = this.state;
                  const darkColorHandler = this.editor?.getDarkColorHandler();
                  setColor(
                      contentDiv,
                      textColors,
                      false /*isBackground*/,
                      isDarkMode,
                      false /*shouldAdaptFontColor*/,
                      darkColorHandler
                  );
                  setColor(
                      contentDiv,
                      backgroundColors,
                      true /*isBackground*/,
                      isDarkMode,
                      false /*shouldAdaptFontColor*/,
                      darkColorHandler
                  );
              };

        const getDarkColor = options.getDarkColor ?? ((color: string) => color);
        const defaultFormat = options.defaultFormat ? { ...options.defaultFormat } : null;

        if (defaultFormat) {
            if (defaultFormat.textColor && !defaultFormat.textColors) {
                defaultFormat.textColors = {
                    lightModeColor: defaultFormat.textColor,
                    darkModeColor: getDarkColor(defaultFormat.textColor),
                };
                delete defaultFormat.textColor;
            }

            if (defaultFormat.backgroundColor && !defaultFormat.backgroundColors) {
                defaultFormat.backgroundColors = {
                    lightModeColor: defaultFormat.backgroundColor,
                    darkModeColor: getDarkColor(defaultFormat.backgroundColor),
                };
                delete defaultFormat.backgroundColor;
            }
        }

        this.state = {
            customData: {},
            defaultFormat,
            isDarkMode: !!options.inDarkMode,
            getDarkColor,
            onExternalContentTransform: options.onExternalContentTransform ?? null,
            experimentalFeatures: options.experimentalFeatures || [],
            shadowEditFragment: null,
            shadowEditEntities: null,
            shadowEditSelectionPath: null,
            shadowEditTableSelectionPath: null,
            shadowEditImageSelectionPath: null,
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

        // Ensure initial content and its format
        this.editor.setContent(this.initialContent, false /*triggerContentChangedEvent*/);

        // Set content DIV to be editable
        this.initializer?.();

        // Set editor background color for dark mode
        this.adjustColor();

        // Let other plugins know that we are ready
        this.editor.triggerPluginEvent(PluginEventType.EditorReady, {}, true /*broadcast*/);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor?.triggerPluginEvent(PluginEventType.BeforeDispose, {}, true /*broadcast*/);

        getObjectKeys(this.state.customData).forEach(key => {
            const data = this.state.customData[key];

            if (data && data.disposer) {
                data.disposer(data.value);
            }

            delete this.state.customData[key];
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

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            event.eventType == PluginEventType.ContentChanged &&
            (event.source == ChangeSource.SwitchToDarkMode ||
                event.source == ChangeSource.SwitchToLightMode)
        ) {
            this.state.isDarkMode = event.source == ChangeSource.SwitchToDarkMode;
            this.adjustColor();
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
