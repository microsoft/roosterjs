import {
    contentModelToDom,
    contentModelToText,
    createModelToDomContext,
    transformColor,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ExportContentMode,
    IEditor,
    ModelToDomOption,
    ModelToTextCallbacks,
} from 'roosterjs-content-model-types';

/**
 * Export HTML content. If there are entities, this will cause EntityOperation event with option = 'replaceTemporaryContent' to get a dehydrated entity
 * @param editor The editor to get content from
 * @param mode Specify HTML to get plain text result. This is the default option
 * @param options @optional Options for Model to DOM conversion
 */
export function exportContent(editor: IEditor, mode?: 'HTML', options?: ModelToDomOption): string;

/**
 * Export HTML content. If there are entities, this will cause EntityOperation event with option = 'replaceTemporaryContent' to get a dehydrated entity.
 * This is a fast version, it retrieve HTML content directly from editor without going through content model conversion.
 * @param editor The editor to get content from
 * @param mode Specify HTML to get plain text result. This is the default option
 */
export function exportContent(editor: IEditor, mode: 'HTMLFast'): string;

/**
 * Export plain text content
 * @param editor The editor to get content from
 * @param mode Specify PlainText to get plain text result
 * @param callbacks @optional Callbacks to customize conversion behavior
 */
export function exportContent(
    editor: IEditor,
    mode: 'PlainText',
    callbacks?: ModelToTextCallbacks
): string;

/**
 * Export plain text using editor's textContent property directly
 * @param editor The editor to get content from
 * @param mode Specify PlainTextFast to get plain text result using textContent property
 * @param options @optional Options for Model to DOM conversion
 */
export function exportContent(editor: IEditor, mode: 'PlainTextFast'): string;

export function exportContent(
    editor: IEditor,
    mode: ExportContentMode = 'HTML',
    optionsOrCallbacks?: ModelToDomOption | ModelToTextCallbacks
): string {
    let model: ContentModelDocument;

    switch (mode) {
        case 'PlainTextFast':
            return editor.getDOMHelper().getTextContent();
        case 'PlainText':
            model = editor.getContentModelCopy('clean');

            return contentModelToText(
                model,
                undefined /*separator*/,
                optionsOrCallbacks as ModelToTextCallbacks
            );

        case 'HTML':
            model = editor.getContentModelCopy('clean');

            const doc = editor.getDocument();
            const div = doc.createElement('div');

            contentModelToDom(
                doc,
                div,
                model,
                createModelToDomContext(
                    undefined /*editorContext*/,
                    optionsOrCallbacks as ModelToDomOption
                )
            );

            return getHTMLFromDOM(editor, div);
        case 'HTMLFast':
            const clonedRoot = editor.getDOMHelper().getClonedRoot();

            if (editor.isDarkMode()) {
                transformColor(
                    clonedRoot,
                    false /*includeSelf*/,
                    'darkToLight',
                    editor.getColorManager()
                );
            }

            return getHTMLFromDOM(editor, clonedRoot);
    }
}

function getHTMLFromDOM(editor: IEditor, root: HTMLElement): string {
    editor.triggerEvent('extractContentWithDom', { clonedRoot: root }, true /*broadcast*/);

    return root.innerHTML;
}
