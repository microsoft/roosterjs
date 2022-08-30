import * as React from 'react';
import { ContentModelBlockGroup } from 'roosterjs-content-model';
import { ContentModelDocumentView } from './ContentModelDocumentView';
import { ContentModelGeneralView } from './ContentModelGeneralView';
import { ContentModelTableCellView } from './ContentModelTableCellView';

export function ContentModelBlockGroupView(props: { group: ContentModelBlockGroup }) {
    const { group } = props;

    switch (group.blockGroupType) {
        case 'Document':
            return <ContentModelDocumentView doc={group} />;

        case 'General':
            return <ContentModelGeneralView model={group} />;

        case 'TableCell':
            return <ContentModelTableCellView cell={group} />;
    }
}
