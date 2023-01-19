import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { isBlockGroupOfType } from '..//common/isBlockGroupOfType';
import {
    iterateSelections,
    IterateSelectionsOption,
    TableSelectionContext,
} from './iterateSelections';
import {
    getClosestAncestorBlockGroupIndex,
    TypeOfBlockGroup,
} from '../common/getClosestAncestorBlockGroupIndex';

/**
 * @internal
 */
export type OperationalBlocks<T extends ContentModelBlockGroup> = {
    parent: ContentModelBlockGroup;
    block: ContentModelBlock | T;
};

/**
 * @internal
 */
export function getSelectedSegments(
    model: ContentModelDocument,
    includingFormatHolder: boolean
): ContentModelSegment[] {
    const selections = collectSelections(model, {
        includeListFormatHolder: includingFormatHolder ? 'allSegments' : 'never',
    });
    const result: ContentModelSegment[] = [];

    selections.forEach(({ segments, block }) => {
        if (segments && ((includingFormatHolder && !block) || block?.blockType == 'Paragraph')) {
            arrayPush(result, segments);
        }
    });

    return result;
}

/**
 * @internal
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
 * @internal
 */
export function getSelectedImage(model: ContentModelDocument): ContentModelImage | undefined {
    const selections = collectSelections(model);
    let image: ContentModelImage | undefined;

    removeUnmeaningfulSelections(selections);

    selections.forEach(({ segments }) => {
        if (segments?.[0].segmentType === 'Image') {
            image = segments[0];
        }
    });

    return image;
}

/**
 * @internal
 */
export function getOperationalBlocks<T extends ContentModelBlockGroup>(
    model: ContentModelDocument,
    blockGroupTypes: TypeOfBlockGroup<T>[],
    stopTypes: ContentModelBlockGroupType[],
    deepFirst?: boolean
): OperationalBlocks<T>[] {
    const result: OperationalBlocks<T>[] = [];
    const findSequence = deepFirst ? blockGroupTypes.map(type => [type]) : [blockGroupTypes];
    const selections = collectSelections(model, { includeListFormatHolder: 'never' });

    removeUnmeaningfulSelections(selections);

    selections.forEach(({ path, block }) => {
        for (let i = 0; i < findSequence.length; i++) {
            const groupIndex = getClosestAncestorBlockGroupIndex(path, findSequence[i], stopTypes);

            if (groupIndex >= 0) {
                if (result.filter(x => x.block == path[groupIndex]).length <= 0) {
                    result.push({
                        parent: path[groupIndex + 1],
                        block: path[groupIndex] as T,
                    });
                }
                break;
            } else if (i == findSequence.length - 1 && block) {
                result.push({
                    parent: path[0],
                    block: block,
                });
                break;
            }
        }
    });

    return result;
}

/**
 * @internal
 */
export function getFirstSelectedTable(model: ContentModelDocument): ContentModelTable | undefined {
    const selections = collectSelections(model, { includeListFormatHolder: 'never' });
    let table: ContentModelTable | undefined;

    removeUnmeaningfulSelections(selections);

    selections.forEach(({ block, tableContext }) => {
        if (!table) {
            table = block?.blockType == 'Table' ? block : tableContext?.table;
        }
    });

    return table;
}

/**
 * @internal
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
        [model],
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
