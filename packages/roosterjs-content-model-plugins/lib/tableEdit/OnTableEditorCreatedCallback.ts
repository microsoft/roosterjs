/**
 * Optional callback when creating a TableEditPlugin, allows to customize the Selectors element as required.
 */
export type OnTableEditorCreatedCallback = (
    editorType: 'HorizontalTableInserter' | 'VerticalTableInserter' | 'TableMover' | 'TableResizer',
    element: HTMLElement
) => () => void;
