import { createImageCropper } from '../../../lib/imageEdit/Cropper/createImageCropper';
import { createImageResizer } from '../../../lib/imageEdit/Resizer/createImageResizer';
import { createImageRotator } from '../../../lib/imageEdit/Rotator/createImageRotator';
import { IEditor, ImageEditOperation, ImageMetadataFormat } from 'roosterjs-content-model-types';
import { ImageEditOptions } from '../../../lib/imageEdit/types/ImageEditOptions';
import { ImageHtmlOptions } from '../../../lib/imageEdit/types/ImageHtmlOptions';
import { initEditor } from '../../TestHelper';
import {
    WrapperElements,
    createImageWrapper,
} from '../../../lib/imageEdit/utils/createImageWrapper';

describe('createImageWrapper', () => {
    const editor = initEditor('editor_test');
    let image: HTMLImageElement;
    let imageSpan: HTMLSpanElement;
    let options: ImageEditOptions;
    let editInfo: ImageMetadataFormat;
    let htmlOptions: ImageHtmlOptions;
    let editorDiv: HTMLElement;

    function runTest(operation: ImageEditOperation | undefined, expectResult: WrapperElements) {
        image = document.createElement('img');
        imageSpan = document.createElement('span');
        imageSpan.append(image);
        editorDiv = document.getElementById('editor_test')!;
        editorDiv.append(imageSpan);
        options = {
            borderColor: '#DB626C',
            minWidth: 10,
            minHeight: 10,
            preserveRatio: true,
            disableRotate: false,
            disableSideResize: false,
            onSelectState: 'resizeAndRotate',
        };
        editInfo = {
            src: 'test',
            widthPx: 20,
            heightPx: 20,
            naturalWidth: 10,
            naturalHeight: 10,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0.1,
            bottomPercent: 0,
            angleRad: 0,
        };
        htmlOptions = {
            borderColor: '#DB626C',
            rotateHandleBackColor: 'white',
            isSmallImage: false,
        };
        const result = createImageWrapper(
            editor,
            image,
            imageSpan,
            options,
            editInfo,
            htmlOptions,
            operation
        );
        expect(result).toEqual(expectResult);
    }

    it('resizer', () => {
        const resizers = createImageResizer(document);
        const wrapper = createWrapper(editor, image, options, editInfo, resizers);
        const shadowSpan = createShadowSpan(wrapper, imageSpan);
        const imageClone = cloneImage(image, editInfo);

        runTest('resize', {
            resizers,
            wrapper,
            shadowSpan,
            imageClone,
            croppers: [],
            rotators: [],
        });
    });

    it('resizeAndRotate', () => {
        const resizers = createImageResizer(document);
        const rotator = createImageRotator(document, htmlOptions);
        const wrapper = createWrapper(editor, image, options, editInfo, resizers, rotator);
        const shadowSpan = createShadowSpan(wrapper, imageSpan);
        const imageClone = cloneImage(image, editInfo);

        runTest('resizeAndRotate', {
            resizers,
            wrapper,
            shadowSpan,
            imageClone,
            croppers: [],
            rotators: rotator,
        });
    });

    it('rotate', () => {
        const rotator = createImageRotator(document, htmlOptions);
        const wrapper = createWrapper(editor, image, options, editInfo, undefined, rotator);
        const shadowSpan = createShadowSpan(wrapper, imageSpan);
        const imageClone = cloneImage(image, editInfo);

        runTest('resizeAndRotate', {
            resizers: [],
            wrapper,
            shadowSpan,
            imageClone,
            croppers: [],
            rotators: rotator,
        });
    });

    it('crop', () => {
        const cropper = createImageCropper(document);
        const wrapper = createWrapper(
            editor,
            image,
            options,
            editInfo,
            undefined,
            undefined,
            cropper
        );
        const shadowSpan = createShadowSpan(wrapper, imageSpan);
        const imageClone = cloneImage(image, editInfo);

        runTest('crop', {
            resizers: [],
            wrapper,
            shadowSpan,
            imageClone,
            croppers: cropper,
            rotators: [],
        });
    });
});

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

const createShadowSpan = (wrapper: HTMLElement, imageSpan: HTMLSpanElement) => {
    const shadowRoot = imageSpan.attachShadow({
        mode: 'open',
    });
    imageSpan.style.verticalAlign = 'bottom';
    shadowRoot.append(wrapper);
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
    imageBox.append(image);
    wrapper.setAttribute(
        'style',
        `max-width: 100%; position: relative; display: inline-flex; font-size: 24px; margin: 0px; transform: rotate(${
            editInfo.angleRad ?? 0
        }rad); text-align: left;`
    );
    wrapper.style.display = editor.getEnvironment().isSafari ? 'inline-block' : 'inline-flex';

    const border = createBorder(editor, options.borderColor);
    wrapper.append(imageBox);
    wrapper.append(border);
    wrapper.style.userSelect = 'none';

    if (resizers && resizers?.length > 0) {
        resizers.forEach(resizer => {
            wrapper.append(resizer);
        });
    }
    if (rotators && rotators.length > 0) {
        rotators.forEach(r => {
            wrapper.append(r);
        });
    }
    if (cropper && cropper.length > 0) {
        cropper.forEach(c => {
            wrapper.append(c);
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
