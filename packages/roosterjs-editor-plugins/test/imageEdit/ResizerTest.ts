import DragAndDropContext, { X, Y } from '../../lib/plugins/ImageEdit/types/DragAndDropContext';
import ImageEditInfo, { ResizeInfo } from '../../lib/plugins/ImageEdit/types/ImageEditInfo';
import Resizer from '../../lib/plugins/ImageEdit/imageEditors/Resizer';
import { ImageEditOptions } from 'roosterjs-editor-types';

describe('Resizer: resize only', () => {
    const options: ImageEditOptions = {
        minWidth: 10,
        minHeight: 10,
    };

    const initValue: ResizeInfo = { width: 100, height: 200 };
    const mouseEvent: MouseEvent = {} as any;
    const mouseEventShift: MouseEvent = { shiftKey: true } as any;
    const Xs: X[] = ['w', '', 'e'];
    const Ys: Y[] = ['n', '', 's'];

    function getInitEditInfo(): ImageEditInfo {
        return {
            src: '',
            naturalWidth: 100,
            naturalHeight: 200,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 100,
            height: 200,
            angle: 0,
        };
    }

    function runTest(
        e: MouseEvent,
        getEditInfo: () => ImageEditInfo,
        expectedResult: Record<X, Record<Y, [number, number]>>
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

                Resizer.onDragging(context, e, initValue, 20, 20);
                actualResult[x][y] = [Math.floor(editInfo.width), Math.floor(editInfo.height)];
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
                n: [90, 180],
                '': [120, 200],
                s: [110, 220],
            },
        });
    });

    it('With rotation', () => {
        runTest(
            mouseEvent,
            () => {
                const editInfo = getInitEditInfo();
                editInfo.angle = Math.PI / 6;
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
                editInfo.angle = Math.PI / 6;
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
                    n: [96, 192],
                    '': [127, 200],
                    s: [103, 207],
                },
            }
        );
    });
});
