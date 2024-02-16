import { setDirection } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { LtrButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Left to right" button on the format ribbon
 */
export const ltrButton: RibbonButton<LtrButtonStringKey> = {
    key: 'buttonNameLtr',
    unlocalizedText: 'Left to right',
    iconName: 'BidiLtr',
    onClick: editor => {
        setDirection(editor, 'ltr');
    },
};
