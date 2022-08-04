import * as React from 'react';
import { ContentModelBlockGroup, ContentModelBlockGroupType } from 'roosterjs-content-model';
import { ContentModelDocumentView } from './ContentModelDocumentView';
import { ContentModelGeneralView } from './ContentModelGeneralView';
import { ContentModelTableCellView } from './ContentModelTableCellView';

export function ContentModelBlockGroupView(props: { group: ContentModelBlockGroup }) {
    const { group } = props;

    switch (group.blockGroupType) {
        case ContentModelBlockGroupType.Document:
            return <ContentModelDocumentView doc={group} />;

        case ContentModelBlockGroupType.General:
            return <ContentModelGeneralView model={group} />;

        case ContentModelBlockGroupType.TableCell:
            return <ContentModelTableCellView cell={group} />;
    }
}
