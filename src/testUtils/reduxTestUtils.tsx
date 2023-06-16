import React, { PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { PreloadedState } from "@reduxjs/toolkit";
import { setupStore, AppStore, RootState } from "./reduxTestStore";
import { act } from "react-dom/test-utils";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}
const preloadedState = { auth: { user: { username: "test1" }, status: "idle" } }
export const store = setupStore(preloadedState as PreloadedState<RootState>)
export function renderWithProviders(
  ui: React.ReactElement,
  {
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  const components = render(ui, { wrapper: Wrapper, ...renderOptions });
  const state = store.getState();
  return { ...components };
}
