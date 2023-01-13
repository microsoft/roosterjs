import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getSelectedImage } from '../../modelApi/selection/collectSelections';
import {
    DomToModelOption,
    IExperimentalContentModelEditor,
} from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * @internal
 * Format Image using content model
 * @param editor The editor instance
 * @param callback the formatting operations
 * @param apiName
 */
export default function formatImageWithContentModel(
    editor: IExperimentalContentModelEditor,
    callback: (image: ContentModelImage) => void,
    apiName: string,
    domToModelOptions?: DomToModelOption
) {
    formatWithContentModel(
        editor,
        apiName,
        model => {
            const image = getSelectedImage(model);
            if (image) {
                callback(image);
            }
            return !!image;
        },
        domToModelOptions
    );
}
