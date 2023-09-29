import { cacheGetEventData, getAnnounceDataForList, isNodeEmpty } from 'roosterjs-editor-dom';
import { Keys } from 'roosterjs-editor-types';
import type { AnnounceFeature, AnnounceFeatureParam } from '../AnnounceFeature';
import type { IEditor, PluginKeyboardEvent } from 'roosterjs-editor-types';

const announceNewListItemNumber: AnnounceFeature = {
    keys: [Keys.ENTER],
    shouldHandle: ({ event, editor }) => {
        const li = cacheGetElement(event, editor, 'LI');
        const ol = cacheGetElement(event, editor, 'OL,UL');
        return !!(ol && li && !isNodeEmpty(li));
    },
    handle: ({ event, editor, announceCallback }: AnnounceFeatureParam) => {
        const li = cacheGetElement(event, editor, 'LI');
        const list = cacheGetElement(event, editor, 'OL,UL') as HTMLOListElement | HTMLUListElement;

        const data = getAnnounceDataForList(list, li);

        if (data) {
            announceCallback(data);
        }
    },
};

export default announceNewListItemNumber;

function cacheGetElement(
    event: PluginKeyboardEvent,
    editor: IEditor,
    selector: string
): HTMLElement | null {
    return cacheGetEventData(event, 'GET_' + selector, () => editor.getElementAtCursor(selector));
}
