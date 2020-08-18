import { cacheGetEventData, createRange } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentEditFeature,
    IEditor,
    Keys,
    MarkdownFeatureSettings,
    NodePosition,
    PluginKeyboardEvent,
    PositionType,
} from 'roosterjs-editor-types';

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
            !!cacheGetRangeForMarkdownOperation(event, editor, triggerCharacter),
        handleEvent: (event, editor) => {
            // runAsync is here to allow the event to complete so autocomplete will present the trigger character.
            editor.runAsync(() => {
                handleMarkdownEvent(event, editor, triggerCharacter, elementTag);
            });
        },
    };
}

function cacheGetRangeForMarkdownOperation(
    event: PluginKeyboardEvent,
    editor: IEditor,
    triggerCharacter: string
): Range {
    return cacheGetEventData(event, 'MARKDOWN_RANGE', () => {
        const searcher = editor.getContentSearcherOfCursor(event);

        let startPosition: NodePosition;
        let endPosition: NodePosition;
        searcher.forEachTextInlineElement(textInlineElement => {
            if (endPosition && startPosition) {
                return true;
            }
            const inlineTextContent = textInlineElement.getTextContent();

            // special case for immediately preceeding character being whitespace
            if (inlineTextContent[inlineTextContent.length - 1].trim().length == 0) {
                return false;
            }

            // special case for consecutive trigger characters
            if (inlineTextContent[inlineTextContent.length - 1] === triggerCharacter) {
                return false;
            }

            if (!endPosition) {
                endPosition = textInlineElement.getStartPosition().move(inlineTextContent.length);
            }
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
    });
}

function handleMarkdownEvent(
    event: PluginKeyboardEvent,
    editor: IEditor,
    triggerCharacter: string,
    elementTag: string
) {
    editor.addUndoSnapshot(
        () => {
            const range = cacheGetRangeForMarkdownOperation(event, editor, triggerCharacter);
            if (!!range) {
                // get the text content range
                const textContentRange = range.cloneRange();
                textContentRange.setStart(
                    textContentRange.startContainer,
                    textContentRange.startOffset + 1
                );

                // set the removal range to include the typed last character.
                range.setEnd(range.endContainer, range.endOffset + 1);

                // extract content and put it into a new element.
                const elementToWrap = editor.getDocument().createElement(elementTag);
                elementToWrap.appendChild(textContentRange.extractContents());
                range.deleteContents();

                // ZWS here ensures we don't end up inside the newly created node.
                const nonPrintedSpaceTextNode = editor
                    .getDocument()
                    .createTextNode(ZERO_WIDTH_SPACE);
                range.insertNode(nonPrintedSpaceTextNode);
                range.insertNode(elementToWrap);
                editor.select(nonPrintedSpaceTextNode, PositionType.End);
            }
        },
        ChangeSource.Format,
        true /*canUndoByBackspace*/
    );
}

/**
 * Markdown bold feature. Bolds text with markdown shortcuts.
 */
const MarkdownBold: ContentEditFeature = generateBasicMarkdownFeature(
    Keys.EIGHT_ASTIRISK,
    '*',
    'b',
    true
);

/**
 * Markdown italics feature. Italicises text with markdown shortcuts.
 */
const MarkdownItalic: ContentEditFeature = generateBasicMarkdownFeature(
    Keys.DASH_UNDERSCORE,
    '_',
    'i',
    true
);

/**
 * Markdown strikethru feature. Strikethrus text with markdown shortcuts.
 */
const MarkdownStrikethru: ContentEditFeature = generateBasicMarkdownFeature(
    Keys.GRAVE_TILDE,
    '~',
    's',
    true
);

/**
 * Markdown inline code feature. Marks specific text as inline code with markdown shortcuts.
 */
const MarkdownInlineCode: ContentEditFeature = generateBasicMarkdownFeature(
    Keys.GRAVE_TILDE,
    '`',
    'code',
    false
);

/**
 * @internal
 */
export const MarkdownFeatures: Record<keyof MarkdownFeatureSettings, ContentEditFeature> = {
    markdownBold: MarkdownBold,
    markdownItalic: MarkdownItalic,
    markdownStrikethru: MarkdownStrikethru,
    markdownInlineCode: MarkdownInlineCode,
};
