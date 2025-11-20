import { getDocumentSource } from 'roosterjs-content-model-dom';
import type {
    BeforePasteEvent,
    EditorEnvironment,
    GetSourceInputParams,
    KnownDocumentSourceType,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * This function tries to get the source of the Pasted content
 * @param event the before paste event
 * @param shouldConvertSingleImage Whether convert single image is enabled.
 * @returns The Type of pasted content, if no type found will return {KnownSourceType.Default}
 */
export function getPasteSource(
    event: BeforePasteEvent,
    shouldConvertSingleImage: boolean,
    environment: EditorEnvironment
): KnownDocumentSourceType {
    const { htmlAttributes, clipboardData, fragment } = event;

    const param: GetSourceInputParams = {
        htmlAttributes,
        fragment,
        shouldConvertSingleImage,
        clipboardItemTypes: clipboardData.types,
        htmlFirstLevelChildTags: clipboardData.htmlFirstLevelChildTags,
        environment,
        rawHtml: clipboardData.rawHtml,
    };

    return getDocumentSource(param);
}
