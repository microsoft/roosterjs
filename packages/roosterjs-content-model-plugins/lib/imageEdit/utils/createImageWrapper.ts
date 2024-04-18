import ImageHtmlOptions from '../types/ImageHtmlOptions';
import { createImageCropper } from '../Cropper/createImageCropper';
import { createImageResizer } from '../Resizer/createImageResizer';
import { createImageRotator } from '../Rotator/createImageRotator';
import { IEditor, ImageMetadataFormat } from 'roosterjs-content-model-types';
import { ImageEditOptions } from '../types/ImageEditOptions';

/**
 * @internal
 */
export function createImageWrapper(
    editor: IEditor,
    image: HTMLImageElement,
    options: ImageEditOptions,
    editInfo: ImageMetadataFormat,
    htmlOptions: ImageHtmlOptions,
    operation?: 'resize' | 'rotate' | 'resizeAndRotate' | 'crop'
) {
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
    const doc = editor.getDocument();
    if (!operation) {
        operation = options.onSelectState ?? 'resizeAndRotate';
    }

    let rotators: HTMLDivElement[] = [];
    if (!options.disableRotate && (operation === 'resizeAndRotate' || operation === 'rotate')) {
        rotators = createImageRotator(doc, htmlOptions);
    }
    let resizers: HTMLDivElement[] = [];
    if (operation === 'resize' || operation === 'resizeAndRotate') {
        resizers = createImageResizer(doc, htmlOptions);
    }

    let croppers: HTMLDivElement[] = [];
    if (operation === 'crop') {
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
    const shadowSpan = createShadowSpan(editor, wrapper, image);
    return { wrapper, shadowSpan, imageClone, resizers, rotators, croppers };
}

const createShadowSpan = (editor: IEditor, wrapper: HTMLElement, image: HTMLImageElement) => {
    const shadowSpan = editor.getDOMHelper().wrap(image, 'span');
    if (shadowSpan) {
        const shadowRoot = shadowSpan.attachShadow({
            mode: 'open',
        });
        shadowSpan.style.verticalAlign = 'bottom';
        shadowRoot.appendChild(wrapper);
    }
    return shadowSpan;
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
        `max-width: 100%; position: relative; display: inline-flex; font-size: 24px; margin: 0px; transform: rotate(${
            editInfo.angleRad ?? 0
        }rad); text-align: left;`
    );
    wrapper.style.display = editor.getEnvironment().isSafari ? 'inline-block' : 'inline-flex';

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
    resizeBorder.setAttribute(
        `style`,
        `position:absolute;left:0;right:0;top:0;bottom:0;border:solid 2px ${borderColor};pointer-events:none;`
    );
    return resizeBorder;
};
