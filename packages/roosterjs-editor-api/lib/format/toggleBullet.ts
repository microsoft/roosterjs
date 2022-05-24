import toggleListType from '../utils/toggleListType';
import { BulletListType, IEditor, ListType } from 'roosterjs-editor-types';
import { CompatibleBulletListType } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Toggle bullet at selection
 * If selection contains bullet in deep level, toggle bullet will decrease the bullet level by one
 * If selection contains number list, toggle bullet will convert the number list into bullet list
 * If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 * browser execCommand API
 * @param editor The editor instance
 * @param listStyle (Optional) the style of the bullet list. If If not defined, the style will be set to disc.
 */
export default function toggleBullet(
    editor: IEditor,
    listStyle?: BulletListType | CompatibleBulletListType
) {
    toggleListType(
        editor,
        ListType.Unordered,
        undefined /* startNumber */,
        false /* includeSiblingLists */,
        listStyle
    );
}
