import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { Direction } from 'roosterjs-editor-types';
import { setDirection } from 'roosterjs-editor-api';

/**
 * "Right to left" button on the format ribbon
 */
export const rtl: RibbonButton = {
    key: 'rtl',
    unlocalizedText: 'Right to left',
    iconName: 'BidiRtl',
    onClick: editor => {
        setDirection(editor, Direction.RightToLeft);
    },
};
