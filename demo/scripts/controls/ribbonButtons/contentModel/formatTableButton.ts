import { formatTable } from 'roosterjs-content-model';
import { isContentModelEditor } from 'roosterjs-content-model';
import { PREDEFINED_STYLES } from '../../sidePane/shared/PredefinedTableStyles';
import { RibbonButton } from 'roosterjs-react';

export const formatTableButton: RibbonButton<'ribbonButtonTableFormat'> = {
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
        const format = PREDEFINED_STYLES[key]?.('#ABABAB', '#ABABAB20');

        if (format && isContentModelEditor(editor)) {
            formatTable(editor, format);
        }
    },
};
