import { isRouteErrorResponse, useRouteError } from "react-router-dom";

// TODO: make it look nicer
export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>page not found!</h1>
        <p>{error.statusText}</p>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <>
        <h1>an error has occurred!</h1>
        <p>{error.message}</p>
      </>
    );
  } else {
    return null;
  }
}
