export interface BaseScreenProps {
  navigation: Navigation;
}

export interface Navigation {
  navigate: (screen: Screen) => void;
}

export enum Screen {
  ProductList = "ProductList",
  ProductDetails = "ProductDetails",
}
