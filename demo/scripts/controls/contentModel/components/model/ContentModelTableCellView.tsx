import * as React from 'react';
import { BackgroundColorFormatRenderer } from '../format/formatPart/BackgroundColorFormatRenderer';
import { BlockGroupContentView } from './BlockGroupContentView';
import { BorderBoxFormatRenderer } from '../format/formatPart/BorderBoxFormatRenderer';
import { BorderFormatRenderers } from '../format/formatPart/BorderFormatRenderers';
import { ContentModelView } from '../ContentModelView';
import { DirectionFormatRenderer } from '../format/formatPart/DirectionFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { HtmlAlignFormatRenderer } from '../format/formatPart/HtmlAlignFormatRenderer';
import { MetadataView } from '../format/MetadataView';
import { PaddingFormatRenderer } from '../format/formatPart/PaddingFormatRenderer';
import { TableCellMetadataFormatRender } from '../format/formatPart/TableCellMetadataFormatRender';
import { TextAlignFormatRenderer } from '../format/formatPart/TextAlignFormatRenderer';
import { TextColorFormatRenderer } from '../format/formatPart/TextColorFormatRenderer';
import { updateTableCellMetadata } from 'roosterjs-content-model';
import { useProperty } from '../../hooks/useProperty';
import { VerticalAlignFormatRenderer } from '../format/formatPart/VerticalAlignFormatRenderer';
import { WordBreakFormatRenderer } from '../format/formatPart/WordBreakFormatRenderer';
import {
    ContentModelTableCell,
    ContentModelTableCellFormat,
    hasSelectionInBlockGroup,
} from 'roosterjs-content-model';

const styles = require('./ContentModelTableCellView.scss');

const TableCellFormatRenderers: FormatRenderer<ContentModelTableCellFormat>[] = [
    ...BorderFormatRenderers,
    DirectionFormatRenderer,
    TextAlignFormatRenderer,
    HtmlAlignFormatRenderer,
    BorderBoxFormatRenderer,
    BackgroundColorFormatRenderer,
    PaddingFormatRenderer,
    VerticalAlignFormatRenderer,
    WordBreakFormatRenderer,
    TextColorFormatRenderer,
];

export function ContentModelTableCellView(props: { cell: ContentModelTableCell }) {
    const { cell } = props;
    const checkboxHeader = React.useRef<HTMLInputElement>(null);
    const checkboxSpanLeft = React.useRef<HTMLInputElement>(null);
    const checkboxSpanAbove = React.useRef<HTMLInputElement>(null);
    const [isHeader, setIsHeader] = useProperty(cell.isHeader);
    const [spanLeft, setSpanLeft] = useProperty(cell.spanLeft);
    const [spanAbove, setSpanAbove] = useProperty(cell.spanAbove);

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
                        onChange={onHeaderChanged}
                    />
                    Header
                </div>
                <div>
                    <input
                        type="checkbox"
                        checked={spanLeft}
                        ref={checkboxSpanLeft}
                        onChange={onSpanLeftChanged}
                    />
                    Span Left
                </div>
                <div>
                    <input
                        type="checkbox"
                        checked={spanAbove}
                        ref={checkboxSpanAbove}
                        onChange={onSpanAboveChanged}
                    />
                    Span Above
                </div>
                <BlockGroupContentView group={cell} />
            </>
        );
    }, [cell, isHeader, spanAbove, spanLeft]);

    const getMetadata = React.useCallback(() => {
        return (
            <MetadataView
                model={cell}
                renderers={[TableCellMetadataFormatRender]}
                updater={updateTableCellMetadata}
            />
        );
    }, [cell]);

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
            hasSelection={hasSelectionInBlockGroup(cell)}
            isSelected={cell.isSelected}
            jsonSource={cell}
            getContent={getContent}
            getFormat={getFormat}
            getMetadata={getMetadata}
        />
    );
}
