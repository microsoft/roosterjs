import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { formatWithContentModel } from './formatWithContentModel';
import { getSelectedSegments } from '../../modelApi/selection/collectSelections';
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
            const segments = getSelectedSegments(model, !!includingFormatHolder);
            const pendingFormat = editor.getPendingFormat();
            const formats = pendingFormat
                ? [pendingFormat]
                : segments.map(segment => segment.format);

            const isTurningOff = segmentHasStyleCallback
                ? formats.every(format => segmentHasStyleCallback(format))
                : false;

            formats.forEach(format => toggleStyleCallback(format, !isTurningOff));

            if (
                !pendingFormat &&
                segments.length == 1 &&
                segments[0].segmentType == 'SelectionMarker'
            ) {
                editor.setPendingFormat(segments[0].format);
            }

            return formats.length > 0;
        },
        domToModelOptions
    );
}
