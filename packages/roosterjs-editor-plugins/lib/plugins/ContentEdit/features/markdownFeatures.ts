import { cacheGetEventData, createRange, Position, wrap } from 'roosterjs-editor-dom';
import type { CompatibleKeys } from 'roosterjs-editor-types/lib/compatibleTypes';
import {
    BuildInEditFeature,
    ChangeSource,
    IEditor,
    Keys,
    MarkdownFeatureSettings,
    NodePosition,
    PluginKeyboardEvent,
    PositionType,
} from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '\u200B';

function generateBasicMarkdownFeature(
    key: Keys | CompatibleKeys,
    triggerCharacter: string,
    elementTag: string,
    useShiftKey: boolean
): BuildInEditFeature<PluginKeyboardEvent> {
    return {
        keys: [key],
        shouldHandleEvent: (event, editor) =>
            event.rawEvent.shiftKey === useShiftKey &&
            !!cacheGetRangeForMarkdownOperation(event, editor, triggerCharacter),
        handleEvent: (event, editor) => {
            // runAsync is here to allow the event to complete so autocomplete will present the trigger character.
            editor.runAsync(editor => {
                handleMarkdownEvent(event, editor, triggerCharacter, elementTag);
            });
        },
    };
}

function cacheGetRangeForMarkdownOperation(
    event: PluginKeyboardEvent,
    editor: IEditor,
    triggerCharacter: string
): Range | null {
    return cacheGetEventData(event, 'MARKDOWN_RANGE', (): Range | null => {
        const searcher = editor.getContentSearcherOfCursor(event);

        let startPosition: NodePosition | null = null;
        let endPosition: NodePosition | null = null;
        searcher?.forEachTextInlineElement(textInlineElement => {
            if (endPosition && startPosition) {
                return true;
            }
            const inlineTextContent = textInlineElement.getTextContent();

            // special case for immediately preceding character being whitespace
            if (inlineTextContent[inlineTextContent.length - 1].trim().length == 0) {
                return false;
            }

            //if the text is pasted, it might create a inner element inside the text element,
            // then is necessary to check the parent block to get whole text
            const parentBlockText = textInlineElement.getParentBlock().getTextContent();

            // special case for consecutive trigger characters
            // check parent block in case of pasted text
            if (parentBlockText[parentBlockText.length - 1].trim() === triggerCharacter) {
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
        return startPosition && endPosition && createRange(startPosition, endPosition);
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
            if (!range) {
                return;
            }
            const lastTypedTriggerPosition = new Position(range.endContainer, PositionType.End);
            const hasLastTypedTrigger = range.endOffset + 1 <= lastTypedTriggerPosition.offset;
            if (!!range && hasLastTypedTrigger) {
                // get the text content range
                const textContentRange = range.cloneRange();
                textContentRange.setStart(
                    textContentRange.startContainer,
                    textContentRange.startOffset + 1
                );

                const text = textContentRange.extractContents().textContent;
                const textNode = editor.getDocument().createTextNode(text ?? '');

                // extract content and put it into a new element.
                const elementToWrap = wrap(textNode, elementTag);
                //include last typed character
                range.setEnd(range.endContainer, range.endOffset + 1);
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
 * Markdown bold feature. Make bold text with markdown shortcuts.
 */
const MarkdownBold: BuildInEditFeature<PluginKeyboardEvent> = generateBasicMarkdownFeature(
    Keys.EIGHT_ASTERISK,
    '*',
    'b',
    true /* useShiftKey */
);

/**
 * Markdown italics feature. Make italic text with markdown shortcuts.
 */
const MarkdownItalic: BuildInEditFeature<PluginKeyboardEvent> = generateBasicMarkdownFeature(
    Keys.DASH_UNDERSCORE,
    '_',
    'i',
    true /* useShiftKey */
);

/**
 * Markdown strikethrough feature. MAke strikethrough text with markdown shortcuts.
 */
const MarkdownStrikethrough: BuildInEditFeature<PluginKeyboardEvent> = generateBasicMarkdownFeature(
    Keys.GRAVE_TILDE,
    '~',
    's',
    true /* useShiftKey */
);

/**
 * Markdown inline code feature. Marks specific text as inline code with markdown shortcuts.
 */
const MarkdownInlineCode: BuildInEditFeature<PluginKeyboardEvent> = generateBasicMarkdownFeature(
    Keys.GRAVE_TILDE,
    '`',
    'code',
    false /* useShiftKey */
);

/**
 * @internal
 */
export const MarkdownFeatures: Record<
    keyof MarkdownFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    markdownBold: MarkdownBold,
    markdownItalic: MarkdownItalic,
    markdownStrikethru: MarkdownStrikethrough,
    markdownInlineCode: MarkdownInlineCode,
};
