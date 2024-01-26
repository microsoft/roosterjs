import { getCurrentContentModel } from '../currentModel';
import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { RibbonButton } from 'roosterjs-react';

export const exportButton: RibbonButton<'buttonNameExport'> = {
    key: 'buttonNameExport',
    unlocalizedText: 'Create DOM tree',
    iconName: 'DOM',
    onClick: editor => {
        const model = getCurrentContentModel(editor);

        if (model && isContentModelEditor(editor)) {
            editor.formatContentModel(currentModel => {
                currentModel.blocks = model.blocks;

                return true;
            });
        }
    },
};
