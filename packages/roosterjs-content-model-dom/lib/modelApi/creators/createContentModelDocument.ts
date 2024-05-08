import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelDocument,
    ReadonlyContentModelDocument,
    ReadonlyContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelDocument model
 * @param defaultFormat @optional Default format of this model
 */
export function createContentModelDocument(
    defaultFormat?: ReadonlyContentModelSegmentFormat
): ContentModelDocument {
    const doc: ReadonlyContentModelDocument = Object.assign(
        <ReadonlyContentModelDocument>{
            blockGroupType: 'Document',
            blocks: [],
        },
        defaultFormat ? { format: defaultFormat } : undefined
    );

    return internalConvertToMutableType(doc);
}
