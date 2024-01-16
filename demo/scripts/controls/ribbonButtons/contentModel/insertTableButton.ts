import ContentModelRibbonButton from './ContentModelRibbonButton';
import { getButtons, KnownRibbonButtonKey } from 'roosterjs-react';
import { insertTable } from 'roosterjs-content-model-api';
import { InsertTableButtonStringKey, RibbonButton } from 'roosterjs-react';

const originalPasteButton: RibbonButton<InsertTableButtonStringKey> = getButtons([
    KnownRibbonButtonKey.InsertTable,
])[0] as RibbonButton<InsertTableButtonStringKey>;

export const insertTableButton: ContentModelRibbonButton<InsertTableButtonStringKey> = {
    ...originalPasteButton,
    onClick: (editor, key) => {
        const { row, col } = parseKey(key);
        insertTable(editor, col, row);
    },
};

function parseKey(key: string): { row: number; col: number } {
    const [row, col] = key.split(',');
    return {
        row: parseInt(row),
        col: parseInt(col),
    };
}
