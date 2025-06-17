import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from "../routes";
import { GAZPROM_ROUTE } from "../utils/consts";
import { Context } from "../index";
const AppRouter = () => {
  const { user } = useContext(Context);
  console.log(user);
  return (
    <Routes>
      {authRoutes.map(({ path, Component, authOnly }) => {
        if (authOnly && !user.isAuth) {
          return (
            <Route key={path} path={path} element={<Navigate to={GAZPROM_ROUTE} replace />} />
          );
        }
        return <Route key={path} path={path} element={<Component />} />;
      })}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to={GAZPROM_ROUTE} replace />} />
    </Routes>
  );
};
export default AppRouter;