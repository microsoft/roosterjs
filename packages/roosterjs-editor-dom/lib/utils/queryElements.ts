/**
 * Query HTML elements in teh container by a selector string
 * @param container Container element to query from
 * @param selector Selector string to query
 * @param forEachCallback An optional callback to be invoked on each node in query result
 * @returns HTML Element array of the query result
 */
export default function queryElements(
    container: HTMLElement,
    selector: string,
    forEachCallback?: (node: HTMLElement) => any
) {
    let elements = [].slice.call(container.querySelectorAll(selector)) as HTMLElement[];
    if (forEachCallback) {
        elements.forEach(forEachCallback);
    }
    return elements;
}
