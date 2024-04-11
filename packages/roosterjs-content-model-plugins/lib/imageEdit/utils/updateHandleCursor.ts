const PI = Math.PI;
const DIRECTIONS = 8;
const DirectionRad = (PI * 2) / DIRECTIONS;
const DirectionOrder = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

function handleRadIndexCalculator(angleRad: number): number {
    const idx = Math.round(angleRad / DirectionRad) % DIRECTIONS;
    return idx < 0 ? idx + DIRECTIONS : idx;
}

function rotateHandles(angleRad: number, y: string = '', x: string = ''): string {
    const radIndex = handleRadIndexCalculator(angleRad);
    const originalDirection = y + x;
    const originalIndex = DirectionOrder.indexOf(originalDirection);
    const rotatedIndex = originalIndex >= 0 && originalIndex + radIndex;
    return rotatedIndex ? DirectionOrder[rotatedIndex % DIRECTIONS] : '';
}
/**
 * @internal
 * Rotate the resizer and cropper handles according to the image position.
 * @param handles The resizer handles.
 * @param angleRad The angle that the image was rotated.
 */
export function updateHandleCursor(handles: HTMLElement[], angleRad: number) {
    handles.forEach(handle => {
        const { y, x } = handle.dataset;
        handle.style.cursor = `${rotateHandles(angleRad, y, x)}-resize`;
    });
}
