import { theme } from "@/lib/theme";
import { format, isThisWeek, isToday, isTomorrow } from "date-fns";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const formatDropsAtDay = (date: Date) => {
  if (isToday(date)) {
    return `Today`;
  }

  if (isTomorrow(date)) {
    return `Tomorrow`;
  }

  if (isThisWeek(date)) {
    return format(date, "eeee");
  }

  return format(date, "dd.MM");
};

export interface ShoesHeaderProps {
  model: string;
  sizeRange: { min: string; max: string } | null;
  modelVariant: string | null;
  dropsAt: Date | null;
  priceAmount: number;
  priceCurrencyCode: string;
}

export function ShoesHeader({
  dropsAt,
  model,
  modelVariant,
  priceAmount,
  priceCurrencyCode,
  sizeRange,
}: ShoesHeaderProps) {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: priceCurrencyCode,
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.model}>{model}</Text>
      {modelVariant && <Text style={styles.modelVariant}>{modelVariant}</Text>}
      <Text style={styles.price}>{currencyFormatter.format(priceAmount)}</Text>
      {dropsAt && (
        <Text style={styles.dropsAt}>
          Available {formatDropsAtDay(dropsAt)} at {format(dropsAt, "h:mm aaa")}
        </Text>
      )}
      {sizeRange && (
        <Text style={styles.sizeRange}>
          {sizeRange.min} - {sizeRange.max}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: theme.spacing(5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  model: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: "500",
    color: theme.palette.gray[100],
    marginBottom: theme.spacing(1.5),
  },
  modelVariant: {
    fontSize: theme.typography.fontSize["2xl"],
    lineHeight:
      theme.typography.fontSize["2xl"] * theme.typography.lineHeight.normal,
    fontWeight: "500",
    color: theme.palette.gray[100],
    marginBottom: theme.spacing(1.5),
  },
  price: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: "500",
    color: theme.palette.gray[100],
    marginBottom: theme.spacing(3.5),
  },
  dropsAt: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
    marginBottom: theme.spacing(1.5),
  },
  sizeRange: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
  },
});
