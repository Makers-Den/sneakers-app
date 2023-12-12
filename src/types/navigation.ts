import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export enum Screen {
  DiscoverScreens = 'DiscoverScreens',
  ShoppingScreens = 'ShoppingScreens',
}

export type RootTabParamList = {
  [Screen.ShoppingScreens]: undefined;
  [Screen.DiscoverScreens]: undefined;
};

export enum ShoppingScreen {
  ShoesList = 'ShoesList',
  ShoesDetails = 'ShoesDetails',
  ShoesSearch = 'ShoesSearch',
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
