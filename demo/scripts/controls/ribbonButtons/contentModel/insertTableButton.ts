import { getButtons, KnownRibbonButtonKey } from 'roosterjs-react';
import { insertTable } from 'roosterjs-content-model';
import { InsertTableButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor } from 'roosterjs-content-model';

const originalPasteButton: RibbonButton<InsertTableButtonStringKey> = getButtons([
    KnownRibbonButtonKey.InsertTable,
])[0] as RibbonButton<InsertTableButtonStringKey>;

export const insertTableButton: RibbonButton<InsertTableButtonStringKey> = {
    ...originalPasteButton,
    onClick: (editor, key) => {
        if (isContentModelEditor(editor)) {
            const { row, col } = parseKey(key);
            insertTable(editor, col, row);
        }
    },
};

function parseKey(key: string): { row: number; col: number } {
    const [row, col] = key.split(',');
    return {
        row: parseInt(row),
        col: parseInt(col),
    };
}
