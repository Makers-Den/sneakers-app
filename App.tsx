import { QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Navigation } from "./src/Navigation";
import { queryClient } from "./src/lib/query";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
