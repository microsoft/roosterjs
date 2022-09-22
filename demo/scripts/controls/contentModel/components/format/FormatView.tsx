import * as React from 'react';
import { FormatRenderer } from './utils/FormatRenderer';

const styles = require('./FormatView.scss');

export function FormatView<T>(props: {
    format: T;
    renderers: FormatRenderer<T>[];
    onUpdate?: () => void;
}) {
    const { format, renderers, onUpdate } = props;

    return <div className={styles.formatTable}>{renderers.map(x => x(format, onUpdate))}</div>;
}
