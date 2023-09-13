import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import { createSelectionMarker } from 'roosterjs-content-model-dom';
import { isContentModelEditor, TableSelectionContext } from 'roosterjs-content-model-editor';
import { iterateSelections } from 'roosterjs-content-model-editor/lib/modelApi/selection/iterateSelections';
import { wrap } from 'roosterjs-editor-dom';
import {
    ContentModelBlock,
    ContentModelBlockBase,
    ContentModelBlockGroup,
    ContentModelBlockGroupBase,
    ContentModelBlockGroupType,
    ContentModelBlockType,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelTable,
    ContentModelText,
} from 'roosterjs-content-model-types';

type AnyBlock = Partial<
    ContentModelBlockBase<ContentModelBlockType> &
        ContentModelBlockGroupBase<ContentModelBlockGroupType> & {
            row?: number;
            cell?: number;
        }
>;

type SearchResults = {
    startIndex: number;
    endIndex: number;
    segmentStartIndex: number;
    segmentEndIndex: number;
    path: AnyBlock[];
    tableContext: TableSelectionContext | undefined;
};

interface InsertEntityPaneState {
    entities: SearchResults[];
}

export default class SearchPane extends React.Component<ApiPaneProps, InsertEntityPaneState> {
    private search = React.createRef<HTMLInputElement>();

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            entities: [],
        };
    }

    render() {
        return (
            <>
                <div>
                    Type: <input type="input" ref={this.search} />
                </div>
                <div>
                    <button onClick={this.onSearch}>Search</button>
                </div>
                <div>
                    Search Results
                    <hr />
                    <table>
                        <tr>
                            <th>SegmentStart</th>
                            <th>SegmentEnd</th>
                            <th>StartIndex</th>
                            <th>EndIndex</th>
                            <th>EndIndex</th>
                        </tr>
                        {this.state.entities.map(entity => (
                            <tr>
                                <td>{entity.segmentStartIndex}</td>
                                <td>{entity.segmentEndIndex}</td>
                                <td>{entity.startIndex}</td>
                                <td>{entity.endIndex}</td>
                                <td>
                                    <button onClick={this.onClickFocus(entity)}>Focus</button>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </>
        );
    }

    private onClickFocus = (entity: SearchResults) => {
        return () => {
            const editor = this.props.getEditor();
            if (isContentModelEditor(editor)) {
                const model = editor.createContentModel({}, null);

                let currentPath = model.blocks;
                const selectionPath: number[] = searchPathToIndex(entity.path);

                for (let index = 1; index < selectionPath.length; index++) {
                    const current = currentPath[selectionPath[index]];
                    if (current.blockType == 'Entity') {
                        return;
                    }

                    if (current.blockType == 'Table') {
                        index++;
                        const rows = current.rows[selectionPath[index]];
                        index++;
                        const cell = rows.cells[selectionPath[index]];
                        currentPath = cell.blocks;
                    } else if (containBlockProp(current)) {
                        currentPath = current.blocks;
                    }
                }

                // for (let index = entity.path.length - 1; index >= 1; index--) {
                //     const next = entity.path[index];
                //     const includ =
                //         next.blockGroupType === 'TableCell' && currentPath[0].blockType == 'Table'
                //             ? currentPath[0].rows.find(row =>
                //                   row.cells.find(cell => cell == entity.path[index])
                //               )
                //             : currentPath.find(w => objectsEqual(w, next as ContentModelBlock));

                //     if (includ) {
                //         currentPath =
                //             next.blockType === 'Table'
                //                 ? ([next] as ContentModelBlock[])
                //                 : next.blocks;
                //     }
                // }

                const result = currentPath[0];
                const { startIndex, segmentStartIndex, segmentEndIndex, endIndex } = entity;
                let textNodes: ContentModelText[] = [];
                if (result.blockType && result.blockType == 'Paragraph') {
                    const firstSelectionMarker = createSelectionMarker(result.segmentFormat);
                    const lastSelectionMarker = createSelectionMarker(result.segmentFormat);

                    const firstSegment = result.segments[segmentStartIndex];
                    const lastSegment = result.segments[segmentEndIndex];

                    if (firstSegment == lastSegment) {
                        textNodes = doubleSplitSegmentText(
                            firstSegment,
                            startIndex,
                            endIndex,
                            result,
                            firstSelectionMarker,
                            lastSelectionMarker
                        );
                    } else {
                        textNodes.push(
                            splitSegmentText(
                                firstSegment,
                                startIndex,
                                result,
                                firstSelectionMarker,
                                false
                            ),
                            splitSegmentText(
                                lastSegment,
                                endIndex,
                                result,
                                lastSelectionMarker,
                                true
                            )
                        );
                    }

                    let nodeToSelect: Node | undefined = undefined;
                    let nodeToSelect2: Node | undefined = undefined;
                    let nodeToSelect3: Node | undefined = undefined;
                    editor.setContentModel(model, {
                        onNodeCreated: (modelElement, node) => {
                            if (modelElement === result) {
                                nodeToSelect = node;
                            }

                            if (textNodes.includes(modelElement as any)) {
                                nodeToSelect2 = node;
                                const span = wrap(node, 'span');
                                span.id = 'Plz no remove';
                            }

                            if (modelElement == firstSegment) {
                                nodeToSelect2 = node;
                            }

                            if (modelElement == lastSegment) {
                                nodeToSelect3 = node;
                            }
                        },
                    });

                    if (nodeToSelect) {
                        console.log(nodeToSelect2);
                        console.log(nodeToSelect3);
                        editor.select(
                            nodeToSelect.firstChild.firstChild,
                            startIndex,
                            nodeToSelect.firstChild.firstChild,
                            endIndex + 1
                        );
                    }
                }
            }
        };
    };

    private onSearch = () => {
        const editor = this.props.getEditor();
        if (isContentModelEditor(editor)) {
            const contentModel = editor.createContentModel();
            console.log(contentModel);

            const result: SearchResults[] = [];
            iterateSelections(
                [contentModel],
                (path, tableContext, block, segments) => {
                    const segmentsToRemove: ContentModelSegment[] = [];
                    for (let index = 0; index < segments.length; index++) {
                        const segment = segments[index];

                        if (segment.segmentType === 'SelectionMarker') {
                            segmentsToRemove.push(segment);
                        }
                    }

                    segmentsToRemove.forEach(segment => {
                        const index = segments.indexOf(segment);
                        if (segments[index] == segment) {
                            segments.splice(index, 1);
                        }
                    });

                    const pathToUse: AnyBlock[] = getPath(path, block, tableContext);
                    const asd = findTextInString(
                        pathToUse,
                        segments,
                        this.search.current.value,
                        tableContext
                    );
                    asd && result.push(...asd);
                    console.log(asd);
                },
                {
                    contentUnderSelectedTableCell: 'ignoreForTableOrCell',
                    contentUnderSelectedGeneralElement: 'contentOnly',
                },
                undefined,
                true
            );

            this.setState({
                entities: result,
            });
        }
    };
}

function getPath(
    path: ContentModelBlockGroup[],
    block: ContentModelBlock,
    tableContext: TableSelectionContext
) {
    const pathToUse: AnyBlock[] = [];
    path.forEach(el => {
        pathToUse.push(el);
    });
    pathToUse.unshift(block);
    if (tableContext) {
        const tableCells = path.filter(block => block.blockGroupType == 'TableCell');
        const lastCell = tableCells[tableCells.length - 1];
        const lastIndex = pathToUse.lastIndexOf(lastCell);
        pathToUse.splice(lastIndex + 1, 0, tableContext.table);
    }
    return pathToUse;
}

function findTextInString(
    path: AnyBlock[],
    segments: ContentModelSegment[],
    searchString: string,
    tableContext?: TableSelectionContext
) {
    let startIndex: number | undefined = undefined;
    let endIndex: number | undefined = undefined;
    let segmentStartIndex: number | undefined = undefined;
    let segmentEndIndex: number | undefined = undefined;

    const segmentResults: SearchResults[] = [];

    for (let segmentIndex = 0; segmentIndex < segments?.length || 0; segmentIndex++) {
        const segment = segments[segmentIndex];
        if (!isTextSegment(segment)) {
            return;
        }
        let text = segment.text;

        for (let i = 0; i <= text.length; i++) {
            let found = true;
            let traversedChars = 0;

            for (
                let currentSearchStringIndex = 0;
                currentSearchStringIndex < searchString.length;
                currentSearchStringIndex++
            ) {
                if (found && currentSearchStringIndex == searchString.length - 1) {
                    endIndex = i + currentSearchStringIndex - traversedChars;
                    segmentEndIndex = segmentIndex;

                    segmentResults.push({
                        startIndex,
                        endIndex,
                        segmentEndIndex,
                        segmentStartIndex,
                        path,
                        tableContext,
                    });

                    startIndex = undefined;
                    endIndex = undefined;
                    segmentEndIndex = undefined;
                    segmentStartIndex = undefined;
                }
                if (text[i + currentSearchStringIndex] === undefined) {
                    segmentIndex++;
                    const nextSegment = segments[segmentIndex];
                    if (!isTextSegment(nextSegment)) {
                        break;
                    }
                    traversedChars = currentSearchStringIndex;
                    i = 0;
                    text = nextSegment.text;
                }
                if (
                    text[i + currentSearchStringIndex - traversedChars] !==
                    searchString[currentSearchStringIndex]
                ) {
                    found = false;
                    break;
                } else {
                    startIndex =
                        startIndex != undefined ? startIndex : i + currentSearchStringIndex;
                    segmentStartIndex =
                        segmentStartIndex != undefined ? segmentStartIndex : segmentIndex;
                }
            }
        }
    }
    return segmentResults;
}

function isTextSegment(segment: ContentModelSegment | undefined): segment is ContentModelText {
    return segment?.segmentType == 'Text';
}

function splitSegmentText(
    segmentToSplit: ContentModelSegment,
    splitIndex: number,
    parent: ContentModelParagraph,
    elementToInsert: ContentModelSegment,
    selectBefore: boolean
) {
    if (segmentToSplit.segmentType == 'Text') {
        const segmentBefore = Object.assign({}, segmentToSplit);
        const segmentAfter = Object.assign({}, segmentToSplit);

        segmentBefore.text = segmentBefore.text.substring(0, splitIndex + 1);
        segmentAfter.text = segmentAfter.text.substring(splitIndex + 1);

        (selectBefore ? segmentBefore : segmentAfter).isSelected = true;

        parent.segments.splice(
            parent.segments.indexOf(segmentToSplit),
            1,
            segmentBefore,
            segmentAfter
        );

        console.log(elementToInsert);
        return selectBefore ? segmentBefore : segmentAfter;
    }
    return undefined;
}

function doubleSplitSegmentText(
    segmentToSplit: ContentModelSegment,
    splitIndex: number,
    splitIndex2: number,
    parent: ContentModelParagraph,
    elementToInsert: ContentModelSegment,
    elementToInsert2: ContentModelSegment
) {
    if (segmentToSplit.segmentType == 'Text') {
        const segmentBefore = Object.assign({}, segmentToSplit);
        const segmentMiddle = Object.assign({}, segmentToSplit);
        const segmentAfter = Object.assign({}, segmentToSplit);

        segmentBefore.text = segmentBefore.text.substring(0, splitIndex);
        segmentMiddle.text = segmentMiddle.text.substring(splitIndex, splitIndex2 + 1);
        segmentMiddle.isSelected = true;
        segmentAfter.text = segmentAfter.text.substring(splitIndex2 + 1);

        parent.segments.splice(
            parent.segments.indexOf(segmentToSplit),
            1,
            segmentBefore,
            segmentMiddle,
            segmentAfter
        );

        if (false) {
            console.log(elementToInsert, elementToInsert2);
        }
        return [segmentMiddle];
    }
    return [];
}
function searchPathToIndex(path: AnyBlock[]): number[] {
    const result: number[] = [];

    for (let index = path.length - 1; index >= 0; index--) {
        const current = path[index];
        const currentParent = path[index + 1];

        if (current.blockGroupType === 'Document') {
            result.push(0);
            continue;
        }

        if (current.blockGroupType === 'TableCell' && currentParent.blockType == 'Table') {
            let rowIndex: number = -1;
            let colIndex: number = -1;
            (currentParent as ContentModelTable).rows.some((row, rI) => {
                if (
                    row.cells.some((cell, cI) => {
                        if (cell == current) {
                            colIndex = cI;
                        }
                        return cell == current;
                    })
                ) {
                    rowIndex = rI;
                    return true;
                }
                return false;
            });

            result.push(rowIndex);
            result.push(colIndex);
        } else {
            const newIndex = currentParent.blocks.indexOf(current as ContentModelBlock);
            result.push(newIndex);
        }
    }
    return result;
}
function containBlockProp(
    currentPath: ContentModelBlock
): currentPath is ContentModelBlock & { blocks: ContentModelBlock[] } {
    return (currentPath as any)?.blocks?.length != undefined;
}
