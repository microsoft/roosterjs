import RibbonButton from '../../type/RibbonButton';
import { AlignCenterButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { Alignment } from 'roosterjs-editor-types';
import { setAlignment } from 'roosterjs-editor-api';

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
