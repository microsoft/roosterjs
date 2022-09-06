import { BrowserInfo } from 'roosterjs-editor-types';

const isAndroidRegex = /android/i;

/**
 * Get current browser information from user agent string
 * @param userAgent The userAgent string of a browser
 * @param appVersion The appVersion string of a browser
 * @param vendor The vendor string of a browser
 * @returns The BrowserInfo object calculated from the given userAgent and appVersion
 */
export function getBrowserInfo(
    userAgent: string,
    appVersion: string,
    vendor?: string
): BrowserInfo {
    // checks whether the browser is running in IE
    // IE11 will use rv in UA instead of MSIE. Unfortunately Firefox also uses this. We should also look for "Trident" to confirm this.
    // There have been cases where companies using older version of IE and custom UserAgents have broken this logic (e.g. IE 10 and KellyServices)
    // therefore we should check that the Trident/rv combo is not just from an older IE browser
    let isIE11OrGreater = userAgent.indexOf('rv:') != -1 && userAgent.indexOf('Trident') != -1;
    let isIE = userAgent.indexOf('MSIE') != -1 || isIE11OrGreater;

    // IE11+ may also have 'Chrome', 'Firefox' and 'Safari' in user agent. But it will have 'trident' as well
    let isChrome = false;
    let isFirefox = false;
    let isSafari = false;
    let isEdge = false;
    let isWebKit = userAgent.indexOf('WebKit') != -1;
    let isMobileOrTablet = false;

    // Reference: http://detectmobilebrowsers.com/
    // The default regex on the website doesn't consider tablet.
    // To support tablet, add |android|ipad|playbook|silk to the first regex according to the info in /about page
    ((userAgentOrVendor: string) => {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                userAgentOrVendor
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                userAgentOrVendor.substr(0, 4)
            )
        ) {
            isMobileOrTablet = true;
        }
    })(userAgent || vendor || '');

    if (!isIE) {
        isChrome = userAgent.indexOf('Chrome') != -1;
        isFirefox = userAgent.indexOf('Firefox') != -1;
        if (userAgent.indexOf('Safari') != -1) {
            // Android and Chrome have Safari in the user string
            isSafari = userAgent.indexOf('Chrome') == -1 && userAgent.indexOf('Android') == -1;
        }

        // Sample Edge UA: Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10121
        isEdge = userAgent.indexOf('Edge') != -1;

        // When it is edge, it should not be chrome or firefox. and it is also not webkit
        if (isEdge) {
            isWebKit = isChrome = isFirefox = false;
        }
    }

    let isMac = appVersion.indexOf('Mac') != -1;
    let isWin = appVersion.indexOf('Win') != -1 || appVersion.indexOf('NT') != -1;
    let isAndroid = isAndroidRegex.test(userAgent);

    return {
        isMac,
        isWin,
        isWebKit,
        isIE,
        isIE11OrGreater,
        isSafari,
        isChrome,
        isFirefox,
        isEdge,
        isIEOrEdge: isIE || isEdge,
        isAndroid,
        isMobileOrTablet,
    };
}

/**
 * Browser object contains browser and operating system information of current environment
 */
export const Browser =
    typeof window !== 'undefined' && window
        ? getBrowserInfo(
              window.navigator.userAgent,
              window.navigator.appVersion,
              window.navigator.vendor
          )
        : {};
