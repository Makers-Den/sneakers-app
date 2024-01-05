import { PixelRatio } from "react-native";

export function getImageSize({
  height,
  width,
}: {
  height: number;
  width: number;
}) {
  return {
    height: Math.round(PixelRatio.getPixelSizeForLayoutSize(height)),
    width: Math.round(PixelRatio.getPixelSizeForLayoutSize(width)),
  };
}
