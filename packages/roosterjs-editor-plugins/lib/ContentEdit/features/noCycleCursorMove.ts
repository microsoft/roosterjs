import { ContentEditFeature, Keys } from 'roosterjs-editor-core';
import { Position } from 'roosterjs-editor-dom';

export const NoCycleCursorMove: ContentEditFeature = {
    keys: [Keys.LEFT],
    allowFunctionKeys: true,
    shouldHandleEvent: (event, editor) => {
        let range: Range;
        return (
            event.rawEvent.ctrlKey &&
            (range = editor.getSelectionRange()) &&
            range.collapsed &&
            editor.isPositionAtBeginning(Position.getStart(range))
        );
    },
    handleEvent: event => {
        event.rawEvent.preventDefault();
    },
};
