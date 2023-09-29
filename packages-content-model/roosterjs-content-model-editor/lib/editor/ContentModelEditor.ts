import { createContentModelEditorCore } from './createContentModelEditorCore';
import { EditorBase } from 'roosterjs-editor-core';
import { ExperimentalFeatures } from 'roosterjs-editor-types';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import type {
    ContentModelEditorOptions,
    IContentModelEditor,
} from '../publicTypes/IContentModelEditor';
import type {
    ContentModelDocument,
    DOMSelection,
    DomToModelOption,
    ModelToDomOption,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

/**
 * Editor for Content Model.
 * (This class is still under development, and may still be changed in the future with some breaking changes)
 */
export default class ContentModelEditor
    extends EditorBase<ContentModelEditorCore, ContentModelEditorOptions>
    implements IContentModelEditor {
    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: ContentModelEditorOptions = {}) {
        super(contentDiv, options, createContentModelEditorCore);

        if (this.isFeatureEnabled(ExperimentalFeatures.ReusableContentModelV2)) {
            // Create an initial content model to cache
            // TODO: Once we have standalone editor and get rid of `ensureTypeInContainer` function, we can set init content
            // using content model and cache the model directly
            this.createContentModel();
        }
    }

    /**
     * Create Content Model from DOM tree in this editor
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(
        option?: DomToModelOption,
        selectionOverride?: DOMSelection
    ): ContentModelDocument {
        const core = this.getCore();

        return core.api.createContentModel(core, option, selectionOverride);
    }

    /**
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     * @param onNodeCreated An optional callback that will be called when a DOM node is created
     */
    setContentModel(
        model: ContentModelDocument,
        option?: ModelToDomOption,
        onNodeCreated?: OnNodeCreated
    ): DOMSelection | null {
        const core = this.getCore();

        return core.api.setContentModel(core, model, option, onNodeCreated);
    }

    /**
     * Get current DOM selection
     */
    getDOMSelection(): DOMSelection | null {
        const core = this.getCore();

        return core.api.getDOMSelection(core);
    }

    /**
     * Set DOMSelection into editor content.
     * This is the replacement of IEditor.select.
     * @param selection The selection to set
     */
    setDOMSelection(selection: DOMSelection) {
        const core = this.getCore();

        core.api.setDOMSelection(core, selection);
    }
}
