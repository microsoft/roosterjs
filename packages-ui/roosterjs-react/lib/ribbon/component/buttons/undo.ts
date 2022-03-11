import RibbonButton from '../../type/RibbonButton';
/**
 * Key of localized strings of Undo button
 */
export type UndoButtonStringKey = 'buttonNameUndo';

/**
 * "Undo" button on the format ribbon
 */
export const undo: RibbonButton<UndoButtonStringKey> = {
    key: 'buttonNameUndo',
    unlocalizedText: 'Undo',
    iconName: 'undo',
    disabled: formatState => !formatState.canUndo,
    onClick: editor => {
        editor.undo();
        return true;
    },
};
