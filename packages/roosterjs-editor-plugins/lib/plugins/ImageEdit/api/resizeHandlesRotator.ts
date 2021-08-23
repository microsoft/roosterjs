const Rotation22to67DegreesHandlesSequence = [
    'w-resize',
    'n-resize',
    's-resize',
    'e-resize',
    'nw-resize',
    'sw-resize',
    'ne-resize',
    'se-resize',
];

const Rotation67to112DegreesHandlesSequence = [
    'nw-resize',
    'ne-resize',
    'sw-resize',
    'se-resize',
    'n-resize',
    'w-resize',
    'e-resize',
    's-resize',
];

const Rotation112to157DegreesHandlesSequence = [
    'n-resize',
    'e-resize',
    'w-resize',
    's-resize',
    'ne-resize',
    'nw-resize',
    'se-resize',
    'sw-resize',
];

const Rotation157to202DegreesHandlesSequence = [
    'ne-resize',
    'se-resize',
    'nw-resize',
    'sw-resize',
    'e-resize',
    'n-resize',
    's-resize',
    'w-resize',
];

const Rotation202to248DegreesHandlesSequence = [
    'e-resize',
    's-resize',
    'n-resize',
    'w-resize',
    'se-resize',
    'ne-resize',
    'sw-resize',
    'nw-resize',
];

const Rotation248to292DegreeshandlesSequence = [
    'se-resize',
    'sw-resize',
    'ne-resize',
    'nw-resize',
    's-resize',
    'e-resize',
    'w-resize',
    'n-resize',
];

const Rotation292to338DegreesHandlesSequence = [
    's-resize',
    'w-resize',
    'e-resize',
    'n-resize',
    'sw-resize',
    'se-resize',
    'nw-resize',
    'ne-resize',
];

const Rotation338to22DegreesHandlesSequence = [
    'sw-resize',
    'nw-resize',
    'se-resize',
    'ne-resize',
    'w-resize',
    's-resize',
    'n-resize',
    'e-resize',
];

const part = Math.PI / 8;

function rotateResizeHandles(angleRad: number, index: number): string {
    switch (true) {
        case angleRad >= part && angleRad < 3 * part:
            return Rotation22to67DegreesHandlesSequence[index];
        case angleRad >= 3 * part && angleRad < 5 * part:
            return Rotation67to112DegreesHandlesSequence[index];
        case angleRad >= 5 * part && angleRad < 7 * part:
            return Rotation112to157DegreesHandlesSequence[index];
        case angleRad >= 7 * part && angleRad < 9 * part:
            return Rotation157to202DegreesHandlesSequence[index];
        case angleRad <= -5 * part && angleRad > -7 * part:
            return Rotation202to248DegreesHandlesSequence[index];
        case angleRad <= -3 * part && angleRad > -5 * part:
            return Rotation248to292DegreeshandlesSequence[index];
        case angleRad <= -part && angleRad > -3 * part:
            return Rotation292to338DegreesHandlesSequence[index];
        default:
            return Rotation338to22DegreesHandlesSequence[index];
    }
}

/**
 * Rotate the resizer handles according to the image position.
 * @param resizeHandles The resizer handles.
 * @param angleRad The angle that the image was rotated.
 */
export function resizeHandlesRotator(resizerHandles: HTMLElement[], angleRad: number) {
    resizerHandles.map(handles => {
        const index = resizerHandles.indexOf(handles);
        handles.style.cursor = rotateResizeHandles(angleRad, index);
    });
}
