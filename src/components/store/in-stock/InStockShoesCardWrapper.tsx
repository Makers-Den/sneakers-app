import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { IN_STOCK_SHOES_LIST_ITEM_SEPARATOR_HEIGHT } from "./InStockShoesListItemSeparator";

const IN_STOCK_SHOES_CARD_WRAPPER_PADDING =
  IN_STOCK_SHOES_LIST_ITEM_SEPARATOR_HEIGHT / 2;

export interface InStockShoesCardWrapperProps {
  isLeftColumn: boolean;
  children: ReactNode;
}

export function InStockShoesCardWrapper({
  isLeftColumn,
  children,
}: InStockShoesCardWrapperProps) {
  return (
    <View
      style={[
        styles.wrapper,
        isLeftColumn
          ? {
              paddingRight: IN_STOCK_SHOES_CARD_WRAPPER_PADDING,
            }
          : {
              paddingLeft: IN_STOCK_SHOES_CARD_WRAPPER_PADDING,
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
