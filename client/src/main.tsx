import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { trpc, createTrpcClient } from "./lib/trpc";

const queryClient = new QueryClient();

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;
if (BACKEND_URL) {
  setInterval(() => {
    fetch(`${BACKEND_URL}/trpc/system.health?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%7D%7D`)
      .catch(() => {});
  }, 10 * 60 * 1000);
}

function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [trpcClient] = React.useState(() => createTrpcClient());
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TrpcProvider>
      <App />
    </TrpcProvider>
  </QueryClientProvider>
);
