import { toArray } from './toArray';

/**
 * Retrieves metadata from the given Document object.
 * Consisting of key-value pairs from meta tags and html attributes.
 * @param doc The Document object to retrieve metadata from
 * @returns A record containing metadata key-value pairs
 */
export function retrieveDocumentMetadata(doc: Document): Record<string, string> {
    const result: Record<string, string> = {};
    const attributes = doc.querySelector('html')?.attributes;

    (attributes ? toArray(attributes) : []).forEach(attr => {
        result[attr.name] = attr.value;
    });

    toArray(doc.querySelectorAll('meta')).forEach(meta => {
        result[meta.name] = meta.content;
    });

    return result;
}
