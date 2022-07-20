import toggleListType from '../utils/toggleListType';
import { BulletListType, IEditor, ListType } from 'roosterjs-editor-types';
import type { CompatibleBulletListType } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Toggle bullet at selection
 * If selection contains bullet in deep level, toggle bullet will decrease the bullet level by one
 * If selection contains number list, toggle bullet will convert the number list into bullet list
 * If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 * browser execCommand API
 * @param editor The editor instance
 * @param listStyle (Optional) the style of the bullet list. If not defined, the style will be set to disc.
 * @param apiNameOverride (Optional) Set a new api name, if empty the api name will be 'toggleListType'.
 */
export default function toggleBullet(
    editor: IEditor,
    listStyle?: BulletListType | CompatibleBulletListType,
    apiNameOverride?: string
) {
    toggleListType(
        editor,
        ListType.Unordered,
        undefined /* startNumber */,
        false /* includeSiblingLists */,
        undefined /** orderedStyle  */,
        listStyle,
        apiNameOverride
    );
}
