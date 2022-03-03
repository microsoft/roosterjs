import RibbonButton from '../../plugins/RibbonPlugin/RibbonButton';
import { bold } from './buttons/bold';
import { italic } from './buttons/italic';
import { underline } from './buttons/underline';

/**
 * A shortcut to get all format buttons provided by roosterjs-react
 * @returns An array of all buttons
 */
export default function getAllButtons(): RibbonButton[] {
    return [bold, italic, underline];
}
