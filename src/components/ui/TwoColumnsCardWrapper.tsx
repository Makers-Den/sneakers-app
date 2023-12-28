import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export interface TwoColumnCardWrapperProps {
  isLeftColumn: boolean;
  children: ReactNode;
  padding: number;
}

export function TwoColumnCardWrapper({
  isLeftColumn,
  children,
  padding,
}: TwoColumnCardWrapperProps) {
  return (
    <View
      style={[
        styles.wrapper,
        isLeftColumn
          ? {
              paddingRight: padding,
            }
          : {
              paddingLeft: padding,
            },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
