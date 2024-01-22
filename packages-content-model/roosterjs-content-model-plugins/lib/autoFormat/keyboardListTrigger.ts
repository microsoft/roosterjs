import { getListTypeStyle } from './utils/getListTypeStyle';
import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-core';
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
            const paragraph = getSelectedSegmentsAndParagraphs(model, false)[0][1];
            if (paragraph) {
                paragraph.segments.splice(0, 1);
            }
            const { listType, styleType, index } = listStyleType;
            triggerList(editor, model, listType, styleType, index);
            rawEvent.preventDefault();
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
    if (index && isOrderedList) {
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
