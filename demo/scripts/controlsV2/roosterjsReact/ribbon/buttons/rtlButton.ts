import { setDirection } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { RtlButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Right to left" button on the format ribbon
 */
export const rtlButton: RibbonButton<RtlButtonStringKey> = {
    key: 'buttonNameRtl',
    unlocalizedText: 'Right to left',
    iconName: 'BidiRtl',
    onClick: editor => {
        setDirection(editor, 'rtl');
    },
};
