import { theme } from "@/lib/theme";
import { FlashList } from "@shopify/flash-list";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export type Product = {
  id: string;
  title: string;
  subTitle: string;
  previewImage: string | null;
};

export type ProductCardProps = Omit<Product, "id"> & {
  onPress: () => void;
};

const productCardDimensions = {
  width: 200,
  height: 200,
  image: {
    width: 200,
    height: 200,
  },
};

function ProductCard({
  title,
  previewImage,
  onPress,
  subTitle,
}: ProductCardProps) {
  return (
    <Pressable style={styles.cardWrapper} onPress={onPress}>
      <View style={styles.cardImageWrapper}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.cardSubTitle}
        >
          {subTitle}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardTitle}>
          {title}
        </Text>
        {previewImage && (
          <Image style={styles.cardImage} source={{ uri: previewImage }} />
        )}
      </View>
    </Pressable>
  );
}

function calculateListWidth(listItemCount: number) {
  return (
    productCardDimensions.width * listItemCount +
    Math.max(0, listItemCount - 1) * theme.spacing(2)
  );
}

export type OnProductPress<T extends Product> = (Product: T) => void;

export type ProductHorizontalListProps<T extends Product> = {
  products: T[];
  onProductPress: OnProductPress<T>;
};

export function ProductsHorizontalList<Prod extends Product>({
  products,
  onProductPress,
}: ProductHorizontalListProps<Prod>) {
  return (
    <FlashList
      horizontal
      data={products}
      showsHorizontalScrollIndicator={false}
      estimatedItemSize={productCardDimensions.width}
      estimatedListSize={{
        width: calculateListWidth(products.length),
        height: productCardDimensions.height,
      }}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <ProductCard
          key={item.id}
          {...item}
          onPress={() => onProductPress(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    height: productCardDimensions.height,
    width: productCardDimensions.width,
    marginHorizontal: theme.spacing(2),
  },
  cardImageWrapper: {
    height: productCardDimensions.image.height,
    width: productCardDimensions.image.width,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    top: theme.spacing(3),
    left: 0,
  },
  cardTitle: {
    marginTop: theme.spacing(0.5),
    fontSize: theme.typography.fontSize.lg,
    color: theme.palette.gray[100],
  },
  cardSubTitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
  },
});
