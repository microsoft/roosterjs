import { ImageEditOptions } from '../../../lib/imageEdit/types/ImageEditOptions';
import { Resizer } from '../../../lib/imageEdit/Resizer/resizerContext';

import {
    DNDDirectionX,
    DnDDirectionY,
    DragAndDropContext,
} from '../../../lib/imageEdit/types/DragAndDropContext';
import type { ImageMetadataFormat, ImageResizeMetadataFormat } from 'roosterjs-content-model-types';

describe('Resizer: resize only', () => {
    const options: ImageEditOptions = {
        minWidth: 10,
        minHeight: 10,
    };

    const initValue: ImageResizeMetadataFormat = { widthPx: 100, heightPx: 200 };
    const mouseEvent: MouseEvent = {} as any;
    const mouseEventShift: MouseEvent = { shiftKey: true } as any;
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
        expectedResult: Record<DNDDirectionX, Record<DnDDirectionY, [number, number]>>
    ) {
        const actualResult: { [key: string]: { [key: string]: [number, number] } } = {};
        Xs.forEach(x => {
            actualResult[x] = {};
            Ys.forEach(y => {
                const editInfo = getEditInfo();
                const context: DragAndDropContext = {
                    elementClass: <any>'',
                    x,
                    y,
                    editInfo,
                    options,
                };

                Resizer.onDragging?.(context, e, initValue, 20, 20);
                actualResult[x][y] = [
                    Math.floor(editInfo.widthPx || 0),
                    Math.floor(editInfo.heightPx || 0),
                ];
            });
        });

        expect(actualResult).toEqual(expectedResult);
    }

    it('Not shift key', () => {
        runTest(mouseEvent, getInitEditInfo, {
            w: {
                n: [80, 180],
                '': [80, 200],
                s: [80, 220],
            },
            '': {
                n: [100, 180],
                '': [100, 200],
                s: [100, 220],
            },
            e: {
                n: [120, 180],
                '': [120, 200],
                s: [120, 220],
            },
        });
    });

    it('With shift key', () => {
        runTest(mouseEventShift, getInitEditInfo, {
            w: {
                n: [80, 160],
                '': [80, 200],
                s: [80, 160],
            },
            '': {
                n: [100, 180],
                '': [100, 200],
                s: [100, 220],
            },
            e: {
                n: [120, 240],
                '': [120, 200],
                s: [120, 240],
            },
        });
    });

    it('With rotation', () => {
        runTest(
            mouseEvent,
            () => {
                const editInfo = getInitEditInfo();
                editInfo.angleRad = Math.PI / 6;
                return editInfo;
            },
            {
                w: {
                    n: [72, 192],
                    '': [72, 200],
                    s: [72, 207],
                },
                '': {
                    n: [100, 192],
                    '': [100, 200],
                    s: [100, 207],
                },
                e: {
                    n: [127, 192],
                    '': [127, 200],
                    s: [127, 207],
                },
            }
        );
    });

    it('With rotation and SHIFT key', () => {
        runTest(
            mouseEventShift,
            () => {
                const editInfo = getInitEditInfo();
                editInfo.angleRad = Math.PI / 6;
                return editInfo;
            },
            {
                w: {
                    n: [72, 145],
                    '': [72, 200],
                    s: [72, 145],
                },
                '': {
                    n: [100, 192],
                    '': [100, 200],
                    s: [100, 207],
                },
                e: {
                    n: [127, 254],
                    '': [127, 200],
                    s: [127, 254],
                },
            }
        );
    });
});
