import * as React from 'react';
import { BlockFormatView } from '../format/BlockFormatView';
import { ContentModelDivider } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';
import { useProperty } from '../../hooks/useProperty';

const styles = require('./ContentModelDividerView.scss');

export function ContentModelDividerView(props: { divider: ContentModelDivider }) {
    const { divider } = props;
    const [tagName, setTagName] = useProperty(divider.tagName);
    const tagNameDropDown = React.useRef<HTMLSelectElement>(null);
    const onTagNameChange = React.useCallback(() => {
        const newValue = tagNameDropDown.current.value as 'hr' | 'div';
        divider.tagName = newValue;
        setTagName(newValue);
    }, [divider, setTagName]);

    const getContent = React.useCallback(() => {
        return (
            <div>
                TagName:
                <select value={tagName} ref={tagNameDropDown} onChange={onTagNameChange}>
                    <option value="hr">HR</option>
                    <option value="div">DIV</option>
                </select>
            </div>
        );
    }, [tagName]);

    const getFormat = React.useCallback(() => {
        return <BlockFormatView format={divider.format} />;
    }, [divider.format]);

    return (
        <ContentModelView
            title="Divider"
            className={styles.modelDivider}
            isSelected={divider.isSelected}
            jsonSource={divider}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
