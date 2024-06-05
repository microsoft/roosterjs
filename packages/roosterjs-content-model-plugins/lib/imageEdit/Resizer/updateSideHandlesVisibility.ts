/**
 * @internal
 */
export function updateSideHandlesVisibility(handles: HTMLDivElement[], isSmall: boolean) {
    handles.forEach(handle => {
        const { y, x } = handle.dataset;
        const coordinate = (y ?? '') + (x ?? '');
        const directions = ['n', 's', 'e', 'w'];
        const isSideHandle = directions.indexOf(coordinate) > -1;
        handle.style.display = isSideHandle && isSmall ? 'none' : '';
    });
}
