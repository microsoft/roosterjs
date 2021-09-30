import toggleListType from '../utils/toggleListType';
import { IEditor, ListType } from 'roosterjs-editor-types';

/**
 * Toggle bullet at selection
 * If selection contains bullet in deep level, toggle bullet will decrease the bullet level by one
 * If selection contains number list, toggle bullet will convert the number list into bullet list
 * If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 * browser execCommand API
 * @param editor The editor instance
 */
export default function toggleBullet(editor: IEditor) {
    toggleListType(editor, ListType.Unordered);
}
