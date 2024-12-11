import { setTableTitle } from 'roosterjs-content-model-api';
import { showInputDialog } from 'roosterjs-react';
import type { RibbonButton } from 'roosterjs-react';

/**
 * Key of localized strings of Table title button
 */
export type TableTitleButtonStringKey = 'buttonTableTitle';

/**
 * "Table Title" button on the format ribbon
 */
export const tableTitleButton: RibbonButton<TableTitleButtonStringKey> = {
    key: 'buttonTableTitle',
    unlocalizedText: 'Add Table Title',
    iconName: 'OpenInNewWindow',
    flipWhenRtl: true,
    onClick: (editor, key, strings, uiUtility) => {
        showInputDialog(
            uiUtility,
            key,
            'Add table title',
            {
                title: {
                    labelKey: null,
                    unlocalizedLabel: null,
                    initValue: '',
                },
                description: {
                    labelKey: null,
                    unlocalizedLabel: null,
                    initValue: '',
                },
            },
            strings,
            (itemName, newValue, values) => {
                if (itemName == 'title') {
                    values.title = newValue;
                }
                if (itemName == 'description') {
                    values.description = newValue;
                }
                return values;
            }
        ).then(values => {
            editor.focus();
            setTableTitle(editor, values.title || '');
        });
    },
};
