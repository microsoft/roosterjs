import { Mutable } from '../common/Mutable';
import type {
    ContentModelSegmentBase,
    ReadonlyContentModelSegmentBase,
} from './ContentModelSegmentBase';

export interface ContentModelTextCommon {
    /**
     * Text content of this segment
     */
    text: string;
}

/**
 * Content Model for Text
 */
export interface ContentModelText
    extends Mutable,
        ContentModelSegmentBase<'Text'>,
        ContentModelTextCommon {}

export interface ReadonlyContentModelText
    extends ReadonlyContentModelSegmentBase<'Text'>,
        Readonly<ContentModelTextCommon> {}
