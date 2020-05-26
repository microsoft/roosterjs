import toArray from './toArray';
import { DocumentPosition, NodeType, QueryScope } from 'roosterjs-editor-types';

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

    let elements = toArray(container.querySelectorAll<HTMLElement>(selector));

    if (scope != QueryScope.Body && range) {
        let { startContainer, startOffset, endContainer, endOffset } = range;
        startContainer =
            startContainer.nodeType == NodeType.Element && startContainer.firstChild
                ? startContainer.childNodes[startOffset]
                : startContainer;
        endContainer =
            endContainer.nodeType == NodeType.Element && endContainer.firstChild && endOffset > 0
                ? endContainer.childNodes[endOffset - 1]
                : endContainer;

        elements = elements.filter(element =>
            isIntersectWithNodeRange(
                element,
                startContainer,
                endContainer,
                scope == QueryScope.InSelection
            )
        );
    }

    if (forEachCallback) {
        elements.forEach(forEachCallback);
    }
    return elements;
}

function isIntersectWithNodeRange(
    node: Node,
    startNode: Node,
    endNode: Node,
    nodeContainedByRangeOnly: boolean
): boolean {
    let startPosition = node.compareDocumentPosition(startNode);
    let endPosition = node.compareDocumentPosition(endNode);
    let targetPositions = [DocumentPosition.Same, DocumentPosition.Contains];

    if (!nodeContainedByRangeOnly) {
        targetPositions.push(DocumentPosition.ContainedBy);
    }

    return (
        checkPosition(startPosition, targetPositions) || // intersectStart
        checkPosition(endPosition, targetPositions) || // intersectEnd
        (checkPosition(startPosition, [DocumentPosition.Preceding]) && // Contains
            checkPosition(endPosition, [DocumentPosition.Following]) &&
            !checkPosition(endPosition, [DocumentPosition.ContainedBy]))
    );
}

function checkPosition(position: DocumentPosition, targets: DocumentPosition[]): boolean {
    return targets.some(target =>
        target == DocumentPosition.Same
            ? position == DocumentPosition.Same
            : (position & target) == target
    );
}
