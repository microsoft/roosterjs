import { AnnounceFeature, AnnounceFeatureParam } from '../AnnounceFeature';
import { cacheGetEventData, isNodeEmpty, VList } from 'roosterjs-editor-dom';
import { Keys } from 'roosterjs-editor-types/lib/enum/Keys';
import type { IEditor, PluginKeyboardEvent } from 'roosterjs-editor-types';
import { KnownAnnounceStrings } from 'roosterjs-editor-types';

const announceNewListItemNumber: AnnounceFeature = {
    keys: [Keys.ENTER],
    shouldHandle: ({ event, editor }: AnnounceFeatureParam) => {
        const li = cacheGetElement(event, editor, 'LI');
        const ol = cacheGetElement(event, editor, 'OL');
        return !!(ol && li && !isNodeEmpty(li));
    },
    handle: ({ event, editor, announceCallback }: AnnounceFeatureParam) => {
        const li = cacheGetElement(event, editor, 'LI');
        const ol = cacheGetElement(event, editor, 'OL') as HTMLOListElement | HTMLUListElement;
        if (!ol || !li) {
            return;
        }

        const vList = new VList(ol);
        const index = vList.getListItemIndex(li) + 1;

        if (index != -1) {
            announceCallback({
                defaultStrings: KnownAnnounceStrings.AnnounceNewListItemNumber,
                formatStrings: [index.toString()],
            });
        }
    },
};

export default announceNewListItemNumber;

function cacheGetElement(
    event: PluginKeyboardEvent,
    editor: IEditor,
    selector: string
): Node | null {
    return cacheGetEventData(event, 'GET_' + selector, () => editor.getElementAtCursor(selector));
}
