import {
    BuildInEditFeature,
    IEditor,
    Keys,
    KnownCreateElementDataIndex,
    PluginKeyboardEvent,
    PositionType,
    StructuredNodeFeatureSettings,
} from 'roosterjs-editor-types';
import {
    cacheGetEventData,
    isPositionAtBeginningOf,
    Position,
    getTagOfNode,
    createElement,
    getObjectKeys,
} from 'roosterjs-editor-dom';

const CHILD_PARENT_TAG_MAP: { [childTag: string]: string } = {
    TD: 'TABLE',
    TH: 'TABLE',
    LI: 'OL,UL',
};
const CHILD_SELECTOR = getObjectKeys(CHILD_PARENT_TAG_MAP).join(',');

/**
 * InsertLineBeforeStructuredNode edit feature, provides the ability to insert an empty line before
 * a structured element (bullet/numbering list, blockquote, table) if the element is at beginning of
 * document
 */
const InsertLineBeforeStructuredNodeFeature: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.ENTER],
    shouldHandleEvent: cacheGetStructuredElement,
    handleEvent: (event, editor) => {
        let element = cacheGetStructuredElement(event, editor);
        let div = createElement(
            KnownCreateElementDataIndex.EmptyLine,
            editor.getDocument()
        ) as HTMLElement;
        editor.addUndoSnapshot(() => {
            element?.parentNode?.insertBefore(div, element);
            // Select the new line when we are in table. This is the same behavior with Word
            if (getTagOfNode(element) == 'TABLE') {
                editor.select(new Position(div, PositionType.Begin).normalize());
            }
        });
        event.rawEvent.preventDefault();
    },
    defaultDisabled: true,
};

function cacheGetStructuredElement(event: PluginKeyboardEvent, editor: IEditor) {
    return cacheGetEventData(event, 'FIRST_STRUCTURE', () => {
        // Provide a chance to keep browser default behavior by pressing SHIFT
        let element = event.rawEvent.shiftKey ? null : editor.getElementAtCursor(CHILD_SELECTOR);

        if (element) {
            let range = editor.getSelectionRange();
            if (
                range &&
                range.collapsed &&
                isPositionAtBeginningOf(Position.getStart(range), element) &&
                !editor.getBodyTraverser(element).getPreviousBlockElement()
            ) {
                return editor.getElementAtCursor(CHILD_PARENT_TAG_MAP[getTagOfNode(element)]);
            }
        }

        return null;
    });
}

/**
 * @internal
 */
export const StructuredNodeFeatures: Record<
    keyof StructuredNodeFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    insertLineBeforeStructuredNodeFeature: InsertLineBeforeStructuredNodeFeature,
};
