import { getListTypeStyle } from './utils/getListTypeStyle';
import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-core';
import { normalizeContentModel } from 'roosterjs-content-model-dom';
import { setListStartNumber, setListStyle, setListType } from 'roosterjs-content-model-api';
import type { ContentModelDocument, IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardListTrigger(
    editor: IStandaloneEditor,
    rawEvent: KeyboardEvent,
    shouldSearchForBullet: boolean = true,
    shouldSearchForNumbering: boolean = true
) {
    editor.formatContentModel((model, _context) => {
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
            triggerList(editor, model, listType, styleType, index);
            rawEvent.preventDefault();
            normalizeContentModel(model);
            return true;
        }
        return false;
    });
}

const triggerList = (
    editor: IStandaloneEditor,
    model: ContentModelDocument,
    listType: 'OL' | 'UL',
    styleType: number,
    index?: number
) => {
    setListType(model, listType);
    const isOrderedList = listType == 'OL';
    // If the index < 1, it is a new list, so it will be starting by 1, then no need to set startNumber
    if (index && index > 1 && isOrderedList) {
        setListStartNumber(editor, index);
    }
    setListStyle(
        editor,
        isOrderedList
            ? {
                  orderedStyleType: styleType,
              }
            : {
                  unorderedStyleType: styleType,
              }
    );
};
