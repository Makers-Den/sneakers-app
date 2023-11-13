import { QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Navigation } from "@/Navigation";
import { queryClient } from "@/lib/query";
import { StatusBar } from "expo-status-bar";
import { theme } from "@/lib/theme";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>

      <StatusBar style="light" backgroundColor={theme.palette.gray[800]} />
    </QueryClientProvider>
  );
}
