import ContentModelRibbonButton from './ContentModelRibbonButton';
import { setIndentation } from 'roosterjs-content-model-editor';
import { IncreaseIndentButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Increase indent" button on the format ribbon
 */
export const increaseIndentButton: ContentModelRibbonButton<IncreaseIndentButtonStringKey> = {
    key: 'buttonNameIncreaseIndent',
    unlocalizedText: 'Increase indent',
    iconName: 'IncreaseIndentLegacy',
    flipWhenRtl: true,
    onClick: editor => {
        setIndentation(editor, 'indent');
    },
};
