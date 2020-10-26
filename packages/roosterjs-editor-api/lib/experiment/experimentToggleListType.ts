import blockFormat from '../utils/blockFormat';
import { createVListFromRegion, getBlockElementAtNode } from 'roosterjs-editor-dom';
import { IEditor, ListType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export default function experimentToggleListType(editor: IEditor, listType: ListType): void;
export default function experimentToggleListType(
    editor: IEditor,
    listType: ListType.Ordered,
    startNumber: number
): void;

export default function experimentToggleListType(
    editor: IEditor,
    listType: ListType,
    startNumber?: number
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
                : createVListFromRegion(region, true /*includeSiblingLists*/);

        if (vList) {
            vList.changeListType(start, end, listType);
            vList.writeBack();
        }
    });
}
