import * as React from 'react';
import { BlockFormatView } from '../format/BlockFormatView';
import { ContentModelParagraph, hasSelectionInBlock } from 'roosterjs-content-model';
import { ContentModelSegmentView } from './ContentModelSegmentView';
import { ContentModelView } from '../ContentModelView';
import { SegmentFormatView } from '../format/SegmentFormatView';
import { useProperty } from '../../hooks/useProperty';

const styles = require('./ContentModelParagraphView.scss');

export function ContentModelParagraphView(props: { paragraph: ContentModelParagraph }) {
    const { paragraph } = props;
    const implicitCheckbox = React.useRef<HTMLInputElement>(null);
    const headerLevelDropDown = React.useRef<HTMLSelectElement>(null);
    const [value, setValue] = useProperty(!!paragraph.isImplicit);
    const [headerLevel, setHeaderLevel] = useProperty((paragraph.header?.headerLevel || '') + '');

    const onChange = React.useCallback(() => {
        const newValue = implicitCheckbox.current.checked;
        paragraph.isImplicit = newValue;
        setValue(newValue);
    }, [paragraph, setValue]);

    const onHeaderLevelChange = React.useCallback(() => {
        const newValue = headerLevelDropDown.current.value;

        if (paragraph.header) {
            paragraph.header.headerLevel = parseInt(newValue);
        }
        setHeaderLevel(newValue);
    }, [paragraph, setHeaderLevel]);

    const getContent = React.useCallback(() => {
        return (
            <>
                <div>
                    <input
                        type="checkbox"
                        checked={value}
                        ref={implicitCheckbox}
                        onChange={onChange}
                    />
                    Implicit
                </div>
                {paragraph.header ? (
                    <div>
                        Header level:
                        <select
                            value={headerLevel}
                            ref={headerLevelDropDown}
                            onChange={onHeaderLevelChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                        <SegmentFormatView format={paragraph.header.format} />
                    </div>
                ) : null}
                {paragraph.segments.map((segment, index) => (
                    <ContentModelSegmentView segment={segment} key={index} />
                ))}
            </>
        );
    }, [paragraph, value, headerLevel]);

    const getFormat = React.useCallback(() => {
        return <BlockFormatView format={paragraph.format} />;
    }, [paragraph.format]);

    return (
        <ContentModelView
            title="Paragraph"
            subTitle={paragraph.isImplicit ? ' (Implicit)' : ''}
            isExpanded={true}
            className={styles.modelParagraph}
            hasSelection={hasSelectionInBlock(paragraph)}
            jsonSource={paragraph}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
