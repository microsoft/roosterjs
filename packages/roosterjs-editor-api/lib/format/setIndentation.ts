import blockFormat from '../utils/blockFormat';
import normalizeBlockquote from '../utils/normalizeBlockquote';
import {
    BlockElement,
    ExperimentalFeatures,
    IEditor,
    Indentation,
    KnownCreateElementDataIndex,
    RegionBase,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';
import {
    collapseNodesInRegion,
    createVListFromRegion,
    findClosestElementAncestor,
    getSelectedBlockElementsInRegion,
    getTagOfNode,
    isNodeInRegion,
    isWholeTableSelected,
    splitBalancedNodeRange,
    toArray,
    unwrap,
    VList,
    VTable,
    wrap,
} from 'roosterjs-editor-dom';
import type { CompatibleIndentation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Set indentation at selection
 * If selection contains bullet/numbering list, increase/decrease indentation will
 * increase/decrease the list level by one.
 * @param editor The editor instance
 * @param indentation The indentation option:
 * Indentation.Increase to increase indentation or Indentation.Decrease to decrease indentation
 */
export default function setIndentation(
    editor: IEditor,
    indentation: Indentation | CompatibleIndentation
) {
    const handler = indentation == Indentation.Increase ? indent : outdent;

    blockFormat(
        editor,
        (region, start, end) => {
            const blocks = getSelectedBlockElementsInRegion(region, true /*createBlockIfEmpty*/);
            const blockGroups: BlockElement[][] = [[]];

            for (let i = 0; i < blocks.length; i++) {
                const startNode = blocks[i].getStartNode();
                const vList = createVListFromRegion(
                    region,
                    true /*includeSiblingLists*/,
                    startNode
                );

                if (vList) {
                    while (blocks[i + 1] && vList.contains(blocks[i + 1].getStartNode())) {
                        i++;
                    }

                    const isTabKeyTextFeaturesEnabled = editor.isFeatureEnabled(
                        ExperimentalFeatures.TabKeyTextFeatures
                    );

                    if (
                        isTabKeyTextFeaturesEnabled &&
                        isFirstItem(vList, startNode) &&
                        shouldHandleWithBlockquotes(indentation, editor, startNode)
                    ) {
                        const block = editor.getBlockElementAtNode(vList.rootList);
                        if (block) {
                            blockGroups.push([block]);
                        }
                    } else {
                        if (start && end) {
                            indentation == Indentation.Decrease
                                ? vList.setIndentation(
                                      start,
                                      end,
                                      indentation,
                                      false /* softOutdent */,
                                      isTabKeyTextFeaturesEnabled /* preventItemRemoval */
                                  )
                                : vList.setIndentation(start, end, indentation);
                            vList.writeBack(
                                editor.isFeatureEnabled(
                                    ExperimentalFeatures.ReuseAllAncestorListElements
                                )
                            );
                            blockGroups.push([]);
                        }
                    }
                } else {
                    blockGroups[blockGroups.length - 1].push(blocks[i]);
                }
            }

            blockGroups.forEach(group => handler(region, group));
        },
        () => {
            const selection = editor.getSelectionRangeEx();
            if (
                selection.type == SelectionRangeTypes.TableSelection &&
                selection.coordinates &&
                isWholeTableSelected(new VTable(selection.table), selection.coordinates)
            ) {
                if (indentation == Indentation.Decrease) {
                    const quote = editor.getElementAtCursor('blockquote', selection.table);
                    if (quote) {
                        unwrap(quote);
                    }
                } else if (indentation == Indentation.Increase) {
                    wrap(selection.table, KnownCreateElementDataIndex.BlockquoteWrapper);
                }
                return false;
            }

            return true;
        },
        'setIndentation'
    );

    function indent(region: RegionBase, blocks: BlockElement[]) {
        const nodes = collapseNodesInRegion(region, blocks);
        wrap(nodes, KnownCreateElementDataIndex.BlockquoteWrapper);
        const quotesHandled: Node[] = [];
        nodes.forEach(node => normalizeBlockquote(node, quotesHandled));
    }
}

function outdent(region: RegionBase, blocks: BlockElement[]) {
    blocks.forEach(blockElement => {
        let node: Node | null = blockElement.collapseToSingleElement();
        const quote = findClosestElementAncestor(node, region.rootNode, 'blockquote');
        if (quote) {
            if (node == quote) {
                node = wrap(toArray(node.childNodes));
            }

            while (node && isNodeInRegion(region, node) && getTagOfNode(node) != 'BLOCKQUOTE') {
                node = splitBalancedNodeRange(node);
            }

            if (node && isNodeInRegion(region, node)) {
                unwrap(node);
            }
        }
    });
}

function isFirstItem(vList: VList, startNode: Node) {
    return (
        vList.items[0]?.getNode() == startNode &&
        vList.getListItemIndex(startNode) == (vList.getStart() || 1)
    );
}

function shouldHandleWithBlockquotes(
    indentation: Indentation | CompatibleIndentation,
    editor: IEditor,
    startNode: Node
) {
    return (
        indentation == Indentation.Increase || editor.getElementAtCursor('blockquote', startNode)
    );
}
