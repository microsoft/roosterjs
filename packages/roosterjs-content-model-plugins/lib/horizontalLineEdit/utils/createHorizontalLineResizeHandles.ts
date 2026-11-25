import { DEFAULT_BORDER_COLOR, HANDLE_SIZE, WRAPPER_GAP } from '../constants';
import { DragAndDropHelper } from '../../pluginUtils/DragAndDrop/DragAndDropHelper';
import { HorizontalLineResizer } from './resizeHorizontalLine';
import type { HorizontalLineEditOptions } from '../HorizontalLineEditOptions';
import type {
    HorizontalLineResizeContext,
    HorizontalLineResizeHandleContext,
} from '../types/HorizontalLineResizeContext';
import type { IEditor } from 'roosterjs-content-model-types';

const HANDLE_DIRECTIONS = [
    { horizontal: -1, vertical: -1, direction: 'nw' },
    { horizontal: 0, vertical: -1, direction: 'n' },
    { horizontal: 1, vertical: -1, direction: 'ne' },
    { horizontal: 1, vertical: 0, direction: 'e' },
    { horizontal: 1, vertical: 1, direction: 'se' },
    { horizontal: 0, vertical: 1, direction: 's' },
    { horizontal: -1, vertical: 1, direction: 'sw' },
    { horizontal: -1, vertical: 0, direction: 'w' },
];

/**
 * @internal
 * Register the eight handles and wire mouse and touch preview resizing.
 */
export function createHorizontalLineResizeHandles(
    context: HorizontalLineResizeContext,
    editor: IEditor,
    options: HorizontalLineEditOptions,
    zoomScale: number
) {
    HANDLE_DIRECTIONS.forEach(({ horizontal, vertical, direction }) => {
        const handleContext = { context, horizontal, vertical, options };
        const handle = createResizeHandle(context.wrapper.ownerDocument, handleContext, direction);
        context.wrapper.appendChild(handle);
        context.handles.set(handle, handleContext);
        context.helpers.push(
            new DragAndDropHelper(
                handle,
                handleContext,
                // Releasing a handle leaves the preview active until editing is dismissed.
                () => {},
                HorizontalLineResizer,
                zoomScale,
                editor.getEnvironment().isMobileOrTablet,
                editor.getEnvironment().isTouchSupported
            )
        );
    });
}

function createResizeHandle(
    doc: Document,
    { horizontal, vertical, options }: HorizontalLineResizeHandleContext,
    direction: string
) {
    const handle = doc.createElement('div');
    handle.tabIndex = 0;
    handle.setAttribute('role', 'button');
    handle.setAttribute('data-resize-handle', direction);
    if (options.resizeHandleLabel) {
        handle.setAttribute('aria-label', options.resizeHandleLabel);
    }
    handle.style.cssText =
        `position:absolute;width:${HANDLE_SIZE}px;height:${HANDLE_SIZE}px;box-sizing:border-box;` +
        'background:white;border:1px solid;z-index:1;transform:translateX(-50%);';
    handle.style.borderColor = options.borderColor ?? DEFAULT_BORDER_COLOR;
    handle.style.left =
        horizontal < 0
            ? -WRAPPER_GAP + 'px'
            : horizontal > 0
            ? `calc(100% + ${WRAPPER_GAP}px)`
            : '50%';
    if (vertical < 0) {
        handle.style.bottom = `calc(100% + ${WRAPPER_GAP}px)`;
    } else if (vertical > 0) {
        handle.style.top = `calc(100% + ${WRAPPER_GAP}px)`;
    } else {
        handle.style.top = '50%';
        handle.style.transform = 'translate(-50%, -50%)';
    }
    handle.style.cursor = direction + '-resize';
    return handle;
}
