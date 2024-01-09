import { ChangeSource } from '../constants/ChangeSource';
import {
    createBr,
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    setColor,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelSegmentFormat,
    IStandaloneEditor,
    LifecyclePluginState,
    PluginEvent,
    PluginWithState,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

const ContentEditableAttributeName = 'contenteditable';
const DefaultTextColor = '#000000';
const DefaultBackColor = '#ffffff';

/**
 * Lifecycle plugin handles editor initialization and disposing
 */
class LifecyclePlugin implements PluginWithState<LifecyclePluginState> {
    private editor: IStandaloneEditor | null = null;
    private state: LifecyclePluginState;
    private initialModel: ContentModelDocument;
    private initializer: (() => void) | null = null;
    private disposer: (() => void) | null = null;
    private adjustColor: () => void;

    /**
     * Construct a new instance of LifecyclePlugin
     * @param options The editor options
     * @param contentDiv The editor content DIV
     */
    constructor(options: StandaloneEditorOptions, contentDiv: HTMLDivElement) {
        this.initialModel =
            options.initialModel ?? this.createInitModel(options.defaultSegmentFormat);

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
    initialize(editor: IStandaloneEditor) {
        this.editor = editor;

        this.editor.setContentModel(this.initialModel, { ignoreSelection: true });

        // Initial model is only used once. After that we can just clean it up to make sure we don't cache anything useless
        // including the cached DOM element inside the model.
        this.initialModel = createContentModelDocument();

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
            this.state.isDarkMode = event.source == ChangeSource.SwitchToDarkMode;
            this.adjustColor();
        }
    }

    private adjustContainerColor(contentDiv: HTMLElement) {
        if (this.editor) {
            const { isDarkMode } = this.state;
            const colorManager = this.editor.getColorManager();

            setColor(
                contentDiv,
                DefaultTextColor,
                false /*isBackground*/,
                isDarkMode,
                colorManager
            );
            setColor(contentDiv, DefaultBackColor, true /*isBackground*/, isDarkMode, colorManager);
        }
    }

    private createInitModel(format?: ContentModelSegmentFormat) {
        const model = createContentModelDocument(format);
        const paragraph = createParagraph(false /*isImplicit*/, undefined /*blockFormat*/, format);

        paragraph.segments.push(createSelectionMarker(format), createBr(format));
        model.blocks.push(paragraph);

        return model;
    }
}

/**
 * @internal
 * Create a new instance of LifecyclePlugin.
 * @param option The editor option
 * @param contentDiv The editor content DIV element
 */
export function createLifecyclePlugin(
    option: StandaloneEditorOptions,
    contentDiv: HTMLDivElement
): PluginWithState<LifecyclePluginState> {
    return new LifecyclePlugin(option, contentDiv);
}
