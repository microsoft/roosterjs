import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { formatWithContentModel } from './formatWithContentModel';
import { getSelectedSegments } from '../../modelApi/selection/collectSelections';
import { selectWord } from '../utils/selectWord';
import {
    DomToModelOption,
    IExperimentalContentModelEditor,
} from '../../publicTypes/IExperimentalContentModelEditor';
/**
 * @internal
 */
export function formatSegmentWithContentModel(
    editor: IExperimentalContentModelEditor,
    apiName: string,
    toggleStyleCallback: (format: ContentModelSegmentFormat, isTuringOn: boolean) => void,
    segmentHasStyleCallback?: (format: ContentModelSegmentFormat) => boolean,
    includingFormatHolder?: boolean,
    domToModelOptions?: DomToModelOption
) {
    formatWithContentModel(
        editor,
        apiName,
        model => {
            let segments = getSelectedSegments(model, !!includingFormatHolder);
            const pendingFormat = editor.getPendingFormat();
            let isCollapsedSelection =
                segments.length == 1 && segments[0].segmentType == 'SelectionMarker';

            if (isCollapsedSelection) {
                segments = selectWord(model, segments[0]);
                if (segments.length > 1) {
                    isCollapsedSelection = false;
                }
            }

            const formatsAndSegments: [
                ContentModelSegmentFormat,
                ContentModelSegment | null
            ][] = pendingFormat
                ? [[pendingFormat, null]]
                : segments.map(segment => [segment.format, segment]);

            const isTurningOff = segmentHasStyleCallback
                ? formatsAndSegments.every(([format, segment]) =>
                      segmentHasStyleCallback(format, segment)
                  )
                : false;

            formatsAndSegments.forEach(([format, segment]) =>
                toggleStyleCallback(format, !isTurningOff, segment)
            );

            if (!pendingFormat && isCollapsedSelection) {
                editor.setPendingFormat(segments[0].format);
            }

            return formatsAndSegments.length > 0;
        },
        domToModelOptions
    );
}
