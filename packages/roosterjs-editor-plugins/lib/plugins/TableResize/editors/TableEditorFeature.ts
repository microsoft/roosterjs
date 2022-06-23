import Disposable from '../../../pluginUtils/Disposable';

/**
 * @internal
 */
export default interface TableEditFeature {
    node: Node;
    div: HTMLDivElement | undefined;
    featureHandler: Disposable | undefined;
}

/**
 * @internal
 */
export function disposeTableEditFeature(resizer: TableEditFeature) {
    resizer.div?.parentNode?.removeChild(resizer.div);
    resizer.div = undefined;
    resizer.featureHandler?.dispose();
    resizer.featureHandler = undefined;
}
