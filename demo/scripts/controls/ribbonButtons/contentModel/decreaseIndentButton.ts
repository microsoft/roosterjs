import isContentModelEditor from '../../editor/isContentModelEditor';
import { DecreaseIndentButtonStringKey, RibbonButton } from 'roosterjs-react';
import { setIndentation } from 'roosterjs-content-model';

/**
 * @internal
 * "Decrease indent" button on the format ribbon
 */
export const decreaseIndentButton: RibbonButton<DecreaseIndentButtonStringKey> = {
    key: 'buttonNameDecreaseIndent',
    unlocalizedText: 'Decrease indent',
    iconName: 'DecreaseIndentLegacy',
    flipWhenRtl: true,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            setIndentation(editor, 'outdent');
        }
    },
};
