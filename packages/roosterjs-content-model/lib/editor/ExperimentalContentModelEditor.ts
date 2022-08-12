import contentModelToDom from '../publicApi/contentModelToDom';
import domToContentModel from '../publicApi/domToContentModel';
import { ContentModelContext } from '../publicTypes/ContentModelContext';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, SelectionRangeTypes } from 'roosterjs-editor-types';
import { getComputedStyles, Position } from 'roosterjs-editor-dom';
import { IExperimentalContentModelEditor } from '../publicTypes/IExperimentalContentModelEditor';

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
     * Create a ContentModelContext object used by ContentModel API
     */
    createContentModelContext(): ContentModelContext {
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
     */
    createContentModel(startNode?: HTMLElement): ContentModelDocument {
        return domToContentModel(
            startNode || this.contentDiv,
            this.createContentModelContext(),
            !!startNode,
            this.getSelectionRangeEx()
        );
    }

    /**
     * Set content with content model
     * @param model The content model to set
     * @param mergingCallback A callback to indicate how should the new content be integrated into existing content
     */
    setContentModel(
        model: ContentModelDocument,
        mergingCallback: (fragment: DocumentFragment) => void = this.defaultMergingCallback
    ) {
        const [fragment, range] = contentModelToDom(model, this.createContentModelContext());

        switch (range?.type) {
            case SelectionRangeTypes.Normal:
                const start = Position.getStart(range.ranges[0]);
                const end = Position.getEnd(range.ranges[0]);

                mergingCallback(fragment);
                this.select(start, end);
                break;

            case SelectionRangeTypes.TableSelection:
                mergingCallback(fragment);
                this.select(range.table, range.coordinates);
                break;

            case undefined:
                mergingCallback(fragment);
                break;
        }
    }

    private defaultMergingCallback = (fragment: DocumentFragment) => {
        this.setContent('');
        this.insertNode(fragment);
    };
}
