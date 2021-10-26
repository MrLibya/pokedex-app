import { Dimensions, Platform, PixelRatio } from 'react-native';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');
// orientation must fixed
// export const SCREEN_WIDTH = width < height ? width : height;
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const unknownErrorToast = (text) => Toast.show({
    type: 'error',
    text1: 'Error',
    text2: text ?? "Something Went Wrong, Try again"
});

export function fontNormalize(size) {
    const newSize = size * (SCREEN_WIDTH / 320);
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

export const isEmptyString = (str) => {
    let reg = /\S/;
    return !reg.test(str)
};