/**
 * @internal
 */
export interface FormatContext {
    isInSelection: boolean;

    // TODO: Add format for block and segment here

    isSelectionCollapsed?: boolean;
    startContainer?: Node;
    endContainer?: Node;
    startOffset?: number;
    endOffset?: number;
}
