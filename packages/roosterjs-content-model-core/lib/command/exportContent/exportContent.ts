import { createClonedRoot } from './createClonedRoot';
import {
    contentModelToDom,
    contentModelToText,
    createModelToDomContext,
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

export function exportContent(
    editor: IEditor,
    mode: ExportContentMode = 'HTML',
    optionsOrCallbacks?: ModelToDomOption | ModelToTextCallbacks
): string {
    if (mode == 'PlainTextFast') {
        return editor.getDOMHelper().getTextContent();
    } else {
        const model = editor.getContentModelCopy('clean');

        if (mode == 'PlainText') {
            return contentModelToText(
                model,
                undefined /*separator*/,
                optionsOrCallbacks as ModelToTextCallbacks
            );
        } else {
            const body = createClonedRoot();

            contentModelToDom(
                body.ownerDocument,
                body,
                model,
                createModelToDomContext(
                    undefined /*editorContext*/,
                    optionsOrCallbacks as ModelToDomOption
                )
            );

            editor.triggerEvent('extractContentWithDom', { clonedRoot: body }, true /*broadcast*/);

            return body.innerHTML;
        }
    }
}
