import { createImageCropper } from '../Cropper/createImageCropper';
import { createImageResizer } from '../Resizer/createImageResizer';
import { createImageRotator } from '../Rotator/createImageRotator';
import { wrap } from 'roosterjs-content-model-dom';

import type {
    IEditor,
    ImageEditOperation,
    ImageMetadataFormat,
} from 'roosterjs-content-model-types';
import type { ImageEditOptions } from '../types/ImageEditOptions';
import type { ImageHtmlOptions } from '../types/ImageHtmlOptions';

const IMAGE_EDIT_SHADOW_ROOT = 'ImageEditShadowRoot';

/**
 * @internal
 */
export interface WrapperElements {
    wrapper: HTMLSpanElement;
    shadowSpan: HTMLElement;
    imageClone: HTMLImageElement;
    resizers: HTMLDivElement[];
    rotators: HTMLDivElement[];
    croppers: HTMLDivElement[];
}

/**
 * @internal
 */
export function createImageWrapper(
    editor: IEditor,
    image: HTMLImageElement,
    options: ImageEditOptions,
    editInfo: ImageMetadataFormat,
    htmlOptions: ImageHtmlOptions,
    operation: ImageEditOperation[]
): WrapperElements {
    const imageClone = cloneImage(image, editInfo);
    const doc = editor.getDocument();

    let rotators: HTMLDivElement[] = [];
    if (!options.disableRotate && operation.indexOf('rotate') > -1) {
        rotators = createImageRotator(doc, htmlOptions);
    }
    let resizers: HTMLDivElement[] = [];
    if (operation.indexOf('resize') > -1) {
        resizers = createImageResizer(doc);
    }

    let croppers: HTMLDivElement[] = [];
    if (operation.indexOf('crop') > -1) {
        croppers = createImageCropper(doc);
    }

    const wrapper = createWrapper(
        editor,
        imageClone,
        options,
        editInfo,
        resizers,
        rotators,
        croppers
    );
    const imageSpan = wrap(doc, image, 'span');
    const shadowSpan = createShadowSpan(wrapper, imageSpan);
    return { wrapper, shadowSpan, imageClone, resizers, rotators, croppers };
}

const createShadowSpan = (wrapper: HTMLElement, imageSpan: HTMLSpanElement) => {
    const shadowRoot = imageSpan.attachShadow({
        mode: 'open',
    });
    imageSpan.id = IMAGE_EDIT_SHADOW_ROOT;
    wrapper.style.verticalAlign = 'bottom';
    shadowRoot.appendChild(wrapper);
    return imageSpan;
};

const createWrapper = (
    editor: IEditor,
    image: HTMLImageElement,
    options: ImageEditOptions,
    editInfo: ImageMetadataFormat,
    resizers?: HTMLDivElement[],
    rotators?: HTMLDivElement[],
    cropper?: HTMLDivElement[]
) => {
    const doc = editor.getDocument();
    const wrapper = doc.createElement('span');
    const imageBox = doc.createElement('div');

    imageBox.setAttribute(
        `style`,
        `position:relative;width:100%;height:100%;overflow:hidden;transform:scale(1);`
    );
    imageBox.appendChild(image);
    wrapper.setAttribute(
        'style',
        `font-size: 24px; margin: 0px; transform: rotate(${editInfo.angleRad ?? 0}rad);`
    );
    wrapper.style.display = editor.getEnvironment().isSafari
        ? '-webkit-inline-flex'
        : 'inline-flex';

    const border = createBorder(editor, options.borderColor);
    wrapper.appendChild(imageBox);
    wrapper.appendChild(border);
    wrapper.style.userSelect = 'none';

    if (resizers && resizers?.length > 0) {
        resizers.forEach(resizer => {
            wrapper.appendChild(resizer);
        });
    }
    if (rotators && rotators.length > 0) {
        rotators.forEach(r => {
            wrapper.appendChild(r);
        });
    }
    if (cropper && cropper.length > 0) {
        cropper.forEach(c => {
            wrapper.appendChild(c);
        });
    }

    return wrapper;
};

const createBorder = (editor: IEditor, borderColor?: string) => {
    const doc = editor.getDocument();
    const resizeBorder = doc.createElement('div');
    resizeBorder.setAttribute(
        `style`,
        `position:absolute;left:0;right:0;top:0;bottom:0;border:solid 2px ${borderColor};pointer-events:none;`
    );
    return resizeBorder;
};

const cloneImage = (image: HTMLImageElement, editInfo: ImageMetadataFormat) => {
    const imageClone = image.cloneNode(true) as HTMLImageElement;
    imageClone.style.removeProperty('transform');
    if (editInfo.src) {
        imageClone.src = editInfo.src;
        imageClone.removeAttribute('id');
        imageClone.style.removeProperty('max-width');
        imageClone.style.removeProperty('max-height');
        imageClone.style.width = editInfo.widthPx + 'px';
        imageClone.style.height = editInfo.heightPx + 'px';
    }
    return imageClone;
};
