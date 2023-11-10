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
