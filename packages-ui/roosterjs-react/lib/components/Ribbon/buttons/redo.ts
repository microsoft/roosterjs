import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';

/**
 * "Redo" button on the format ribbon
 */
export const redo: RibbonButton = {
    key: 'redo',
    unlocalizedText: 'Redo',
    iconName: 'Redo',
    disabled: formatState => !formatState.canRedo,
    onClick: editor => {
        editor.redo();
        return true;
    },
};
