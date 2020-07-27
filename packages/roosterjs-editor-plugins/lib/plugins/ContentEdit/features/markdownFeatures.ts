import { ContentEditFeature, Editor, Keys } from 'roosterjs-editor-core';
import { createRange } from 'roosterjs-editor-dom';
import { NodePosition, PluginKeyboardEvent } from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '\u200B';

/**
 * Markdown bold feature. Bolds text with markdown shortcuts.
 */
export const MarkdownBold: ContentEditFeature = {
    keys: [Keys.EIGHT_ASTIRISK],
    shouldHandleEvent: (event, editor) =>
        event.rawEvent.shiftKey && !!getRangeForMarkdownOperation(event, editor, '*'),
    handleEvent: (event, editor) => {
        event.rawEvent.preventDefault();
        handleMarkdownEvent(event, editor, '*', boldElementBuilder);
    },
};

export const MarkdownItalic: ContentEditFeature = {
    keys: [Keys.DASH_UNDERSCORE],
    shouldHandleEvent: (event, editor) =>
        event.rawEvent.shiftKey && !!getRangeForMarkdownOperation(event, editor, '_'),
    handleEvent: (event, editor) => {
        event.rawEvent.preventDefault();
        handleMarkdownEvent(event, editor, '_', italicElementBuilder);
    },
};

export const MarkdownStrikethru: ContentEditFeature = {
    keys: [Keys.GRAVE_TILDE],
    shouldHandleEvent: (event, editor) =>
        event.rawEvent.shiftKey && !!getRangeForMarkdownOperation(event, editor, '~'),
    handleEvent: (event, editor) => {
        event.rawEvent.preventDefault();
        handleMarkdownEvent(event, editor, '~', strikethruElementBuilder);
    },
};

export const MarkdownInlineCode: ContentEditFeature = {
    keys: [Keys.GRAVE_TILDE],
    shouldHandleEvent: (event, editor) =>
        !event.rawEvent.shiftKey && !!getRangeForMarkdownOperation(event, editor, '`'),
    handleEvent: (event, editor) => {
        event.rawEvent.preventDefault();
        handleMarkdownEvent(event, editor, '`', codeInlineElementBuilder);
    },
};

function getRangeForMarkdownOperation(
    event: PluginKeyboardEvent,
    editor: Editor,
    triggerCharacter: string
): Range {
    const searcher = editor.getContentSearcherOfCursor();

    let startPosition: NodePosition;
    let endPosition: NodePosition;
    searcher.forEachTextInlineElement(textInlineElement => {
        if (endPosition && startPosition) {
            return true;
        }
        const inlineTextContent = textInlineElement.getTextContent();
        if (inlineTextContent[inlineTextContent.length - 1].trim().length == 0) {
            return false;
        }
        endPosition = textInlineElement.getStartPosition().move(inlineTextContent.length);
        if (inlineTextContent[0] == triggerCharacter) {
            startPosition = textInlineElement.getStartPosition();
        } else {
            let contentIndex = inlineTextContent.length - 1;
            for (; contentIndex > 0; contentIndex--) {
                if (startPosition) {
                    return true;
                }
                if (
                    inlineTextContent[contentIndex] == triggerCharacter &&
                    inlineTextContent[contentIndex - 1].trim().length == 0
                ) {
                    startPosition = textInlineElement.getStartPosition().move(contentIndex);
                    return true;
                }
            }
        }
    });
    return !!startPosition && !!endPosition && createRange(startPosition, endPosition);
}

function handleMarkdownEvent(
    event: PluginKeyboardEvent,
    editor: Editor,
    triggerCharacter: string,
    elementBuilder: (editor: Editor) => HTMLElement
) {
    const range = getRangeForMarkdownOperation(event, editor, triggerCharacter);
    if (!!range) {
        const elementToWrap = elementBuilder(editor);
        elementToWrap.appendChild(range.extractContents());
        elementToWrap.innerText = elementToWrap.innerText.slice(1, elementToWrap.innerText.length);
        const nonPrintedSpaceTextNode = editor.getDocument().createTextNode(ZERO_WIDTH_SPACE);
        range.insertNode(nonPrintedSpaceTextNode);
        range.insertNode(elementToWrap);
        range.setEndAfter(nonPrintedSpaceTextNode);
        range.collapse(false);
        editor.select(range);
    }
}

function boldElementBuilder(editor: Editor): HTMLElement {
    return editor.getDocument().createElement('b');
}

function italicElementBuilder(editor: Editor): HTMLElement {
    return editor.getDocument().createElement('i');
}

function strikethruElementBuilder(editor: Editor): HTMLElement {
    return editor.getDocument().createElement('s');
}

function codeInlineElementBuilder(editor: Editor): HTMLElement {
    return editor.getDocument().createElement('code');
}
