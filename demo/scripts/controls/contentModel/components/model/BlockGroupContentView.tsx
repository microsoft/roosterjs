import * as React from 'react';
import { ContentModelBlockGroup } from 'roosterjs-content-model';
import { ContentModelBlockView } from './ContentModelBlockView';

export function BlockGroupContentView(props: { group: ContentModelBlockGroup }) {
    const { group } = props;

    return (
        <>
            {group.blocks.map((block, index) => (
                <ContentModelBlockView block={block} key={index} />
            ))}
        </>
    );
}
