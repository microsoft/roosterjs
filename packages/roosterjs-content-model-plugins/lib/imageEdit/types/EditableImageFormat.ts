import type { ContentModelImageFormat } from 'roosterjs-content-model-types';

/**
 * Type for editable image format
 */
export type EditableImageFormat = ContentModelImageFormat & {
    isEditing?: boolean;
};
