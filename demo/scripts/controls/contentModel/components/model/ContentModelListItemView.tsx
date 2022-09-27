import * as React from 'react';
import { ContentModelBlockView } from './ContentModelBlockView';
import { ContentModelView } from '../ContentModelView';
import { FontFamilyFormatRenderer } from '../format/formatPart/FontFamilyFormatRenderer';
import { FontSizeFormatRenderer } from '../format/formatPart/FontSizeFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { ListMetadataFormatRenderers } from '../format/formatPart/ListMetadataFormatRenderers';
import { ListThreadFormatRenderers } from '../format/formatPart/ListThreadFormatRenderer';
import { ListTypeFormatRenderer } from '../format/formatPart/ListTypeFormatRenderer';
import { TextColorFormatRenderer } from '../format/formatPart/TextColorFormatRenderer';
import { useProperty } from '../../hooks/useProperty';
import {
    ContentModelListItem,
    ContentModelListItemLevelFormat,
    ContentModelSegmentFormat,
    hasSelectionInBlockGroup,
} from 'roosterjs-content-model';

const styles = require('./ContentModelListItemView.scss');

const ListLevelFormatRenders: FormatRenderer<ContentModelListItemLevelFormat>[] = [
    ListTypeFormatRenderer,
    ...ListThreadFormatRenderers,
    ...ListMetadataFormatRenderers,
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
