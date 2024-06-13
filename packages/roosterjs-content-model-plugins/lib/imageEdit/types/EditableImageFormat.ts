import type { ContentModelImageFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export type EditingFormat = {
    isEditing?: boolean;
};

/**
 * @internal
 */
export type EditableImageFormat = ContentModelImageFormat & EditingFormat;
