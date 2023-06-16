import AuthComponent from "../../components/AuthComponent";
import { waitFor, screen } from "@testing-library/react";
import { renderWithProviders, store } from "../../testUtils/reduxTestUtils";
import { handlers } from "../../mocks/handlers";
import * as authSlice from "../../slices/authSlice";
import * as hooks from "../../hooks";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { act } from "react-dom/test-utils";

jest.setTimeout(200000);

const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("AuthComponent", () => {
  it('should dispatch getUser() when authingStatus is "idle"', async () => {
    renderWithProviders(
      <AuthComponent
        Component={() => (
          <div data-testid="test-element">
            {JSON.stringify(store.getState().auth)}
          </div>
        )}
      />,
      { preloadedState: { auth: { user: { username: "test1" }, status: "idle" } } }
    );
    // Assert getUser() is dispatched
    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId("test-element").textContent as string)).toEqual({
        user: { username: "test user" },
        status: "succeeded",
        error: null,
      });
    });
  });
});
