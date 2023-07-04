import { adjustTrailingSpaceSelection } from './adjustTrailingSpaceSelection';
import { adjustWordSelection } from '../../modelApi/selection/adjustWordSelection';
import { formatWithContentModel } from './formatWithContentModel';
import { getPendingFormat, setPendingFormat } from '../../modelApi/format/pendingFormat';
import { getSelectedSegmentsAndParagraphs } from '../../modelApi/selection/collectSelections';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function formatSegmentWithContentModel(
    editor: IContentModelEditor,
    apiName: string,
    toggleStyleCallback: (
        format: ContentModelSegmentFormat,
        isTuringOn: boolean,
        segment: ContentModelSegment | null
    ) => void,
    segmentHasStyleCallback?: (
        format: ContentModelSegmentFormat,
        segment: ContentModelSegment | null,
        paragraph: ContentModelParagraph | null
    ) => boolean,
    includingFormatHolder?: boolean
) {
    formatWithContentModel(editor, apiName, model => {
        let segmentAndParagraphs = getSelectedSegmentsAndParagraphs(model, !!includingFormatHolder);
        const pendingFormat = getPendingFormat(editor);
        let isCollapsedSelection =
            segmentAndParagraphs.length == 1 &&
            segmentAndParagraphs[0][0].segmentType == 'SelectionMarker';

        if (isCollapsedSelection) {
            const para = segmentAndParagraphs[0][1];

            segmentAndParagraphs = adjustWordSelection(model, segmentAndParagraphs[0][0]).map(x => [
                x,
                para,
            ]);

            if (segmentAndParagraphs.length > 1) {
                isCollapsedSelection = false;
            }
        }

        const formatsAndSegments: [
            ContentModelSegmentFormat,
            ContentModelSegment | null,
            ContentModelParagraph | null
        ][] = pendingFormat
            ? [[pendingFormat, null, null]]
            : segmentAndParagraphs.map(item => [item[0].format, item[0], item[1]]);

        // If multiple segments are selected, we ignore the check for the empty text segment and return true directly
        // Then only the result of segmentHasStyleCallback will be used to determine whether to turn on/off the style
        const isTurningOff = segmentHasStyleCallback
            ? formatsAndSegments.every(([format, segment, paragraph]) => {
                  if (
                      formatsAndSegments.length == 1 ||
                      segment?.segmentType != 'Text' ||
                      segment.text.trim().length > 0
                  ) {
                      return segmentHasStyleCallback(format, segment, paragraph);
                  } else {
                      return true;
                  }
              })
            : false;

        formatsAndSegments.forEach(([format, segment, paragraph]) => {
            toggleStyleCallback(format, !isTurningOff, segment);
            adjustTrailingSpaceSelection(segment, paragraph);
        });

        if (!pendingFormat && isCollapsedSelection) {
            const pos = editor.getFocusedPosition();

            if (pos) {
                setPendingFormat(editor, segmentAndParagraphs[0][0].format, pos);
            }
        }

        if (isCollapsedSelection) {
            editor.focus();
            return false;
        } else {
            return formatsAndSegments.length > 0;
        }
    });
}
