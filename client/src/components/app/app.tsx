import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppReset } from "@/components/app/app.styles";
import Loading from "@/components/loading/loading";
import { useChromecast } from "@/hooks/use-chromecast";

useChromecast.getState().init();

const Login = React.lazy(() => import("@/pages/login/login"));
const Admin = React.lazy(() => import("@/pages/admin/admin"));
const Streams = React.lazy(() => import("@/pages/streams/streams"));
const Stream = React.lazy(() => import("@/pages/stream/stream"));
const NotFound = React.lazy(() => import("@/pages/not-found/not-found"));

export default function App() {
  return (
    <>
      <AppReset />
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/streams" element={<Streams />}>
            <Route path=":uuid" element={<Stream />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </>
  );
}
