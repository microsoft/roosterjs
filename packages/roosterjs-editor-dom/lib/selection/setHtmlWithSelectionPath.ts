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
    ImageContentMetadata,
    NormalContentMetadata,
    TableContentMetadata,
    Coordinates,
} from 'roosterjs-editor-types';
const NumberArrayDefinition = createArrayDefinition<number>(createNumberDefinition());

const CoordinatesDefinition = createObjectDefinition<Coordinates>({
    x: createNumberDefinition(),
    y: createNumberDefinition(),
});

const IsDarkModeDefinition = createBooleanDefinition(true /*isOptional*/);

const NormalContentMetadataDefinition = createObjectDefinition<NormalContentMetadata>({
    type: createNumberDefinition(true /*isOptional*/, SelectionRangeTypes.Normal),
    isDarkMode: IsDarkModeDefinition,
    start: NumberArrayDefinition,
    end: NumberArrayDefinition,
});

const TableContentMetadataDefinition = createObjectDefinition<TableContentMetadata>({
    type: createNumberDefinition(false /*isOptional*/, SelectionRangeTypes.TableSelection),
    isDarkMode: IsDarkModeDefinition,
    tableId: createStringDefinition(),
    firstCell: CoordinatesDefinition,
    lastCell: CoordinatesDefinition,
});

const ImageContentMetadataDefinition = createObjectDefinition<ImageContentMetadata>({
    type: createNumberDefinition(false /*isOptional*/, SelectionRangeTypes.ImageSelection),
    isDarkMode: IsDarkModeDefinition,
    imageId: createStringDefinition(),
});

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

    return extractContentMetadata(rootNode);
}

/**
 * Extract content metadata from DOM tree
 * @param rootNode Root of the DOM tree
 * @returns If there is a valid content metadata node in the give DOM tree, return this metadata object, otherwise undefined
 */
export function extractContentMetadata(rootNode: HTMLElement): ContentMetadata | undefined {
    const potentialMetadataComment = rootNode.lastChild;

    if (safeInstanceOf(potentialMetadataComment, 'Comment')) {
        try {
            const obj = JSON.parse(potentialMetadataComment.nodeValue || '');

            if (
                validate(obj, NormalContentMetadataDefinition) ||
                validate(obj, TableContentMetadataDefinition) ||
                validate(obj, ImageContentMetadataDefinition)
            ) {
                rootNode.removeChild(potentialMetadataComment);
                obj.type = typeof obj.type === 'undefined' ? SelectionRangeTypes.Normal : obj.type;
                obj.isDarkMode = obj.isDarkMode || false;

                return obj;
            }
        } catch {}
    }

    return undefined;
}
