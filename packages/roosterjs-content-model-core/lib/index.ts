export { mergeModel, MergeModelOption } from './publicApi/model/mergeModel';
export { isBold } from './publicApi/model/isBold';
export { createModelFromHtml } from './publicApi/model/createModelFromHtml';
export { exportContent } from './publicApi/model/exportContent';

export { applyTableFormat } from './publicApi/table/applyTableFormat';
export { normalizeTable, MIN_ALLOWED_TABLE_CELL_WIDTH } from './publicApi/table/normalizeTable';
export { setTableCellBackgroundColor } from './publicApi/table/setTableCellBackgroundColor';
export { getSelectedCells } from './publicApi/table/getSelectedCells';

export { isCharacterValue, isModifierKey } from './publicApi/domUtils/eventUtils';
export { combineBorderValue, extractBorderValues } from './publicApi/domUtils/borderValues';
export { isPunctuation, isSpace } from './publicApi/domUtils/stringUtil';
export { readFile } from './publicApi/domUtils/readFile';
export { cacheGetEventData } from './publicApi/domUtils/cacheGetEventData';

export { undo } from './publicApi/undo/undo';
export { redo } from './publicApi/undo/redo';
export { paste } from './publicApi/paste/paste';

export { retrieveModelFormatState } from './publicApi/format/retrieveModelFormatState';

export { ChangeSource } from './constants/ChangeSource';

export { extractClipboardItems } from './utils/extractClipboardItems';

export { Editor } from './editor/Editor';
