import React from "react";
import { Button } from "@/components/ui/button";

const App: React.FunctionComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center w-1/3 p-4 border border-gray-200 rounded-lg shadow">
        <h1 className="text-2xl font-bold">Study Hub Admin</h1>

        <Button variant="outline" className="cursor-pointer">
          Click me
        </Button>
      </div>
    </div>
  );
};

export default App;
