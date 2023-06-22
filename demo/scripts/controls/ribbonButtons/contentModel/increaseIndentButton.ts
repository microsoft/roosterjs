import { IncreaseIndentButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor, setIndentation } from 'roosterjs-content-model-editor';

/**
 * @internal
 * "Increase indent" button on the format ribbon
 */
export const increaseIndentButton: RibbonButton<IncreaseIndentButtonStringKey> = {
    key: 'buttonNameIncreaseIndent',
    unlocalizedText: 'Increase indent',
    iconName: 'IncreaseIndentLegacy',
    flipWhenRtl: true,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            setIndentation(editor, 'indent');
        }
    },
};
