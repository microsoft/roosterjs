import * as React from 'react';
import { BlockGroupContentView } from './BlockGroupContentView';
import { ContentModelView } from '../ContentModelView';
import { LinkFormatView } from '../format/LinkFormatView';
import { SegmentFormatView } from '../format/SegmentFormatView';
import {
    ContentModelGeneralBlock,
    ContentModelGeneralSegment,
    hasSelectionInBlock,
} from 'roosterjs-content-model';

const styles = require('./ContentModelGeneralView.scss');

export function ContentModelGeneralView(props: { model: ContentModelGeneralBlock }) {
    const { model } = props;
    const segment = isGeneralSegment(model) ? model : undefined;
    const getContent = React.useCallback(() => {
        return <BlockGroupContentView group={model} />;
    }, [model]);

    const getFormat = React.useCallback(() => {
        return (
            <>
                <SegmentFormatView format={model.format} />
                {segment?.link && <LinkFormatView format={segment.link} />}
            </>
        );
    }, [segment?.format]);

    return (
        <ContentModelView
            title="General"
            subTitle={model.element?.tagName || 'NULL'}
            className={styles.modelGeneral}
            hasSelection={hasSelectionInBlock(model)}
            isSelected={isGeneralSegment(model) ? model.isSelected : false}
            jsonSource={model}
            getContent={getContent}
            getFormat={segment ? getFormat : undefined}
        />
    );
}

function isGeneralSegment(block: ContentModelGeneralBlock): block is ContentModelGeneralSegment {
    return (block as ContentModelGeneralSegment).segmentType == 'General';
}
