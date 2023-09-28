import { Direction } from 'roosterjs-editor-types';
import { setDirection } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { LtrButtonStringKey } from '../../type/RibbonButtonStringKeys';

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
