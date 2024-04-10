import ImageHtmlOptions from '../types/ImageHtmlOptions';
import { createImageResizer, ResizeHandle } from '../Resizer/createImageResizer';
import { createImageRotator, ImageRotator } from '../Rotator/createImageRotator';
import { IEditor, ImageMetadataFormat } from 'roosterjs-content-model-types/lib';
import { ImageEditOptions } from '../types/ImageEditOptions';

export function createImageWrapper(
    editor: IEditor,
    image: HTMLImageElement,
    options: ImageEditOptions,
    editInfo: ImageMetadataFormat,
    htmlOptions: ImageHtmlOptions
) {
    const imageClone = image.cloneNode(true) as HTMLImageElement;
    imageClone.style.removeProperty('transform');

    let rotators: ImageRotator | undefined;
    if (
        !options.disableRotate &&
        (options.onSelectState === 'resizeAndRotate' || options.onSelectState === 'rotate')
    ) {
        rotators = createImageRotator(
            editor,
            htmlOptions.borderColor,
            htmlOptions.rotateHandleBackColor
        );
    }
    let handles: ResizeHandle[] = [];
    if (options.onSelectState === 'resize' || options.onSelectState === 'resizeAndRotate') {
        handles = createImageResizer(editor);
    }

    const wrapper = createWrapper(
        editor,
        imageClone,
        options,
        editInfo,
        handles,
        rotators?.rotator
    );
    const shadowSpan = createShadowSpan(editor, wrapper, image);
    return { wrapper, handles, rotators, shadowSpan, imageClone };
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
    handles?: ResizeHandle[],
    rotator?: Element
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
        `max-width: 100%; position: relative; display: inline-flex; font-size: 24px; margin: 0px; transform: rotate(${editInfo.angleRad}rad); text-align: left;`
    );
    setWrapperSizeDimensions(wrapper, image, editInfo.widthPx ?? 0, editInfo.heightPx ?? 0);

    const border = createBorder(editor, options.borderColor);
    wrapper.appendChild(imageBox);
    wrapper.appendChild(border);

    if (handles && handles?.length > 0) {
        handles.forEach(handle => {
            wrapper.appendChild(handle.handleWrapper);
        });
    }
    if (rotator) {
        wrapper.appendChild(rotator);
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

function setWrapperSizeDimensions(
    wrapper: HTMLElement,
    image: HTMLImageElement,
    width: number,
    height: number
) {
    const hasBorder = image.style.borderStyle;
    if (hasBorder) {
        const borderWidth = image.style.borderWidth ? 2 * parseInt(image.style.borderWidth) : 2;
        wrapper.style.width = getPx(width + borderWidth);
        wrapper.style.height = getPx(height + borderWidth);
        return;
    }
    wrapper.style.width = getPx(width);
    wrapper.style.height = getPx(height);
}

function getPx(value: number): string {
    return value + 'px';
}
