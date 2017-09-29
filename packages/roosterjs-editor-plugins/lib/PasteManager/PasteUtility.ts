import ClipboardData, { LocalFileImageData, Base64ImageData } from './ClipboardData';
import { Editor } from 'roosterjs-editor-core';

const LOCALFILEREFERENCEREGEX = new RegExp('^file:///[a-zA-Z]:', 'i');
const BASE64IMAGEDATAREGEX = new RegExp('^data:(image\\/\\w+);base64,([A-Za-z0-9+/=]+?)$', 'i');
const SAFARI_IMAGE_BLOB_PREFIX = 'blob:';
const WEBKIT_FAKE_URL_IMAGE_PREFIX = 'webkit-fake-url:';
const PASTED_IMAGE_ATTRIBUTE_NAME = 'data-pastedImageId';

export function validateFileType(file: File): boolean {
    return file instanceof Blob;
}

export function processImages(pasteContainer: HTMLElement, clipboardData: ClipboardData) {
    let images = pasteContainer.querySelectorAll('img');
    let imageCount = images.length;
    for (let i = 0; i < imageCount; i++) {
        let image = images[i];
        let imageSrc = image.getAttribute('src');
        // Check for images with no src or images pasted from Safari which don't have usable sources
        if (
            !imageSrc ||
            imageSrc.indexOf(SAFARI_IMAGE_BLOB_PREFIX) === 0 ||
            imageSrc.indexOf(WEBKIT_FAKE_URL_IMAGE_PREFIX) === 0
        ) {
            if (!clipboardData.imageData.noSrcImageIds) {
                clipboardData.imageData.noSrcImageIds = [];
            }

            clipboardData.imageData.noSrcImageIds.push(addUniqueIdToImage(image));
            continue;
        }

        // Check for images with src as local file path (normally comes from pasting images & text from Office)
        let localFileImage = parseLocalFileImageData(image, imageSrc);
        if (localFileImage) {
            if (!clipboardData.imageData.localFileImages) {
                clipboardData.imageData.localFileImages = [];
            }

            clipboardData.imageData.localFileImages.push(localFileImage);
            continue;
        }

        // Check for images with src as base64 data uri
        let base64Image = parseBase64ImageData(image, imageSrc);
        if (base64Image) {
            if (!clipboardData.imageData.base64Images) {
                clipboardData.imageData.base64Images = [];
            }

            clipboardData.imageData.base64Images.push(base64Image);
        }
    }
}

export function getPastedElementWithId(editor: Editor, uniqueId: string): Element {
    let selector = `img[${PASTED_IMAGE_ATTRIBUTE_NAME}="${uniqueId}"]`;
    let nodes = editor.queryContent(selector);
    if (nodes && nodes.length > 0) {
        return nodes.item(0);
    }

    return null;
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

function getGuid(): string {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function addUniqueIdToImage(image: HTMLImageElement): string {
    let uniqueId = getGuid();
    image.setAttribute(PASTED_IMAGE_ATTRIBUTE_NAME, uniqueId);
    return uniqueId;
}

function parseLocalFileImageData(
    imageNode: HTMLImageElement,
    imageSrc: string
): LocalFileImageData {
    let localFileImageData: LocalFileImageData = null;
    let matchedValues = imageSrc.match(LOCALFILEREFERENCEREGEX);
    if (matchedValues && matchedValues.length > 0) {
        localFileImageData = {
            path: imageSrc,
            imageId: addUniqueIdToImage(imageNode),
        };
    }

    return localFileImageData;
}

function parseBase64ImageData(imageNode: HTMLImageElement, imageSrc: string): Base64ImageData {
    let base64ImageData: Base64ImageData = null;
    let matchedValues = imageSrc.match(BASE64IMAGEDATAREGEX);
    if (matchedValues && matchedValues.length === 3) {
        base64ImageData = {
            base64Content: matchedValues[2],
            mimeType: matchedValues[1],
            imageId: addUniqueIdToImage(imageNode),
        };
    }
    return base64ImageData;
}
