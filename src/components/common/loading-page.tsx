import React from "react";
import { SpinLoading } from "./spin-loading";

export const LoadingPage: React.FunctionComponent = () => (
  <div className="flex items-center justify-center w-full min-h-screen">
    <SpinLoading color="blue" size="xl" />
  </div>
);
