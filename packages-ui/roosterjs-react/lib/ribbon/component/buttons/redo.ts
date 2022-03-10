import RibbonButton from '../../type/RibbonButton';
/**
 * Key of localized strings of Redo button
 */
export type RedoButtonStringKey = 'buttonNameRedo';

/**
 * "Redo" button on the format ribbon
 */
export const redo: RibbonButton<RedoButtonStringKey> = {
    key: 'buttonNameRedo',
    unlocalizedText: 'Redo',
    iconName: 'Redo',
    disabled: formatState => !formatState.canRedo,
    onClick: editor => {
        editor.redo();
        return true;
    },
};
