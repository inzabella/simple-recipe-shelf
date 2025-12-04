import { ReactNode } from 'react';
import { TabNavigation } from './TabNavigation';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="max-w-lg mx-auto">
        {children}
      </main>
      <TabNavigation />
    </div>
  );
}
