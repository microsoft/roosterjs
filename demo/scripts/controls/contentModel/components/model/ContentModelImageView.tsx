import * as React from 'react';
import { ContentModelImage, ContentModelImageFormat } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { IdFormatRenderer } from '../format/formatPart/IdFormatRenderer';
import { ImageMetadataFormatRenderers } from '../format/formatPart/ImageMetadataFormatRenderers';
import { LinkFormatView } from '../format/LinkFormatView';
import { MarginFormatRenderer } from '../format/formatPart/MarginFormatRenderer';
import { PaddingFormatRenderer } from '../format/formatPart/PaddingFormatRenderer';
import { SegmentFormatView } from '../format/SegmentFormatView';
import { SizeFormatRenderers } from '../format/formatPart/SizeFormatRenderers';
import { useProperty } from '../../hooks/useProperty';

const styles = require('./ContentModelImageView.scss');

const ImageFormatRenderers: FormatRenderer<ContentModelImageFormat>[] = [
    IdFormatRenderer,
    ...SizeFormatRenderers,
    ...ImageMetadataFormatRenderers,
    MarginFormatRenderer,
    PaddingFormatRenderer,
];

export function ContentModelImageView(props: { image: ContentModelImage }) {
    const { image } = props;
    const srcTextArea = React.useRef<HTMLTextAreaElement>(null);
    const imageSelectionCheckBox = React.useRef<HTMLInputElement>(null);

    const [src, setSrc] = useProperty(image.src);
    const [imageSelected, setImageSelected] = useProperty(
        image.isSelectedAsImageSelection || false
    );

    const getFormat = React.useCallback(() => {
        return (
            <>
                <SegmentFormatView format={image.format} />
                <FormatView format={image.format} renderers={ImageFormatRenderers} />
                {image.link && <LinkFormatView format={image.link} />}
            </>
        );
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
