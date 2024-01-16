import ContentModelRibbonButton from './ContentModelRibbonButton';
import { StrikethroughButtonStringKey } from 'roosterjs-react';
import { toggleStrikethrough } from 'roosterjs-content-model-api';

/**
 * @internal
 * "Strikethrough" button on the format ribbon
 */
export const strikethroughButton: ContentModelRibbonButton<StrikethroughButtonStringKey> = {
    key: 'buttonNameStrikethrough',
    unlocalizedText: 'Strikethrough',
    iconName: 'Strikethrough',
    isChecked: formatState => formatState.isStrikeThrough,
    onClick: editor => {
        toggleStrikethrough(editor);

        return true;
    },
};
