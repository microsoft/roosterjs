import getAnnounceDataForList from '../../../pluginUtils/announceData/getAnnounceDataForList';
import { Keys } from 'roosterjs-editor-types';
import type { AnnounceFeature } from '../AnnounceFeature';

const LIST_SELECTOR = 'OL,UL';
const LIST_ITEM_SELECTOR = 'LI';

const announceNewListItemNumber: AnnounceFeature = {
    keys: [Keys.ENTER],
    shouldHandle: editor => {
        const li = editor.getElementAtCursor(LIST_ITEM_SELECTOR);
        const list = editor.getElementAtCursor(LIST_SELECTOR);
        return (!!(list && li) && getAnnounceDataForList(list, li)) || false;
    },
};

export default announceNewListItemNumber;
