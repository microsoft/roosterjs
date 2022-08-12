import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { getSelectionPosition } from '../utils/getSelectionPosition';
import { handleBlock } from './handleBlock';
import { ModelToDomContext } from '../context/ModelToDomContext';
import { NodePosition } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function handleSegment(
    doc: Document,
    parent: Node,
    segment: ContentModelSegment,
    context: ModelToDomContext
) {
    let pos: NodePosition | undefined;

    const regularSelection = context.regularSelection || {};

    if (!regularSelection.start && segment.isSelected) {
        pos = getSelectionPosition(regularSelection);
        regularSelection.start = pos;
    }

    if (regularSelection.start && !regularSelection.end && !segment.isSelected) {
        regularSelection.end = pos || getSelectionPosition(regularSelection);
    }

    context.regularSelection = regularSelection;

    let element: HTMLElement | null = null;

    switch (segment.segmentType) {
        case ContentModelSegmentType.Text:
            const txt = doc.createTextNode(segment.text);

            element = doc.createElement('span');
            element.appendChild(txt);
            regularSelection.currentSegmentNode = txt;
            break;

        case ContentModelSegmentType.Br:
            element = doc.createElement('br');
            regularSelection.currentSegmentNode = element;
            break;

        case ContentModelSegmentType.General:
            regularSelection.currentSegmentNode = segment.element;

            handleBlock(doc, parent, segment, context);
            break;
    }

    if (element) {
        parent.appendChild(element);
    }
}
