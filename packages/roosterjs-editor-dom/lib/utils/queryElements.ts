import isDocumentPosition from './isDocumentPosition';
import { DocumentPosition } from 'roosterjs-editor-types';
import { QueryScope } from 'roosterjs-editor-types';

/**
 * Query HTML elements in the container by a selector string
 * @param container Container element to query from
 * @param selector Selector string to query
 * @param forEachCallback An optional callback to be invoked on each node in query result
 * @param scope The scope of the query, default value is QueryScope.Body
 * @param range The selection range to query with. This is required when scope is not Body
 * @returns HTML Element array of the query result
 */
export default function queryElements(
    container: HTMLElement,
    selector: string,
    forEachCallback?: (node: HTMLElement) => any,
    scope: QueryScope = QueryScope.Body,
    range?: Range
): HTMLElement[] {
    if (!container || !selector) {
        return [];
    }

    let elements = [].slice.call(container.querySelectorAll(selector)) as HTMLElement[];

    if (scope != QueryScope.Body && range) {
        elements = elements.filter(element =>
            isIntersectWithNodeRange(element, range, scope == QueryScope.InSelection)
        );
    }

    if (forEachCallback) {
        elements.forEach(forEachCallback);
    }
    return elements;
}

function isIntersectWithNodeRange(
    node: Node,
    range: Range,
    nodeContainedByRangeOnly: boolean
): boolean {
    let startPosition = node.compareDocumentPosition(range.startContainer);
    let endPosition = node.compareDocumentPosition(range.endContainer);
    let targetPositions = [DocumentPosition.Same, DocumentPosition.Contains];

    if (!nodeContainedByRangeOnly) {
        targetPositions.push(DocumentPosition.ContainedBy);
    }

    return (
        isDocumentPosition(startPosition, targetPositions) || // intersectStart
        isDocumentPosition(endPosition, targetPositions) || // intersectEnd
        (isDocumentPosition(startPosition, DocumentPosition.Preceding) && // Contains
            isDocumentPosition(endPosition, DocumentPosition.Following) &&
            !isDocumentPosition(endPosition, DocumentPosition.ContainedBy))
    );
}
