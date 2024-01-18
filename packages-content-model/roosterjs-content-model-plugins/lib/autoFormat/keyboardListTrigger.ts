import { getListTypeStyle } from './utils/getListTypeStyle';
import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-core';
import { setListStartNumber, setListStyle } from 'roosterjs-content-model-api';
import { setListType } from 'roosterjs-content-model-api/lib/modelApi/list/setListType';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardListTrigger(
    editor: IStandaloneEditor,
    shouldSearchForBullet: boolean = true,
    shouldSearchForNumbering: boolean = true
) {
    editor.formatContentModel((model, context) => {
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
            const isOrderedList = listType === 'OL';
            setListType(model, listType);
            if (index && isOrderedList) {
                setListStartNumber(editor, index);
            }
            setListStyle(
                editor,
                isOrderedList
                    ? {
                          orderedStyleType: styleType,
                      }
                    : { unorderedStyleType: styleType }
            );

            return true;
        }
        return false;
    });
}
