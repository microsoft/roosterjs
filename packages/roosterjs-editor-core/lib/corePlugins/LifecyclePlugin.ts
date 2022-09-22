import { Browser, getComputedStyles, getObjectKeys, setColor } from 'roosterjs-editor-dom';
import {
    DefaultFormat,
    DocumentCommand,
    EditorOptions,
    IEditor,
    LifecyclePluginState,
    PluginEventType,
    PluginWithState,
    PluginEvent,
    ChangeSource,
} from 'roosterjs-editor-types';

const CONTENT_EDITABLE_ATTRIBUTE_NAME = 'contenteditable';
const COMMANDS: Record<string, string> = Browser.isFirefox
    ? {
          /**
           * Disable these object resizing for firefox since other browsers don't have these behaviors
           */
          [DocumentCommand.EnableObjectResizing]: (false as any) as string,
          [DocumentCommand.EnableInlineTableEditing]: (false as any) as string,
      }
    : Browser.isIE
    ? {
          /**
           * Change the default paragraph separator to DIV. This is mainly for IE since its default setting is P
           */
          [DocumentCommand.DefaultParagraphSeparator]: 'div',

          /**
           * Disable auto link feature in IE since we have our own implementation
           */
          [DocumentCommand.AutoUrlDetect]: (false as any) as string,
      }
    : {};

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
 * @internal
 * Lifecycle plugin handles editor initialization and disposing
 */
export default class LifecyclePlugin implements PluginWithState<LifecyclePluginState> {
    private editor: IEditor | null = null;
    private state: LifecyclePluginState;
    private initialContent: string;
    private contentDivFormat: string[];
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
        this.contentDivFormat = getComputedStyles(contentDiv);

        // Make the container editable and set its selection styles
        if (contentDiv.getAttribute(CONTENT_EDITABLE_ATTRIBUTE_NAME) === null) {
            this.initializer = () => {
                contentDiv.contentEditable = 'true';
                contentDiv.style.userSelect = 'text';
                contentDiv.style.webkitUserSelect = 'text';
            };
            this.disposer = () => {
                contentDiv.style.userSelect = '';
                contentDiv.style.webkitUserSelect = '';
                contentDiv.removeAttribute(CONTENT_EDITABLE_ATTRIBUTE_NAME);
            };
        }
        this.adjustColor = options.doNotAdjustEditorColor
            ? () => {}
            : () => {
                  const { textColors, backgroundColors } = DARK_MODE_DEFAULT_FORMAT;
                  const { isDarkMode } = this.state;
                  setColor(contentDiv, textColors, false /*isBackground*/, isDarkMode);
                  setColor(contentDiv, backgroundColors, true /*isBackground*/, isDarkMode);
              };

        this.state = {
            customData: {},
            defaultFormat: options.defaultFormat ?? {},
            isDarkMode: !!options.inDarkMode,
            getDarkColor: options.getDarkColor ?? ((color: string | null) => color ?? '#fff'),
            onExternalContentTransform: options.onExternalContentTransform ?? null,
            experimentalFeatures: options.experimentalFeatures || [],
            shadowEditFragment: null,
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

        // Calculate default format
        this.recalculateDefaultFormat();

        // Ensure initial content and its format
        this.editor.setContent(this.initialContent, false /*triggerContentChangedEvent*/);

        // Set content DIV to be editable
        this.initializer?.();

        // Set editor background color for dark mode
        this.adjustColor();

        // Do proper change for browsers to disable some browser-specified behaviors.
        this.adjustBrowserBehavior();

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
            this.recalculateDefaultFormat();
            this.adjustColor();
        }
    }

    private adjustBrowserBehavior() {
        getObjectKeys(COMMANDS).forEach(command => {
            // Catch any possible exception since this should not block the initialization of editor
            try {
                this.editor?.getDocument().execCommand(command, false, COMMANDS[command]);
            } catch {}
        });
    }

    private recalculateDefaultFormat() {
        const { defaultFormat: baseFormat, isDarkMode } = this.state;

        if (isDarkMode && baseFormat) {
            if (!baseFormat.backgroundColors) {
                baseFormat.backgroundColors = DARK_MODE_DEFAULT_FORMAT.backgroundColors;
            }
            if (!baseFormat.textColors) {
                baseFormat.textColors = DARK_MODE_DEFAULT_FORMAT.textColors;
            }
        }

        if (baseFormat && getObjectKeys(baseFormat).length === 0) {
            return;
        }

        const {
            fontFamily,
            fontSize,
            textColor,
            textColors,
            backgroundColor,
            backgroundColors,
            bold,
            italic,
            underline,
        } = baseFormat || <DefaultFormat>{};
        const defaultFormat = this.contentDivFormat;

        this.state.defaultFormat = {
            fontFamily: fontFamily || defaultFormat[0],
            fontSize: fontSize || defaultFormat[1],
            get textColor() {
                return textColors
                    ? isDarkMode
                        ? textColors.darkModeColor
                        : textColors.lightModeColor
                    : textColor || defaultFormat[2];
            },
            textColors: textColors,
            get backgroundColor() {
                return backgroundColors
                    ? isDarkMode
                        ? backgroundColors.darkModeColor
                        : backgroundColors.lightModeColor
                    : backgroundColor || '';
            },
            backgroundColors: backgroundColors,
            bold: bold,
            italic: italic,
            underline: underline,
        };
    }
}
