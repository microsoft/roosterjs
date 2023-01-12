import { addLink } from '../common/addLink';
import { addSegment } from '../common/addSegment';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelLink } from '../../publicTypes/decorator/ContentModelLink';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createContentModelDocument } from '../creators/createContentModelDocument';
import { createText } from '../creators/createText';
import { getSelectedSegments } from '../selection/collectSelections';
import { HyperLinkColorPlaceholder } from '../../formatHandlers/utils/defaultStyles';
import { LinkFormat } from '../../publicTypes/format/formatParts/LinkFormat';
import { mergeModel } from '../common/mergeModel';

/**
 * @internal
 */
export function insertModelLink(
    model: ContentModelDocument,
    displayText: string,
    format: LinkFormat
) {
    const segments = getSelectedSegments(model, false /*includingFormatHolder*/);
    const originalText = segments.map(x => (x.segmentType == 'Text' ? x.text : '')).join('');
    const link: ContentModelLink = {
        dataset: {},
        format,
    };

    if (
        segments.every(x => x.segmentType == 'SelectionMarker') ||
        (!!displayText && displayText != originalText)
    ) {
        const segment = createText(displayText, segments[0]?.format);
        const doc = createContentModelDocument();

        addLink(segment, link);
        addSegment(doc, segment);
        updateLinkSegmentFormat(segment.format);

        mergeModel(model, doc);
    } else if (displayText == originalText || !displayText) {
        segments.forEach(x => {
            addLink(x, link);
            updateLinkSegmentFormat(x.format);
        });
    }

    return segments.length > 0;
}

function updateLinkSegmentFormat(format: ContentModelSegmentFormat) {
    format.underline = true;
    format.textColor = HyperLinkColorPlaceholder;
}
