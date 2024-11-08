import { findListItemsInSameThread } from 'roosterjs-content-model-api';
import { getNumberingListStyle } from './getNumberingListStyle';
import type {
    ContentModelListItem,
    ReadonlyContentModelDocument,
    ReadonlyContentModelListItem,
    ReadonlyContentModelParagraph,
} from 'roosterjs-content-model-types';
import {
    BulletListType,
    isBlockGroupOfType,
    updateListMetadata,
    getOperationalBlocks,
    getSelectedSegmentsAndParagraphs,
} from 'roosterjs-content-model-dom';

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
    model: ReadonlyContentModelDocument,
    shouldSearchForBullet: boolean = true,
    shouldSearchForNumbering: boolean = true
): ListTypeStyle | undefined {
    const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(model, true);
    if (!selectedSegmentsAndParagraphs[0]) {
        return undefined;
    }
    const marker = selectedSegmentsAndParagraphs[0][0];
    const paragraph = selectedSegmentsAndParagraphs[0][1];
    const listMarkerSegment = paragraph?.segments[0];

    if (
        marker &&
        marker.segmentType == 'SelectionMarker' &&
        listMarkerSegment &&
        listMarkerSegment.segmentType == 'Text'
    ) {
        const listMarker = listMarkerSegment.text.trim();
        const bulletType = bulletListType.get(listMarker);

        if (bulletType && shouldSearchForBullet) {
            return { listType: 'UL', styleType: bulletType };
        } else if (shouldSearchForNumbering) {
            const { previousList, hasSpaceBetween } = getPreviousListLevel(model, paragraph);
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
                    index: getIndex(
                        listMarker,
                        previousListStyle,
                        numberingType,
                        previousIndex,
                        hasSpaceBetween
                    ),
                };
            }
        }
    }
    return undefined;
}

const getIndex = (
    listMarker: string,
    previousListStyle?: number,
    numberingType?: number,
    previousIndex?: number,
    hasSpaceBetween?: boolean
) => {
    const newList = isNewList(listMarker);
    return previousListStyle && previousListStyle !== numberingType && newList
        ? 1
        : !newList && previousListStyle === numberingType && hasSpaceBetween && previousIndex
        ? previousIndex + 1
        : undefined;
};

const getPreviousListIndex = (
    model: ReadonlyContentModelDocument,
    previousListItem?: ReadonlyContentModelListItem
) => {
    return previousListItem ? findListItemsInSameThread(model, previousListItem).length : undefined;
};

const getPreviousListLevel = (
    model: ReadonlyContentModelDocument,
    paragraph: ReadonlyContentModelParagraph
) => {
    const blocks = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        ['TableCell']
    )[0];
    let previousList: ContentModelListItem | undefined = undefined;
    let hasSpaceBetween = false;
    if (blocks) {
        const listBlockIndex = blocks.parent.blocks.indexOf(paragraph);

        if (listBlockIndex > -1) {
            for (let i = listBlockIndex - 1; i > -1; i--) {
                const item = blocks.parent.blocks[i];
                if (isBlockGroupOfType<ContentModelListItem>(item, 'ListItem')) {
                    previousList = item;
                    break;
                } else {
                    hasSpaceBetween = listBlockIndex > 0 ? true : false;
                }
            }
        }
    }

    return { previousList, hasSpaceBetween };
};

const getPreviousListStyle = (list?: ContentModelListItem) => {
    if (list?.levels[0].dataset) {
        return updateListMetadata(list.levels[0])?.orderedStyleType;
    }
};

const bulletListType: Map<string, number> = new Map<string, number>([
    ['*', BulletListType.Disc],
    ['-', BulletListType.Dash],
    ['--', BulletListType.Square],
    ['->', BulletListType.LongArrow],
    ['-->', BulletListType.DoubleLongArrow],
    ['=>', BulletListType.UnfilledArrow],
    ['>', BulletListType.ShortArrow],
    ['—', BulletListType.Hyphen],
]);

const isNewList = (listMarker: string) => {
    const marker = listMarker.replace(/[^\w\s]/g, '');
    const pattern = /^[1aAiI]$/;
    return pattern.test(marker);
};
