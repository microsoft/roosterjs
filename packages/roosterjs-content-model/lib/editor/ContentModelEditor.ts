import contentModelToDom from '../modelToDom/contentModelToDom';
import domToContentModel from '../domToModel/domToContentModel';
import { ContentModelDocument } from '../publicTypes/group/ContentModelDocument';
import { ContentModelSegmentFormat } from '../publicTypes/format/ContentModelSegmentFormat';
import { Editor } from 'roosterjs-editor-core';
import { EditorContext } from '../publicTypes/context/EditorContext';
import { EditorOptions, ExperimentalFeatures } from 'roosterjs-editor-types';
import {
    DomToModelOption,
    IContentModelEditor,
    ModelToDomOption,
} from '../publicTypes/IContentModelEditor';

/**
 * Editor for Content Model.
 * (This class is still under development, and may still be changed in the future with some breaking changes)
 */
export default class ContentModelEditor extends Editor implements IContentModelEditor {
    private cachedModel: ContentModelDocument | null;
    private reuseModel: boolean = false;
    private defaultFormat: ContentModelSegmentFormat = {};

    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: EditorOptions = {}) {
        super(contentDiv, options);
        this.cachedModel = null;
        this.reuseModel = this.isFeatureEnabled(ExperimentalFeatures.ReusableContentModel);

        this.createDefaultFormat();
    }

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    dispose() {
        this.cachedModel = null;
        super.dispose();
    }

    /**
     * Create Content Model from DOM tree in this editor
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(option?: DomToModelOption): ContentModelDocument {
        const core = this.getCore();
        const cachedModel = this.reuseModel ? this.cachedModel : null;

        return (
            cachedModel ||
            domToContentModel(core.contentDiv, this.createEditorContext(), {
                selectionRange: this.getSelectionRangeEx(),
                alwaysNormalizeTable: true,
                ...(option || {}),
            })
        );
    }

    /**
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel(model: ContentModelDocument, option?: ModelToDomOption) {
        const range = contentModelToDom(
            this.getDocument(),
            this.getCore().contentDiv,
            model,
            this.createEditorContext(),
            option
        );

        this.select(range);
    }

    /**
     * Cache a content model object. Next time when format with content model, we can reuse it.
     * @param model
     */
    cacheContentModel(model: ContentModelDocument | null) {
        if (this.reuseModel) {
            this.cachedModel = model;
        }
    }

    /**
     * Create a EditorContext object used by ContentModel API
     */
    private createEditorContext(): EditorContext {
        const core = this.getCore();

        return {
            isDarkMode: this.isDarkMode(),
            defaultFormat: this.defaultFormat,
            getDarkColor: core.lifecycle.getDarkColor,
            darkColorHandler: this.getDarkColorHandler(),
            addDelimiterForEntity: this.isFeatureEnabled(
                ExperimentalFeatures.InlineEntityReadOnlyDelimiters
            ),
        };
    }

    private createDefaultFormat() {
        const format = this.getDefaultFormat();

        if (format.bold) {
            this.defaultFormat.fontWeight = 'bold';
        }

        if (format.italic) {
            this.defaultFormat.italic = true;
        }

        if (format.underline) {
            this.defaultFormat.underline = true;
        }

        if (format.fontFamily) {
            this.defaultFormat.fontFamily = format.fontFamily;
        }

        if (format.fontSize) {
            this.defaultFormat.fontSize = format.fontSize;
        }

        if (format.textColors) {
            this.defaultFormat.textColor = format.textColors.lightModeColor;
        } else if (format.textColor) {
            this.defaultFormat.textColor = format.textColor;
        }

        if (format.backgroundColors) {
            this.defaultFormat.backgroundColor = format.backgroundColors.lightModeColor;
        } else if (format.backgroundColor) {
            this.defaultFormat.backgroundColor = format.backgroundColor;
        }
    }
}
