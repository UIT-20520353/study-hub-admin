import { ModalProvider } from "./modal-provider";
import type { ReactNode } from "react";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <>
      {children}
      <ModalProvider />
    </>
  );
};
