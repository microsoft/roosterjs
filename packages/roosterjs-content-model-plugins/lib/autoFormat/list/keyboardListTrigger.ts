import { getListTypeStyle } from './getListTypeStyle';
import {
    setListType,
    setModelListStartNumber,
    setModelListStyle,
} from 'roosterjs-content-model-api';
import type {
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
              }
            : {
                  unorderedStyleType: styleType,
              }
    );
};
