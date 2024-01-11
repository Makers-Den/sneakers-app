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
  Story = "Story",
  BlogPostScreen = "BlogPostScreen",
  CategoryScreen = "CategoryScreen",
}

export type RootStackParamList = {
  [RootScreen.Main]: NavigatorScreenParams<MainTabParamList>;
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
