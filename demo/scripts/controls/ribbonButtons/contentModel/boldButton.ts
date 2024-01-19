import ContentModelRibbonButton from './ContentModelRibbonButton';
import { BoldButtonStringKey } from 'roosterjs-react';
import { toggleBold } from 'roosterjs-content-model-api';

/**
 * @internal
 * "Bold" button on the format ribbon
 */
export const boldButton: ContentModelRibbonButton<BoldButtonStringKey> = {
    key: 'buttonNameBold',
    unlocalizedText: 'Bold',
    iconName: 'Bold',
    isChecked: formatState => formatState.isBold,
    onClick: editor => {
        toggleBold(editor);
        return true;
    },
};
