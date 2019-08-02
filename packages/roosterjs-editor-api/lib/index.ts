export { default as changeFontSize, FONT_SIZES } from './format/changeFontSize';
export {
    default as clearBlockFormat,
    TAGS_TO_UNWRAP,
    TAGS_TO_STOP_UNWRAP,
    ATTRIBUTES_TO_PRESERVE,
} from './format/clearBlockFormat';
export { default as clearFormat } from './format/clearFormat';
export { default as createLink } from './format/createLink';
export {
    default as getFormatState,
    getElementBasedFormatState,
    getStyleBasedFormatState,
} from './format/getFormatState';
export { default as insertImage } from './format/insertImage';
export { default as insertTable } from './table/insertTable';
export { default as editTable } from './table/editTable';
export { default as formatTable } from './table/formatTable';
export { default as removeLink } from './format/removeLink';
export { default as replaceWithNode } from './format/replaceWithNode';
export { default as setAlignment } from './format/setAlignment';
export { default as setBackgroundColor } from './format/setBackgroundColor';
export { default as setTextColor } from './format/setTextColor';
export { default as setDirection } from './format/setDirection';
export { default as setFontName } from './format/setFontName';
export { default as setFontSize } from './format/setFontSize';
export { default as setImageAltText } from './format/setImageAltText';
export { default as setIndentation } from './format/setIndentation';
export { default as toggleBold } from './format/toggleBold';
export { default as toggleBullet } from './format/toggleBullet';
export { default as toggleItalic } from './format/toggleItalic';
export { default as toggleNumbering } from './format/toggleNumbering';
export { default as toggleBlockQuote } from './format/toggleBlockQuote';
export { default as toggleCodeBlock } from './format/toggleCodeBlock';
export { default as toggleStrikethrough } from './format/toggleStrikethrough';
export { default as toggleSubscript } from './format/toggleSubscript';
export { default as toggleSuperscript } from './format/toggleSuperscript';
export { default as toggleUnderline } from './format/toggleUnderline';
export { default as toggleHeader } from './format/toggleHeader';

// @deprecated the function getPendableFormatState will still be available from
// roosterjs-editor-dom package, keep export it here just for compatibility
export { getPendableFormatState } from 'roosterjs-editor-dom';
