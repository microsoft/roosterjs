import type {
    ContentModelSegmentHandler,
    ContentModelSelectionMarker,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleSelectionMarker: ContentModelSegmentHandler<ContentModelSelectionMarker> = (
    doc,
    parent,
    segment,
    context
) => {
    if (!segment.isSelected && segment.owner && segment.owner != context.owner) {
        const element = createCoauthoringMarker(doc, segment.owner);
        parent.appendChild(element);
    }
};

function createCoauthoringMarker(doc: Document, owner: string) {
    const element = doc.createElement('span');
    element.style.display = 'inline-block';
    element.style.width = '2px';
    element.style.height = '1em';
    element.style.backgroundColor = 'blue';
    element.style.border = '1px solid white';
    element.style.margin = '0 -2px';
    element.style.verticalAlign = 'bottom';
    element.contentEditable = 'false';
    element.className = 'roosterjs-coauthoring-marker';
    element.dataset.owner = owner;

    const ownerTag = doc.createElement('span');

    ownerTag.style.position = 'absolute';
    ownerTag.style.backgroundColor = 'blue';
    ownerTag.style.color = 'white';
    ownerTag.style.fontSize = '10px';
    ownerTag.style.padding = '1px 3px';
    ownerTag.style.borderRadius = '3px';
    ownerTag.style.transform = 'translateY(-100%)';
    ownerTag.style.pointerEvents = 'none';
    ownerTag.innerText = owner;

    element.appendChild(ownerTag);

    return element;
}
