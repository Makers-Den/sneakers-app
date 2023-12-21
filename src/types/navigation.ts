import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum Screen {
  DiscoverScreens = "DiscoverScreens",
  ShoppingScreens = "ShoppingScreens",
  BlogPostScreens = "BlogPostScreens",
}

export type RootTabParamList = {
  [Screen.ShoppingScreens]: undefined;
  [Screen.DiscoverScreens]: undefined;
  [Screen.BlogPostScreens]: { blogPostId: string };
};

export enum ShoppingScreen {
  ShoesList = "ShoesList",
  ShoesDetails = "ShoesDetails",
  ShoesSearch = "ShoesSearch",
}

export type ShoppingStackParamList = {
  [ShoppingScreen.ShoesList]: undefined;
  [ShoppingScreen.ShoesDetails]: { shoesId: string };
  [ShoppingScreen.ShoesSearch]: undefined;
};

export type Navigation = NativeStackNavigationProp<
  ShoppingStackParamList,
  ShoppingScreen,
  undefined
>;
