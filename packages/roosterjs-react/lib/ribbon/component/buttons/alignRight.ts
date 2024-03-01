import { Alignment } from 'roosterjs-editor-types';
import { setAlignment } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { AlignRightButtonStringKey } from '../../type/RibbonButtonStringKeys';

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
