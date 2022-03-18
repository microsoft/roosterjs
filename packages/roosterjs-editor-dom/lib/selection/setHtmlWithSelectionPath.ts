import createRange from './createRange';
import safeInstanceOf from '../utils/safeInstanceOf';
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

            if (isContentMetadata(obj)) {
                rootNode.removeChild(potentialMetadataComment);
                return obj;
            }
        } catch {}
    }

    return undefined;
}

function isContentMetadata(obj: any): obj is ContentMetadata {
    if (!obj || typeof obj != 'object') {
        return false;
    }

    switch (obj.type || SelectionRangeTypes.Normal) {
        case SelectionRangeTypes.Normal:
            const regularMetadata = obj as NormalContentMetadata;
            if (isNumberArray(regularMetadata.start) && isNumberArray(regularMetadata.end)) {
                obj.type = SelectionRangeTypes.Normal;
                obj.isDarkMode = !!obj.isDarkMode;
                return true;
            }
            break;

        case SelectionRangeTypes.TableSelection:
            const tableMetadata = obj as TableContentMetadata;
            if (
                typeof tableMetadata.tableId == 'string' &&
                !!tableMetadata.tableId &&
                isCoordinates(tableMetadata.firstCell) &&
                isCoordinates(tableMetadata.lastCell)
            ) {
                obj.isDarkMode = !!obj.isDarkMode;
                return true;
            }
            break;
    }

    return false;
}

function isNumberArray(obj: any): obj is number[] {
    return obj && Array.isArray(obj) && obj.every(o => typeof o == 'number');
}

function isCoordinates(obj: any): obj is Coordinates {
    const coordinates = obj as Coordinates;
    return (
        coordinates &&
        typeof coordinates == 'object' &&
        typeof coordinates.x == 'number' &&
        typeof coordinates.y == 'number'
    );
}
