import { toArray } from 'roosterjs-editor-dom';

export default function handleInlineImages(fragment: DocumentFragment, rtf?: string) {
    const imageElements = toArray(fragment.querySelectorAll('img'));

    if (rtf && imageElements.length > 0) {
        const imageContents = getImagesFromRtf(rtf);

        if (imageElements.length == imageContents.length) {
            imageElements.forEach((imageElement, i) => {
                const dataUrl = createDataUrlFromImageContent(imageContents[i]);
                imageElement.src = 'data:image/png;base64,' + dataUrl;
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

function createDataUrlFromImageContent(content: string) {
    const arrayBuilder = new ArrayBuffer(content.length / 2);
    const unit8Array = new Uint8Array(arrayBuilder);

    for (let i = 0; i < content.length; i += 2) {
        unit8Array[i / 2] = parseInt(content[i] + content[i + 1], 16);
    }

    return btoa(String.fromCharCode.apply(null, unit8Array));
}
