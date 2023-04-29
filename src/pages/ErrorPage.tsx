import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>Page not found!</h1>
        <p>{error.statusText}</p>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <>
        <h1>An err0r has occurred!</h1>
        <p>{error.message}</p>
      </>
    );
  } else {
    return null;
  }
}
