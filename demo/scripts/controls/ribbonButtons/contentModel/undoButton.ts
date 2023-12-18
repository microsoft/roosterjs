import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { RibbonButton, UndoButtonStringKey } from 'roosterjs-react';
import { undo } from 'roosterjs-content-model-core';

/**
 * @internal
 * "Undo" button on the format ribbon
 */
export const undoButton: RibbonButton<UndoButtonStringKey> = {
    key: 'buttonNameUndo',
    unlocalizedText: 'Undo',
    iconName: 'undo',
    isDisabled: formatState => !formatState.canUndo,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            undo(editor);
        }
        return true;
    },
};
