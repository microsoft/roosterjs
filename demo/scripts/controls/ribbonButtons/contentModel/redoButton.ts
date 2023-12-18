import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { redo } from 'roosterjs-content-model-core';
import { RedoButtonStringKey, RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Undo" button on the format ribbon
 */
export const redoButton: RibbonButton<RedoButtonStringKey> = {
    key: 'buttonNameRedo',
    unlocalizedText: 'Redo',
    iconName: 'Redo',
    isDisabled: formatState => !formatState.canRedo,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            redo(editor);
        }
        return true;
    },
};
