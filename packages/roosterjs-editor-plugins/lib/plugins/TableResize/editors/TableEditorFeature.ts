import Disposable from '../../../pluginUtils/Disposable';

/**
 * @internal
 */
export default interface TableEditFeature {
    node: Node;
    div: HTMLDivElement | null;
    featureHandler: Disposable | null;
}

/**
 * @internal
 */
export function disposeTableEditFeature(resizer: TableEditFeature | null) {
    if (resizer) {
        resizer.div?.parentNode?.removeChild(resizer.div);
        resizer.div = null;
        resizer.featureHandler?.dispose();
        resizer.featureHandler = null;
    }
}
