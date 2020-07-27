import { ChangeSource, NodePosition, PluginKeyboardEvent } from 'roosterjs-editor-types';
import { ContentEditFeature, Editor, Keys } from 'roosterjs-editor-core';
import { createRange } from 'roosterjs-editor-dom';

const ZERO_WIDTH_SPACE = '\u200B';

function generateBasicMarkdownFeature(
    key: Keys,
    triggerCharacter: string,
    elementTag: string,
    useShiftKey: boolean
): ContentEditFeature {
    return {
        keys: [key],
        shouldHandleEvent: (event, editor) =>
            event.rawEvent.shiftKey === useShiftKey &&
            !!getRangeForMarkdownOperation(event, editor, triggerCharacter),
        handleEvent: (event, editor) => {
            event.rawEvent.preventDefault();
            handleMarkdownEvent(event, editor, triggerCharacter, elementTag);
        },
    };
}

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
    elementTag: string
) {
    editor.performAutoComplete(() => {
        const range = getRangeForMarkdownOperation(event, editor, triggerCharacter);
        if (!!range) {
            const elementToWrap = editor.getDocument().createElement(elementTag);
            elementToWrap.appendChild(range.extractContents());
            elementToWrap.innerText = elementToWrap.innerText.slice(
                1,
                elementToWrap.innerText.length
            );
            const nonPrintedSpaceTextNode = editor.getDocument().createTextNode(ZERO_WIDTH_SPACE);
            range.insertNode(nonPrintedSpaceTextNode);
            range.insertNode(elementToWrap);
            range.setEndAfter(nonPrintedSpaceTextNode);
            range.collapse(false);
            editor.select(range);
        }
    }, ChangeSource.Format);
}

/**
 * Markdown bold feature. Bolds text with markdown shortcuts.
 */
export const MarkdownBold: ContentEditFeature = generateBasicMarkdownFeature(
    Keys.EIGHT_ASTIRISK,
    '*',
    'b',
    true
);

/**
 * Markdown italics feature. Italicises text with markdown shortcuts.
 */
export const MarkdownItalic: ContentEditFeature = generateBasicMarkdownFeature(
    Keys.DASH_UNDERSCORE,
    '_',
    'i',
    true
);

/**
 * Markdown strikethru feature. Strikethrus text with markdown shortcuts.
 */
export const MarkdownStrikethru: ContentEditFeature = generateBasicMarkdownFeature(
    Keys.GRAVE_TILDE,
    '~',
    's',
    true
);

/**
 * Markdown inline code feature. Marks specific text as inline code with markdown shortcuts.
 */
export const MarkdownInlineCode: ContentEditFeature = generateBasicMarkdownFeature(
    Keys.GRAVE_TILDE,
    '`',
    'code',
    false
);
