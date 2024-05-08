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
