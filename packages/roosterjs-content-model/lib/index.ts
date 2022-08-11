// !!!IMPORTANT!!!
// When update this file, please also update compatibleTypes.ts accordingly.

export * from './publicTypes/index';
export * from './publicTypes/enum/index';

export { default as ExperimentalContentModelEditor } from './editor/ExperimentalContentModelEditor';
export { default as isContentModelEditor } from './editor/isContentModelEditor';

export { default as insertTable } from './publicApi/table/insertTable';
export { default as formatTable } from './publicApi/table/formatTable';
export { default as setTableCellShade } from './publicApi/table/setTableCellShade';

export { hasSelectionInBlock } from './modelApi/selection/hasSelectionInBlock';
export { hasSelectionInSegment } from './modelApi/selection/hasSelectionInSegment';

export { extractBorderValues, combineBorderValue, BorderIndex } from './domUtils/borderValues';
