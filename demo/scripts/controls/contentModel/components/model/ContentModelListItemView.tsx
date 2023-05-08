import * as React from 'react';
import { ContentModelBlockView } from './ContentModelBlockView';
import { ContentModelView } from '../ContentModelView';
import { DirectionFormatRenderer } from '../format/formatPart/DirectionFormatRenderer';
import { FontFamilyFormatRenderer } from '../format/formatPart/FontFamilyFormatRenderer';
import { FontSizeFormatRenderer } from '../format/formatPart/FontSizeFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { LineHeightFormatRenderer } from '../format/formatPart/LineHeightFormatRenderer';
import { ListMetadataFormatRenderers } from '../format/formatPart/ListMetadataFormatRenderers';
import { ListStylePositionFormatRenderer } from '../format/formatPart/ListStylePositionFormatRenderer';
import { ListThreadFormatRenderers } from '../format/formatPart/ListThreadFormatRenderer';
import { ListTypeFormatRenderer } from '../format/formatPart/ListTypeFormatRenderer';
import { MarginFormatRenderer } from '../format/formatPart/MarginFormatRenderer';
import { PaddingFormatRenderer } from '../format/formatPart/PaddingFormatRenderer';
import { TextAlignFormatRenderer } from '../format/formatPart/TextAlignFormatRenderer';
import { TextColorFormatRenderer } from '../format/formatPart/TextColorFormatRenderer';
import { useProperty } from '../../hooks/useProperty';
import {
    ContentModelListItem,
    ContentModelListItemFormat,
    ContentModelListItemLevelFormat,
    ContentModelSegmentFormat,
    hasSelectionInBlockGroup,
} from 'roosterjs-content-model';

const styles = require('./ContentModelListItemView.scss');

const ListLevelFormatRenders: FormatRenderer<ContentModelListItemLevelFormat>[] = [
    ListTypeFormatRenderer,
    ...ListThreadFormatRenderers,
    ...ListMetadataFormatRenderers,
    DirectionFormatRenderer,
    TextAlignFormatRenderer,
    MarginFormatRenderer,
    PaddingFormatRenderer,
    ListStylePositionFormatRenderer,
];
const ListItemFormatRenderers: FormatRenderer<ContentModelListItemFormat>[] = [
    DirectionFormatRenderer,
    TextAlignFormatRenderer,
    LineHeightFormatRenderer,
    MarginFormatRenderer,
];
const ListItemFormatHolderRenderers: FormatRenderer<ContentModelSegmentFormat>[] = [
    TextColorFormatRenderer,
    FontSizeFormatRenderer,
    FontFamilyFormatRenderer,
];

function getSubTitle(listItem: ContentModelListItem) {
    return listItem.levels.map(level => level.listType || 'UL').join('/');
}

export function ContentModelListItemView(props: { listItem: ContentModelListItem }) {
    const { listItem } = props;
    const [subTitle, setSubTitle] = useProperty(getSubTitle(listItem));
    const onFormatChanged = React.useCallback(() => {
        setSubTitle(getSubTitle(listItem));
    }, [setSubTitle, listItem]);

    const getContent = React.useCallback(() => {
        return (
            <>
                {listItem.blocks.map((block, index) => (
                    <ContentModelBlockView block={block} key={index} />
                ))}
            </>
        );
    }, [listItem]);

    const getFormat = React.useCallback(() => {
        return (
            <>
                <div>List levels:</div>
                {listItem.levels.map((level, index) => (
                    <FormatView
                        format={level}
                        renderers={ListLevelFormatRenders}
                        onUpdate={onFormatChanged}
                        key={index}
                    />
                ))}
                <hr className={styles.hr} />

                <div>List item format:</div>
                <FormatView format={listItem.format} renderers={ListItemFormatRenderers} />

                <div>List marker format:</div>
                <FormatView
                    format={listItem.formatHolder.format}
                    renderers={ListItemFormatHolderRenderers}
                />
            </>
        );
    }, [listItem.levels, subTitle]);

    return (
        <ContentModelView
            title="ListItem"
            subTitle={subTitle}
            isExpanded={false}
            className={styles.modelListItem}
            hasSelection={hasSelectionInBlockGroup(listItem)}
            jsonSource={listItem}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
