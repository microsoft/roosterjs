import ContentModelRibbonButton from '../../../ribbonButtons/contentModel/ContentModelRibbonButton';
import { getCurrentContentModel } from '../currentModel';

export const exportButton: ContentModelRibbonButton<'buttonNameExport'> = {
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
