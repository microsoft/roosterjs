import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-core/lib/publicApi/selection/collectSelections';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import {
    setListStartNumber,
    setListStyle,
    toggleBullet,
    toggleNumbering,
} from 'roosterjs-content-model-api';

export const keyboardListTrigger = (
    editor: IStandaloneEditor,
    listStyleType: { listType: 'UL' | 'OL'; styleType: number; index?: number }
) => {
    editor.formatContentModel((model, context) => {
        if (listStyleType.listType === 'UL') {
            toggleBullet(editor);
            setListStyle(editor, { unorderedStyleType: listStyleType.styleType });
        } else {
            toggleNumbering(editor);
            setListStyle(editor, { orderedStyleType: listStyleType.styleType });
            if (listStyleType.index) {
                setListStartNumber(editor, listStyleType.index);
            }
        }
        const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(model, false);
        const listMarker = selectedSegmentsAndParagraphs[0][1]?.segments[0];
        if (listMarker && listMarker.segmentType === 'Text') {
            listMarker.text = '';
        }
        context.skipUndoSnapshot = true;
        return true;
    });
};
