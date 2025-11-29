import { toArray } from './toArray';

/**
 * Retrieves metadata from the given document, including HTML attributes and meta tags.
 * @param doc The document from which to retrieve metadata.
 * @returns A record containing metadata key-value pairs.
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
