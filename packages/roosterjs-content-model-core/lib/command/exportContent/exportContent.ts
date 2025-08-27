import { createClonedRoot } from './createClonedRoot';
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
 * @param mode Specify HTML to get HTML. This is the default option
 * @param options @optional Options for Model to DOM conversion
 */
export function exportContent(editor: IEditor, mode?: 'HTML', options?: ModelToDomOption): string;

/**
 * Export HTML content. If there are entities, this will cause EntityOperation event with option = 'replaceTemporaryContent' to get a dehydrated entity.
 * This is a fast version, it retrieve HTML content directly from editor without going through content model conversion.
 * @param editor The editor to get content from
 * @param mode Specify HTMLFast to get HTML result.
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

// Here I didn't add 'HTMLFast' to ExportContentMode type because it will make this a breaking change and EditorAdapter will see build time error without bumping version
// Once we are confident that 'HTMLFast' is stable, we can fully switch 'HTML' to use the 'HTMLFast' approach
export function exportContent(
    editor: IEditor,
    mode: ExportContentMode | 'HTMLFast' = 'HTML',
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

        case 'HTML':
        default:
            model = editor.getContentModelCopy('clean');

            const doc = editor.getDocument();
            const div = doc.createElement('div');

            contentModelToDom(
                body.ownerDocument,
                body,
                model,
                createModelToDomContext(
                    undefined /*editorContext*/,
                    optionsOrCallbacks as ModelToDomOption
                )
            );

            return getHTMLFromDOM(editor, div);
    }
}

function getHTMLFromDOM(editor: IEditor, root: HTMLElement): string {
    editor.triggerEvent('extractContentWithDom', { clonedRoot: root }, true /*broadcast*/);

    return root.innerHTML;
}
