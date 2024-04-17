import * as React from 'react';
import { BlockGroupContentView } from './BlockGroupContentView';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { ContentModelView } from '../ContentModelView';
import { hasSelectionInBlockGroup } from 'roosterjs-content-model-dom';
import { SegmentFormatView } from '../format/SegmentFormatView';
import { useProperty } from '../../hooks/useProperty';

const styles = require('./ContentModelDocumentView.scss');

export function ContentModelDocumentView(props: { doc: ContentModelDocument }) {
    const { doc } = props;
    const [isReverted, setIsReverted] = useProperty(!!doc.hasRevertedRangeSelection);
    const revertedCheckbox = React.useRef<HTMLInputElement>(null);
    const onIsRevertedChange = React.useCallback(() => {
        const newValue = revertedCheckbox.current.checked;
        doc.hasRevertedRangeSelection = newValue;
        setIsReverted(newValue);
    }, [doc, setIsReverted]);

    const getContent = React.useCallback(() => {
        return (
            <>
                <div>
                    <input
                        type="checkbox"
                        checked={isReverted}
                        ref={revertedCheckbox}
                        onChange={onIsRevertedChange}
                    />
                    Reverted range selection
                </div>
                <BlockGroupContentView group={doc} />
            </>
        );
    }, [doc, isReverted]);

    const getFormat = React.useCallback(() => {
        return doc.format ? <SegmentFormatView format={doc.format} /> : null;
    }, [doc.format]);

    return (
        <ContentModelView
            title="Document"
            className={styles.modelDocument}
            hasSelection={hasSelectionInBlockGroup(doc)}
            jsonSource={doc}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
