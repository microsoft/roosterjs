import { applyTableFormat, ContentModelBlockType } from 'roosterjs-content-model';
import { ChangeSource } from 'roosterjs-editor-types';
import { isHackedEditor } from '../../../hackedEditor/isHackedEditor';
import { PREDEFINED_STYLES } from '../../shared/PredefinedTableStyles';
import { RibbonButton } from 'roosterjs-react';

export const formatTable: RibbonButton<'ribbonButtonTableFormat'> = {
    key: 'ribbonButtonTableFormat',
    iconName: 'TableComputed',
    unlocalizedText: 'Format Table',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: {
            DEFAULT: 'Default',
            DEFAULT_WITH_BACKGROUND_COLOR: 'Default with background color',
            GRID_WITHOUT_BORDER: 'Gride without border',
            LIST: 'list',
            BANDED_ROWS_FIRST_COLUMN_NO_BORDER: 'Banded rows first column no border',
            EXTERNAL: 'External',
            NO_HEADER_VERTICAL: 'No header vertical',
            ESPECIAL_TYPE_1: 'Especial type 1',
            ESPECIAL_TYPE_2: 'Especial type 2',
            ESPECIAL_TYPE_3: 'Especial type 3',
            CLEAR: 'Clear',
        },
    },
    onClick: (editor, key) => {
        const table = editor.queryElements('table')[0];
        const format = PREDEFINED_STYLES[key]?.('#ABABAB', '#ABABAB20');
        const parent = table.parentNode;

        editor.addUndoSnapshot(() => {
            if (table && isHackedEditor(editor) && format && parent) {
                const model = editor.getContentModel(table);
                const tableModel = model.blocks[0];

                if (tableModel?.blockType == ContentModelBlockType.Table) {
                    applyTableFormat(tableModel, format);

                    const [newFragment] = editor.getDOMFromContentModel(model);

                    parent.replaceChild(newFragment, table);
                }
            }
        }, ChangeSource.Format);
    },
};
