import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Total Users</h3>
          <p className="mt-2 text-2xl">1,234</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Total Courses</h3>
          <p className="mt-2 text-2xl">56</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Active Sessions</h3>
          <p className="mt-2 text-2xl">89</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
