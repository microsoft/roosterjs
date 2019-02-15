import { cacheGetEventData, ContentEditFeature, Editor, Keys } from 'roosterjs-editor-core';
import { PluginKeyboardEvent, PositionType } from 'roosterjs-editor-types';
import {
    Browser,
    fromHtml,
    isPositionAtBeginningOf,
    Position,
    getTagOfNode,
} from 'roosterjs-editor-dom';

export const InsertLineBeforeStructuredNodeFeature: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: cacheGetStructuredElement,
    handleEvent: (event, editor) => {
        let element = cacheGetStructuredElement(event, editor);
        let div = fromHtml(
            // Edge can sometimes lose current format when Enter to new line.
            // So here we add an extra SPAN for Edge to workaround this bug
            Browser.isEdge ? '<div><span><br></span></div>' : '<div><br></div>',
            editor.getDocument()
        )[0] as HTMLElement;
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
        let element = event.rawEvent.shiftKey ? null : editor.getElementAtCursor('TD,TH,LI');

        if (element) {
            let range = editor.getSelectionRange();
            if (
                range &&
                range.collapsed &&
                isPositionAtBeginningOf(Position.getStart(range), element) &&
                !editor.getBodyTraverser(element).getPreviousBlockElement()
            ) {
                return editor.getElementAtCursor(
                    getTagOfNode(element) == 'LI' ? 'OL,UL' : 'TABLE',
                    element
                );
            }
        }

        return null;
    });
}
