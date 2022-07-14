import toggleListType from '../utils/toggleListType';
import { IEditor, ListType, NumberingListType } from 'roosterjs-editor-types';
import type { CompatibleNumberingListType } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Toggle numbering at selection
 * If selection contains numbering in deep level, toggle numbering will decrease the numbering level by one
 * If selection contains bullet list, toggle numbering will convert the bullet list into number list
 * If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 * realization of browser execCommand API
 * @param editor The editor instance
 * @param startNumber (Optional) Start number of the list
 * @param listStyle (Optional) The style of the numbering list. If not defined, the style will be set to decimal.
 * @param apiNameOverride (Optional) Set a new api name, if empty the api name will be 'toggleListType'.
 */
export default function toggleNumbering(
    editor: IEditor,
    startNumber?: number,
    listStyle?: NumberingListType | CompatibleNumberingListType,
    apiNameOverride?: string
) {
    toggleListType(
        editor,
        ListType.Ordered,
        startNumber,
        undefined /* includeSiblingLists */,
        listStyle,
        undefined /* unorderedStyle */,
        apiNameOverride
    );
}
