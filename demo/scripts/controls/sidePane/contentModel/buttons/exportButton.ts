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
            const fragment = editor.createFragmentFromContentModel(model);
            const win = window.open('about:blank');

            win.document.body.appendChild(fragment);
        }
    },
};
