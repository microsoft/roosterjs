import type { TableEditFeatureName } from './editors/features/TableEditFeature';

/**
 * Optional callback when creating a TableEditPlugin, allows to customize the Selectors element as required.
 */
export type OnTableEditorCreatedCallback = (
    featureType: TableEditFeatureName,
    element: HTMLElement
) => () => void;
