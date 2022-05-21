import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppReset } from "@/components/app/app.styles";

const Login = React.lazy(() => import("@/pages/login/login"));
const NotFound = React.lazy(() => import("@/pages/not-found/not-found"));

export default function App() {
  return (
    <React.Suspense fallback="Loading...">
      <AppReset />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
}
