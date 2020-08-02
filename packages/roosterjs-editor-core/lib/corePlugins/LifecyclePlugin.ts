import CustomData from '../interfaces/CustomData';
import Editor from '../editor/Editor';
import PluginWithState from '../interfaces/PluginWithState';
import { Browser } from 'roosterjs-editor-dom';
import {
    DefaultFormat,
    DocumentCommand,
    NodePosition,
    PluginEventType,
    Wrapper,
    PluginEvent,
} from 'roosterjs-editor-types';

/**
 * The state object for LifecyclePlugin
 */
export interface LifecyclePluginState {
    /**
     * initial content of editor content div
     */
    initialContent: string;

    /**
     * Custom data of this editor
     */
    customData: Record<string, CustomData>;

    /**
     * Style object of editor content DIV
     */
    style: CSSStyleDeclaration;

    /**
     * Calcuated default format of content DIV
     */
    calculatedDefaultFormat: string[];

    /**
     * Start position of editor content DIV
     */
    startPosition: NodePosition;

    /**
     * Default format of this editor
     */
    defaultFormat: DefaultFormat;
}

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
export default class LifecyclePlugin implements PluginWithState<LifecyclePluginState> {
    private editor: Editor;
    private contenteditableChanged: boolean;

    constructor(public readonly state: Wrapper<LifecyclePluginState>) {}

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
    initialize(editor: Editor) {
        this.editor = editor;

        // Ensure initial content and its format
        this.editor.setContent(
            this.state.value.initialContent,
            false /*triggerContentChangedEvent*/
        );

        // Make the container editable and set its selection styles
        if (this.editor.getEditorDomAttribute(CONTENT_EDITABLE_ATTRIBUTE_NAME) === null) {
            this.editor.setEditorDomAttribute(CONTENT_EDITABLE_ATTRIBUTE_NAME, 'true');

            const style = this.state.value.style;
            style.userSelect = style.msUserSelect = style.webkitUserSelect = 'text';
            this.contenteditableChanged = true;
        }

        // Do proper change for browsers to disable some browser-specified behaviors.
        this.adjustBrowserBehavior();

        // Let other plugins know that we are ready
        this.editor.triggerPluginEvent(
            PluginEventType.EditorReady,
            {
                startPosition: this.editor.getFocusedPosition() || this.state.value.startPosition,
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

        if (this.contenteditableChanged) {
            const style = this.state.value.style;
            style.userSelect = style.msUserSelect = style.webkitUserSelect = '';
            this.editor.setEditorDomAttribute(CONTENT_EDITABLE_ATTRIBUTE_NAME, null);
        }

        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.DarkModeChanged) {
            this.updateDefaultFormat();
        }
    }

    private adjustBrowserBehavior() {
        Object.keys(COMMANDS).forEach(command => {
            // Catch any possible exception since this should not block the initialization of editor
            try {
                this.editor.getDocument().execCommand(command, false, COMMANDS[command]);
            } catch {}
        });
    }

    private updateDefaultFormat() {
        const isDarkMode = this.editor.isDarkMode();
        let baseFormat = this.state.value.defaultFormat;
        if (baseFormat && Object.keys(baseFormat).length === 0) {
            return;
        }

        if (isDarkMode && baseFormat) {
            if (!baseFormat.backgroundColors) {
                baseFormat.backgroundColors = DARK_MODE_DEFAULT_FORMAT.backgroundColors;
            }
            if (!baseFormat.textColors) {
                baseFormat.textColors = DARK_MODE_DEFAULT_FORMAT.textColors;
            }
        }

        baseFormat = baseFormat || <DefaultFormat>{};
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
        } = baseFormat;
        const originalStyle = this.state.value.calculatedDefaultFormat;
        this.state.value.defaultFormat = {
            fontFamily: fontFamily || originalStyle[0],
            fontSize: fontSize || originalStyle[1],
            get textColor() {
                return textColors
                    ? isDarkMode
                        ? textColors.darkModeColor
                        : textColors.lightModeColor
                    : textColor || originalStyle[2];
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
