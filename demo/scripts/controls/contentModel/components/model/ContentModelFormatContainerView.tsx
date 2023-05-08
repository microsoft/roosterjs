import * as React from 'react';
import { BlockFormatView } from '../format/BlockFormatView';
import { BlockGroupContentView } from './BlockGroupContentView';
import { ContentModelFormatContainer, hasSelectionInBlock } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';
import { SegmentFormatView } from '../format/SegmentFormatView';

const styles = require('./ContentModelFormatContainerView.scss');

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
