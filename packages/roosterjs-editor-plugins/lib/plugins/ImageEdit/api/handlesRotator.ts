const DIRECTIONS = 8;

function handleRadIndexCalculator(angleRad: number): number {
    const directionRad = (Math.PI * 2) / DIRECTIONS; // 45deg
    let idx = Math.round(angleRad / directionRad) % DIRECTIONS;
    return idx < 0 ? idx + DIRECTIONS : idx;
}

function rotateHandles(element: HTMLElement, angleRad: number): string {
    const radIndex = handleRadIndexCalculator(angleRad);
    const DirectionOrder = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    const originalDirection = element.dataset.y + element.dataset.x;
    const originalIndex = DirectionOrder.indexOf(originalDirection);
    const rotatedIndex = originalIndex + radIndex;
    return DirectionOrder[rotatedIndex % DIRECTIONS];
}
/**
 * Rotate the resizer and cropper handles according to the image position.
 * @param handles The resizer handles.
 * @param angleRad The angle that the image was rotated.
 */
export function handlesRotator(handles: HTMLElement[], angleRad: number) {
    handles.map(handle => {
        handle.style.cursor = `${rotateHandles(handle, angleRad)}-resize`;
    });
}
