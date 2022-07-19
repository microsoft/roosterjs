import { TableFormat } from 'roosterjs-editor-types';

/**
 * Format of Table
 */
export interface ContentModelTableFormat {
    id?: string;

    /**
     * Metadata of table, used for reformat table when structure is changed
     */
    metadata?: TableFormat;

    /**
     * Whether borders of cells are collapsed together
     */
    borderCollapse?: boolean;
}
