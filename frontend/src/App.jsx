import { RouterProvider } from 'react-router-dom';
import { CursorDot } from '@/components/common/cursor-dot.jsx';
import { SessionRestore } from '@/components/common/session-restore.jsx';
import { QueryProvider } from '@/providers/query-provider.jsx';
import { router } from '@/routes/router.jsx';

function App() {
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
