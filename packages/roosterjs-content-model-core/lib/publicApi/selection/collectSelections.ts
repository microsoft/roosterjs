import { getClosestAncestorBlockGroupIndex } from '../model/getClosestAncestorBlockGroupIndex';
import { isBlockGroupOfType } from '../model/isBlockGroupOfType';
import { iterateSelections } from './iterateSelections';
import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelBlockGroupType,
    ContentModelDocument,
    ContentModelListItem,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelTable,
    IterateSelectionsOption,
    OperationalBlocks,
    TableSelectionContext,
    TypeOfBlockGroup,
} from 'roosterjs-content-model-types';

/**
 * Get an array of selected parent paragraph and child segment pair
 * @param model The Content Model to get selection from
 * @param includingFormatHolder True means also include format holder as segment from list item, in that case paragraph will be null
 */
export function getSelectedSegmentsAndParagraphs(
    model: ContentModelDocument,
    includingFormatHolder: boolean
): [ContentModelSegment, ContentModelParagraph | null][] {
    const selections = collectSelections(model, {
        includeListFormatHolder: includingFormatHolder ? 'allSegments' : 'never',
    });
    const result: [ContentModelSegment, ContentModelParagraph | null][] = [];

    selections.forEach(({ segments, block }) => {
        if (segments && ((includingFormatHolder && !block) || block?.blockType == 'Paragraph')) {
            segments.forEach(segment => {
                if (segment.segmentType != 'Entity' || !segment.entityFormat.isReadonly) {
                    result.push([segment, block?.blockType == 'Paragraph' ? block : null]);
                }
            });
        }
    });

    return result;
}

/**
 * Get an array of selected segments from a content model
 * @param model The Content Model to get selection from
 * @param includingFormatHolder True means also include format holder as segment from list item
 */
export function getSelectedSegments(
    model: ContentModelDocument,
    includingFormatHolder: boolean
): ContentModelSegment[] {
    return getSelectedSegmentsAndParagraphs(model, includingFormatHolder).map(x => x[0]);
}

/**
 * Get any array of selected paragraphs from a content model
 * @param model The Content Model to get selection from
 */
export function getSelectedParagraphs(model: ContentModelDocument): ContentModelParagraph[] {
    const selections = collectSelections(model, { includeListFormatHolder: 'never' });
    const result: ContentModelParagraph[] = [];

    removeUnmeaningfulSelections(selections);

    selections.forEach(({ block }) => {
        if (block?.blockType == 'Paragraph') {
            result.push(block);
        }
    });

    return result;
}

/**
 * Get an array of block group - block pair that is of the expected block group type from selection
 * @param model The Content Model to get selection from
 * @param blockGroupTypes The expected block group types
 * @param stopTypes Block group types that will stop searching when hit
 * @param deepFirst True means search in deep first, otherwise wide first
 */
export function getOperationalBlocks<T extends ContentModelBlockGroup>(
    model: ContentModelDocument,
    blockGroupTypes: TypeOfBlockGroup<T>[],
    stopTypes: ContentModelBlockGroupType[],
    deepFirst?: boolean
): OperationalBlocks<T>[] {
    const result: OperationalBlocks<T>[] = [];
    const findSequence = deepFirst ? blockGroupTypes.map(type => [type]) : [blockGroupTypes];
    const selections = collectSelections(model, {
        includeListFormatHolder: 'never',
        contentUnderSelectedTableCell: 'ignoreForTable', // When whole table is selected, we treat the table as a single block
    });

    removeUnmeaningfulSelections(selections);

    selections.forEach(({ path, block }) => {
        for (let i = 0; i < findSequence.length; i++) {
            const groupIndex = getClosestAncestorBlockGroupIndex(path, findSequence[i], stopTypes);

            if (groupIndex >= 0) {
                if (result.filter(x => x.block == path[groupIndex]).length <= 0) {
                    result.push({
                        parent: path[groupIndex + 1],
                        block: path[groupIndex] as T,
                        path: path.slice(groupIndex + 1),
                    });
                }
                break;
            } else if (i == findSequence.length - 1 && block) {
                result.push({
                    parent: path[0],
                    block: block,
                    path,
                });
                break;
            }
        }
    });

    return result;
}

/**
 * Get the first selected table from content model
 * @param model The Content Model to get selection from
 */
export function getFirstSelectedTable(
    model: ContentModelDocument
): [ContentModelTable | undefined, ContentModelBlockGroup[]] {
    const selections = collectSelections(model, { includeListFormatHolder: 'never' });
    let table: ContentModelTable | undefined;
    let resultPath: ContentModelBlockGroup[] = [];

    removeUnmeaningfulSelections(selections);

    selections.forEach(({ block, tableContext, path }) => {
        if (!table) {
            if (block?.blockType == 'Table') {
                table = block;
                resultPath = [...path];
            } else if (tableContext?.table) {
                table = tableContext.table;

                const parent = path.filter(
                    group => group.blocks.indexOf(tableContext.table) >= 0
                )[0];
                const index = path.indexOf(parent);
                resultPath = index >= 0 ? path.slice(index) : [];
            }
        }
    });

    return [table, resultPath];
}

/**
 * Get the first selected list item from content model
 * @param model The Content Model to get selection from
 */
export function getFirstSelectedListItem(
    model: ContentModelDocument
): ContentModelListItem | undefined {
    let listItem: ContentModelListItem | undefined;

    getOperationalBlocks(model, ['ListItem'], ['TableCell']).forEach(r => {
        if (!listItem && isBlockGroupOfType<ContentModelListItem>(r.block, 'ListItem')) {
            listItem = r.block;
        }
    });

    return listItem;
}

interface SelectionInfo {
    path: ContentModelBlockGroup[];
    segments?: ContentModelSegment[];
    block?: ContentModelBlock;
    tableContext?: TableSelectionContext;
}

function collectSelections(
    model: ContentModelDocument,
    option?: IterateSelectionsOption
): SelectionInfo[] {
    const selections: SelectionInfo[] = [];

    iterateSelections(
        model,
        (path, tableContext, block, segments) => {
            selections.push({
                path,
                tableContext,
                block,
                segments,
            });
        },
        option
    );

    return selections;
}

function removeUnmeaningfulSelections(selections: SelectionInfo[]) {
    if (
        selections.length > 1 &&
        isOnlySelectionMarkerSelected(selections, false /*checkFirstParagraph*/)
    ) {
        selections.pop();
    }

    // Remove head paragraph if first selection marker is the only selection
    if (
        selections.length > 1 &&
        isOnlySelectionMarkerSelected(selections, true /*checkFirstParagraph*/)
    ) {
        selections.shift();
    }
}

function isOnlySelectionMarkerSelected(
    selections: SelectionInfo[],
    checkFirstParagraph: boolean
): boolean {
    const selection = selections[checkFirstParagraph ? 0 : selections.length - 1];

    if (
        selection.block?.blockType == 'Paragraph' &&
        selection.segments &&
        selection.segments.length > 0
    ) {
        const allSegments = selection.block.segments;
        const segment = selection.segments[0];

        return (
            selection.segments.length == 1 &&
            segment.segmentType == 'SelectionMarker' &&
            segment == allSegments[checkFirstParagraph ? allSegments.length - 1 : 0]
        );
    } else {
        return false;
    }
}
