import * as React from 'react';
import { BorderFormatRenderers } from '../format/formatPart/BorderFormatRenderers';
import { BoxShadowFormatRenderer } from '../format/formatPart/BoxShadowFormatRenderer';
import { ContentModelCodeView } from './ContentModelCodeView';
import { ContentModelImage, ContentModelImageFormat } from 'roosterjs-content-model-types';
import { ContentModelLinkView } from './ContentModelLinkView';
import { ContentModelView } from '../ContentModelView';
import { DisplayFormatRenderer } from '../format/formatPart/DisplayFormatRenderer';
import { FloatFormatRenderer } from '../format/formatPart/FloatFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { IdFormatRenderer } from '../format/formatPart/IdFormatRenderer';
import { ImageMetadataFormatRenderers } from '../format/formatPart/ImageMetadataFormatRenderers';
import { ImageStateFormatRenderer } from '../format/formatPart/ImageStateFormatRenderer';
import { MarginFormatRenderer } from '../format/formatPart/MarginFormatRenderer';
import { MetadataView } from '../format/MetadataView';
import { PaddingFormatRenderer } from '../format/formatPart/PaddingFormatRenderer';
import { SegmentFormatView } from '../format/SegmentFormatView';
import { SizeFormatRenderers } from '../format/formatPart/SizeFormatRenderers';
import { updateImageMetadata } from 'roosterjs-content-model-dom';
import { useProperty } from '../../hooks/useProperty';
import { VerticalAlignFormatRenderer } from '../format/formatPart/VerticalAlignFormatRenderer';

const styles = require('./ContentModelImageView.scss');

const ImageFormatRenderers: FormatRenderer<ContentModelImageFormat>[] = [
    IdFormatRenderer,
    ...SizeFormatRenderers,
    MarginFormatRenderer,
    PaddingFormatRenderer,
    ...BorderFormatRenderers,
    BoxShadowFormatRenderer,
    DisplayFormatRenderer,
    FloatFormatRenderer,
    VerticalAlignFormatRenderer,
    ImageStateFormatRenderer,
];

export function ContentModelImageView(props: { image: ContentModelImage }) {
    const { image } = props;
    const srcTextArea = React.useRef<HTMLTextAreaElement>(null);
    const altInput = React.useRef<HTMLInputElement>(null);
    const titleInput = React.useRef<HTMLInputElement>(null);
    const imageSelectionCheckBox = React.useRef<HTMLInputElement>(null);

    const [src, setSrc] = useProperty(image.src);
    const [alt, setAlt] = useProperty(image.alt || '');
    const [title, setTitle] = useProperty(image.title || '');
    const [imageSelected, setImageSelected] = useProperty(
        image.isSelectedAsImageSelection || false
    );

    const getFormat = React.useCallback(() => {
        return (
            <>
                <SegmentFormatView format={image.format} />
                <FormatView format={image.format} renderers={ImageFormatRenderers} />
            </>
        );
    }, [image.format]);

    const getContent = React.useCallback(() => {
        return (
            <>
                <img src={src} className={styles.image} />
                <textarea value={src} ref={srcTextArea} onChange={onSrcChange} />
                <div>
                    Alt: <input type="text" value={alt} ref={altInput} onChange={onAltChange} />
                </div>
                <div>
                    Title:{' '}
                    <input type="text" value={title} ref={titleInput} onChange={onTitleChange} />
                </div>
                <div>
                    <input
                        type="checkbox"
                        checked={imageSelected}
                        ref={imageSelectionCheckBox}
                        onChange={onImageSelectionChange}
                    />
                    Image selection
                </div>
                {image.link ? <ContentModelLinkView link={image.link} /> : null}{' '}
                {image.code ? <ContentModelCodeView code={image.code} /> : null}
            </>
        );
    }, [src, imageSelected, image.link, alt, title]);

    const getMetadata = React.useCallback(() => {
        return (
            <MetadataView
                model={image}
                renderers={ImageMetadataFormatRenderers}
                updater={updateImageMetadata}
            />
        );
    }, [image]);

    const onSrcChange = React.useCallback(() => {
        const newValue = srcTextArea.current.value;
        image.src = newValue;
        setSrc(newValue);
    }, [src, setSrc]);

    const onAltChange = React.useCallback(() => {
        const newValue = altInput.current.value;
        image.alt = newValue;
        setAlt(newValue);
    }, [alt, setAlt]);

    const onTitleChange = React.useCallback(() => {
        const newValue = titleInput.current.value;
        image.title = newValue;
        setTitle(newValue);
    }, [title, setTitle]);

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
            getMetadata={getMetadata}
        />
    );
}
