import { VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export interface TableCellSelectionState {
    lastTarget: Node;
    firstTarget: Node;
    tableSelection: boolean;
    startedSelection: boolean;
    vTable: VTable;
    firstTable: HTMLTableElement;
    targetTable: HTMLElement;
    preventKeyUp: boolean;
    mouseMoveDisposer: (() => void) | null;
}
