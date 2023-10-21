import ContentModelRibbonButton from './ContentModelRibbonButton';
import { setIndentation } from 'roosterjs-content-model-editor';
import { DecreaseIndentButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Decrease indent" button on the format ribbon
 */
export const decreaseIndentButton: ContentModelRibbonButton<DecreaseIndentButtonStringKey> = {
    key: 'buttonNameDecreaseIndent',
    unlocalizedText: 'Decrease indent',
    iconName: 'DecreaseIndentLegacy',
    flipWhenRtl: true,
    onClick: editor => {
        setIndentation(editor, 'outdent');
    },
};
