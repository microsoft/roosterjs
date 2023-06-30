import { isContentModelEditor, setDirection } from 'roosterjs-content-model-editor';
import { RibbonButton, RtlButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Right to left" button on the format ribbon
 */
export const rtlButton: RibbonButton<RtlButtonStringKey> = {
    key: 'buttonNameRtl',
    unlocalizedText: 'Right to left',
    iconName: 'BidiRtl',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            setDirection(editor, 'rtl');
        }
        return true;
    },
};
