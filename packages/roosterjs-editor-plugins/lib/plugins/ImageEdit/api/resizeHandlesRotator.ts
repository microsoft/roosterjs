const Rotation30to60DegreesHandlesSequence = [
    'w-resize',
    'n-resize',
    's-resize',
    'e-resize',
    'nw-resize',
    'sw-resize',
    'ne-resize',
    'se-resize',
];

const Rotation60to120DegreesHandlesSequence = [
    'nw-resize',
    'ne-resize',
    'sw-resize',
    'se-resize',
    'n-resize',
    'w-resize',
    'e-resize',
    's-resize',
];

const Rotation120to150DegreesHandlesSequence = [
    'n-resize',
    'e-resize',
    'w-resize',
    's-resize',
    'ne-resize',
    'nw-resize',
    'se-resize',
    'sw-resize',
];

const Rotation150to210DegreesHandlesSequence = [
    'ne-resize',
    'se-resize',
    'nw-resize',
    'sw-resize',
    'e-resize',
    'n-resize',
    's-resize',
    'w-resize',
];

const Rotation210to240DegreesHandlesSequence = [
    'e-resize',
    's-resize',
    'n-resize',
    'w-resize',
    'se-resize',
    'ne-resize',
    'sw-resize',
    'nw-resize',
];

const Rotation240to300DegreeshandlesSequence = [
    'se-resize',
    'sw-resize',
    'ne-resize',
    'nw-resize',
    's-resize',
    'e-resize',
    'w-resize',
    'n-resize',
];

const Rotation300to330DegreesHandlesSequence = [
    's-resize',
    'w-resize',
    'e-resize',
    'n-resize',
    'sw-resize',
    'se-resize',
    'nw-resize',
    'ne-resize',
];

const Rotation330to30DegreesHandlesSequence = [
    'sw-resize',
    'nw-resize',
    'se-resize',
    'ne-resize',
    'w-resize',
    's-resize',
    'n-resize',
    'e-resize',
];

const PI = Math.PI;

function rotateResizeHandles(angleRad: number, index: number): string {
    switch (true) {
        case angleRad >= PI / 6 && angleRad <= PI / 3:
            return Rotation30to60DegreesHandlesSequence[index];
        case angleRad > PI / 3 && angleRad <= (2 * PI) / 3:
            return Rotation60to120DegreesHandlesSequence[index];
        case angleRad > (2 * PI) / 3 && angleRad <= (5 * PI) / 6:
            return Rotation120to150DegreesHandlesSequence[index];
        case angleRad > (5 * PI) / 6 && angleRad <= (7 * PI) / 6:
            return Rotation150to210DegreesHandlesSequence[index];
        case angleRad < -(2 * PI) / 3 && angleRad >= -(5 * PI) / 6:
            return Rotation210to240DegreesHandlesSequence[index];
        case angleRad < -PI / 3 && angleRad >= -(2 * PI) / 3:
            return Rotation240to300DegreeshandlesSequence[index];
        case angleRad <= -PI / 6 && angleRad >= -PI / 3:
            return Rotation300to330DegreesHandlesSequence[index];
        default:
            return Rotation330to30DegreesHandlesSequence[index];
    }
}

/**
 * Rotation the resizer handles according to the image position.
 * @param resizeHandles The resizer handles.
 * @param angleRad The angle that the image was rotated.
 */
export function resizeHandlesRotator(resizerHandles: HTMLElement[], angleRad: number) {
    resizerHandles.map(handles => {
        const index = resizerHandles.indexOf(handles);
        handles.style.cursor = rotateResizeHandles(angleRad, index);
    });
}
