import { getButtons, KnownRibbonButtonKey } from 'roosterjs-react';
import { insertTable as insertTableApi } from 'roosterjs-content-model';
import { InsertTableButtonStringKey, RibbonButton } from 'roosterjs-react';

const originalPasteButton: RibbonButton<InsertTableButtonStringKey> = getButtons([
    KnownRibbonButtonKey.InsertTable,
])[0] as RibbonButton<InsertTableButtonStringKey>;

export const insertTable: RibbonButton<InsertTableButtonStringKey> = {
    ...originalPasteButton,
    onClick: (editor, key) => {
        const { row, col } = parseKey(key);
        insertTableApi(editor, col, row);
    },
};

function parseKey(key: string): { row: number; col: number } {
    const [row, col] = key.split(',');
    return {
        row: parseInt(row),
        col: parseInt(col),
    };
}
