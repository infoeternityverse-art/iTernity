import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { CursorDot } from '@/components/common/cursor-dot.jsx';
import { SessionRestore } from '@/components/common/session-restore.jsx';
import { SparkLoader } from '@/components/common/spark-loader.jsx';
import { QueryProvider } from '@/providers/query-provider.jsx';
import { router } from '@/routes/router.jsx';

function App() {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsBooting(false), 950);
    return () => window.clearTimeout(timeout);
  }, []);

  if (isBooting) {
    return <SparkLoader />;
  }

  return (
    <QueryProvider>
      <SessionRestore>
        <CursorDot />
        <RouterProvider router={router} />
      </SessionRestore>
    </QueryProvider>
  );
}

export default App;
