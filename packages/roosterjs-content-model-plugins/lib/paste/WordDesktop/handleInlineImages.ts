import { toArray } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function handleInlineImages(fragment: DocumentFragment, rtf?: string) {
    const imageElements = toArray(
        fragment.querySelectorAll('img[src^="file:///"]')
    ) as HTMLImageElement[];

    if (rtf && imageElements.length > 0) {
        const imageContents = getImagesFromRtf(rtf);

        if (imageElements.length == imageContents.length) {
            imageElements.forEach((imageElement, i) => {
                if (imageContents[i]) {
                    imageElement.src = 'data:image/png;base64,' + imageContents[i];
                } else {
                    imageElement.parentElement?.removeChild(imageElement);
                }
            });
        }
    }
}

function parsePair(content: string, startIndex: number) {
    let level = 1;
    let index = startIndex;

    while (index < content.length) {
        const c = content[index];

        if (c == '{') {
            level++;
        } else if (c == '}') {
            level--;

            if (level == 0) {
                break;
            }
        }
        index++;
    }

    return index;
}

function getImagesFromRtf(content: string) {
    const knownImageTags: string[] = [];
    const result: string[] = [];

    let startIndex = 0;

    while (startIndex >= 0 && startIndex < content.length) {
        const imageTagStartIndex = content.indexOf('{\\*\\blipuid', startIndex);
        const shapeStartIndex = content.indexOf('{\\*\\shpinst', startIndex);
        const shapeGroupStartIndex = content.indexOf('\\shpgrp', startIndex);

        if (
            imageTagStartIndex >= 0 &&
            (shapeStartIndex < 0 || imageTagStartIndex < shapeStartIndex) &&
            (shapeGroupStartIndex < 0 || imageTagStartIndex < shapeGroupStartIndex)
        ) {
            const imageTagEndIndex =
                imageTagStartIndex >= 0 ? content.indexOf('}', imageTagStartIndex) : -1;
            const imageTag =
                imageTagEndIndex >= 0
                    ? content.substring(imageTagStartIndex + 1, imageTagEndIndex)
                    : '';

            if (imageTag) {
                const imageStartIndex = imageTagEndIndex + 1;
                const imageEndIndex = content.indexOf('}', imageStartIndex);
                const imageData = content.substring(imageStartIndex, imageEndIndex);

                if (knownImageTags.indexOf(imageTag) < 0) {
                    const blob = imageData.replace(/[\r\n]/g, '');
                    const dataUri = createDataUrlFromImageContent(blob);
                    result.push(dataUri);
                    knownImageTags.push(imageTag);
                }

                startIndex = imageEndIndex + 1;
            } else {
                break;
            }
        } else if (
            shapeGroupStartIndex >= 0 &&
            (shapeStartIndex < 0 || shapeStartIndex > shapeGroupStartIndex)
        ) {
            result.push('');
            startIndex = parsePair(content, shapeGroupStartIndex + 1);
        } else if (
            shapeStartIndex >= 0 &&
            (shapeGroupStartIndex < 0 || shapeGroupStartIndex > shapeStartIndex)
        ) {
            result.push('');
            startIndex = parsePair(content, shapeStartIndex + 1);
        } else {
            break;
        }
    }

    return result;
}

const trunkSize = 240000;

function createDataUrlFromImageContent(content: string) {
    const trunkCount = Math.floor((content.length - 1) / trunkSize) + 1;
    const result: string[] = [];

    for (let trunk = 0; trunk < trunkCount; trunk++) {
        const base = trunk * trunkSize;
        const contentLength = Math.min(trunkSize, content.length - base);
        const arrayBuilder = new ArrayBuffer(contentLength / 2);
        const unit8Array = new Uint8Array(arrayBuilder);

        for (let j = 0; j < contentLength; j += 2) {
            unit8Array[j / 2] = parseInt(content[j + base] + content[j + base + 1], 16);
        }

        const str = String.fromCharCode.apply(null, unit8Array as any);

        result.push(btoa(str));
    }

    return result.join('');
}
