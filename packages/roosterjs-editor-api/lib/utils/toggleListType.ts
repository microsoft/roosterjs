import blockFormat from '../utils/blockFormat';
import { createVListFromRegion, getBlockElementAtNode } from 'roosterjs-editor-dom';
import {
    BulletListType,
    ExperimentalFeatures,
    IEditor,
    ListType,
    NumberingListType,
} from 'roosterjs-editor-types';
import type {
    CompatibleBulletListType,
    CompatibleListType,
    CompatibleNumberingListType,
} from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Toggle List Type at selection
 * If ListType Provided is Ordered:
 *      If selection contains numbering in deep level, toggle numbering will decrease the numbering level by one
 *      If selection contains bullet list, toggle numbering will convert the bullet list into number list
 *      If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 *       realization of browser execCommand API
 * If ListType Provided is Unordered:
 *      If selection contains bullet in deep level, toggle bullet will decrease the bullet level by one
 *      If selection contains number list, toggle bullet will convert the number list into bullet list
 *      If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 *      browser execCommand API
 * @param editor The editor instance
 * @param listType The list type to toggle
 * @param startNumber (Optional) Start number of the list
 * @param includeSiblingLists Sets wether the operation should include Sibling Lists, by default true
 * @param listStyle (Optional) the style of an ordered or unordered list. If If not defined, the style will be set to disc or decimal.
 */
export default function toggleListType(
    editor: IEditor,
    listType: ListType | CompatibleListType,
    startNumber?: number,
    includeSiblingLists: boolean = true,
    listStyle?:
        | BulletListType
        | NumberingListType
        | CompatibleBulletListType
        | CompatibleNumberingListType
) {
    blockFormat(editor, (region, start, end, chains) => {
        const chain =
            startNumber > 0 && chains.filter(chain => chain.canAppendAtCursor(startNumber))[0];
        const vList =
            chain && start.equalTo(end)
                ? chain.createVListAtBlock(
                      getBlockElementAtNode(region.rootNode, start.node)?.collapseToSingleElement(),
                      startNumber
                  )
                : createVListFromRegion(region, includeSiblingLists);

        if (vList) {
            vList.changeListType(start, end, listType);
            if (editor.isFeatureEnabled(ExperimentalFeatures.AutoFormatList)) {
                vList.setListStyleType(listType, listStyle);
            }
            vList.writeBack();
        }
    });
}
