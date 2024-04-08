import ImageHtmlOptions from '../types/ImageHtmlOptions';
import { createImageResizer } from '../Resizer/createImageResizer';
import { createImageRotator } from '../Rotator/createImageRotator';
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

    let rotators: { rotator: HTMLDivElement; rotatorHandle: HTMLDivElement } | undefined;
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
    let handles: HTMLDivElement[] = [];
    if (options.onSelectState === 'resize' || options.onSelectState === 'resizeAndRotate') {
        handles = createImageResizer(editor);
    }

    const wrapper = createWrapper(editor, imageClone, options, handles, rotators?.rotator);
    const shadowSpan = createShadowSpan(editor, wrapper, image, editInfo);
    return { wrapper, handles, rotators, shadowSpan, imageClone };
}

const createShadowSpan = (
    editor: IEditor,
    wrapper: HTMLElement,
    image: HTMLImageElement,
    editInfo: ImageMetadataFormat
) => {
    const shadowSpan = editor.getDOMHelper().wrap(image, 'span');
    if (shadowSpan) {
        const shadowRoot = shadowSpan.attachShadow({
            mode: 'open',
        });
        shadowSpan.style.position = 'absolute';
        shadowSpan.style.verticalAlign = 'bottom';
        shadowSpan.style.transform = `rotate(${editInfo.angleRad}rad)`;
        shadowRoot.appendChild(wrapper);
    }
    return shadowSpan;
};

const createWrapper = (
    editor: IEditor,
    image: HTMLImageElement,
    options: ImageEditOptions,
    handles?: HTMLDivElement[],
    rotator?: Element
) => {
    const doc = editor.getDocument();
    const wrapper = doc.createElement('span');
    const imageBox = doc.createElement('div');
    imageBox.setAttribute(
        `styles`,
        `position:relative;width:100%;height:100%;overflow:hidden;transform:scale(1);`
    );
    imageBox.appendChild(image);
    wrapper.style.position = 'relative';
    wrapper.style.fontSize = '24px';

    const border = createBorder(editor, options);
    wrapper.appendChild(imageBox);
    wrapper.appendChild(border);
    if (rotator) {
        wrapper.appendChild(rotator);
    }
    if (handles && handles?.length > 0) {
        handles.forEach(handle => {
            wrapper.appendChild(handle);
        });
    }

    return wrapper;
};

const createBorder = (editor: IEditor, options: ImageEditOptions) => {
    const doc = editor.getDocument();
    const resizeBorder = doc.createElement('div');
    resizeBorder.setAttribute(
        `styles`,
        `position:absolute;left:0;right:0;top:0;bottom:0;border:solid 2px ${options.borderColor};pointer-events:none;`
    );
    return resizeBorder;
};
