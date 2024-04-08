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

export function createImageResizer(editor: IEditor): HTMLDivElement[] {
    return HANDLES.map(handle => createHandles(editor, handle.y, handle.x));
}

const createHandles = (editor: IEditor, y: DnDDirectionY, x: DNDDirectionX): HTMLDivElement => {
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
