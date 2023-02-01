import { ChangeSource } from 'roosterjs-editor-types';
import { getCurrentContentModel } from '../currentModel';
import { isContentModelEditor } from 'roosterjs-content-model';
import { RibbonButton } from 'roosterjs-react';

export const exportButton: RibbonButton<'buttonNameExport'> = {
    key: 'buttonNameExport',
    unlocalizedText: 'Create DOM tree',
    iconName: 'DOM',
    onClick: editor => {
        const model = getCurrentContentModel(editor);

        if (model && isContentModelEditor(editor)) {
            editor.addUndoSnapshot(() => {
                editor.focus();
                editor.setContentModel(model);
            }, ChangeSource.SetContent);
        }
    },
};
