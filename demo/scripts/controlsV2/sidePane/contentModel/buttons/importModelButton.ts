import { ContentModelDocument } from 'roosterjs-content-model-types';
import { showInputDialog } from '../../../roosterjsReact/inputDialog/utils/showInputDialog';
import type { RibbonButton } from '../../../roosterjsReact/ribbon/type/RibbonButton';

/**
 * @internal
 * "Import Model" button on the format ribbon
 */
export const importModelButton: RibbonButton<'buttonNameImportModel'> = {
    key: 'buttonNameImportModel',
    unlocalizedText: 'Import Model',
    iconName: 'Installation',
    isChecked: formatState => formatState.isBold,
    onClick: (editor, _, strings, uiUtilities) => {
        showInputDialog(
            uiUtilities,
            'buttonNameImportModel',
            'Import Model',
            {
                model: {
                    autoFocus: true,
                    labelKey: 'buttonNameImportModel' as const,
                    unlocalizedLabel: 'Insert model',
                    initValue: '',
                },
            },
            strings,
            undefined /* onChange */,
            10 /* rows */
        ).then(values => {
            const importedModel = JSON.parse(values.model) as ContentModelDocument;
            editor.formatContentModel(model => {
                if (importedModel) {
                    model.blocks = importedModel.blocks;
                    return true;
                }
                return false;
            });
        });
    },
};
