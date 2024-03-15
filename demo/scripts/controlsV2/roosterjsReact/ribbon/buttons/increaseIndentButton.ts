import { setIndentation } from 'roosterjs-content-model-api';
import type { IncreaseIndentButtonStringKey } from '../type/RibbonButtonStringKeys';
import type { RibbonButton } from '../type/RibbonButton';

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
        setIndentation(editor, 'indent');
    },
};
