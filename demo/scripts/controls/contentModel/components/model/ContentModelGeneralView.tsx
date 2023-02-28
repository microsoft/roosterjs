import * as React from 'react';
import { BlockGroupContentView } from './BlockGroupContentView';
import { ContentModelCodeView } from './ContentModelCodeView';
import { ContentModelLinkView } from './ContentModelLinkView';
import { ContentModelView } from '../ContentModelView';
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
    const link = segment?.link;
    const code = segment?.code;
    const getContent = React.useCallback(() => {
        return (
            <>
                {link ? <ContentModelLinkView link={link} /> : null}
                {code ? <ContentModelCodeView code={code} /> : null}
                <BlockGroupContentView group={model} />
            </>
        );
    }, [model, link]);

    const getFormat = React.useCallback(() => {
        return <SegmentFormatView format={model.format} />;
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
