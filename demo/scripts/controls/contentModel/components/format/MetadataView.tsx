import * as React from 'react';
import { ContentModelWithDataset } from 'roosterjs-content-model';
import { FormatRenderer } from './utils/FormatRenderer';

const styles = require('./FormatView.scss');

export function MetadataView<T>(props: {
    model: ContentModelWithDataset<T>;
    renderers: FormatRenderer<T>[];
    updater: (model: ContentModelWithDataset<T>, callback: (format: T | null) => T | null) => void;
}) {
    const { model, renderers, updater } = props;
    const metadata = React.useRef<T>(null);

    const onUpdate = React.useCallback(() => {
        updater(model, () => metadata.current);
    }, [model]);

    let result: JSX.Element | null = null;

    updater(model, format => {
        metadata.current = format;
        result = format ? (
            <div className={styles.formatTable}>{renderers.map(x => x(format, onUpdate))}</div>
        ) : null;

        return format;
    });

    return result;
}
