/**
 * @internal
 */
export function ptToPx(pt: number): number {
    return Math.round((pt * 4000) / 3) / 1000;
}
