import * as React from 'react';
import { ContentModelText } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';

const styles = require('./ContentModelTextView.scss');

export function ContentModelTextView(props: { text: ContentModelText }) {
    const { text } = props;
    const textArea = React.useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = React.useState(text.text);

    const onChange = React.useCallback(() => {
        const value = textArea.current.value;
        text.text = value;
        setValue(value);
    }, [text]);

    const getContent = React.useCallback(() => {
        return (
            <textarea ref={textArea} onChange={onChange}>
                {value}
            </textarea>
        );
    }, [text]);

    return (
        <ContentModelView
            title="Text"
            subTitle={value}
            className={styles.modelText}
            isSelected={text.isSelected}
            jsonSource={text}
            getContent={getContent}
        />
    );
}
