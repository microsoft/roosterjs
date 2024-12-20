import { getFirstSelectedTable, mutateBlock } from 'roosterjs-content-model-dom';
import { IEditor } from 'roosterjs-content-model-types';
import { RibbonButton, showInputDialog } from 'roosterjs-react';

/**
 * @internal
 * "Image Border Style" button on the format ribbon
 */
export const tableTitleButton: RibbonButton<'buttonNameTableTitle'> = {
    key: 'buttonNameTableTitle',
    unlocalizedText: 'Table Title',
    iconName: 'TableComputed',
    isDisabled: formatState => !formatState.isInTable,
    onClick: (editor, _, strings, uiUtilities) => {
        const items = {
            title: {
                autoFocus: true,
                labelKey: 'buttonNameTableTitle' as const,
                unlocalizedLabel: 'Title',
                initValue: '',
            },
        };

        showInputDialog(
            uiUtilities,
            'buttonNameTableTitle',
            'Insert Table',
            items,
            strings,
            (itemName, newValue, values) => {
                if (itemName == 'title') {
                    values.title = newValue;
                    return values;
                } else {
                    return null;
                }
            }
        ).then(result => {
            editor.focus();
            if (result && result.title) {
                insertTableTitle(editor, result.title);
            }
        });
    },
};

const insertTableTitle = (editor: IEditor, title: string) => {
    editor.formatContentModel(model => {
        const table = getFirstSelectedTable(model)[0];
        if (table) {
            mutateBlock(table).format.title = title;
            return true;
        }
        return false;
    });
};
