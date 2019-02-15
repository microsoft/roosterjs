import { cacheGetEventData, ContentEditFeature, Editor, Keys } from 'roosterjs-editor-core';
import { PluginKeyboardEvent, PositionType } from 'roosterjs-editor-types';
import {
    Browser,
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

export const InsertLineBeforeStructuredNodeFeature: ContentEditFeature = {
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
};

function cacheGetStructuredElement(event: PluginKeyboardEvent, editor: Editor) {
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
