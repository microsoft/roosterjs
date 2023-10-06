import { Alignment } from 'roosterjs-editor-types';
import { setAlignment } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { AlignCenterButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Align center" button on the format ribbon
 */
export const alignCenter: RibbonButton<AlignCenterButtonStringKey> = {
    key: 'buttonNameAlignCenter',
    unlocalizedText: 'Align center',
    iconName: 'AlignCenter',
    onClick: editor => {
        setAlignment(editor, Alignment.Center);
    },
};
