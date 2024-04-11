/**
 * @internal Calculate the rotated x and y distance for mouse moving
 * @param x Original x distance
 * @param y Original y distance
 * @param angle Rotated angle, in radian
 * @returns rotated x and y distances
 */
export function rotateCoordinate(x: number, y: number, angle: number): [number, number] {
    if (x == 0 && y == 0) {
        return [0, 0];
    }
    const hypotenuse = Math.sqrt(x * x + y * y);
    angle = Math.atan2(y, x) - angle;
    return [hypotenuse * Math.cos(angle), hypotenuse * Math.sin(angle)];
}
