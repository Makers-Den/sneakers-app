import { QueryClientProvider } from "react-query";
import { Navigation } from "./src/Navigation";
import { queryClient } from "./src/lib/query";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
}
