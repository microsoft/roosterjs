import { DOMSelection, IStandaloneEditor } from 'roosterjs-content-model-types';
import { getSelectedListItem } from './utils/getListItemSelected';
import { normalizeContentModel } from 'roosterjs-content-model-dom/lib';

export const keyboardAdjustList = (editor: IStandaloneEditor, rawEvent: KeyboardEvent) => {
    const selection = editor.getDOMSelection();
    if (shouldAdjustList(selection, rawEvent)) {
        editor.formatContentModel((model, context) => {
            const listItem = getSelectedListItem(model);
            if (listItem && listItem.format) {
                normalizeContentModel(model);
                return true;
            }
            return false;
        });
    }
};

const shouldAdjustList = (selection: DOMSelection | null, rawEvent: KeyboardEvent) => {
    return (
        selection &&
        selection.type == 'range' &&
        selection.range.collapsed &&
        rawEvent.key == 'Enter'
    );
};
