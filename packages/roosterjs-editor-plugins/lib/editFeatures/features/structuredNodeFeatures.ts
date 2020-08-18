import {
    ContentEditFeature,
    IEditor,
    Keys,
    PluginKeyboardEvent,
    PositionType,
} from 'roosterjs-editor-types';
import {
    Browser,
    cacheGetEventData,
    fromHtml,
    isPositionAtBeginningOf,
    Position,
    getTagOfNode,
} from 'roosterjs-editor-dom';

// Edge can sometimes lose current format when Enter to new line.
// So here we add an extra SPAN for Edge to workaround this bug
const NEWLINE_HTML = Browser.isEdge ? '<div><span><br></span></div>' : '<div><br></div>';
const CHILD_PARENT_TAG_MAP: { [childTag: string]: string } = {
    TD: 'TABLE',
    TH: 'TABLE',
    LI: 'OL,UL',
};
const CHILD_SELECTOR = Object.keys(CHILD_PARENT_TAG_MAP).join(',');

/**
 * InsertLineBeforeStructuredNode edit feature, provides the ability to insert an empty line before
 * a structured element (bullet/numbering list, blockquote, table) if the element is at beginning of
 * document
 */
const InsertLineBeforeStructuredNodeFeature: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: cacheGetStructuredElement,
    handleEvent: (event, editor) => {
        let element = cacheGetStructuredElement(event, editor);
        let div = fromHtml(NEWLINE_HTML, editor.getDocument())[0] as HTMLElement;
        editor.addUndoSnapshot(() => {
            element.parentNode.insertBefore(div, element);
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
 * Settings for structured node features
 */
export default interface StructuredNodeFeatureSettings {
    /**
     * When press Enter at the beginning of first structured element (table, list) and there isn't line before the position
     * we create a new line before so that user got a chance to enter content before the table or list
     * @default false
     */
    insertLineBeforeStructuredNodeFeature: boolean;
}

/**
 * @internal
 */
export const StructuredNodeFeatures: Record<
    keyof StructuredNodeFeatureSettings,
    ContentEditFeature
> = {
    insertLineBeforeStructuredNodeFeature: InsertLineBeforeStructuredNodeFeature,
};
