import createWrapper from '../utils/createWrapper';
import CustomData from '../../interfaces/CustomData';
import Editor from '../../editor/Editor';
import EditorOptions from '../../interfaces/EditorOptions';
import PluginWithState from '../../interfaces/PluginWithState';
import { Browser, getComputedStyles, Position } from 'roosterjs-editor-dom';
import {
    DefaultFormat,
    DocumentCommand,
    NodePosition,
    PluginEventType,
    PositionType,
    Wrapper,
    PluginEvent,
} from 'roosterjs-editor-types';

/**
 * The state object for LifecyclePlugin
 */
export interface LifecyclePluginState {
    /**
     * Custom data of this editor
     */
    customData: Record<string, CustomData>;

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
    private state: Wrapper<LifecyclePluginState>;
    private style: CSSStyleDeclaration;
    private initialContent: string;
    private calculatedDefaultFormat: string[];
    private startPosition: NodePosition;

    /**
     * Construct a new instance of LifecyclePlugin
     * @param options The editor options
     * @param contentDiv The editor content DIV
     */
    constructor(options: EditorOptions, contentDiv: HTMLDivElement) {
        this.style = contentDiv.style;
        this.initialContent = options.initialContent || contentDiv.innerHTML || '';
        this.calculatedDefaultFormat = getComputedStyles(contentDiv);
        this.startPosition = new Position(contentDiv, PositionType.Begin);
        this.state = createWrapper({
            customData: {},
            defaultFormat: options.defaultFormat,
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
    initialize(editor: Editor) {
        this.editor = editor;

        this.updateDefaultFormat();

        // Ensure initial content and its format
        this.editor.setContent(this.initialContent, false /*triggerContentChangedEvent*/);

        // Make the container editable and set its selection styles
        if (this.editor.getEditorDomAttribute(CONTENT_EDITABLE_ATTRIBUTE_NAME) === null) {
            this.editor.setEditorDomAttribute(CONTENT_EDITABLE_ATTRIBUTE_NAME, 'true');
            this.style.userSelect = (<any>this.style).msUserSelect = this.style.webkitUserSelect =
                'text';
            this.contenteditableChanged = true;
        }

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

        if (this.contenteditableChanged) {
            this.style.userSelect = (<any>this.style).msUserSelect = this.style.webkitUserSelect =
                '';
            this.editor.setEditorDomAttribute(CONTENT_EDITABLE_ATTRIBUTE_NAME, null);
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
        const originalStyle = this.calculatedDefaultFormat;
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
