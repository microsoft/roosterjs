import RibbonButton from '../../type/RibbonButton';
import { AlignLeftButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { Alignment } from 'roosterjs-editor-types';
import { setAlignment } from 'roosterjs-editor-api';

/**
 * @internal
 * "Align left" button on the format ribbon
 */
export const alignLeft: RibbonButton<AlignLeftButtonStringKey> = {
    key: 'buttonNameAlignLeft',
    unlocalizedText: 'Align left',
    iconName: 'AlignLeft',
    onClick: editor => {
        setAlignment(editor, Alignment.Left);
    },
};
