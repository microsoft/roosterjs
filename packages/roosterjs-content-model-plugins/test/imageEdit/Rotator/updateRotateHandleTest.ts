import * as TestHelper from '../../TestHelper';
import { createImageWrapper } from '../../../lib/imageEdit/utils/createImageWrapper';
import { ImageEditPlugin } from '../../../lib/imageEdit/ImageEditPlugin';
import { ImageHtmlOptions } from '../../../lib/imageEdit/types/ImageHtmlOptions';
import { updateRotateHandle } from '../../../lib/imageEdit/Rotator/updateRotateHandle';

import type { IEditor, Rect } from 'roosterjs-content-model-types';

const DEG_PER_RAD = 180 / Math.PI;

describe('updateRotateHandlePosition', () => {
    let editor: IEditor;
    const TEST_ID = 'imageEditTest_rotateHandlePosition';
    let plugin: ImageEditPlugin;
    let editorGetVisibleViewport: any;
    beforeEach(() => {
        plugin = new ImageEditPlugin();
        editor = TestHelper.initEditor(TEST_ID, [plugin]);
        editorGetVisibleViewport = spyOn(editor, 'getVisibleViewport');
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement?.removeChild(element);
        }
        editor.dispose();
    });
    const options: ImageHtmlOptions = {
        borderColor: 'blue',
        rotateHandleBackColor: 'blue',
        isSmallImage: false,
    };

    function runTest(
        rotatePosition: DOMRect,
        rotateCenterTop: string,
        rotateCenterHeight: string,
        rotateHandleTop: string,
        wrapperPosition: DOMRect,
        angle: number
    ) {
        const imageSpan = document.createElement('span');
        const image = document.createElement('img');
        imageSpan.appendChild(image);
        document.body.appendChild(imageSpan);
        const imageInfo = {
            src: image.getAttribute('src') || '',
            widthPx: image.clientWidth,
            heightPx: image.clientHeight,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0,
        };
        const { wrapper } = createImageWrapper(
            editor,
            image,
            imageSpan,
            {},
            imageInfo,
            options,
            'rotate'
        );
        const rotateCenter = wrapper.querySelector('.r_rotateC')! as HTMLElement;
        const rotateHandle = wrapper.querySelector('.r_rotateH')! as HTMLElement;
        spyOn(rotateHandle, 'getBoundingClientRect').and.returnValues(rotatePosition);
        spyOn(wrapper, 'getBoundingClientRect').and.returnValues(wrapperPosition);
        const viewport: Rect = {
            top: 1,
            bottom: 200,
            left: 1,
            right: 200,
        };
        editorGetVisibleViewport.and.returnValue(viewport);
        const angleRad = angle / DEG_PER_RAD;

        updateRotateHandle(viewport, angleRad, wrapper, rotateCenter, rotateHandle, false);

        expect(rotateCenter.style.top).toBe(rotateCenterTop);
        expect(rotateCenter.style.height).toBe(rotateCenterHeight);
        expect(rotateHandle.style.top).toBe(rotateHandleTop);

        document.body.removeChild(imageSpan);
    }

    xit('adjust rotate handle - ROTATOR HIDDEN ON TOP', () => {
        runTest(
            {
                top: 0,
                bottom: 3,
                left: 3,
                right: 5,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            '-21px',
            '15px',
            '7px',
            {
                top: 2,
                bottom: 3,
                left: 2,
                right: 5,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            0
        );
    });

    xit('adjust rotate handle - ROTATOR NOT HIDDEN', () => {
        runTest(
            {
                top: 2,
                bottom: 3,
                left: 3,
                right: 5,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            '-21px',
            '15px',
            '-32px',
            {
                top: 0,
                bottom: 20,
                left: 3,
                right: 5,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            50
        );
    });

    it('adjust rotate handle - ROTATOR HIDDEN ON LEFT', () => {
        runTest(
            {
                top: 2,
                bottom: 3,
                left: 2,
                right: 5,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            '-12px',
            '6px',
            '0px',
            {
                top: 2,
                bottom: 3,
                left: 2,
                right: 5,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            -90
        );
    });

    it('adjust rotate handle - ROTATOR HIDDEN ON BOTTOM', () => {
        runTest(
            {
                top: 2,
                bottom: 200,
                left: 1,
                right: 5,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            '-6px',
            '0px',
            '0px',
            {
                top: 0,
                bottom: 190,
                left: 3,
                right: 190,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            180
        );
    });

    it('adjust rotate handle - ROTATOR HIDDEN ON RIGHT', () => {
        runTest(
            {
                top: 2,
                bottom: 3,
                left: 1,
                right: 200,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            '-6px',
            '0px',
            '0px',
            {
                top: 0,
                bottom: 190,
                left: 3,
                right: 190,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            90
        );
    });
});
