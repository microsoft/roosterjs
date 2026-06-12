import {
    convertMarkdownToContentModel,
    isPastedContentMarkdown,
} from 'roosterjs-content-model-markdown';
import { mergeModel } from 'roosterjs-content-model-dom';
import { paste } from 'roosterjs-content-model-core';
import { readClipboardData } from '../../utils/readClipboardData';
import type { IEditor } from 'roosterjs-content-model-types';
import type { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Paste as Markdown" button on the format ribbon.
 *
 * Reads the clipboard, checks whether the content can be interpreted as markdown
 * (via {@link isMarkdownContent}). If so, converts it with
 * {@link convertMarkdownToContentModel} and merges the resulting model into the
 * editor. Otherwise, falls back to the regular paste flow.
 */
export const pasteAsMarkdownButton: RibbonButton<'buttonNamePasteAsMarkdown'> = {
    key: 'buttonNamePasteAsMarkdown',
    unlocalizedText: 'Paste as Markdown',
    iconName: 'Paste',
    onClick: async editor => {
        const doc = editor.getDocument();
        const clipboardData = await readClipboardData(doc);
        if (!clipboardData) {
            return;
        }

        if (isPastedContentMarkdown(doc, clipboardData, editor.getDOMCreator())) {
            insertMarkdown(editor, clipboardData.text);
        } else {
            paste(editor, clipboardData);
        }
    },
};

function insertMarkdown(editor: IEditor, text: string) {
    const newModel = convertMarkdownToContentModel(text);
    editor.formatContentModel((model, context) => {
        mergeModel(model, newModel, context, {
            mergeFormat: 'mergeAll',
        });
        return true;
    });
}
