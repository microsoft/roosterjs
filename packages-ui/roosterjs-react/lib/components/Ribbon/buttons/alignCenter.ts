import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { Alignment } from 'roosterjs-editor-types';
import { setAlignment } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Align left button
 */
export type AlignLeftButtonStringKey = 'buttonNameAlignLeft';

/**
 * "Align center" button on the format ribbon
 */
export const alignCenter: RibbonButton<AlignLeftButtonStringKey> = {
    key: 'buttonNameAlignLeft',
    unlocalizedText: 'Align center',
    iconName: 'AlignCenter',
    onClick: editor => {
        setAlignment(editor, Alignment.Center);
    },
};
