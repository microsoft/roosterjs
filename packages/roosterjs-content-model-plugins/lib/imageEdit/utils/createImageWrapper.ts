import { createImageCropper } from '../Cropper/createImageCropper';
import { createImageResizer } from '../Resizer/createImageResizer';
import { createImageRotator } from '../Rotator/createImageRotator';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { wrap } from 'roosterjs-content-model-dom';

import type {
    IEditor,
    ImageEditOperation,
    ImageMetadataFormat,
} from 'roosterjs-content-model-types';
import type { ImageEditOptions } from '../types/ImageEditOptions';
import type { ImageHtmlOptions } from '../types/ImageHtmlOptions';

const IMAGE_EDIT_SHADOW_ROOT = 'ImageEditShadowRoot';
const BORDER_COLOR_VARIABLE = '--rooster-image-border-color';

// Static styling for the wrapper lives in a stylesheet injected into the shadow root instead of
// inline styles, so appearance is driven by CSS classes. Only dynamic values (rotation angle,
// border color and the Safari display override) stay inline.
const WRAPPER_STYLESHEET = `
.${ImageEditElementClass.Wrapper} {
    font-size: 24px;
    margin: 0;
    display: inline-flex;
    user-select: none;
}
.${ImageEditElementClass.ImageBox} {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transform: scale(1);
}
.${ImageEditElementClass.Border} {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border: solid 2px var(${BORDER_COLOR_VARIABLE});
    pointer-events: none;
}
.${ImageEditElementClass.Wrapper}.${ImageEditElementClass.HideHandles} > *:not(.${ImageEditElementClass.ImageBox}) {
    display: none !important;
}`;

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
    const imageClone = cloneImage(image, editInfo, options.resolveImageSource);
    const doc = editor.getDocument();

    let rotators: HTMLDivElement[] = [];
    if (!options.disableRotate && operation.indexOf('rotate') > -1) {
        rotators = createImageRotator(doc, htmlOptions);
    }
    let resizers: HTMLDivElement[] = [];
    if (operation.indexOf('resize') > -1) {
        resizers = createImageResizer(doc, !!options.disableSideResize);
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
    // Capture the image footprint before attaching the shadow root, since the light-DOM image
    // stops being rendered once the shadow root takes over.
    const imageWidth = image.offsetWidth;
    const imageHeight = image.offsetHeight;
    const imageSpan = wrap(doc, image, 'span');
    const shadowSpan = createShadowSpan(wrapper, imageSpan, imageWidth, imageHeight);
    return { wrapper, shadowSpan, imageClone, resizers, rotators, croppers };
}

const createShadowSpan = (
    wrapper: HTMLElement,
    imageSpan: HTMLSpanElement,
    imageWidth: number,
    imageHeight: number
) => {
    const shadowRoot = imageSpan.attachShadow({
        mode: 'open',
    });
    imageSpan.id = IMAGE_EDIT_SHADOW_ROOT;

    const style = imageSpan.ownerDocument.createElement('style');
    style.textContent = WRAPPER_STYLESHEET;
    shadowRoot.appendChild(style);

    // Pin the shadow host to the original image's box so that wrapping the image does not grow the
    // surrounding line box. Without this, the taller edit wrapper enlarges the line and the browser
    // scrolls the selection back into view, making the editor jump. The wrapper and handles still
    // overflow the host visually because overflow is left visible.
    if (imageWidth > 0 && imageHeight > 0) {
        imageSpan.style.display = 'inline-block';
        imageSpan.style.width = `${imageWidth}px`;
        imageSpan.style.height = `${imageHeight}px`;
        imageSpan.style.verticalAlign = 'bottom';
        imageSpan.style.overflow = 'visible';
    }

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

    imageBox.className = ImageEditElementClass.ImageBox;
    imageBox.appendChild(image);

    wrapper.className = ImageEditElementClass.Wrapper;
    wrapper.style.transform = `rotate(${editInfo.angleRad ?? 0}rad)`;
    if (editor.getEnvironment().isSafari) {
        wrapper.style.display = '-webkit-inline-flex';
    }

    const border = createBorder(editor, options.borderColor);
    wrapper.appendChild(imageBox);
    wrapper.appendChild(border);

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
    resizeBorder.className = ImageEditElementClass.Border;
    resizeBorder.style.setProperty(BORDER_COLOR_VARIABLE, borderColor ?? '');
    return resizeBorder;
};

const cloneImage = (
    image: HTMLImageElement,
    editInfo: ImageMetadataFormat,
    resolveImageSource?: (src: string) => string | undefined
) => {
    const imageClone = image.cloneNode(true) as HTMLImageElement;
    imageClone.style.removeProperty('transform');
    if (editInfo.src) {
        imageClone.src = resolveImageSource?.(editInfo.src) ?? editInfo.src;
        imageClone.removeAttribute('id');
        imageClone.style.removeProperty('max-width');
        imageClone.style.removeProperty('max-height');
        imageClone.style.width = editInfo.widthPx + 'px';
        imageClone.style.height = editInfo.heightPx + 'px';
    }
    return imageClone;
};
