import * as React from 'react';
import { ContentModelParagraph, hasSelectionInBlock } from 'roosterjs-content-model';
import { ContentModelSegmentView } from './ContentModelSegmentView';
import { ContentModelView } from '../ContentModelView';
import { useProperty } from '../../hooks/useProperty';

const styles = require('./ContentModelParagraphView.scss');

export function ContentModelParagraphView(props: { paragraph: ContentModelParagraph }) {
    const { paragraph } = props;
    const implicitCheckbox = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = useProperty(!!paragraph.isImplicit);

    const onChange = React.useCallback(() => {
        const newValue = implicitCheckbox.current.checked;
        paragraph.isImplicit = newValue;
        setValue(newValue);
    }, [paragraph, setValue]);

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
                {paragraph.segments.map((segment, index) => (
                    <ContentModelSegmentView segment={segment} key={index} />
                ))}
            </>
        );
    }, [paragraph, value]);

    return (
        <ContentModelView
            title="Paragraph"
            subTitle={paragraph.isImplicit ? ' (Implicit)' : ''}
            isExpanded={true}
            className={styles.modelParagraph}
            hasSelection={hasSelectionInBlock(paragraph)}
            jsonSource={paragraph}
            getContent={getContent}
        />
    );
}
