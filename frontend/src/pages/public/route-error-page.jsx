import { ArrowLeft, Home, RefreshCw, ShieldAlert } from 'lucide-react';
import { isRouteErrorResponse, Link, useNavigate, useRouteError } from 'react-router-dom';
import { APP_NAME } from '@/constants/app.constants.js';

const getErrorDetails = (error) => {
  if (isRouteErrorResponse(error)) {
    return {
      title: error.status === 404 ? 'Page Not Found' : 'Something Went Wrong',
      message:
        error.status === 404
          ? 'The page you are looking for does not exist or may have moved.'
          : error.statusText || 'The app could not complete this request.',
      code: String(error.status),
    };
  }

  if (error instanceof Error) {
    return {
      title: 'Something Went Wrong',
      message: 'A page asset or application module could not be loaded.',
      code: '500',
      technicalMessage: error.message,
    };
  }

  return {
    title: 'Something Went Wrong',
    message: 'The app hit an unexpected state while loading this page.',
    code: '500',
  };
};

export function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const details = getErrorDetails(error);

  return (
    <main className="route-error-page premium-shell">
      <section className="route-error-panel" aria-labelledby="route-error-title">
        <div className="route-error-icon">
          <ShieldAlert aria-hidden="true" />
        </div>

        <p className="route-error-kicker">{APP_NAME}</p>
        <h1 id="route-error-title">{details.title}</h1>
        <p className="route-error-message">{details.message}</p>

        {details.technicalMessage ? (
          <p className="route-error-detail">{details.technicalMessage}</p>
        ) : null}

        <div className="route-error-actions">
          <Link to="/" className="route-error-primary">
            <Home aria-hidden="true" />
            Home
          </Link>
          <button type="button" onClick={() => window.location.reload()}>
            <RefreshCw aria-hidden="true" />
            Retry
          </button>
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft aria-hidden="true" />
            Back
          </button>
        </div>

        <span className="route-error-code" aria-hidden="true">
          {details.code}
        </span>
      </section>
    </main>
  );
}
