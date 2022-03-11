import RibbonButton from '../../type/RibbonButton';
import { Direction } from 'roosterjs-editor-types';
import { LtrButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { setDirection } from 'roosterjs-editor-api';

/**
 * @internal
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
