import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { handleBlock } from './handleBlock';
import { ModelToDomContext } from '../context/ModelToDomContext';

/**
 * @internal
 */
export function handleSegment(
    doc: Document,
    parent: Node,
    segment: ContentModelSegment,
    context: ModelToDomContext
) {
    const regularSelection = context.regularSelection;

    // If start position is not set yet, and current segment is in selection, set start position and finalized it
    if (segment.isSelected && !regularSelection.start) {
        regularSelection.start = {
            ...regularSelection.current,
            isFinalized: true,
        };
    }

    // If end position is not set, or it is not finalized, and current segment is not in selection, set end position and finalized it
    // since we know there won't be another segment in selection.
    // If there is other selection, it means the content model is in bad state, selections are not continuous. we should ignore further selection.
    if (!segment.isSelected && regularSelection.start && !regularSelection.end?.isFinalized) {
        regularSelection.end = {
            ...regularSelection.current,
            isFinalized: true,
        };
    }

    let element: HTMLElement | null = null;

    switch (segment.segmentType) {
        case ContentModelSegmentType.Text:
            const txt = doc.createTextNode(segment.text);

            element = doc.createElement('span');
            element.appendChild(txt);
            regularSelection.current.segment = txt;
            break;

        case ContentModelSegmentType.Br:
            element = doc.createElement('br');
            regularSelection.current.segment = element;
            break;

        case ContentModelSegmentType.General:
            regularSelection.current.segment = segment.element;

            handleBlock(doc, parent, segment, context);
            break;
    }

    if (element) {
        parent.appendChild(element);
    }

    // If end position is not set, or it is not finalized, and current segment is in selection, set end position but do not finalize it.
    // Because next segment may also be in selection, or this may be the last segment. But we don't know such info here.
    if (segment.isSelected && !regularSelection.end?.isFinalized) {
        regularSelection.end = {
            ...regularSelection.current,
        };
    }
}
