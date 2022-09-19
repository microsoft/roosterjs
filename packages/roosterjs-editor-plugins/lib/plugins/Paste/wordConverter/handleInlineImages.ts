import { toArray } from 'roosterjs-editor-dom';

export default function handleInlineImages(fragment: DocumentFragment, rtf?: string) {
    const imageElements = toArray(fragment.querySelectorAll('img'));

    if (rtf && imageElements.length > 0) {
        const imageDataUrls = getImagesFromRtf(rtf);

        if (imageElements.length == imageDataUrls.length) {
            imageElements.forEach((imageElement, i) => {
                imageElement.src = imageDataUrls[i];
            });
        }
    }
}

function getImagesFromRtf(content: string) {
    const stack: RtfEntry = [];
    let result: RtfEntry;

    for (let i = 0; i < content.length; i++) {
        const c = content[i];

        switch (c) {
            case '{':
                const newObj: RtfEntry = [];

                if (stack.length > 0) {
                    (stack[stack.length - 1] as RtfEntry).push(newObj);
                }

                stack.push(newObj);
                break;

            case '}':
                result = stack.pop() as RtfEntry;

                break;

            case '\r':
            case '\n':
                break;

            default:
                const obj = stack[stack.length - 1] as RtfEntry;

                if (typeof obj[obj.length - 1] !== 'string') {
                    obj.push('');
                }

                obj[obj.length - 1] += c;

                break;
        }
    }

    const images: Record<string, string> = {};

    findImageInternal(result, images);

    return Object.values(images);
}

type RtfEntry = (string | RtfEntry)[];

function findImageInternal(doc: RtfEntry | string, results: Record<string, string>) {
    if (typeof doc !== 'object') {
        return;
    }

    for (let i = 0; i < doc.length; i++) {
        const item = doc[i];

        if (typeof item != 'object') {
            continue;
        }

        const firstChild = item[0];
        const fileContent = doc[i + 1];

        if (
            item.length == 1 &&
            typeof firstChild === 'string' &&
            firstChild.indexOf('\\*\\blipuid') == 0 &&
            typeof fileContent == 'string'
        ) {
            i++;

            if (!results[firstChild]) {
                results[firstChild] = createFileFromImageSource(fileContent);
            }
        } else {
            findImageInternal(doc[i], results);
        }
    }
}

function createFileFromImageSource(dataUri: string) {
    const arrayBuilder = new ArrayBuffer(dataUri.length / 2);
    const unit8Array = new Uint8Array(arrayBuilder);

    for (let i = 0; i < dataUri.length; i += 2) {
        unit8Array[i / 2] = parseInt(dataUri[i] + dataUri[i + 1], 16);
    }

    return 'data:image/png;base64, ' + btoa(String.fromCharCode.apply(null, unit8Array));
}
