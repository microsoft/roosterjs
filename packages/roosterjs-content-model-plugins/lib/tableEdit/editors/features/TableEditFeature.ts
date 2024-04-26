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
export function disposeTableEditFeature(resizer: TableEditFeature | null) {
    if (resizer) {
        resizer.featureHandler?.dispose();
        resizer.featureHandler = null;
        resizer.div?.parentNode?.removeChild(resizer.div);
        resizer.div = null;
    }
}
