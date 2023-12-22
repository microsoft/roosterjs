import ContentModelRibbonButton from './ContentModelRibbonButton';
import { RtlButtonStringKey } from 'roosterjs-react';
import { setDirection } from 'roosterjs-content-model-api';

/**
 * @internal
 * "Right to left" button on the format ribbon
 */
export const rtlButton: ContentModelRibbonButton<RtlButtonStringKey> = {
    key: 'buttonNameRtl',
    unlocalizedText: 'Right to left',
    iconName: 'BidiRtl',
    onClick: editor => {
        setDirection(editor, 'rtl');

        return true;
    },
};
