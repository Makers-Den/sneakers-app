import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  [Screen.SneakersList]: undefined;
  [Screen.SneakersDetails]: { sneakersId: string };
  [Screen.SneakersSearch]: undefined;
};

export enum Screen {
  SneakersList = "SneakersList",
  SneakersDetails = "SneakersDetails",
  SneakersSearch = "SneakersSearch",
}

export type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  Screen,
  undefined
>;
