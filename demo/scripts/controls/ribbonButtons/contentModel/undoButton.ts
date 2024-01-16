import ContentModelRibbonButton from './ContentModelRibbonButton';
import { undo } from 'roosterjs-content-model-core';
import { UndoButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Undo" button on the format ribbon
 */
export const undoButton: ContentModelRibbonButton<UndoButtonStringKey> = {
    key: 'buttonNameUndo',
    unlocalizedText: 'Undo',
    iconName: 'undo',
    isDisabled: formatState => !formatState.canUndo,
    onClick: editor => {
        undo(editor);

        return true;
    },
};
