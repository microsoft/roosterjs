import * as React from 'react';
import { BackgroundColorFormatRenderer } from '../format/formatPart/BackgroundColorFormatRenderer';
import { ContentModelBlockGroupView } from './ContentModelBlockGroupView';
import { ContentModelView } from '../ContentModelView';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { useProperty } from '../../hooks/useProperty';
import {
    ContentModelBlockFormat,
    ContentModelTableRow,
    hasSelectionInBlockGroup,
} from 'roosterjs-content-model';

const styles = require('./ContentModelTableRowView.scss');

const TableRowFormatRenderers: FormatRenderer<ContentModelBlockFormat>[] = [
    BackgroundColorFormatRenderer,
];

export function ContentModelTableRowView(props: { row: ContentModelTableRow }) {
    const { row } = props;
    const [height, setHeight] = useProperty(row.height);
    const textBoxRef = React.useRef<HTMLInputElement>(null);
    const onChange = React.useCallback(() => {
        const newValue = parseInt(textBoxRef.current.value);
        row.height = newValue;
        setHeight(newValue);
    }, [row]);

    const getContent = React.useCallback(() => {
        return (
            <>
                <div>
                    Height:
                    <input
                        type="number"
                        value={height}
                        onChange={onChange}
                        ref={textBoxRef}
                        className={styles.sizeInput}
                    />
                </div>
                {row.cells.map((cell, j) => (
                    <ContentModelBlockGroupView group={cell} key={j} />
                ))}
            </>
        );
    }, [row]);

    const getFormat = React.useCallback(() => {
        return <FormatView format={row.format} renderers={TableRowFormatRenderers} />;
    }, [row.format]);

    return (
        <ContentModelView
            title="Table Row"
            isExpanded={false}
            className={styles.modelTableRow}
            hasSelection={row.cells.some(cell => hasSelectionInBlockGroup(cell))}
            jsonSource={row}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
