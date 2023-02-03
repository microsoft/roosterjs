import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, SelectionRangeTypes } from 'roosterjs-editor-types';
import { Position, restoreContentWithEntityPlaceholder } from 'roosterjs-editor-dom';
import {
    ContentModelDocument,
    contentModelToDom,
    domToContentModel,
    DomToModelOption,
    EditorContext,
    IContentModelEditor,
    ModelToDomOption,
} from 'roosterjs-content-model';

/**
 * !!! This is a temporary interface and will be removed in the future !!!
 *
 * Experimental editor to support Content Model
 */
export default class ExperimentalContentModelEditor extends Editor implements IContentModelEditor {
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
    private createEditorContext(): EditorContext {
        return {
            isDarkMode: this.isDarkMode(),
            getDarkColor: this.getDarkColor,
            darkColorHandler: this.getDarkColorHandler(),
        };
    }

    /**
     * Create Content Model from DOM tree in this editor
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(option?: DomToModelOption): ContentModelDocument {
        return domToContentModel(this.contentDiv, this.createEditorContext(), {
            selectionRange: this.getSelectionRangeEx(),
            alwaysNormalizeTable: true,
            ...(option || {}),
        });
    }

    /**
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel(model: ContentModelDocument, option?: ModelToDomOption) {
        const [fragment, range, entityPairs] = contentModelToDom(
            this.getDocument(),
            model,
            this.createEditorContext(),
            option
        );

        if (range?.type == SelectionRangeTypes.Normal) {
            // Need to get start and end from range position before merge because range can be changed during merging
            const start = Position.getStart(range.ranges[0]);
            const end = Position.getEnd(range.ranges[0]);

            restoreContentWithEntityPlaceholder(fragment, this.contentDiv, entityPairs);
            this.select(start, end);
        } else {
            restoreContentWithEntityPlaceholder(fragment, this.contentDiv, entityPairs);
            this.select(range);
        }
    }
}
