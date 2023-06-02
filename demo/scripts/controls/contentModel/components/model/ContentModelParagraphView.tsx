import * as React from 'react';
import { BlockFormatView } from '../format/BlockFormatView';
import { ContentModelSegmentView } from './ContentModelSegmentView';
import { ContentModelView } from '../ContentModelView';
import { SegmentFormatView } from '../format/SegmentFormatView';
import { useProperty } from '../../hooks/useProperty';
import {
    ContentModelParagraph,
    ContentModelParagraphDecorator,
    hasSelectionInBlock,
} from 'roosterjs-content-model';

const styles = require('./ContentModelParagraphView.scss');

export function ContentModelParagraphView(props: { paragraph: ContentModelParagraph }) {
    const { paragraph } = props;
    const implicitCheckbox = React.useRef<HTMLInputElement>(null);
    const [isImplicit, setIsImplicit] = useProperty(!!paragraph.isImplicit);

    const onIsImplicitChange = React.useCallback(() => {
        const newValue = implicitCheckbox.current.checked;
        paragraph.isImplicit = newValue;
        setIsImplicit(newValue);
    }, [paragraph, setIsImplicit]);

    const getContent = React.useCallback(() => {
        return (
            <>
                <div>
                    <input
                        type="checkbox"
                        checked={isImplicit}
                        ref={implicitCheckbox}
                        onChange={onIsImplicitChange}
                    />
                    Implicit
                </div>
                {paragraph.decorator && (
                    <ContentModelParagraphDecoratorView decorator={paragraph.decorator} />
                )}
                {paragraph.segments.map((segment, index) => (
                    <ContentModelSegmentView segment={segment} key={index} />
                ))}
            </>
        );
    }, [paragraph, isImplicit]);

    const getFormat = React.useCallback(() => {
        return (
            <>
                <BlockFormatView format={paragraph.format} />
                {paragraph.segmentFormat && <SegmentFormatView format={paragraph.segmentFormat} />}
            </>
        );
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

function ContentModelParagraphDecoratorView(props: { decorator: ContentModelParagraphDecorator }) {
    const { decorator } = props;
    const tagNameDropDown = React.useRef<HTMLSelectElement>(null);
    const [tagName, setTagName] = useProperty(decorator.tagName || '');

    const onTagNameChange = React.useCallback(() => {
        const newValue = tagNameDropDown.current.value;

        decorator.tagName = newValue;
        setTagName(newValue);
    }, [decorator, setTagName]);

    const getContent = React.useCallback(() => {
        return (
            <div>
                Tag name:
                <select value={tagName} ref={tagNameDropDown} onChange={onTagNameChange}>
                    <option value="p">P</option>
                    <option value="h1">H1</option>
                    <option value="h2">H2</option>
                    <option value="h3">H3</option>
                    <option value="h4">H4</option>
                    <option value="h5">H5</option>
                    <option value="h6">H6</option>
                </select>
            </div>
        );
    }, [decorator, tagName]);

    const getFormat = React.useCallback(() => {
        return <SegmentFormatView format={decorator.format} />;
    }, [decorator.format]);

    return (
        <ContentModelView
            title="Decorator"
            subTitle={decorator.tagName}
            className={styles.modelDecorator}
            jsonSource={decorator}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
