import Disposable from '../../../pluginUtils/Disposable';

/**
 * @internal
 */
export default interface TableEditFeature {
    node: Node;
    div: HTMLDivElement;
    featureHandler: Disposable;
}

/**
 * @internal
 */
export function disposeTableEditFeature(resizer: TableEditFeature) {
    resizer.div.parentNode?.removeChild(resizer.div);
    resizer.div = null;
    resizer.featureHandler.dispose();
    resizer.featureHandler = null;
}
