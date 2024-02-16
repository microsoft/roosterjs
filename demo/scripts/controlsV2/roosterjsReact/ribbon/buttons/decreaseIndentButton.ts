import { setIndentation } from 'roosterjs-content-model-api';
import type { DecreaseIndentButtonStringKey } from '../type/RibbonButtonStringKeys';
import type { RibbonButton } from '../type/RibbonButton';

/**
 * @internal
 * "Decrease indent" button on the format ribbon
 */
export const decreaseIndentButton: RibbonButton<DecreaseIndentButtonStringKey> = {
    key: 'buttonNameDecreaseIndent',
    unlocalizedText: 'Decrease indent',
    iconName: 'DecreaseIndentLegacy',
    flipWhenRtl: true,
    category: 'format',
    onClick: editor => {
        setIndentation(editor, 'outdent');
    },
};
