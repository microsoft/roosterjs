import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { Definition } from 'roosterjs-editor-types';
import { FormatRenderer } from '../utils/FormatRenderer';
import { MetadataFormat } from 'roosterjs-content-model';
import { validate } from 'roosterjs-editor-dom';

export function createMetadataFormatRenderer<T>(
    def: Definition<T> | null
): FormatRenderer<MetadataFormat<T>> {
    return createTextFormatRenderer<MetadataFormat<T>>(
        'Metadata',
        format => JSON.stringify(format.metadata, null, 2),
        (format, value) => {
            if (value == '') {
                delete format.metadata;
                return undefined;
            } else {
                try {
                    const metadata = JSON.parse(value);

                    if (!def || validate(metadata, def)) {
                        format.metadata = metadata;
                        return undefined;
                    } else {
                        return 'Fail to validate metadata';
                    }
                } catch (e) {
                    return 'Fail to parse JSON: ' + e;
                }
            }
        },
        'multiline'
    );
}
