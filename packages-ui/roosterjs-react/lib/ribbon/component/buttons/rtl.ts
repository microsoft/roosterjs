import RibbonButton from '../../type/RibbonButton';
import { Direction } from 'roosterjs-editor-types';
import { RtlButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { setDirection } from 'roosterjs-editor-api';

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
