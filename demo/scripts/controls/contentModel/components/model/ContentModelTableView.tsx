import * as React from 'react';
import { applyTableFormat } from 'roosterjs-content-model/lib/modelApi/table/applyTableFormat';
import { BackgroundColorFormatRenderer } from '../format/formatPart/BackgroundColorFormatRenderer';
import { BorderFormatRenderers } from '../format/formatPart/BorderFormatRenderers';
import { ContentModelBlockView } from './ContentModelBlockView';
import { ContentModelView } from '../ContentModelView';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { IdFormatRenderer } from '../format/formatPart/IdFormatRenderer';
import { MarginFormatRenderer } from '../format/formatPart/MarginFormatRenderer';
import { SpacingFormatRenderer } from '../format/formatPart/SpacingFormatRenderer';
import { TableMetadataFormatRenders } from '../format/formatPart/TableMetadataFormatRenders';
import { useProperty } from '../../hooks/useProperty';
import {
    ContentModelTable,
    ContentModelTableFormat,
    hasSelectionInBlock,
} from 'roosterjs-content-model';

const styles = require('./ContentModelTableView.scss');

const TableFormatRenderers: FormatRenderer<ContentModelTableFormat>[] = [
    IdFormatRenderer,
    SpacingFormatRenderer,
    BackgroundColorFormatRenderer,
    MarginFormatRenderer,
    ...BorderFormatRenderers,
    ...TableMetadataFormatRenders,
];

export function ContentModelTableView(props: { table: ContentModelTable }) {
    const { table } = props;
    const getContent = React.useCallback(() => {
        return (
            <>
                <div>
                    Widths:
                    {table.widths.map((_, index) => (
                        <NumberView values={table.widths} index={index} key={index} />
                    ))}
                </div>
                <div>
                    Heights:
                    {table.heights.map((_, index) => (
                        <NumberView values={table.heights} index={index} key={index} />
                    ))}
                </div>
                {table.cells.map((row, i) => (
                    <div className={styles.tableRow} key={i}>
                        {row.map((cell, j) => (
                            <ContentModelBlockView block={cell} key={j} />
                        ))}
                    </div>
                ))}
            </>
        );
    }, [table]);

    const onApplyTableFormat = React.useCallback(() => {
        applyTableFormat(table, undefined, true);
    }, [table]);

    const getFormat = React.useCallback(() => {
        return (
            <>
                <div>
                    <button onClick={onApplyTableFormat}>Apply table format</button>
                </div>
                <FormatView format={table.format} renderers={TableFormatRenderers} />
            </>
        );
    }, [table.format]);

    return (
        <ContentModelView
            title="Table"
            subTitle={`${table.cells.length} x ${table.cells[0]?.length || 0}`}
            isExpanded={true}
            className={styles.modelTable}
            hasSelection={hasSelectionInBlock(table)}
            jsonSource={table}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}

function NumberView(props: { values: number[]; index: number }) {
    const { values, index } = props;
    const textBoxRef = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = useProperty(values[index]);
    const onChange = React.useCallback(() => {
        const newValue = parseInt(textBoxRef.current.value);
        values[index] = newValue;
        setValue(newValue);
    }, [values, index]);

    return (
        <input
            type="number"
            value={value}
            onChange={onChange}
            ref={textBoxRef}
            className={styles.sizeInput}
        />
    );
}
