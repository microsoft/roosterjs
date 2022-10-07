import { ContentPosition, EditorOptions, SelectionRangeTypes } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { getComputedStyles, Position } from 'roosterjs-editor-dom';
import {
    EditorContext,
    ContentModelDocument,
    contentModelToDom,
    domToContentModel,
    DomToModelOption,
    IExperimentalContentModelEditor,
    ModelToDomOption,
} from 'roosterjs-content-model';

/**
 * !!! This is a temporary interface and will be removed in the future !!!
 *
 * Experimental editor to support Content Model
 */
export default class ExperimentalContentModelEditor extends Editor
    implements IExperimentalContentModelEditor {
    private getDarkColor: ((lightColor: string) => string) | undefined;

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
            model,
            this.createEditorContext(),
            option
        );
        const mergingCallback = option?.mergingCallback || this.defaultMergingCallback;

        switch (range?.type) {
            case SelectionRangeTypes.Normal:
                const start = Position.getStart(range.ranges[0]);
                const end = Position.getEnd(range.ranges[0]);

                mergingCallback(fragment, this.contentDiv, entityPairs);
                this.select(start, end);
                break;

            case SelectionRangeTypes.TableSelection:
                mergingCallback(fragment, this.contentDiv, entityPairs);
                this.select(range.table, range.coordinates);
                break;

            case undefined:
                mergingCallback(fragment, this.contentDiv, entityPairs);
                break;
        }
    }

    private defaultMergingCallback = (fragment: DocumentFragment) => {
        while (this.contentDiv.firstChild) {
            this.contentDiv.removeChild(this.contentDiv.firstChild);
        }

        this.insertNode(fragment, { position: ContentPosition.Begin });
    };
}
