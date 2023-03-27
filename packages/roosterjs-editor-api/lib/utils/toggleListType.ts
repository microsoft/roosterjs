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
 * @param orderedStyle (Optional) the style of an ordered. If not defined, the style will be set to decimal.
 * @param unorderedStyle (Optional) the style of an unordered list. If not defined, the style will be set to disc.
 * @param apiNameOverride (Optional) Set a new api name, if empty the api name will be 'toggleListType'.
 */
export default function toggleListType(
    editor: IEditor,
    listType: ListType | CompatibleListType,
    startNumber: number = 0,
    includeSiblingLists: boolean = true,
    orderedStyle?: NumberingListType | CompatibleNumberingListType,
    unorderedStyle?: BulletListType | CompatibleBulletListType,
    apiNameOverride?: string
) {
    blockFormat(
        editor,
        (region, start, end, chains) => {
            const chain =
                startNumber > 0 && chains.filter(chain => chain.canAppendAtCursor(startNumber))[0];
            const block = getBlockElementAtNode(
                region.rootNode,
                start?.node ?? null
            )?.collapseToSingleElement();
            if (!block) {
                return;
            }
            const vList =
                chain && end && start?.equalTo(end)
                    ? chain.createVListAtBlock(block, startNumber)
                    : createVListFromRegion(
                          region,
                          startNumber === 1 ? false : includeSiblingLists
                      );

            if (vList && start && end) {
                vList.changeListType(start, end, listType);
                if (editor.isFeatureEnabled(ExperimentalFeatures.AutoFormatList)) {
                    vList.setListStyleType(orderedStyle, unorderedStyle);
                }
                vList.writeBack(
                    editor.isFeatureEnabled(ExperimentalFeatures.ReuseAllAncestorListElements)
                );
            }
        },
        undefined /* beforeRunCallback */,
        apiNameOverride || 'toggleListType'
    );
}
