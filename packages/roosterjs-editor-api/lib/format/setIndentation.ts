import blockFormat from '../utils/blockFormat';
import {
    BlockElement,
    IEditor,
    Indentation,
    KnownCreateElementDataIndex,
    RegionBase,
} from 'roosterjs-editor-types';
import {
    collapseNodesInRegion,
    createVListFromRegion,
    findClosestElementAncestor,
    getSelectedBlockElementsInRegion,
    getTagOfNode,
    isNodeInRegion,
    splitBalancedNodeRange,
    toArray,
    unwrap,
    wrap,
} from 'roosterjs-editor-dom';

/**
 * Set indentation at selection
 * If selection contains bullet/numbering list, increase/decrease indentation will
 * increase/decrease the list level by one.
 * @param editor The editor instance
 * @param indentation The indentation option:
 * Indentation.Increase to increase indentation or Indentation.Decrease to decrease indentation
 */
export default function setIndentation(editor: IEditor, indentation: Indentation) {
    const handler = indentation == Indentation.Increase ? indent : outdent;

    blockFormat(editor, (region, start, end) => {
        const blocks = getSelectedBlockElementsInRegion(region, true /*createBlockIfEmpty*/);
        const blockGroups: BlockElement[][] = [[]];

        for (let i = 0; i < blocks.length; i++) {
            const startNode = blocks[i].getStartNode();
            const vList = createVListFromRegion(region, true /*includeSiblingLists*/, startNode);

            if (vList) {
                while (blocks[i + 1] && vList.contains(blocks[i + 1].getStartNode())) {
                    i++;
                }

                if (
                    vList.items[0]?.getNode() == startNode &&
                    vList.getListItemIndex(startNode) == vList.getStart() &&
                    (indentation == Indentation.Increase ||
                        editor.getElementAtCursor('blockquote', startNode))
                ) {
                    const block = editor.getBlockElementAtNode(vList.rootList);
                    blockGroups.push([block]);
                } else {
                    vList.setIndentation(start, end, indentation);
                    vList.writeBack();
                    blockGroups.push([]);
                }
            } else {
                blockGroups[blockGroups.length - 1].push(blocks[i]);
            }
        }

        blockGroups.forEach(group => handler(region, group));
    });
}

function indent(region: RegionBase, blocks: BlockElement[]) {
    const nodes = collapseNodesInRegion(region, blocks);
    wrap(nodes, KnownCreateElementDataIndex.BlockquoteWrapper);
}

function outdent(region: RegionBase, blocks: BlockElement[]) {
    blocks.forEach(blockElement => {
        let node = blockElement.collapseToSingleElement();
        const quote = findClosestElementAncestor(node, region.rootNode, 'blockquote');
        if (quote) {
            if (node == quote) {
                node = wrap(toArray(node.childNodes));
            }

            while (isNodeInRegion(region, node) && getTagOfNode(node) != 'BLOCKQUOTE') {
                node = splitBalancedNodeRange(node);
            }

            if (isNodeInRegion(region, node)) {
                unwrap(node);
            }
        }
    });
}
