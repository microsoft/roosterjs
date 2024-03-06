import { toggleSuperscript } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { SuperscriptButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Superscript" button on the format ribbon
 */
export const superscriptButton: RibbonButton<SuperscriptButtonStringKey> = {
    key: 'buttonNameSuperscript',
    unlocalizedText: 'Superscript',
    iconName: 'Superscript',
    isChecked: formatState => formatState.isSuperscript,
    onClick: editor => {
        toggleSuperscript(editor);
    },
};
