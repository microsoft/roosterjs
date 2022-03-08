import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { Alignment } from 'roosterjs-editor-types';
import { setAlignment } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Align center button
 */
export type AlignCenterButtonStringKey = 'buttonNameAlignCenter';

/**
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
