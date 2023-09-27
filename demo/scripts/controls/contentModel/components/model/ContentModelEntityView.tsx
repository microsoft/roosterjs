import * as React from 'react';
import { BlockFormatView } from '../format/BlockFormatView';
import { ContentModelEntity } from 'roosterjs-content-model-types';
import { ContentModelView } from '../ContentModelView';
import { SegmentFormatView } from '../format/SegmentFormatView';
import { useProperty } from '../../hooks/useProperty';

const styles = require('./ContentModelEntityView.scss');

export function ContentModelEntityView(props: { entity: ContentModelEntity }) {
    const { entity } = props;

    const [id, setId] = useProperty(entity.entityFormat.id);
    const [isReadonly, setIsReadonly] = useProperty(entity.entityFormat.isReadonly);
    const [type, setType] = useProperty(entity.entityFormat.type);

    const idTextBox = React.useRef<HTMLInputElement>(null);
    const isReadonlyCheckBox = React.useRef<HTMLInputElement>(null);
    const typeTextBox = React.useRef<HTMLInputElement>(null);

    const onIdChange = React.useCallback(() => {
        const newValue = idTextBox.current.value;
        entity.entityFormat.id = newValue;
        setId(newValue);
    }, [id, setId]);
    const onTypeChange = React.useCallback(() => {
        const newValue = typeTextBox.current.value;
        entity.entityFormat.type = newValue;
        setType(newValue);
    }, [type, setType]);
    const onReadonlyChange = React.useCallback(() => {
        const newValue = isReadonlyCheckBox.current.checked;
        entity.entityFormat.isReadonly = newValue;
        setIsReadonly(newValue);
    }, [id, setId]);

    const getContent = React.useCallback(() => {
        return (
            <>
                <div>
                    Id: <input type="text" value={id} ref={idTextBox} onChange={onIdChange} />
                </div>
                <div>
                    Type:
                    <input type="text" value={type} ref={typeTextBox} onChange={onTypeChange} />
                </div>
                <div>
                    IsReadonly:
                    <input
                        type="checkbox"
                        checked={isReadonly}
                        ref={isReadonlyCheckBox}
                        onChange={onReadonlyChange}
                    />
                </div>
            </>
        );
    }, [type, isReadonly, id]);

    const getFormat = React.useCallback(() => {
        return (
            <>
                <SegmentFormatView format={entity.format} />
                <BlockFormatView format={entity.format} />
            </>
        );
    }, [entity.format]);

    return (
        <ContentModelView
            title="Entity"
            subTitle={id}
            className={styles.modelEntity}
            isSelected={entity.isSelected}
            jsonSource={entity}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
