import RegExLinkMatchRule from './RegExLinkMatchRule';
import { LinkMatchRule } from 'roosterjs-editor-types';

// http exclude matching regex
// invalid URL example (in paricular on IE and Edge):
// - http://www.bing.com%00, %00 before ? (question mark) is considered invalid. IE/Edge throws invalid argument exception
// - http://www.bing.com%1, %1 is invalid
// - http://www.bing.com%g, %g is invalid (IE and Edge expects a two hex value after a %)
// - http://www.bing.com%, % as ending is invalid (IE and Edge expects a two hex value after a %)
// All above % cases if they're after ? (question mark) is then considered valid again
// Similar for @, it needs to be after / (forward slash), or ? (question mark). Otherwise IE/Edge will throw security exception
// - http://www.bing.com@nick, @nick before ? (question mark) is considered invalid
// - http://www.bing.com/@nick, is valid sine it is after / (forward slash)
// - http://www.bing.com?@nick, is also valid sinve it is after ? (question mark)
// The regex below is essentially a break down of:
// ^[^?]+%[^0-9a-f]+ => to exclude URL like www.bing.com%%
// ^[^?]+%[0-9a-f][^0-9a-f]+ => to exclude URL like www.bing.com%1
// ^[^?]+%00 => to exclude URL like www.bing.com%00
// ^[^?]+%$ => to exclude URL like www.bing.com%
// ^https?:\/\/[^?\/]+@ => to exclude URL like http://www.bing.com@nick
// ^www\.[^?\/]+@ => to exclude URL like www.bing.com@nick
const httpExcludeRegEx = /^[^?]+%[^0-9a-f]+|^[^?]+%[0-9a-f][^0-9a-f]+|^[^?]+%00|^[^?]+%$|^https?:\/\/[^?\/]+@|^www\.[^?\/]+@/i;

// http matching regex
const httpMatchingRegEx = /^http:\/\/\S+|www\.\S+/i;

// https matching regex
const httpsMatchingRegEx = /^https:\/\/\S+/i;

// http matching regex
const edgeHttpMatchingRegEx = /^microsoft-edge:http:\/\/\S+|www\.\S+/i;

// https matching regex
const edgeHttpsMatchingRegEx = /^microsoft-edge:https:\/\/\S+/i;

// mailto matching regex
const mailtoMatchingRegEx = /^mailto:\S+@\S+\.\S+/i;

// notes matching regex
const notesMatchingRegEx = /^notes:\/\/\S+/i;

// file matching regex
const fileMatchingRegEx = /^file:\/\/\/?\S+/i;

// unc matching regex
const uncMatchingRegEx = /^\\\\\S+/i;

// ftp matching regex
const ftpMatchingRegEx = /^ftp:\/\/\S+|ftp\.\S+/i;

// news matching regex
const newsMatchingRegEx = /^news:(\/\/)?\S+/i;

// telnet matching regEx
const telnetMatchingRegex = /^telnet:\S+/i;

// gopher matching regEx
const gopherMatchingRegEx = /^gopher:\/\/\S+/i;

// wais matching regex
const waisMatchingRegEx = /^wais:\S+/i;

// Default match rules that will be used in matching a link
const defaultLinkMatchRules: LinkMatchRule[] = [
    new RegExLinkMatchRule('http', 'http://', httpMatchingRegEx, httpExcludeRegEx),
    new RegExLinkMatchRule('https', 'https://', httpsMatchingRegEx, httpExcludeRegEx),
    new RegExLinkMatchRule('microsoft-edge:http', 'microsoft-edge:http://', edgeHttpMatchingRegEx),
    new RegExLinkMatchRule('microsoft-edge:https', 'microsoft-edge:https://', edgeHttpsMatchingRegEx),
    new RegExLinkMatchRule('mailto', 'mailto:', mailtoMatchingRegEx),
    new RegExLinkMatchRule('notes', 'notes://', notesMatchingRegEx),
    new RegExLinkMatchRule('file', 'file://', fileMatchingRegEx),
    new RegExLinkMatchRule('unc', '\\\\', uncMatchingRegEx),
    new RegExLinkMatchRule('ftp', 'ftp://', ftpMatchingRegEx),
    new RegExLinkMatchRule('news', 'news://', newsMatchingRegEx),
    new RegExLinkMatchRule('telnet', 'telnet://', telnetMatchingRegex),
    new RegExLinkMatchRule('gopher', 'gopher://', gopherMatchingRegEx),
    new RegExLinkMatchRule('wais', 'wais://', waisMatchingRegEx),
];

export default defaultLinkMatchRules;
