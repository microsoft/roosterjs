import DragAndDropContext, { DNDDirectionX, DnDDirectionY } from '../types/DragAndDropContext';
import ImageEditInfo, { ResizeInfo } from '../types/ImageEditInfo';
import { DragAndDropHelper } from 'roosterjs-content-model-plugins/lib/pluginUtils/DragAndDrop/DragAndDropHelper';
import { IEditor } from 'roosterjs-content-model-types/lib';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { ImageEditOptions } from '../types/ImageEditOptions';
import { Resizer } from './resizerContext';

const RESIZE_HANDLE_MARGIN = 6;
const RESIZE_HANDLE_SIZE = 10;
const HANDLES: { x: DNDDirectionX; y: DnDDirectionY }[] = [
    { x: 'w', y: 'n' },
    { x: '', y: 'n' },
    { x: 'e', y: 'n' },
    { x: 'w', y: '' },
    { x: 'e', y: '' },
    { x: 'w', y: 's' },
    { x: '', y: 's' },
    { x: 'e', y: 's' },
];

export function createImageResizer(
    editor: IEditor,
    image: HTMLImageElement,
    editInfo: ImageEditInfo,
    options: ImageEditOptions,
    updateWrapper: () => {}
) {
    const imageClone = image.cloneNode(true) as HTMLImageElement;
    const handles = HANDLES.map(handle => createHandles(editor, handle.y, handle.x));
    const dragAndDropHelpers = handles.map(handle =>
        createDropAndDragHelpers(handle, editInfo, options, updateWrapper)
    );
    const resizer = createResizer(editor, imageClone, options, handles);
    return { resizer, dragAndDropHelpers };
}

const createResizer = (
    editor: IEditor,
    image: HTMLImageElement,
    options: ImageEditOptions,
    handles: HTMLDivElement[]
) => {
    const doc = editor.getDocument();
    const resize = doc.createElement('div');
    const imageBox = doc.createElement('div');
    imageBox.setAttribute(
        `styles`,
        `position:relative;width:100%;height:100%;overflow:hidden;transform:scale(1);`
    );
    imageBox.appendChild(image);
    resize.setAttribute('style', `position:relative;`);
    const border = createResizeBorder(editor, options);
    resize.appendChild(imageBox);
    resize.appendChild(border);
    handles.forEach(handle => {
        resize.appendChild(handle);
    });

    return resize;
};

const createResizeBorder = (editor: IEditor, options: ImageEditOptions) => {
    const doc = editor.getDocument();
    const resizeBorder = doc.createElement('div');
    resizeBorder.setAttribute(
        `styles`,
        `position:absolute;left:0;right:0;top:0;bottom:0;border:solid 2px ${options.borderColor};pointer-events:none;`
    );
    return resizeBorder;
};

const createHandles = (editor: IEditor, y: DnDDirectionY, x: DNDDirectionX) => {
    const leftOrRight = x == 'w' ? 'left' : 'right';
    const topOrBottom = y == 'n' ? 'top' : 'bottom';
    const leftOrRightValue = x == '' ? '50%' : '0px';
    const topOrBottomValue = y == '' ? '50%' : '0px';
    const direction = y + x;
    const doc = editor.getDocument();
    const handle = doc.createElement('div');
    handle.setAttribute(
        'style',
        `position:absolute;${leftOrRight}:${leftOrRightValue};${topOrBottom}:${topOrBottomValue}`
    );
    handle.className = ImageEditElementClass.ResizeHandle;

    const handleChild = doc.createElement('div');
    handle.appendChild(handleChild);
    handleChild.setAttribute(
        'style',
        `position:relative;width:${RESIZE_HANDLE_SIZE}px;height:${RESIZE_HANDLE_SIZE}px;background-color: #FFFFFF;cursor:${direction}-resize;${topOrBottom}:-${RESIZE_HANDLE_MARGIN}px;${leftOrRight}:-${RESIZE_HANDLE_MARGIN}px;border-radius:100%;border: 2px solid #bfbfbf;box-shadow: 0px 0.36316px 1.36185px rgba(100, 100, 100, 0.25);`
    );
    handleChild.dataset.x = x;
    handleChild.dataset.y = y;
    return handle;
};

const createDropAndDragHelpers = (
    handle: HTMLDivElement,
    editInfo: ImageEditInfo,
    options: ImageEditOptions,
    updateWrapper: () => {}
) => {
    return new DragAndDropHelper<DragAndDropContext, ResizeInfo>(
        handle,
        {
            elementClass: ImageEditElementClass.ResizeHandle,
            editInfo: editInfo,
            options: options,
            x: handle.dataset.x as DNDDirectionX,
            y: handle.dataset.y as DnDDirectionY,
        },
        updateWrapper,
        Resizer,
        1
    );
};
