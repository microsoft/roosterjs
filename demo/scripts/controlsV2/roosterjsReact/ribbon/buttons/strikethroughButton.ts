import { toggleStrikethrough } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { StrikethroughButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Strikethrough" button on the format ribbon
 */
export const strikethroughButton: RibbonButton<StrikethroughButtonStringKey> = {
    key: 'buttonNameStrikethrough',
    unlocalizedText: 'Strikethrough',
    iconName: 'Strikethrough',
    isChecked: formatState => formatState.isStrikeThrough,
    onClick: editor => {
        toggleStrikethrough(editor);
    },
};
