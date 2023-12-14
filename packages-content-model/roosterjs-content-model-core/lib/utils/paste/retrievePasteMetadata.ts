import { toArray } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function retrievePasteMetadata(doc: Document, htmlAttributes: Record<string, string>) {
    if (doc) {
        const attributes = doc.querySelector('html')?.attributes;

        (attributes ? toArray(attributes) : []).forEach(attr => {
            htmlAttributes[attr.name] = attr.value;
        });

        toArray(doc.querySelectorAll('meta')).forEach(meta => {
            htmlAttributes[meta.name] = meta.content;
        });
    }
}
