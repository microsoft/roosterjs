import * as React from 'react';
import { BlockGroupContentView } from './BlockGroupContentView';
import { ContentModelView } from '../ContentModelView';
import {
    ContentModelGeneralBlock,
    ContentModelGeneralSegment,
    ContentModelSegmentType,
    hasSelectionInBlock,
} from 'roosterjs-content-model';

const styles = require('./ContentModelGeneralView.scss');

export function ContentModelGeneralView(props: { model: ContentModelGeneralBlock }) {
    const { model } = props;
    const getContent = React.useCallback(() => {
        return <BlockGroupContentView group={model} />;
    }, [model]);

    return (
        <ContentModelView
            title="General"
            subTitle={model.element?.tagName || 'NULL'}
            className={styles.modelGeneral}
            hasSelection={hasSelectionInBlock(model)}
            isSelected={isGeneralSegment(model) ? model.isSelected : false}
            jsonSource={model}
            getContent={getContent}
        />
    );
}

function isGeneralSegment(block: ContentModelGeneralBlock): block is ContentModelGeneralSegment {
    return (block as ContentModelGeneralSegment).segmentType == ContentModelSegmentType.General;
}
