import { Direction } from 'roosterjs-editor-types';
import { setDirection } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { RtlButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Right to left" button on the format ribbon
 */
export const rtl: RibbonButton<RtlButtonStringKey> = {
    key: 'buttonNameRtl',
    unlocalizedText: 'Right to left',
    iconName: 'BidiRtl',
    onClick: editor => {
        setDirection(editor, Direction.RightToLeft);
    },
};
