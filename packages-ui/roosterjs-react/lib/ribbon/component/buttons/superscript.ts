import { toggleSuperscript } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { SuperscriptButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Superscript" button on the format ribbon
 */
export const superscript: RibbonButton<SuperscriptButtonStringKey> = {
    key: 'buttonNameSuperscript',
    unlocalizedText: 'Superscript',
    iconName: 'Superscript',
    isChecked: formatState => !!formatState.isSuperscript,
    onClick: editor => {
        toggleSuperscript(editor);
        return true;
    },
};
