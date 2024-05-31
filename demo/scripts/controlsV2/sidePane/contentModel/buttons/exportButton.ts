import { getCurrentContentModel } from '../currentModel';
import { mutateBlock } from 'roosterjs-content-model-dom';
import { RibbonButton } from '../../../roosterjsReact/ribbon';

export const exportButton: RibbonButton<'buttonNameExport'> = {
    key: 'buttonNameExport',
    unlocalizedText: 'Create DOM tree',
    iconName: 'DOM',
    onClick: editor => {
        const model = getCurrentContentModel();

        if (model) {
            editor.formatContentModel(currentModel => {
                mutateBlock(currentModel).blocks = model.blocks;

                return true;
            });
        }
    },
};
