const RangeKeys: (keyof Range)[] = ['startContainer', 'endContainer', 'startOffset', 'endOffset'];

/**
 * @internal
 * Check if two ranges have the same start and end positions.
 */
export function areSameRanges(r1: Range, r2: Range): boolean {
    return RangeKeys.every(k => r1[k] == r2[k]);
}
