import RibbonButton from '../../type/RibbonButton';
import { SuperscriptButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { toggleSuperscript } from 'roosterjs-editor-api';

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
