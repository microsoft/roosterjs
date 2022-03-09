import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { Direction } from 'roosterjs-editor-types';
import { setDirection } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Left to right button
 */
export type LtrButtonStringKey = 'buttonNameLtr';

/**
 * "Left to right" button on the format ribbon
 */
export const ltr: RibbonButton<LtrButtonStringKey> = {
    key: 'buttonNameLtr',
    unlocalizedText: 'Left to right',
    iconName: 'BidiLtr',
    onClick: editor => {
        setDirection(editor, Direction.LeftToRight);
    },
};
