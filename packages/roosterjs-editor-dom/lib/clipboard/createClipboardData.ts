import { ClipboardData } from 'roosterjs-editor-types';

/**
 * @internal
 */
export default function createClipboardData(
    types: string[] = [],
    text: string = ''
): ClipboardData {
    return {
        types,
        text,
        image: null,
        rawHtml: null,
        customValues: {},
    };
}
