import * as React from 'react';
import { ContentModelBlockView } from './ContentModelBlockView';
import { ContentModelListLevelView } from './ContentModelListLevelView';
import { ContentModelView } from '../ContentModelView';
import { DirectionFormatRenderer } from '../format/formatPart/DirectionFormatRenderer';
import { FontFamilyFormatRenderer } from '../format/formatPart/FontFamilyFormatRenderer';
import { FontSizeFormatRenderer } from '../format/formatPart/FontSizeFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { hasSelectionInBlockGroup } from 'roosterjs-content-model-editor';
import { LineHeightFormatRenderer } from '../format/formatPart/LineHeightFormatRenderer';
import { MarginFormatRenderer } from '../format/formatPart/MarginFormatRenderer';
import { TextAlignFormatRenderer } from '../format/formatPart/TextAlignFormatRenderer';
import { TextColorFormatRenderer } from '../format/formatPart/TextColorFormatRenderer';
import {
    ContentModelListItem,
    ContentModelListItemFormat,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

const styles = require('./ContentModelListItemView.scss');

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

export function ContentModelListItemView(props: { listItem: ContentModelListItem }) {
    const { listItem } = props;
    const getContent = React.useCallback(() => {
        return (
            <>
                <div>List Levels</div>
                {listItem.levels.map((level, index) => (
                    <ContentModelListLevelView level={level} key={index} />
                ))}

                <div>List Contents</div>
                {listItem.blocks.map((block, index) => (
                    <ContentModelBlockView block={block} key={index} />
                ))}
            </>
        );
    }, [listItem]);

    const getFormat = React.useCallback(() => {
        return (
            <>
                <div>List item format:</div>
                <FormatView format={listItem.format} renderers={ListItemFormatRenderers} />
                <br />
                <div>List marker format:</div>
                <FormatView
                    format={listItem.formatHolder.format}
                    renderers={ListItemFormatHolderRenderers}
                />
            </>
        );
    }, [listItem.levels]);

    return (
        <ContentModelView
            title="ListItem"
            isExpanded={false}
            className={styles.modelListItem}
            hasSelection={hasSelectionInBlockGroup(listItem)}
            jsonSource={listItem}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
