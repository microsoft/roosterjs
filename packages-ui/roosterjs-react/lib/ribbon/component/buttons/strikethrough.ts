import RibbonButton from '../../type/RibbonButton';
import { StrikethroughButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { toggleStrikethrough } from 'roosterjs-editor-api';

/**
 * @internal
 * "Strikethrough" button on the format ribbon
 */
export const strikethrough: RibbonButton<StrikethroughButtonStringKey> = {
    key: 'buttonNameStrikethrough',
    unlocalizedText: 'Strikethrough',
    iconName: 'Strikethrough',
    isChecked: formatState => !!formatState.isStrikeThrough,
    onClick: editor => {
        toggleStrikethrough(editor);
        return true;
    },
};
