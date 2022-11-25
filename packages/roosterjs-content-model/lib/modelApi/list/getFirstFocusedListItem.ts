import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { getOperationalBlocks } from '../common/getOperationalBlocks';
import { getSelections } from '../selection/getSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';

/**
 * @internal
 */
export function getFirstFocusedListItem(model: ContentModelDocument): ContentModelListItem | null {
    const paragraphs = getSelections(model);
    const currentListItem = getOperationalBlocks<ContentModelListItem>(paragraphs, ['ListItem'])[0];

    return currentListItem && isBlockGroupOfType(currentListItem, 'ListItem')
        ? currentListItem
        : null;
}
