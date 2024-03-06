import { getCurrentContentModel } from '../currentModel';
import { RibbonButton } from '../../../../controlsV2/roosterjsReact/ribbon';

export const exportButton: RibbonButton<'buttonNameExport'> = {
    key: 'buttonNameExport',
    unlocalizedText: 'Create DOM tree',
    iconName: 'DOM',
    onClick: editor => {
        const model = getCurrentContentModel();

        if (model) {
            editor.formatContentModel(currentModel => {
                currentModel.blocks = model.blocks;

                return true;
            });
        }
    },
};
