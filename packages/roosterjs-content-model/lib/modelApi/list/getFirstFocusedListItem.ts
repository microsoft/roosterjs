import { ContentModelDocument } from '../../publicTypes/block/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/block/group/ContentModelListItem';
import { getOperationalBlocks } from '../common/getOperationalBlocks';
import { getSelectedParagraphs } from '../selection/getSelectedParagraphs';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';

/**
 * @internal
 */
export function getFirstFocusedListItem(model: ContentModelDocument): ContentModelListItem | null {
    const paragraphs = getSelectedParagraphs(model);
    const currentListItem = getOperationalBlocks<ContentModelListItem>(paragraphs, ['ListItem'])[0];

    return currentListItem && isBlockGroupOfType(currentListItem, 'ListItem')
        ? currentListItem
        : null;
}
