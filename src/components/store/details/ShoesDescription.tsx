import { theme } from "@/lib/theme";
import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";

export interface ShoesDescriptionProps {
  htmlDescription: string;
}

export function ShoesDescription({ htmlDescription }: ShoesDescriptionProps) {
  const { width } = useWindowDimensions();

  return (
    <RenderHtml
      contentWidth={width}
      source={{ html: htmlDescription }}
      tagsStyles={styles}
    />
  );
}

const styles = StyleSheet.create({
  p: {
    fontSize: theme.typography.fontSize.base,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: theme.palette.gray[100],
  },
  span: {
    fontSize: theme.typography.fontSize.base,
    lineHeight:
      theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    color: theme.palette.gray[100],
  },
  a: {
    color: theme.palette.gray[100],
  },
  img: {
    marginBottom: theme.spacing(1)
  }
});
