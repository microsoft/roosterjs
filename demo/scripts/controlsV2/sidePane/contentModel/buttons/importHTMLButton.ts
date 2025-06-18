import { createModelFromHtml } from 'roosterjs-content-model-core';
import { isBlockGroupOfType, mergeModel } from 'roosterjs-content-model-dom';
import { showInputDialog } from 'roosterjs-react';
import { trustedHTMLHandler } from '../../../../utils/trustedHTMLHandler';
import type { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Import Model" button on the format ribbon
 */
export const importHTMLButton: RibbonButton<'buttonNameImportHTML'> = {
    key: 'buttonNameImportHTML',
    unlocalizedText: 'Import HTML',
    iconName: 'FileHTML',
    isChecked: formatState => formatState.isBold,
    onClick: (editor, _, strings, uiUtilities) => {
        showInputDialog(
            uiUtilities,
            'buttonNameImportHTML',
            'Import HTML',
            {
                html: {
                    autoFocus: true,
                    labelKey: 'buttonNameImportHTML' as const,
                    unlocalizedLabel: 'Insert HTML',
                    initValue: '',
                },
            },
            strings,
            undefined /* onChange */,
            10 /* rows */
        ).then(values => {
            try {
                const htmlModel = createModelFromHtml(
                    values.html,
                    undefined /* options */,
                    trustedHTMLHandler
                );
                if (isBlockGroupOfType(htmlModel, 'Document')) {
                    editor.formatContentModel((model, context) => {
                        mergeModel(model, htmlModel, context, {
                            mergeFormat: 'preferSource',
                        });
                        return true;
                    });
                }
            } catch (e) {
                throw new Error('Invalid HTML');
            }
        });
    },
};
