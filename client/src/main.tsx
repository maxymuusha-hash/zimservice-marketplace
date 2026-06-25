import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { trpc, createTrpcClient } from "./lib/trpc";

const queryClient = new QueryClient();
const trpcClient = createTrpcClient();

// Keep Render free tier warm by pinging every 10 minutes
const BACKEND_URL = import.meta.env.VITE_SERVER_URL;
if (BACKEND_URL) {
  setInterval(() => {
    fetch(`${BACKEND_URL}/trpc/system.health?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%7D%7D`)
      .catch(() => {});
  }, 10 * 60 * 1000);
}

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
