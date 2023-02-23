import { DelimiterType } from '../enum';

export default interface Delimiter {
    type: DelimiterType;
    id: string;
    element: Element;
}
