import { AuthProvider } from '@/components/auth-provider';
import { NotificationProvider } from '@/components/notification-provider';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <NotificationProvider>
                {children}
            </NotificationProvider>
        </AuthProvider>
    );
}