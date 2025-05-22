import "@/index.css";
import "@/lib/i18n";
import { AppProvider } from "@/components/common/app-provider";
import { router } from "@/router";
import { store } from "@/store/store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </Provider>
  </StrictMode>
);
