import * as TestHelper from '../../../roosterjs-editor-api/test/TestHelper';
import createElement from '../../../roosterjs-editor-dom/lib/utils/createElement';
import DragAndDropContext, {
    DNDDirectionX,
    DnDDirectionY,
} from '../../lib/plugins/ImageEdit/types/DragAndDropContext';
import ImageEditInfo, { RotateInfo } from '../../lib/plugins/ImageEdit/types/ImageEditInfo';
import ImageHtmlOptions from '../../lib/plugins/ImageEdit/types/ImageHtmlOptions';
import {
    getRotateHTML,
    Rotator,
    updateRotateHandlePosition,
} from '../../lib/plugins/ImageEdit/imageEditors/Rotator';
import { IEditor, ImageEditOperation, ImageEditOptions, Rect } from 'roosterjs-editor-types';
import { ImageEdit } from '../../lib/ImageEdit';

const ROTATE_SIZE = 32;
const ROTATE_GAP = 15;
const DEG_PER_RAD = 180 / Math.PI;
const DEFAULT_ROTATE_HANDLE_HEIGHT = ROTATE_SIZE / 2 + ROTATE_GAP;

describe('Rotate: rotate only', () => {
    const options: ImageEditOptions = {
        minRotateDeg: 10,
    };

    const initValue: RotateInfo = { angleRad: 0 };
    const mouseEvent: MouseEvent = {} as any;
    const mouseEventAltKey: MouseEvent = { altkey: true } as any;
    const Xs: DNDDirectionX[] = ['w', '', 'e'];
    const Ys: DnDDirectionY[] = ['n', '', 's'];

    function getInitEditInfo(): ImageEditInfo {
        return {
            src: '',
            naturalWidth: 100,
            naturalHeight: 200,
            leftPercent: 0,
            topPercent: 0,
            rightPercent: 0,
            bottomPercent: 0,
            widthPx: 100,
            heightPx: 200,
            angleRad: 0,
        };
    }

    function runTest(e: MouseEvent, getEditInfo: () => ImageEditInfo, expectedResult: number) {
        let angle = 0;
        Xs.forEach(x => {
            Ys.forEach(y => {
                const editInfo = getEditInfo();
                const context: DragAndDropContext = {
                    elementClass: <any>'',
                    x,
                    y,
                    editInfo,
                    options,
                };
                Rotator.onDragging(context, e, initValue, 20, 20);
                angle = editInfo.angleRad;
            });
        });

        expect(angle).toEqual(expectedResult);
    }

    it('Rotate alt key', () => {
        runTest(
            mouseEventAltKey,
            () => {
                const editInfo = getInitEditInfo();
                editInfo.heightPx = 100;
                return editInfo;
            },
            calculateAngle(100, mouseEventAltKey)
        );
    });

    it('Rotate no alt key', () => {
        runTest(
            mouseEvent,
            () => {
                const editInfo = getInitEditInfo();
                editInfo.heightPx = 180;
                return editInfo;
            },
            calculateAngle(180, mouseEvent)
        );
    });
});

describe('updateRotateHandlePosition', () => {
    let editor: IEditor;
    const TEST_ID = 'imageEditTest';
    let plugin: ImageEdit;
    let editorGetVisibleViewport: any;
    beforeEach(() => {
        plugin = new ImageEdit();
        editor = TestHelper.initEditor(TEST_ID, [plugin]);
        editorGetVisibleViewport = spyOn(editor, 'getVisibleViewport');
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement.removeChild(element);
        }
        editor.dispose();
    });
    const options: ImageHtmlOptions = {
        borderColor: 'blue',
        rotateHandleBackColor: 'blue',
        rotateIconHTML: '',
        isSmallImage: false,
    };

    function runTest(
        rotatePosition: DOMRect,
        rotateCenterTop: string,
        rotateCenterHeight: string,
        rotateHandleTop: string
    ) {
        const IMG_ID = 'IMAGE_ID';
        const content = `<img id="${IMG_ID}" src='test'/>`;
        editor.setContent(content);
        const image = document.getElementById(IMG_ID) as HTMLImageElement;
        plugin.setEditingImage(image, ImageEditOperation.Rotate);
        const rotate = getRotateHTML(options)[0];
        const rotateHTML = createElement(rotate, document);
        image.parentElement!.appendChild(rotateHTML!);
        const rotateCenter = document.getElementsByClassName('r_rotateC')[0] as HTMLElement;
        const rotateHandle = document.getElementsByClassName('r_rotateH')[0] as HTMLElement;
        spyOn(rotateHandle, 'getBoundingClientRect').and.returnValues(rotatePosition);
        const viewport: Rect = {
            top: 1,
            bottom: 200,
            left: 1,
            right: 200,
        };
        editorGetVisibleViewport.and.returnValue(viewport);

        updateRotateHandlePosition(viewport, rotateCenter, rotateHandle);

        expect(rotateCenter.style.top).toBe(rotateCenterTop);
        expect(rotateCenter.style.height).toBe(rotateCenterHeight);
        expect(rotateHandle.style.top).toBe(rotateHandleTop);
    }

    it('adjust rotate handle - ROTATOR HIDDEN ON TOP', () => {
        runTest(
            {
                top: 1,
                bottom: 3,
                left: 3,
                right: 5,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            '0px',
            '0px',
            '0px'
        );
    });

    it('adjust rotate handle - ROTATOR NOT HIDDEN', () => {
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
            '-15px',
            '15px',
            '-32px'
        );
    });

    it('adjust rotate handle - ROTATOR HIDDEN ON LEFT', () => {
        runTest(
            {
                top: 2,
                bottom: 3,
                left: 1,
                right: 5,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            '0px',
            '0px',
            '0px'
        );
    });

    it('adjust rotate handle - ROTATOR HIDDEN ON BOTTOM', () => {
        runTest(
            {
                top: 2,
                bottom: 201,
                left: 1,
                right: 5,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            '0px',
            '0px',
            '0px'
        );
    });

    it('adjust rotate handle - ROTATOR HIDDEN ON RIGHT', () => {
        runTest(
            {
                top: 2,
                bottom: 3,
                left: 1,
                right: 201,
                height: 2,
                width: 2,
                x: 1,
                y: 3,
                toJSON: () => {},
            },
            '0px',
            '0px',
            '0px'
        );
    });
});

function calculateAngle(heightPx: number, mouseInfo: MouseEvent) {
    const distance = heightPx / 2 + DEFAULT_ROTATE_HANDLE_HEIGHT;
    const newX = distance * Math.sin(0) + 20;
    const newY = distance * Math.cos(0) - 20;
    let angleInRad = Math.atan2(newX, newY);

    if (!mouseInfo.altKey) {
        const angleInDeg = angleInRad * DEG_PER_RAD;
        const adjustedAngleInDeg = Math.round(angleInDeg / 10) * 10;
        angleInRad = adjustedAngleInDeg / DEG_PER_RAD;
    }

    return angleInRad;
}
