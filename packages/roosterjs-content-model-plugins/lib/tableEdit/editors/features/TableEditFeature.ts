import type { Disposable } from '../../../pluginUtils/Disposable';

/**
 * @internal
 */
export interface TableEditFeature {
    node: Node;
    div: HTMLDivElement | null;
    featureHandler: Disposable | null;
}

/**
 * @internal
 */
export type TableEditFeatureName =
    | 'HorizontalTableInserter'
    | 'VerticalTableInserter'
    | 'TableMover'
    | 'TableResizer'
    | 'TableSelector'
    | 'CellResizer';

export const VERTICAL_INSERTER_ID = 'verticalInserter';
export const HORIZONTAL_INSERTER_ID = 'horizontalInserter';
export const VERTICAL_RESIZER_ID = 'verticalResizer';
export const HORIZONTAL_RESIZER_ID = 'horizontalResizer';
export const TABLE_MOVER_ID = '_Table_Mover';
export const TABLE_RESIZER_ID = '_Table_Resizer';

/**
 * @internal
 */
export function disposeTableEditFeature(feature: TableEditFeature | null) {
    if (feature) {
        feature.featureHandler?.dispose();
        feature.featureHandler = null;
        feature.div?.parentNode?.removeChild(feature.div);
        feature.div = null;
    }
}
