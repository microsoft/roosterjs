import {
    contentModelToDom,
    contentModelToText,
    createModelToDomContext,
} from 'roosterjs-content-model-dom';
import type {
    ExportContentMode,
    IStandaloneEditor,
    ModelToDomOption,
} from 'roosterjs-content-model-types';

/**
 * Export string content of editor
 * @param editor The editor to get content from
 * @param mode Mode of content to export. It supports:
 * - HTML: Export HTML content. If there are entities, this will cause EntityOperation event with option = 'replaceTemporaryContent' to get a dehydrated entity
 * - PlainText: Export plain text content
 * - PlainTextFast: Export plain text using editor's textContent property directly
 * @param options @optional Options for Model to DOM conversion
 */
export function exportContent(
    editor: IStandaloneEditor,
    mode: ExportContentMode = 'HTML',
    options?: ModelToDomOption
): string {
    if (mode == 'PlainTextFast') {
        return editor.getDOMHelper().getTextContent();
    } else {
        const model = editor.getContentModelCopy('disconnected');

        if (mode == 'PlainText') {
            return contentModelToText(model);
        } else {
            const doc = editor.getDocument();
            const div = doc.createElement('div');

            contentModelToDom(
                doc,
                div,
                model,
                createModelToDomContext(undefined /*editorContext*/, options)
            );

            editor.triggerEvent('extractContentWithDom', { clonedRoot: div }, true /*broadcast*/);

            return div.innerHTML;
        }
    }
}
