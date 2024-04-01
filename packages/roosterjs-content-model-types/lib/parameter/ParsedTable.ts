/**
 * Parse a table, this type represents a parsed table cell. It can be a cell element, or a string to indicate where it is spanned from
 */
export type ParsedTableCell = HTMLTableCellElement | 'spanLeft' | 'spanTop' | 'spanBoth';

/**
 * Represents a parsed table with its table cells
 */
export type ParsedTable = ParsedTableCell[][];
