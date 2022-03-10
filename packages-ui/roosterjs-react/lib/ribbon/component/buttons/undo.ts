import RibbonButton from '../../type/RibbonButton';
import { UndoButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Undo" button on the format ribbon
 */
export const undo: RibbonButton<UndoButtonStringKey> = {
    key: 'buttonNameUndo',
    unlocalizedText: 'Undo',
    iconName: 'undo',
    isDisabled: formatState => !formatState.canUndo,
    onClick: editor => {
        editor.undo();
        return true;
    },
};
