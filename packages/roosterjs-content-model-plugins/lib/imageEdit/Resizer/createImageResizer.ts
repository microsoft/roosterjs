import { DNDDirectionX, DnDDirectionY } from '../types/DragAndDropContext';
import { IEditor } from 'roosterjs-content-model-types/lib';
import { ImageEditElementClass } from '../types/ImageEditElementClass';

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

export interface ResizeHandle {
    handleWrapper: HTMLDivElement;
    handle: HTMLDivElement;
}

export function createImageResizer(editor: IEditor): ResizeHandle[] {
    return HANDLES.map(handle => createHandles(editor, handle.y, handle.x));
}

const createHandles = (editor: IEditor, y: DnDDirectionY, x: DNDDirectionX): ResizeHandle => {
    const leftOrRight = x == 'w' ? 'left' : 'right';
    const topOrBottom = y == 'n' ? 'top' : 'bottom';
    const leftOrRightValue = x == '' ? '50%' : '0px';
    const topOrBottomValue = y == '' ? '50%' : '0px';
    const direction = y + x;
    const doc = editor.getDocument();
    const handleWrapper = doc.createElement('div');
    handleWrapper.setAttribute(
        'style',
        `position:absolute;${leftOrRight}:${leftOrRightValue};${topOrBottom}:${topOrBottomValue}`
    );

    const handle = doc.createElement('div');
    handle.className = ImageEditElementClass.ResizeHandle;
    handleWrapper.appendChild(handle);
    handle.setAttribute(
        'style',
        `position:relative;width:${RESIZE_HANDLE_SIZE}px;height:${RESIZE_HANDLE_SIZE}px;background-color: #FFFFFF;cursor:${direction}-resize;${topOrBottom}:-${RESIZE_HANDLE_MARGIN}px;${leftOrRight}:-${RESIZE_HANDLE_MARGIN}px;border-radius:100%;border: 2px solid #bfbfbf;box-shadow: 0px 0.36316px 1.36185px rgba(100, 100, 100, 0.25);`
    );
    handle.dataset.x = x;
    handle.dataset.y = y;
    return { handleWrapper, handle };
};
