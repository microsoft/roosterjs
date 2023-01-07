import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, SelectionRangeTypes } from 'roosterjs-editor-types';
import {
    ContentModelDocument,
    contentModelToDom,
    domToContentModel,
    DomToModelOption,
    EditorContext,
    IExperimentalContentModelEditor,
    InsertPosition,
    ModelToDomOption,
} from 'roosterjs-content-model';
import {
    getComputedStyles,
    Position,
    restoreContentWithEntityPlaceholder,
} from 'roosterjs-editor-dom';

/**
 * !!! This is a temporary interface and will be removed in the future !!!
 *
 * Experimental editor to support Content Model
 */
export default class ExperimentalContentModelEditor extends Editor
    implements IExperimentalContentModelEditor {
    private getDarkColor: ((lightColor: string) => string) | undefined;
    private cachedInsertPosition: InsertPosition | null = null;

    /**
     * Creates an instance of ExperimentalContentModelEditor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(private contentDiv: HTMLDivElement, options?: EditorOptions) {
        super(contentDiv, options);
        this.getDarkColor = options?.getDarkColor;
    }

    /**
     * Create a EditorContext object used by ContentModel API
     */
    createEditorContext(): EditorContext {
        return {
            isDarkMode: this.isDarkMode(),
            zoomScale: this.getZoomScale(),
            isRightToLeft: getComputedStyles(this.contentDiv, 'direction')[0] == 'rtl',
            getDarkColor: this.getDarkColor,
        };
    }

    /**
     * Create Content Model from DOM tree in this editor
     * @param startNode Optional start node. If provided, Content Model will be created from this node (including itself),
     * otherwise it will create Content Model for the whole content in editor.
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(startNode?: HTMLElement, option?: DomToModelOption): ContentModelDocument {
        return domToContentModel(startNode || this.contentDiv, this.createEditorContext(), {
            includeRoot: !!startNode,
            selectionRange: this.getSelectionRangeEx(),
            alwaysNormalizeTable: true,
            ...(option || {}),
        });
    }

    /**
     * Set content with content model
     * @param model The content model to set
     * @param mergingCallback A callback to indicate how should the new content be integrated into existing content
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel(model: ContentModelDocument, option?: ModelToDomOption) {
        const [fragment, range, entityPairs] = contentModelToDom(
            this.getDocument(),
            model,
            this.createEditorContext(),
            option
        );
        const mergingCallback = option?.mergingCallback || restoreContentWithEntityPlaceholder;

        if (range?.type == SelectionRangeTypes.Normal) {
            // Need to get start and end from range position before merge because range can be changed during merging
            const start = Position.getStart(range.ranges[0]);
            const end = Position.getEnd(range.ranges[0]);

            mergingCallback(fragment, this.contentDiv, entityPairs);
            this.select(start, end);
        } else {
            mergingCallback(fragment, this.contentDiv, entityPairs);
            this.select(range);
        }
    }

    /**
     * Get a content model that can represent current content of editor.
     * @param option The options to customize the behavior of DOM to Content Model conversion
     */
    getCachedInsertPosition(): InsertPosition | null {
        return this.cachedInsertPosition;
    }

    /**
     * Set the given model as current pending content model
     */
    cacheInsertPosition(model: InsertPosition | null) {
        this.cachedInsertPosition = model;
    }
}
