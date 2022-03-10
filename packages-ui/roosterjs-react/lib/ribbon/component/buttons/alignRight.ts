import RibbonButton from '../../type/RibbonButton';
import { Alignment } from 'roosterjs-editor-types';
import { setAlignment } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Align right button
 */
export type AlignRightButtonStringKey = 'buttonNameAlignRight';

/**
 * "Align right" button on the format ribbon
 */
export const alignRight: RibbonButton<AlignRightButtonStringKey> = {
    key: 'buttonNameAlignRight',
    unlocalizedText: 'Align right',
    iconName: 'AlignRight',
    onClick: editor => {
        setAlignment(editor, Alignment.Right);
    },
};
