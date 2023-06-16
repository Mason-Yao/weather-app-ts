import React, { useEffect, FC } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectAuthingStatus, getUser } from "../slices/authSlice";

interface componentsProps {
  Component: FC;
}

const AuthComponent: FC<componentsProps> = ({ Component }) => {
  const authingStatus = useAppSelector(selectAuthingStatus);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // avoid infinite render loop
    if (authingStatus && authingStatus === "idle") {
        dispatch(getUser());
        console.log();
    }
    // redirect to login page if user is not logged in
    if (authingStatus && authingStatus === "failed") {
      window.location.href = "/login";
    }
  });

  return <Component />;
};

export default AuthComponent;
