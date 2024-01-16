import ContentModelRibbonButton from './ContentModelRibbonButton';
import { SuperscriptButtonStringKey } from 'roosterjs-react';
import { toggleSuperscript } from 'roosterjs-content-model-api';

/**
 * @internal
 * "Superscript" button on the format ribbon
 */
export const superscriptButton: ContentModelRibbonButton<SuperscriptButtonStringKey> = {
    key: 'buttonNameSuperscript',
    unlocalizedText: 'Superscript',
    iconName: 'Superscript',
    isChecked: formatState => formatState.isSuperscript,
    onClick: editor => {
        toggleSuperscript(editor);

        return true;
    },
};
