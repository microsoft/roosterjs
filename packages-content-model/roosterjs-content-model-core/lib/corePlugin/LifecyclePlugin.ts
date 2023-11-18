import { ChangeSource } from '../constants/ChangeSource';
import { ColorTransformDirection, PluginEventType } from 'roosterjs-editor-types';
import {
    createBr,
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    setColor,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelDecorator,
    ContentModelDocument,
    ContentModelEntity,
    ContentModelSegment,
    ContentModelSegmentFormat,
    ContentModelTableRow,
    IStandaloneEditor,
    LifecyclePluginState,
    OnNodeCreated,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';
import type { IEditor, PluginWithState, PluginEvent } from 'roosterjs-editor-types';

const ContentEditableAttributeName = 'contenteditable';
const DefaultTextColor = '#000000';
const DefaultBackColor = '#ffffff';

/**
 * Lifecycle plugin handles editor initialization and disposing
 */
class LifecyclePlugin implements PluginWithState<LifecyclePluginState> {
    private editor: (IStandaloneEditor & IEditor) | null = null;
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
            onExternalContentTransform: null,
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
    initialize(editor: IEditor) {
        this.editor = editor as IEditor & IStandaloneEditor;

        this.editor.setContentModel(
            this.initialModel,
            { ignoreSelection: true },
            this.editor.isDarkMode() ? this.onInitialNodeCreated : undefined
        );

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

    private adjustContainerColor(contentDiv: HTMLElement) {
        if (this.editor) {
            const { isDarkMode } = this.state;
            const darkColorHandler = this.editor.getDarkColorHandler();

            setColor(
                contentDiv,
                DefaultTextColor,
                false /*isBackground*/,
                darkColorHandler,
                isDarkMode
            );
            setColor(
                contentDiv,
                DefaultBackColor,
                true /*isBackground*/,
                darkColorHandler,
                isDarkMode
            );
        }
    }

    private createInitModel(format?: ContentModelSegmentFormat) {
        const model = createContentModelDocument(format);
        const paragraph = createParagraph(false /*isImplicit*/, undefined /*blockFormat*/, format);

        paragraph.segments.push(createSelectionMarker(format), createBr(format));
        model.blocks.push(paragraph);

        return model;
    }

    private onInitialNodeCreated: OnNodeCreated = (model, node) => {
        if (isEntity(model) && this.editor) {
            this.editor.transformToDarkColor(node, ColorTransformDirection.LightToDark);
        }
    };
}

function isEntity(
    modelElement:
        | ContentModelBlock
        | ContentModelBlockGroup
        | ContentModelSegment
        | ContentModelDecorator
        | ContentModelTableRow
): modelElement is ContentModelEntity {
    return (
        (modelElement as ContentModelSegment).segmentType == 'Entity' ||
        (modelElement as ContentModelBlock).blockType == 'Entity'
    );
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
