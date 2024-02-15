import { findListItemsInSameThread } from 'roosterjs-content-model-api';
import { getNumberingListStyle } from './getNumberingListStyle';
import type {
    ContentModelDocument,
    ContentModelListItem,
    ContentModelParagraph,
} from 'roosterjs-content-model-types';
import {
    BulletListType,
    isBlockGroupOfType,
    updateListMetadata,
    getOperationalBlocks,
    getSelectedSegmentsAndParagraphs,
} from 'roosterjs-content-model-core';

/**
 * @internal
 */
interface ListTypeStyle {
    listType: 'UL' | 'OL';
    styleType: number;
    index?: number;
}

/**
 * @internal
 */
export function getListTypeStyle(
    model: ContentModelDocument,
    shouldSearchForBullet: boolean = true,
    shouldSearchForNumbering: boolean = true
): ListTypeStyle | undefined {
    const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(model, true);
    const marker = selectedSegmentsAndParagraphs[0][0];
    const paragraph = selectedSegmentsAndParagraphs[0][1];
    const listMarkerSegment = paragraph?.segments[0];

    if (
        marker &&
        marker.segmentType == 'SelectionMarker' &&
        listMarkerSegment &&
        listMarkerSegment.segmentType == 'Text'
    ) {
        const listMarker = listMarkerSegment.text;
        const bulletType = bulletListType[listMarker];

        if (bulletType && shouldSearchForBullet) {
            return { listType: 'UL', styleType: bulletType };
        } else if (shouldSearchForNumbering) {
            const previousList = getPreviousListLevel(model, paragraph);
            const previousIndex = getPreviousListIndex(model, previousList);
            const previousListStyle = getPreviousListStyle(previousList);
            const numberingType = getNumberingListStyle(
                listMarker,
                previousIndex,
                previousListStyle
            );
            if (numberingType) {
                return {
                    listType: 'OL',
                    styleType: numberingType,
                    index:
                        !isNewList(listMarker) &&
                        previousListStyle === numberingType &&
                        previousIndex
                            ? previousIndex + 1
                            : undefined,
                };
            }
        }
    }
    return undefined;
}

const getPreviousListIndex = (
    model: ContentModelDocument,
    previousListItem?: ContentModelListItem
) => {
    return previousListItem ? findListItemsInSameThread(model, previousListItem).length : undefined;
};

const getPreviousListLevel = (model: ContentModelDocument, paragraph: ContentModelParagraph) => {
    const blocks = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        ['TableCell']
    )[0];
    let listItem: ContentModelListItem | undefined = undefined;
    if (blocks) {
        const listBlockIndex = blocks.parent.blocks.indexOf(paragraph);

        if (listBlockIndex > -1) {
            for (let i = listBlockIndex - 1; i > -1; i--) {
                const item = blocks.parent.blocks[i];
                if (isBlockGroupOfType<ContentModelListItem>(item, 'ListItem')) {
                    listItem = item;
                    break;
                }
            }
        }
    }

    return listItem;
};

const getPreviousListStyle = (list?: ContentModelListItem) => {
    if (list?.levels[0].dataset) {
        return updateListMetadata(list.levels[0])?.orderedStyleType;
    }
};

const bulletListType: Record<string, number> = {
    '*': BulletListType.Disc,
    '-': BulletListType.Dash,
    '--': BulletListType.Square,
    '->': BulletListType.LongArrow,
    '-->': BulletListType.DoubleLongArrow,
    '=>': BulletListType.UnfilledArrow,
    '>': BulletListType.ShortArrow,
    '—': BulletListType.Hyphen,
};

const isNewList = (listMarker: string) => {
    const marker = listMarker.replace(/[^\w\s]/g, '');
    const pattern = /^[1aAiI]$/;
    return pattern.test(marker);
};
