import createRange from './createRange';
import safeInstanceOf from '../utils/safeInstanceOf';
import validate from '../metadata/validate';
import {
    createArrayDefinition,
    createBooleanDefinition,
    createNumberDefinition,
    createObjectDefinition,
    createStringDefinition,
} from '../metadata/definitionCreators';
import {
    ContentMetadata,
    SelectionRangeTypes,
    TrustedHTMLHandler,
    NormalContentMetadata,
    TableContentMetadata,
    Coordinates,
} from 'roosterjs-editor-types';

/**
 * @deprecated Use setHtmlWithMetadata instead
 * Restore inner HTML of a root element from given html string. If the string contains selection path,
 * remove the selection path and return a range represented by the path
 * @param root The root element
 * @param html The HTML to restore
 * @param trustedHTMLHandler An optional trusted HTML handler to convert HTML string to security string
 * @returns A selection range if the html contains a valid selection path, otherwise null
 */
export default function setHtmlWithSelectionPath(
    rootNode: HTMLElement,
    html: string,
    trustedHTMLHandler?: TrustedHTMLHandler
): Range | null {
    const metadata = setHtmlWithMetadata(rootNode, html, trustedHTMLHandler);
    return metadata?.type == SelectionRangeTypes.Normal
        ? createRange(rootNode, metadata.start, metadata.end)
        : null;
}

/**
 * Restore inner HTML of a root element from given html string. If the string contains metadata,
 * remove it from DOM tree and return the metadata
 * @param root The root element
 * @param html The HTML to restore
 * @param trustedHTMLHandler An optional trusted HTML handler to convert HTML string to security string
 * @returns Content metadata if any, or undefined
 */
export function setHtmlWithMetadata(
    rootNode: HTMLElement,
    html: string,
    trustedHTMLHandler?: TrustedHTMLHandler
): ContentMetadata | undefined {
    if (!rootNode) {
        return undefined;
    }

    html = html || '';
    rootNode.innerHTML = trustedHTMLHandler?.(html) || html;

    const potentialMetadataComment = rootNode.lastChild;

    if (safeInstanceOf(potentialMetadataComment, 'Comment')) {
        try {
            const obj = JSON.parse(potentialMetadataComment.nodeValue || '');

            if (
                validate(obj, NormalContentMetadataDefinition) ||
                validate(obj, TableContentMetadataDefinition)
            ) {
                rootNode.removeChild(potentialMetadataComment);
                return obj;
            }
        } catch {}
    }

    return undefined;
}

const NumberArrayDefinition = createArrayDefinition<number>(createNumberDefinition());

const CoordinatesDefinition = createObjectDefinition<Coordinates>({
    x: createNumberDefinition(),
    y: createNumberDefinition(),
});

const NormalContentMetadataDefinition = createObjectDefinition<NormalContentMetadata>({
    start: NumberArrayDefinition,
    end: NumberArrayDefinition,
    isDarkMode: createBooleanDefinition(),
    type: createNumberDefinition(SelectionRangeTypes.Normal),
});

const TableContentMetadataDefinition = createObjectDefinition<TableContentMetadata>({
    tableId: createStringDefinition(),
    firstCell: CoordinatesDefinition,
    lastCell: CoordinatesDefinition,
    isDarkMode: createBooleanDefinition(),
    type: createNumberDefinition(SelectionRangeTypes.TableSelection),
});
