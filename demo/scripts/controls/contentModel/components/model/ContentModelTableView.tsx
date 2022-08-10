import * as React from 'react';
import { BackgroundColorFormatRenderer } from '../format/formatPart/BackgroundColorFormatRenderer';
import { ContentModelBlockView } from './ContentModelBlockView';
import { ContentModelView } from '../ContentModelView';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { IdFormatRenderer } from '../format/formatPart/IdFormatRenderer';
import { MarginFormatRenderer } from '../format/formatPart/MarginFormatRenderer';
import { SizeFormatRenderers } from '../format/formatPart/SizeFormatRenderers';
import { SpacingFormatRenderer } from '../format/formatPart/SpacingFormatRenderer';
import { TableMetadataFormatRenders } from '../format/formatPart/TableMetadataFormatRenders';
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
    ...SizeFormatRenderers,
    ...TableMetadataFormatRenders,
];

export function ContentModelTableView(props: { table: ContentModelTable }) {
    const { table } = props;
    const getContent = React.useCallback(() => {
        return (
            <>
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

    const getFormat = React.useCallback(() => {
        return <FormatView format={table.format} renderers={TableFormatRenderers} />;
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
