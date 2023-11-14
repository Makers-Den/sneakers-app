import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { IN_STOCK_SNEAKERS_LIST_ITEM_SEPARATOR_HEIGHT } from "./InStockSneakersListItemSeparator";

const IN_STOCK_SNEAKERS_CARD_WRAPPER_PADDING =
  IN_STOCK_SNEAKERS_LIST_ITEM_SEPARATOR_HEIGHT / 2;

export interface InStockSneakersCardWrapperProps {
  isLeftColumn: boolean;
  children: ReactNode;
}

export function InStockSneakersCardWrapper({
  isLeftColumn,
  children,
}: InStockSneakersCardWrapperProps) {
  return (
    <View
      style={[
        styles.wrapper,
        isLeftColumn
          ? {
              paddingRight: IN_STOCK_SNEAKERS_CARD_WRAPPER_PADDING,
            }
          : {
              paddingLeft: IN_STOCK_SNEAKERS_CARD_WRAPPER_PADDING,
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
