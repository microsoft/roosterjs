import * as React from 'react';
import { BackgroundColorFormatRenderer } from '../format/formatPart/BackgroundColorFormatRenderer';
import { BlockGroupContentView } from './BlockGroupContentView';
import { BorderFormatRenderers } from '../format/formatPart/BorderFormatRenderers';
import { ContentModelView } from '../ContentModelView';
import { createMetadataFormatRenderer } from '../format/formatPart/MetadataFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { SizeFormatRenderers } from '../format/formatPart/SizeFormatRenderers';
import { TextAlignFormatRenderer } from '../format/formatPart/TextAlignFormatRenderer';
import { VerticalAlignFormatRenderer } from '../format/formatPart/VerticalAlignFormatRenderer';
import {
    ContentModelTableCell,
    ContentModelTableCellFormat,
    hasSelectionInBlock,
} from 'roosterjs-content-model';

const styles = require('./ContentModelTableCellView.scss');

const TableCellFormatRenderers: FormatRenderer<ContentModelTableCellFormat>[] = [
    ...SizeFormatRenderers,
    ...BorderFormatRenderers,
    BackgroundColorFormatRenderer,
    TextAlignFormatRenderer,
    VerticalAlignFormatRenderer,
    createMetadataFormatRenderer(null),
];

export function ContentModelTableCellView(props: { cell: ContentModelTableCell }) {
    const { cell } = props;
    const checkboxHeader = React.useRef<HTMLInputElement>(null);
    const checkboxSpanLeft = React.useRef<HTMLInputElement>(null);
    const checkboxSpanAbove = React.useRef<HTMLInputElement>(null);
    const [isHeader, setIsHeader] = React.useState<boolean>(cell.isHeader);
    const [spanLeft, setSpanLeft] = React.useState<boolean>(cell.spanLeft);
    const [spanAbove, setSpanAbove] = React.useState<boolean>(cell.spanAbove);

    const onHeaderChanged = React.useCallback(() => {
        const value = checkboxHeader.current.checked;
        cell.isHeader = value;
        setIsHeader(value);
    }, [cell, setIsHeader]);

    const onSpanLeftChanged = React.useCallback(() => {
        const value = checkboxSpanLeft.current.checked;
        cell.spanLeft = value;
        setSpanLeft(value);
    }, [cell, setSpanLeft]);

    const onSpanAboveChanged = React.useCallback(() => {
        const value = checkboxSpanAbove.current.checked;
        cell.spanAbove = value;
        setSpanAbove(value);
    }, [cell, setSpanAbove]);

    const getContent = React.useCallback(() => {
        return (
            <>
                <div>
                    <input
                        type="checkbox"
                        checked={isHeader}
                        ref={checkboxHeader}
                        onClick={onHeaderChanged}
                    />
                    Header
                </div>
                <div>
                    <input
                        type="checkbox"
                        checked={spanLeft}
                        ref={checkboxSpanLeft}
                        onClick={onSpanLeftChanged}
                    />
                    Span Left
                </div>
                <div>
                    <input
                        type="checkbox"
                        checked={spanAbove}
                        ref={checkboxSpanAbove}
                        onClick={onSpanAboveChanged}
                    />
                    Span Above
                </div>
                <BlockGroupContentView group={cell} />
            </>
        );
    }, [cell, isHeader, spanAbove, spanLeft]);

    const getFormat = React.useCallback(() => {
        return <FormatView format={cell.format} renderers={TableCellFormatRenderers} />;
    }, [cell.format]);

    const subTitle =
        cell.spanAbove && cell.spanLeft ? '↖' : cell.spanLeft ? '←' : cell.spanAbove ? '↑' : '';

    return (
        <ContentModelView
            title={isHeader ? 'TableCellHeader' : 'TableCell'}
            subTitle={subTitle}
            className={styles.modelTableCell}
            hasSelection={hasSelectionInBlock(cell)}
            isSelected={cell.isSelected}
            jsonSource={cell}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
