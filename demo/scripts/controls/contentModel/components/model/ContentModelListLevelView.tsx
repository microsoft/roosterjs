import * as React from 'react';
import { ContentModelView } from '../ContentModelView';
import { DirectionFormatRenderer } from '../format/formatPart/DirectionFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { ListMetadataFormatRenderers } from '../format/formatPart/ListMetadataFormatRenderers';
import { ListStylePositionFormatRenderer } from '../format/formatPart/ListStylePositionFormatRenderer';
import { ListThreadFormatRenderers } from '../format/formatPart/ListThreadFormatRenderer';
import { MarginFormatRenderer } from '../format/formatPart/MarginFormatRenderer';
import { MetadataView } from '../format/MetadataView';
import { PaddingFormatRenderer } from '../format/formatPart/PaddingFormatRenderer';
import { TextAlignFormatRenderer } from '../format/formatPart/TextAlignFormatRenderer';
import { updateListMetadata } from 'roosterjs-content-model-editor';
import { useProperty } from '../../hooks/useProperty';
import {
    ContentModelListItemLevelFormat,
    ContentModelListLevel,
} from 'roosterjs-content-model-types';

const styles = require('./ContentModelListLevelView.scss');

const ListLevelFormatRenders: FormatRenderer<ContentModelListItemLevelFormat>[] = [
    ...ListThreadFormatRenderers,
    DirectionFormatRenderer,
    TextAlignFormatRenderer,
    MarginFormatRenderer,
    PaddingFormatRenderer,
    ListStylePositionFormatRenderer,
];

export function ContentModelListLevelView(props: { level: ContentModelListLevel }) {
    const { level } = props;
    const [listType, setListType] = useProperty(level.listType);
    const listTypeInput = React.useRef<HTMLSelectElement>(null);
    const onListTypeChanged = React.useCallback(() => {
        const newValue = listTypeInput.current.value as 'OL' | 'UL';

        level.listType = newValue;
        setListType(newValue);
    }, [setListType, level]);

    const getContent = React.useCallback(() => {
        return (
            <div>
                ListType:{' '}
                <select value={listType} onChange={onListTypeChanged} ref={listTypeInput}>
                    <option value="OL">OL</option>
                    <option value="UL">UL</option>
                </select>
            </div>
        );
    }, [level, listType]);

    const getFormat = React.useCallback(() => {
        return <FormatView format={level.format} renderers={ListLevelFormatRenders} />;
    }, [level, listType]);

    const getMetadata = React.useCallback(() => {
        return (
            <MetadataView
                model={level}
                renderers={ListMetadataFormatRenderers}
                updater={updateListMetadata}
            />
        );
    }, [level]);

    return (
        <ContentModelView
            title="ListLevel"
            subTitle={listType}
            isExpanded={false}
            className={styles.modelListLevel}
            jsonSource={level}
            getContent={getContent}
            getFormat={getFormat}
            getMetadata={getMetadata}
        />
    );
}
