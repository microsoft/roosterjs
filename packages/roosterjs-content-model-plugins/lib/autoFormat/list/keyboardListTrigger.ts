import { getListTypeStyle } from './getListTypeStyle';
import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import {
    setListType,
    setModelListStartNumber,
    setModelListStyle,
} from 'roosterjs-content-model-api';
import type { ContentModelDocument, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardListTrigger(
    editor: IEditor,
    shouldSearchForBullet: boolean = true,
    shouldSearchForNumbering: boolean = true
) {
    if (shouldSearchForBullet || shouldSearchForNumbering) {
        editor.formatContentModel(
            (model, context) => {
                const listStyleType = getListTypeStyle(
                    model,
                    shouldSearchForBullet,
                    shouldSearchForNumbering
                );
                if (listStyleType) {
                    const segmentsAndParagraphs = getSelectedSegmentsAndParagraphs(model, false);
                    if (segmentsAndParagraphs[0] && segmentsAndParagraphs[0][1]) {
                        segmentsAndParagraphs[0][1].segments.splice(0, 1);
                    }
                    const { listType, styleType, index } = listStyleType;
                    triggerList(model, listType, styleType, index);
                    context.canUndoByBackspace = true;

                    return true;
                }

                return false;
            },
            {
                apiName: 'autoToggleList',
            }
        );
    }
}

const triggerList = (
    model: ContentModelDocument,
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
