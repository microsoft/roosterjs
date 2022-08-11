import * as React from 'react';
import { FormatRenderer } from './utils/FormatRenderer';

const styles = require('./FormatView.scss');

export function FormatView<T>(props: { format: T; renderers: FormatRenderer<T>[] }) {
    const { format, renderers } = props;

    return <div className={styles.formatTable}>{renderers.map(x => x(format))}</div>;
}
