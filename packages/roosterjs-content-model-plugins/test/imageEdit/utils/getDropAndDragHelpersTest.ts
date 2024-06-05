import { Cropper } from '../../../lib/imageEdit/Cropper/cropperContext';
import { DragAndDropHandler } from '../../../lib/pluginUtils/DragAndDrop/DragAndDropHandler';
import { DragAndDropHelper } from '../../../lib/pluginUtils/DragAndDrop/DragAndDropHelper';
import { getDropAndDragHelpers } from '../../../lib/imageEdit/utils/getDropAndDragHelpers';
import { ImageEditElementClass } from '../../../lib/imageEdit/types/ImageEditElementClass';
import { ImageEditOptions } from '../../../lib/imageEdit/types/ImageEditOptions';
import { Resizer } from '../../../lib/imageEdit/Resizer/resizerContext';
import { Rotator } from '../../../lib/imageEdit/Rotator/rotatorContext';
import {
    DNDDirectionX,
    DnDDirectionY,
    DragAndDropContext,
} from '../../../lib/imageEdit/types/DragAndDropContext';

describe('getDropAndDragHelpers', () => {
    const image = document.createElement('img');
    const imageSpan = document.createElement('span');
    imageSpan.append(image);
    const options: ImageEditOptions = {
        borderColor: '#DB626C',
        minWidth: 10,
        minHeight: 10,
        preserveRatio: true,
        disableRotate: false,
        disableSideResize: false,
        onSelectState: 'resize',
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
    const imageWrapper = document.createElement('div');
    const element = document.createElement('div');
    imageWrapper.appendChild(element);

    function runTest(
        elementClass: ImageEditElementClass,
        helper: DragAndDropHandler<DragAndDropContext, any>,
        expectResult: DragAndDropHelper<DragAndDropContext, any>[]
    ) {
        element.className = elementClass;
        const result = getDropAndDragHelpers(
            imageWrapper,
            editInfo,
            options,
            elementClass,
            helper,
            () => {},
            1
        );
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectResult));
    }

    it('create resizer helper', () => {
        runTest(ImageEditElementClass.ResizeHandle, Resizer, [
            new DragAndDropHelper<DragAndDropContext, any>(
                element,
                {
                    editInfo: editInfo,
                    options: options,
                    elementClass: ImageEditElementClass.ResizeHandle,
                    x: element.dataset.x as DNDDirectionX,
                    y: element.dataset.y as DnDDirectionY,
                },
                () => {},
                Resizer,
                1
            ),
        ]);
    });

    it('create rotate helper', () => {
        runTest(ImageEditElementClass.RotateHandle, Rotator, [
            new DragAndDropHelper<DragAndDropContext, any>(
                element,
                {
                    editInfo: editInfo,
                    options: options,
                    elementClass: ImageEditElementClass.RotateHandle,
                    x: element.dataset.x as DNDDirectionX,
                    y: element.dataset.y as DnDDirectionY,
                },
                () => {},
                Rotator,
                1
            ),
        ]);
    });

    it('create cropper helper', () => {
        runTest(ImageEditElementClass.CropHandle, Cropper, [
            new DragAndDropHelper<DragAndDropContext, any>(
                element,
                {
                    editInfo: editInfo,
                    options: options,
                    elementClass: ImageEditElementClass.CropHandle,
                    x: element.dataset.x as DNDDirectionX,
                    y: element.dataset.y as DnDDirectionY,
                },
                () => {},
                Cropper,
                1
            ),
        ]);
    });
});
