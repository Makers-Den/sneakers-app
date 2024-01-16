import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export enum ShoppingScreen {
  ShoesList = "ShoesList",
}

export type ShoppingStackParamList = {
  [ShoppingScreen.ShoesList]: undefined;
};

export type Navigation = NativeStackNavigationProp<
  ShoppingStackParamList,
  ShoppingScreen,
  undefined
>;

export enum MainScreen {
  DiscoverScreen = "DiscoverScreen",
  ShoppingScreens = "ShoppingScreens",
}

export type MainTabParamList = {
  [MainScreen.ShoppingScreens]: NavigatorScreenParams<ShoppingStackParamList>;
  [MainScreen.DiscoverScreen]: undefined;
};

export enum RootScreen {
  Main = "Main",
  ShoesSearch = "ShoesSearch",
  ShoesDetails = "ShoesDetails",
  Story = "Story",
  BlogPostScreen = "BlogPostScreen",
  CategoryScreen = "CategoryScreen",
}

export type RootStackParamList = {
  [RootScreen.Main]: NavigatorScreenParams<MainTabParamList>;
  [RootScreen.ShoesSearch]: undefined;
  [RootScreen.ShoesDetails]: { shoesId: string };
  [RootScreen.Story]: { id: string };
  [RootScreen.BlogPostScreen]: { blogPostId: string };
  [RootScreen.CategoryScreen]: { categoryId: string };
};

export type RootScreensProps<RouteName extends RootScreen> =
  NativeStackScreenProps<RootStackParamList, RouteName>;

export type MainScreensProps<RouteName extends MainScreen> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, RouteName>,
    RootScreensProps<RootScreen.Main>
  >;

export type ShoppingScreensProps<RouteName extends ShoppingScreen> =
  CompositeScreenProps<
    NativeStackScreenProps<ShoppingStackParamList, RouteName>,
    MainScreensProps<MainScreen.ShoppingScreens>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
