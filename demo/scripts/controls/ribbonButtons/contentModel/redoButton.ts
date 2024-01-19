import ContentModelRibbonButton from './ContentModelRibbonButton';
import { redo } from 'roosterjs-content-model-core';
import { RedoButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Undo" button on the format ribbon
 */
export const redoButton: ContentModelRibbonButton<RedoButtonStringKey> = {
    key: 'buttonNameRedo',
    unlocalizedText: 'Redo',
    iconName: 'Redo',
    isDisabled: formatState => !formatState.canRedo,
    onClick: editor => {
        redo(editor);

        return true;
    },
};
