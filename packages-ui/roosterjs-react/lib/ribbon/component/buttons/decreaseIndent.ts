import RibbonButton from '../../type/RibbonButton';
import { DecreaseIndentButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { Indentation } from 'roosterjs-editor-types';
import { setIndentation } from 'roosterjs-editor-api';

/**
 * @internal
 * "Decrease indent" button on the format ribbon
 */
export const decreaseIndent: RibbonButton<DecreaseIndentButtonStringKey> = {
    key: 'buttonNameDecreaseIndent',
    unlocalizedText: 'Decrease indent',
    iconName: 'DecreaseIndentLegacy',
    flipWhenRtl: true,
    onClick: editor => {
        setIndentation(editor, Indentation.Decrease);
    },
};
