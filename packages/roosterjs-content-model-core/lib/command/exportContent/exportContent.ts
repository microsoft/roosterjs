import {
    contentModelToDom,
    contentModelToText,
    createModelToDomContext,
    transformColor,
} from 'roosterjs-content-model-dom';
import type {
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

/**
 * Export plain text using editor's textContent property directly
 * @param editor The editor to get content from
 * @param mode Specify CleanHTML to get the innerHTML of the editor
 * @param options @optional Options for Model to DOM conversion
 */
export function exportContent(editor: IEditor, mode: 'CleanHTML'): string;

export function exportContent(
    editor: IEditor,
    mode: ExportContentMode = 'HTML',
    optionsOrCallbacks?: ModelToDomOption | ModelToTextCallbacks
): string {
    switch (mode) {
        case 'PlainTextFast':
            return editor.getDOMHelper().getTextContent();
        case 'PlainText':
            return contentModelToText(
                editor.getContentModelCopy('clean'),
                undefined /*separator*/,
                optionsOrCallbacks as ModelToTextCallbacks
            );
        case 'CleanHTML':
            const clonedRoot = editor.getDOMHelper().getClonedRoot();

            if (editor.isDarkMode()) {
                transformColor(
                    clonedRoot,
                    false /*includeSelf*/,
                    'darkToLight',
                    editor.getColorManager()
                );
            }

            editor.triggerEvent(
                'extractContentWithDom',
                {
                    clonedRoot,
                },
                true /*broadcast*/
            );

            return clonedRoot.innerHTML;
        default:
            const doc = editor.getDocument();
            const div = doc.createElement('div');
            contentModelToDom(
                doc,
                div,
                editor.getContentModelCopy('clean'),
                createModelToDomContext(
                    undefined /*editorContext*/,
                    optionsOrCallbacks as ModelToDomOption
                )
            );

            editor.triggerEvent('extractContentWithDom', { clonedRoot: div }, true /*broadcast*/);

            return div.innerHTML;
    }
}
