import { Indentation } from 'roosterjs-editor-types';
import { setIndentation } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { IncreaseIndentButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Increase indent" button on the format ribbon
 */
export const increaseIndent: RibbonButton<IncreaseIndentButtonStringKey> = {
    key: 'buttonNameIncreaseIndent',
    unlocalizedText: 'Increase indent',
    iconName: 'IncreaseIndentLegacy',
    flipWhenRtl: true,
    onClick: editor => {
        setIndentation(editor, Indentation.Increase);
    },
};
