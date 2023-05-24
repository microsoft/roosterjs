import { ContentModelDocument } from '../publicTypes/group/ContentModelDocument';
import { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import { ContentModelSegmentFormat } from '../publicTypes/format/ContentModelSegmentFormat';
import { createContentModelEditorCore } from './createContentModelEditorCore';
import { EditorBase } from 'roosterjs-editor-core';
import { formatWithContentModel } from '../publicApi/utils/formatWithContentModel';
import { getOnDeleteEntityCallback } from './utils/handleKeyboardEventCommon';
import { mergeModel } from '../modelApi/common/mergeModel';
import { Position } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ClipboardData,
    ExperimentalFeatures,
    GetContentMode,
} from 'roosterjs-editor-types';
import {
    ContentModelEditorOptions,
    DomToModelOption,
    IContentModelEditor,
    ModelToDomOption,
} from '../publicTypes/IContentModelEditor';

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
    }

    /**
     * Create Content Model from DOM tree in this editor
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(option?: DomToModelOption): ContentModelDocument {
        const core = this.getCore();

        return core.api.createContentModel(core, option);
    }

    /**
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel(model: ContentModelDocument, option?: ModelToDomOption) {
        const core = this.getCore();

        core.api.setContentModel(core, model, option);
    }

    /**
     * Cache a content model object. Next time when format with content model, we can reuse it.
     * @param model
     */
    cacheContentModel(model: ContentModelDocument | null) {
        const core = this.getCore();

        if (core.reuseModel && !core.lifecycle.shadowEditFragment) {
            core.cachedModel = model || undefined;
        }
    }

    /**
     * Get default format as ContentModelSegmentFormat.
     * This is a replacement of IEditor.getDefaultFormat for Content Model.
     * @returns The default format
     */
    getContentModelDefaultFormat(): ContentModelSegmentFormat {
        const core = this.getCore();

        return core.defaultFormat;
    }

    /**
     * Paste into editor using a clipboardData object
     * @param clipboardData Clipboard data retrieved from clipboard
     * @param pasteAsText Force pasting as plain text. Default value is false
     * @param applyCurrentStyle True if apply format of current selection to the pasted content,
     * false to keep original format.  Default value is false. When pasteAsText is true, this parameter is ignored
     */
    public paste(
        clipboardData: ClipboardData,
        pasteAsText: boolean = false,
        applyCurrentFormat: boolean = false,
        pasteAsImage: boolean = false
    ) {
        if (!this.isFeatureEnabled(ExperimentalFeatures.ContentModelPaste)) {
            super.paste(clipboardData, pasteAsText, applyCurrentFormat, pasteAsImage);
            return;
        }

        const core = this.getCore();
        if (!clipboardData) {
            return;
        }

        if (clipboardData.snapshotBeforePaste) {
            // Restore original content before paste a new one
            this.setContent(clipboardData.snapshotBeforePaste);
        } else {
            clipboardData.snapshotBeforePaste = this.getContent(
                GetContentMode.RawHTMLWithSelection
            );
        }

        const range = this.getSelectionRange();
        const pos = range && Position.getStart(range);
        const pasteModel = core.api.createPasteModel(
            core,
            clipboardData,
            pos,
            pasteAsText,
            applyCurrentFormat,
            pasteAsImage
        );

        if (pasteModel) {
            formatWithContentModel(
                this,
                'Paste',
                model => {
                    mergeModel(model, pasteModel, getOnDeleteEntityCallback(this));
                    return true;
                },
                {
                    changeSource: ChangeSource.Paste,
                }
            );
        }
    }
}
