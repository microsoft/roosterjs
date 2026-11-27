import { createImageCropper } from '../../../lib/imageEdit/Cropper/createImageCropper';
import { createImageResizer } from '../../../lib/imageEdit/Resizer/createImageResizer';
import { createImageRotator } from '../../../lib/imageEdit/Rotator/createImageRotator';
import { createDomToModelContext, domToContentModel } from 'roosterjs-content-model-dom';
import {
    ContentModelParagraph,
    IEditor,
    ImageEditOperation,
    ImageMetadataFormat,
} from 'roosterjs-content-model-types';
import { ImageEditOptions } from '../../../lib/imageEdit/types/ImageEditOptions';
import { ImageHtmlOptions } from '../../../lib/imageEdit/types/ImageHtmlOptions';
import { initEditor } from '../../TestHelper';
import {
    WrapperElements,
    createImageWrapper,
} from '../../../lib/imageEdit/utils/createImageWrapper';

describe('createImageWrapper', () => {
    const editor = initEditor('editor_test');
    function runTest(
        image: HTMLImageElement,
        options: ImageEditOptions,
        editInfo: ImageMetadataFormat,
        htmlOptions: ImageHtmlOptions,
        operation: ImageEditOperation[],
        expectResult: WrapperElements
    ) {
        const result = createImageWrapper(editor, image, options, editInfo, htmlOptions, operation);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectResult));
    }

    it('resizer', () => {
        const image = document.createElement('img');
        const imageSpan = document.createElement('span');
        imageSpan.append(image);
        document.body.appendChild(imageSpan);
        const options: ImageEditOptions = {
            borderColor: '#DB626C',
            minWidth: 10,
            minHeight: 10,
            preserveRatio: true,
            disableRotate: false,
            disableSideResize: false,
            onSelectState: ['resize'],
        };
        const editInfo = {
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
        const htmlOptions = {
            borderColor: '#DB626C',
            rotateHandleBackColor: 'white',
            isSmallImage: false,
            disableSideResize: false,
        };
        const resizers = createImageResizer(document, false);
        const wrapper = createWrapper(editor, image, options, editInfo, resizers);
        const shadowSpan = createShadowSpan(wrapper);
        const imageClone = cloneImage(image, editInfo);

        runTest(image, options, editInfo, htmlOptions, ['resize'], {
            wrapper,
            shadowSpan,
            imageClone,
            resizers,
            rotators: [],
            croppers: [],
        });
        imageSpan.remove();
    });

    it('rotate', () => {
        const image = document.createElement('img');
        const imageSpan = document.createElement('span');
        imageSpan.append(image);
        document.body.appendChild(imageSpan);
        const options: ImageEditOptions = {
            borderColor: '#DB626C',
            minWidth: 10,
            minHeight: 10,
            preserveRatio: true,
            disableRotate: false,
            disableSideResize: false,
            onSelectState: ['rotate'],
        };
        const editInfo = {
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
        const htmlOptions = {
            borderColor: '#DB626C',
            rotateHandleBackColor: 'white',
            isSmallImage: false,
            disableSideResize: false,
        };
        const rotator = createImageRotator(document, htmlOptions);
        const wrapper = createWrapper(editor, image, options, editInfo, undefined, rotator);
        const shadowSpan = createShadowSpan(wrapper);
        const imageClone = cloneImage(image, editInfo);

        runTest(image, options, editInfo, htmlOptions, ['rotate'], {
            wrapper: wrapper,
            shadowSpan: shadowSpan,
            imageClone: imageClone,
            resizers: [],
            rotators: rotator,
            croppers: [],
        });
        imageSpan.remove();
    });

    it('crop', () => {
        const image = document.createElement('img');
        const imageSpan = document.createElement('span');
        imageSpan.append(image);
        document.body.appendChild(imageSpan);
        const options: ImageEditOptions = {
            borderColor: '#DB626C',
            minWidth: 10,
            minHeight: 10,
            preserveRatio: true,
            disableRotate: false,
            disableSideResize: false,
            onSelectState: ['resize'],
        };
        const editInfo = {
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
        const htmlOptions = {
            borderColor: '#DB626C',
            rotateHandleBackColor: 'white',
            isSmallImage: false,
            disableSideResize: false,
        };
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
        const shadowSpan = createShadowSpan(wrapper);
        const imageClone = cloneImage(image, editInfo);

        runTest(image, options, editInfo, htmlOptions, ['crop'], {
            wrapper,
            shadowSpan,
            imageClone,
            resizers: [],
            rotators: [],
            croppers: cropper,
        });
        imageSpan.remove();
    });

    describe('text wrap', () => {
        const options: ImageEditOptions = {
            borderColor: '#DB626C',
            minWidth: 10,
            minHeight: 10,
            preserveRatio: true,
            disableRotate: false,
            disableSideResize: false,
            onSelectState: ['resize'],
        };
        const editInfo = {
            src: 'test',
            widthPx: 20,
            heightPx: 20,
            naturalWidth: 10,
            naturalHeight: 10,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0,
        };
        const htmlOptions = {
            borderColor: '#DB626C',
            rotateHandleBackColor: 'white',
            isSmallImage: false,
            disableSideResize: false,
        };

        function runTextWrapTest(
            imageStyle: string,
            expectedDisplay: string,
            expectedFloat: string,
            expectedTextAlign: string
        ) {
            const container = document.createElement('div');
            const image = document.createElement('img');
            image.setAttribute('style', imageStyle);
            container.appendChild(image);
            document.body.appendChild(container);

            const { shadowSpan } = createImageWrapper(
                editor,
                image,
                options,
                editInfo,
                htmlOptions,
                ['resize']
            );

            expect(shadowSpan.style.display).toBe(expectedDisplay);
            expect(shadowSpan.style.float).toBe(expectedFloat);
            expect(shadowSpan.style.textAlign).toBe(expectedTextAlign);
            container.remove();
        }

        it('inline', () => {
            runTextWrapTest('display: inline', '', '', '');
        });

        it('square', () => {
            runTextWrapTest('display: inline; float: left', '', 'left', '');
        });

        it('top and bottom', () => {
            runTextWrapTest('display: block', 'flow-root', '', 'start');
        });

        it('top and bottom image should not split paragraph when parsed to model', () => {
            const div = document.createElement('div');
            const image = document.createElement('img');
            image.style.display = 'block';
            div.appendChild(document.createTextNode('before'));
            div.appendChild(image);
            div.appendChild(document.createTextNode('after'));
            document.body.appendChild(div);

            createImageWrapper(editor, image, options, editInfo, htmlOptions, ['resize']);

            const model = domToContentModel(div, createDomToModelContext());

            expect(model.blocks.length).toBe(1);
            expect(model.blocks[0].blockType).toBe('Paragraph');
            expect(
                (model.blocks[0] as ContentModelParagraph).segments.map(s => s.segmentType)
            ).toEqual(['Text', 'Image', 'Text']);
            div.remove();
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

const createShadowSpan = (wrapper: HTMLSpanElement) => {
    const span = document.createElement('span');
    const shadowRoot = span.attachShadow({
        mode: 'open',
    });
    span.id = 'IMAGE_EDIT_SHADOW_ROOT';
    shadowRoot.append(wrapper);
    return span;
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
    const doc = document;
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

    const border = createBorder(options.borderColor);
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

const createBorder = (borderColor?: string) => {
    const doc = document;
    const resizeBorder = doc.createElement('div');
    resizeBorder.setAttribute(
        `style`,
        `position:absolute;left:0;right:0;top:0;bottom:0;border:solid 2px ${borderColor};pointer-events:none;`
    );
    return resizeBorder;
};
