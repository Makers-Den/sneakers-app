import { theme } from "@/lib/theme";
import React from "react";
import { StyleSheet } from "react-native";
import RenderHtml from "react-native-render-html";

export interface HtmlRendererProps {
  html: string;
  width: number;
}

export function HtmlRenderer({ html, width }: HtmlRendererProps) {
  return (
    <RenderHtml contentWidth={width} source={{ html }} tagsStyles={styles} />
  );
}

const styles = StyleSheet.create({
  p: {
    fontSize: theme.typography.fontSize.base,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: theme.palette.gray[100],
  },
  h1: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.gray[100],
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  h2: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.gray[100],
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  h3: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.gray[100],
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  h4: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.gray[100],
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  h5: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.gray[100],
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  h6: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.gray[100],
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
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
    marginBottom: theme.spacing(1),
  },
});
