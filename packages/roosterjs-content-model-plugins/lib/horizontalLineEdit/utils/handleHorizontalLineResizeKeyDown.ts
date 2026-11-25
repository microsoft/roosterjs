import { resizeHorizontalLine } from './resizeHorizontalLine';
import type { HorizontalLineResizeContext } from '../types/HorizontalLineResizeContext';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Resolve the handle across the shadow boundary for editor-level keyboard events.
 * @returns Whether the event was handled as a resize command.
 */
export function handleHorizontalLineResizeKeyDown(
    context: HorizontalLineResizeContext,
    event: KeyboardEvent,
    editor: IEditor,
    onFinish: () => void,
    onCancel: () => void
): boolean {
    const handleContext = event
        .composedPath()
        .map(target => context.handles.get(target))
        .find(handle => !!handle);

    if (handleContext) {
        const step = event.shiftKey ? 10 : 1;
        const deltaX = event.key == 'ArrowRight' ? step : event.key == 'ArrowLeft' ? -step : 0;
        const deltaY = event.key == 'ArrowDown' ? step : event.key == 'ArrowUp' ? -step : 0;
        if (deltaX || deltaY) {
            resizeHorizontalLine(handleContext, context.dimensions, deltaX, deltaY);
        } else if (event.key == 'Enter') {
            onFinish();
            editor.focus();
        } else if (event.key == 'Escape') {
            onCancel();
            editor.focus();
        } else {
            return false;
        }
        event.preventDefault();
        event.stopPropagation();
        return true;
    }

    return false;
}
