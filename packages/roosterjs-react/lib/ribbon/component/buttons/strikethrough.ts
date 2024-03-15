import { toggleStrikethrough } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { StrikethroughButtonStringKey } from '../../type/RibbonButtonStringKeys';

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
