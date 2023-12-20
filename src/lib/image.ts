import { PixelRatio } from "react-native";

export function getImageSize({
  height,
  width,
}: {
  height: number;
  width: number;
}) {
  return {
    height: PixelRatio.getPixelSizeForLayoutSize(height),
    width: PixelRatio.getPixelSizeForLayoutSize(width),
  };
}
