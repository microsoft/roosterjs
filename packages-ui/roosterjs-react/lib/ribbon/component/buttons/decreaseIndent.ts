import RibbonButton from '../../type/RibbonButton';
import { DecreaseIndentButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { Indentation } from 'roosterjs-editor-types';
import { setIndentation } from 'roosterjs-editor-api';

/**
 * @internal
 * "Decrease indent" button on the format ribbon
 */
export const decreaseIndent: RibbonButton<DecreaseIndentButtonStringKey> = {
    key: 'buttonNameDecreaseIntent',
    unlocalizedText: 'Decrease indent',
    iconName: 'DecreaseIndentLegacy',
    onClick: editor => {
        setIndentation(editor, Indentation.Decrease);
    },
};
