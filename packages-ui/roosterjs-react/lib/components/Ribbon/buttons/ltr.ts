import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { Direction } from 'roosterjs-editor-types';
import { setDirection } from 'roosterjs-editor-api';

/**
 * "Left to right" button on the format ribbon
 */
export const ltr: RibbonButton = {
    key: 'ltr',
    unlocalizedText: 'Left to right',
    iconName: 'BidiLtr',
    onClick: editor => {
        setDirection(editor, Direction.LeftToRight);
    },
};
