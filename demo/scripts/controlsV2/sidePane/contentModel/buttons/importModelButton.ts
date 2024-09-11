import { isBlockGroupOfType } from 'roosterjs-content-model-dom';
import { showInputDialog } from 'roosterjs-react';
import type { RibbonButton } from 'roosterjs-react';

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
            try {
                const importedModel = JSON.parse(values.model);
                if (isBlockGroupOfType(importedModel, 'Document')) {
                    editor.formatContentModel(model => {
                        const mutableModel = model;

                        mutableModel.blocks = importedModel.blocks;
                        mutableModel.format = importedModel.format;

                        return true;
                    });
                }
            } catch (e) {
                throw new Error('Invalid model');
            }
        });
    },
};
