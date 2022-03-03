import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { Alignment } from 'roosterjs-editor-types';
import { setAlignment } from 'roosterjs-editor-api';

/**
 * "Align center" button on the format ribbon
 */
export const alignCenter: RibbonButton = {
    key: 'alignCenter',
    unlocalizedText: 'Align center',
    iconName: 'AlignCenter',
    onClick: editor => {
        setAlignment(editor, Alignment.Center);
    },
};
