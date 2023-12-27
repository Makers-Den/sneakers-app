import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootTabParamList, Screen } from "./types/navigation";
import { createContext } from "react";

const defaultContext = {} as Pick<
  BottomTabScreenProps<RootTabParamList, Screen.ShoppingScreens>,
  "navigation"
>;

export const ShoppingRootNavigationContext = createContext(defaultContext);
