import RibbonButton from '../../type/RibbonButton';
import { Alignment } from 'roosterjs-editor-types';
import { AlignRightButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { setAlignment } from 'roosterjs-editor-api';

/**
 * @internal
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
