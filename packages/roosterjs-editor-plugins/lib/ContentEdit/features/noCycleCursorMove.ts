import { ContentEditFeature, Keys } from 'roosterjs-editor-core';
import { isRtl, Position } from 'roosterjs-editor-dom';

export const NoCycleCursorMove: ContentEditFeature = {
    keys: [Keys.LEFT, Keys.RIGHT],
    allowFunctionKeys: true,
    shouldHandleEvent: (event, editor, ctrlOrMeta) => {
        let range: Range;
        let position: Position;

        if (
            !ctrlOrMeta ||
            !(range = editor.getSelectionRange()) ||
            !range.collapsed ||
            !(position = Position.getStart(range)) ||
            !editor.isPositionAtBeginning(position)
        ) {
            return false;
        }

        let rtl = isRtl(position.element);
        let rawEvent = event.rawEvent;

        return (!rtl && rawEvent.which == Keys.LEFT) || (rtl && rawEvent.which == Keys.RIGHT);
    },
    handleEvent: event => {
        event.rawEvent.preventDefault();
    },
};
