import { getFirstSelectedTable } from 'roosterjs-content-model-dom';
import { setModelIndentation } from 'roosterjs-content-model-api';
import type { ContentModelDocument, ContentModelTable } from 'roosterjs-content-model-types';

/**
 * When the whole table is selected, indent or outdent the whole table with setModelIndentation.
 * @internal
 */
export function handleTabOnTable(model: ContentModelDocument, rawEvent: KeyboardEvent) {
    const tableModel = getFirstSelectedTable(model)[0];
    if (tableModel && isWholeTableSelected(tableModel)) {
        setModelIndentation(model, rawEvent.shiftKey ? 'outdent' : 'indent');
        rawEvent.preventDefault();
        return true;
    }
    return false;
}

function isWholeTableSelected(tableModel: ContentModelTable) {
    return (
        tableModel.rows[0]?.cells[0]?.isSelected &&
        tableModel.rows[tableModel.rows.length - 1]?.cells[tableModel.widths.length - 1]?.isSelected
    );
}
