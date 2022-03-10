import RibbonButton from '../../type/RibbonButton';
import { Direction } from 'roosterjs-editor-types';
import { setDirection } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Right to left button
 */
export type RtlButtonStringKey = 'buttonNameRtl';

/**
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
