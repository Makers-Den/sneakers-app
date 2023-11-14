import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  [Screen.ShoesList]: undefined;
  [Screen.ShoesDetails]: { shoesId: string };
  [Screen.ShoesSearch]: undefined;
};

export enum Screen {
  ShoesList = "ShoesList",
  ShoesDetails = "ShoesDetails",
  ShoesSearch = "ShoesSearch",
}

export type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  Screen,
  undefined
>;
