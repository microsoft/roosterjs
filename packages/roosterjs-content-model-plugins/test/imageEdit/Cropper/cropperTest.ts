import { Cropper } from '../../../lib/imageEdit/Cropper/cropperContext';
import {
    DNDDirectionX,
    DnDDirectionY,
    DragAndDropContext,
} from '../../../lib/imageEdit/types/DragAndDropContext';
import { ImageEditOptions } from '../../../lib/imageEdit/types/ImageEditOptions';
import type { ImageMetadataFormat } from 'roosterjs-content-model-types';

describe('Cropper: crop only', () => {
    const options: ImageEditOptions = {
        minWidth: 10,
        minHeight: 10,
    };

    const initValue = {
        leftPercent: 0,
        rightPercent: 0,
        topPercent: 0,
        bottomPercent: 0,
    };
    const mouseEvent: MouseEvent = {} as any;
    const Xs: DNDDirectionX[] = ['w', '', 'e'];
    const Ys: DnDDirectionY[] = ['n', '', 's'];

    function getInitEditInfo(): ImageMetadataFormat {
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

    function runTest(
        e: MouseEvent,
        getEditInfo: () => ImageMetadataFormat,
        expectedResult: { width: number; height: number }
    ) {
        let actualResult: { width: number; height: number } = { width: 0, height: 0 };
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

                Cropper.onDragging?.(context, e, initValue, 20, 20);
                actualResult = {
                    width: Math.floor(editInfo.widthPx || 0),
                    height: Math.floor(editInfo.heightPx || 0),
                };
            });
        });

        expect(actualResult).toEqual(expectedResult);
    }

    it('Crop right', () => {
        runTest(
            mouseEvent,
            () => {
                const editInfo = getInitEditInfo();
                editInfo.rightPercent = -0.1;
                return editInfo;
            },
            { width: 90, height: 200 }
        );
    });

    it('Crop top', () => {
        runTest(
            mouseEvent,
            () => {
                const editInfo = getInitEditInfo();
                editInfo.topPercent = 0.5;
                return editInfo;
            },
            { width: 100, height: 200 }
        );
    });

    it('Crop top and bottom', () => {
        runTest(
            mouseEvent,
            () => {
                const editInfo = getInitEditInfo();
                editInfo.topPercent = 0.1;
                editInfo.bottomPercent = -0.1;
                return editInfo;
            },
            { width: 100, height: 180 }
        );
    });

    it('Crop left and right', () => {
        runTest(
            mouseEvent,
            () => {
                const editInfo = getInitEditInfo();
                editInfo.leftPercent = 0.1;
                editInfo.rightPercent = -0.1;
                return editInfo;
            },
            { width: 90, height: 200 }
        );
    });

    it('Crop all', () => {
        runTest(
            mouseEvent,
            () => {
                const editInfo = getInitEditInfo();

                editInfo.leftPercent = 0.1;
                editInfo.rightPercent = -0.1;
                editInfo.topPercent = 0.1;
                editInfo.bottomPercent = -0.1;
                return editInfo;
            },
            { width: 90, height: 180 }
        );
    });
});
