import {Dimensions, PixelRatio} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';

const {width, height} = Dimensions.get('window');

export const screenWidth = width;
export const screenHeight = height;

// This is the scaling factor for the screen size.
export const screenScale = width / 375; // Device width in pixels
export const scaleInApp = screenScale * 0.75; // Device width in pixels

export const scaleInAppWidth = (width: number) => width * scaleInApp;
export const scaleInAppHeight = (height: number) => height * scaleInApp;

{/* 
  This is a helper function to normalize the size of the elements in the app.
  It takes a size in pixels and returns a size that is scaled to the screen size.
  The scaling factor is determined based on the screen size and the size of the element.
  The function takes a size in pixels and returns a size that is scaled to the screen size.
*/}
export const normalizeModerately = (size: number, factor = 0.5): number => {
  return PixelRatio.roundToNearestPixel(moderateScale(size, factor));
};

// This function takes a size in pixels and returns a size that is scaled to the screen size.
export const normalizeWidth = (size: number): number => {
  return PixelRatio.roundToNearestPixel(scale(size));
};

// This function takes a size in pixels and returns a size that is scaled to the screen size.
export const normalizeHeight = (size: number): number => {
  return PixelRatio.roundToNearestPixel(verticalScale(size));
};
