export const theme = {
  spacing: (value: number) => value * 8,
  opacity: {
    sm: 0.75,
  },
  typography: {
    fontSize: {
      base: 14,
      lg: 18,
      "2xl": 26,
    },
  },
  palette: {
    gray: {
      100: "#FFFFFF",
      300: "#CCCCCC",
      400: "#A0A0A0",
      500: "#6B6B6B",
      700: "#2B2B2B",
      800: "#232323",
      900: "#111111",
    },
    green: {
      400: "#6DDA84",
    },
  },
} as const;
