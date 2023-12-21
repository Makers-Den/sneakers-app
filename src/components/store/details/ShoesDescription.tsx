import { HtmlRenderer } from "@/components/ui/HtmlRenderer";
import React from "react";
import { useWindowDimensions } from "react-native";

export interface ShoesDescriptionProps {
  htmlDescription: string;
}

export function ShoesDescription({ htmlDescription }: ShoesDescriptionProps) {
  const { width } = useWindowDimensions();

  return <HtmlRenderer html={htmlDescription} width={width} />;
}
