import toggleListType from '../utils/toggleListType';
import { BulletListType, IEditor, ListType, NumberingListType } from 'roosterjs-editor-types';

/**
 * Toggle numbering at selection
 * If selection contains numbering in deep level, toggle numbering will decrease the numbering level by one
 * If selection contains bullet list, toggle numbering will convert the bullet list into number list
 * If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 * realization of browser execCommand API
 * @param editor The editor instance
 * @param startNumber (Optional) Start number of the list
 */
export default function toggleNumbering(
    editor: IEditor,
    startNumber?: number,
    styleType?: NumberingListType | BulletListType
) {
    toggleListType(
        editor,
        ListType.Ordered,
        startNumber,
        false /** includeSiblingLists */,
        styleType
    );
}
