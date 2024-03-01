import type RibbonButton from '../../type/RibbonButton';
import type { RedoButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Redo" button on the format ribbon
 */
export const redo: RibbonButton<RedoButtonStringKey> = {
    key: 'buttonNameRedo',
    unlocalizedText: 'Redo',
    iconName: 'Redo',
    isDisabled: formatState => !formatState.canRedo,
    onClick: editor => {
        editor.redo();
        return true;
    },
};
