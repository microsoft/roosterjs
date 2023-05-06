import * as React from 'react';
import { BackgroundColorFormatRenderer } from '../format/formatPart/BackgroundColorFormatRenderer';
import { BorderFormatRenderers } from '../format/formatPart/BorderFormatRenderers';
import { ContentModelDivider, ContentModelDividerFormat } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';
import { DirectionFormatRenderer } from '../format/formatPart/DirectionFormatRenderer';
import { DisplayFormatRenderer } from '../format/formatPart/DisplayFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { LineHeightFormatRenderer } from '../format/formatPart/LineHeightFormatRenderer';
import { MarginFormatRenderer } from '../format/formatPart/MarginFormatRenderer';
import { PaddingFormatRenderer } from '../format/formatPart/PaddingFormatRenderer';
import { SizeFormatRenderers } from '../format/formatPart/SizeFormatRenderers';
import { useProperty } from '../../hooks/useProperty';
import { WhiteSpaceFormatRenderer } from '../format/formatPart/WhiteSpaceFormatRenderer';

const styles = require('./ContentModelDividerView.scss');
const DividerFormatRenders: FormatRenderer<ContentModelDividerFormat>[] = [
    BackgroundColorFormatRenderer,
    DirectionFormatRenderer,
    MarginFormatRenderer,
    PaddingFormatRenderer,
    LineHeightFormatRenderer,
    WhiteSpaceFormatRenderer,
    ...BorderFormatRenderers,
    DisplayFormatRenderer,
    ...SizeFormatRenderers,
];

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
        return <FormatView format={divider.format} renderers={DividerFormatRenders} />;
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
