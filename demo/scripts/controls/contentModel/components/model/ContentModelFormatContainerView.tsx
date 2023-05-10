import * as React from 'react';
import { BlockFormatView } from '../format/BlockFormatView';
import { BlockGroupContentView } from './BlockGroupContentView';
import { ContentModelView } from '../ContentModelView';
import { DisplayFormatRenderer } from '../format/formatPart/DisplayFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { SegmentFormatView } from '../format/SegmentFormatView';
import { SizeFormatRenderers } from '../format/formatPart/SizeFormatRenderers';
import {
    ContentModelFormatContainer,
    ContentModelFormatContainerFormat,
    hasSelectionInBlock,
} from 'roosterjs-content-model';

const styles = require('./ContentModelFormatContainerView.scss');

const FormatContainerFormatRenderers: FormatRenderer<ContentModelFormatContainerFormat>[] = [
    ...SizeFormatRenderers,
    DisplayFormatRenderer,
];

export function ContentModelFormatContainerView(props: { container: ContentModelFormatContainer }) {
    const { container } = props;
    const getContent = React.useCallback(() => {
        return <BlockGroupContentView group={container} />;
    }, [container]);

    const getFormat = React.useCallback(() => {
        return (
            <>
                <BlockFormatView format={container.format} />
                <SegmentFormatView format={container.format} />
                <FormatView format={container.format} renderers={FormatContainerFormatRenderers} />
            </>
        );
    }, [container]);

    return (
        <ContentModelView
            title="FormatContainer"
            subTitle={container.tagName}
            className={styles.modelFormatContainer}
            hasSelection={hasSelectionInBlock(container)}
            jsonSource={container}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
