import { getListTypeStyle } from './getListTypeStyle';
import { getOperationalBlocks, isBlockGroupOfType } from 'roosterjs-content-model-dom';
import {
    getListAnnounceData,
    setListType,
    setModelListStartNumber,
    setModelListStyle,
} from 'roosterjs-content-model-api';
import type {
    ContentModelListItem,
    FormatContentModelContext,
    ReadonlyContentModelDocument,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardListTrigger(
    model: ReadonlyContentModelDocument,
    paragraph: ShallowMutableContentModelParagraph,
    context: FormatContentModelContext,
    shouldSearchForBullet: boolean = true,
    shouldSearchForNumbering: boolean = true
) {
    const listStyleType = getListTypeStyle(model, shouldSearchForBullet, shouldSearchForNumbering);
    if (listStyleType) {
        paragraph.segments.splice(0, 1);
        const { listType, styleType, index } = listStyleType;
        triggerList(model, listType, styleType, index);
        context.canUndoByBackspace = true;
        setAnnounceData(model, context);

        return true;
    }
    return false;
}

const triggerList = (
    model: ReadonlyContentModelDocument,
    listType: 'OL' | 'UL',
    styleType: number,
    index?: number
) => {
    setListType(model, listType);
    const isOrderedList = listType == 'OL';
    if (index && index > 1 && isOrderedList) {
        setModelListStartNumber(model, index);
    }
    setModelListStyle(
        model,
        isOrderedList
            ? {
                  orderedStyleType: styleType,
                  applyListStyleFromLevel: false,
              }
            : {
                  unorderedStyleType: styleType,
                  applyListStyleFromLevel: false,
              }
    );
};

function setAnnounceData(model: ReadonlyContentModelDocument, context: FormatContentModelContext) {
    const [paragraphOrListItems] = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        [] // Set stop types to be empty so we can find list items even cross the boundary of table, then we can always operation on the list item if any
    );

    if (paragraphOrListItems && isBlockGroupOfType(paragraphOrListItems.block, 'ListItem')) {
        const { path, block } = paragraphOrListItems;
        context.announceData = getListAnnounceData([block, ...path]);
    }
}
