import { undo } from 'roosterjs-content-model-core';
import type { RibbonButton } from '../type/RibbonButton';
import type { UndoButtonStringKey } from '../type/RibbonButtonStringKeys';

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
        undo(editor);
    },
};
