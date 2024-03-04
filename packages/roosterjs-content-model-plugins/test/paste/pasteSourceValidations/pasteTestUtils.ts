export const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';
export const POWERPOINT_ATTRIBUTE_VALUE = 'PowerPoint.Slide';
export const WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word';

export const getWacElement = (): HTMLElement => {
    const element = document.createElement('span');
    element.classList.add('WACImageContainer');
    return element;
};
