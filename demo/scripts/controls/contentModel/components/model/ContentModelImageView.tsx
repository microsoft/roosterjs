import * as React from 'react';
import { ContentModelImage } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';
import { SegmentFormatView } from '../format/SegmentFormatView';
import { useProperty } from '../../hooks/useProperty';

const styles = require('./ContentModelImageView.scss');

export function ContentModelImageView(props: { image: ContentModelImage }) {
    const { image } = props;
    const srcTextArea = React.useRef<HTMLTextAreaElement>(null);
    const imageSelectionCheckBox = React.useRef<HTMLInputElement>(null);

    const [src, setSrc] = useProperty(image.src);
    const [imageSelected, setImageSelected] = useProperty(
        image.isSelectedAsImageSelection || false
    );

    const getFormat = React.useCallback(() => {
        return <SegmentFormatView format={image.format} />;
    }, [image.format]);

    const getContent = React.useCallback(() => {
        return (
            <>
                <img src={src} className={styles.image} />
                <textarea value={src} ref={srcTextArea} onChange={onSrcChange} />
                <div>
                    <input
                        type="checkbox"
                        checked={imageSelected}
                        ref={imageSelectionCheckBox}
                        onChange={onImageSelectionChange}
                    />
                    Image selection
                </div>
            </>
        );
    }, [src, imageSelected]);

    const onSrcChange = React.useCallback(() => {
        const newValue = srcTextArea.current.value;
        image.src = newValue;
        setSrc(newValue);
    }, [src, setSrc]);

    const onImageSelectionChange = React.useCallback(() => {
        const newValue = imageSelectionCheckBox.current.checked;
        image.isSelectedAsImageSelection = newValue;
        setImageSelected(newValue);
    }, [imageSelected, setImageSelected]);

    return (
        <ContentModelView
            title="Image"
            subTitle={imageSelected ? '[ImageSelection]' : ''}
            className={styles.modelImage}
            isSelected={image.isSelected}
            jsonSource={image}
            getFormat={getFormat}
            getContent={getContent}
        />
    );
}
