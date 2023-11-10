export type RootStackParamList = {
  [Screen.SneakersList]: undefined;
  [Screen.SneakersDetails]: { sneakersId: string };
};

export enum Screen {
  SneakersList = "SneakersList",
  SneakersDetails = "SneakersDetails",
}
