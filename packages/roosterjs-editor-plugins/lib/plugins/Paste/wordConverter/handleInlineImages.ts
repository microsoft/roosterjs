import { toArray } from 'roosterjs-editor-dom';

export default function handleInlineImages(fragment: DocumentFragment, rtf?: string) {
    const imageElements = toArray(fragment.querySelectorAll('img')).filter(img => !img.alt);

    if (rtf && imageElements.length > 0) {
        const imageContents = getImagesFromRtf(rtf);

        if (imageElements.length == imageContents.length) {
            imageElements.forEach((imageElement, i) => {
                if (imageContents[i]) {
                    const dataUrl = createDataUrlFromImageContent(imageContents[i]);
                    imageElement.src = 'data:image/png;base64,' + dataUrl;
                }
            });
        }
    }
}

function getImagesFromRtf(content: string) {
    const knownImageTags: string[] = [];
    const result: string[] = [];

    let startIndex = 0;

    while (startIndex >= 0 && startIndex < content.length) {
        const imageTagStartIndex = content.indexOf('{\\*\\blipuid', startIndex);
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
                result.push(imageData.replace(/[\r\n]/g, ''));
                knownImageTags.push(imageTag);
            }

            startIndex = imageEndIndex + 1;
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

        const str = String.fromCharCode.apply(null, unit8Array);

        result.push(btoa(str));
    }

    return result.join('');
}
