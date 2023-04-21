import { VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export type Nullable<T> = T | null | undefined;

/**
 * @internal
 */
export interface TableCellSelectionState {
    lastTarget: Nullable<Node>;
    firstTarget: Nullable<Node>;
    tableSelection: Nullable<boolean>;
    startedSelection: Nullable<boolean>;
    vTable: Nullable<VTable>;
    firstTable: Nullable<HTMLTableElement>;
    targetTable: Nullable<HTMLElement>;
    preventKeyUp: boolean;
    mouseMoveDisposer: (() => void) | null;
}
