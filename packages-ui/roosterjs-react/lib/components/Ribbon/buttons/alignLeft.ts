import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { Alignment } from 'roosterjs-editor-types';
import { setAlignment } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Align center button
 */
export type AlignCenterButtonStringKey = 'buttonNameAlignCenter';

/**
 * "Align left" button on the format ribbon
 */
export const alignLeft: RibbonButton<AlignCenterButtonStringKey> = {
    key: 'buttonNameAlignCenter',
    unlocalizedText: 'Align left',
    iconName: 'AlignLeft',
    onClick: editor => {
        setAlignment(editor, Alignment.Left);
    },
};
