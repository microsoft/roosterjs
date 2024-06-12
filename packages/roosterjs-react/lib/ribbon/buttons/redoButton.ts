import { redo } from 'roosterjs-content-model-core';
import type { RedoButtonStringKey } from '../type/RibbonButtonStringKeys';
import type { RibbonButton } from '../type/RibbonButton';

/**
 * "Undo" button on the format ribbon
 */
export const redoButton: RibbonButton<RedoButtonStringKey> = {
    key: 'buttonNameRedo',
    unlocalizedText: 'Redo',
    iconName: 'Redo',
    isDisabled: formatState => !formatState.canRedo,
    onClick: editor => {
        redo(editor);
    },
    commandBarProperties: {
        buttonStyles: {
            icon: { paddingBottom: '10px' },
        },
    },
};
