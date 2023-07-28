/**
 * @internal
 */
export function shouldDeleteWord(rawEvent: KeyboardEvent, isMac: boolean) {
    return (
        (isMac && rawEvent.altKey && !rawEvent.metaKey) ||
        (!isMac && rawEvent.ctrlKey && !rawEvent.altKey)
    );
}

/**
 * @internal
 */
export function shouldDeleteAllSegmentsBefore(rawEvent: KeyboardEvent) {
    return rawEvent.metaKey && !rawEvent.altKey;
}
