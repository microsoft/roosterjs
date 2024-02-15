import ContentModelRibbonButton from './ContentModelRibbonButton';
import { setDirection } from 'roosterjs-content-model-api';
import { LtrButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Left to right" button on the format ribbon
 */
export const ltrButton: ContentModelRibbonButton<LtrButtonStringKey> = {
    key: 'buttonNameLtr',
    unlocalizedText: 'Left to right',
    iconName: 'BidiLtr',
    onClick: editor => {
        setDirection(editor, 'ltr');

        return true;
    },
};
