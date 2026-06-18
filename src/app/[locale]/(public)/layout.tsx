import { AuthProvider } from '@/components/auth-provider';
import { LanguagePopup } from '@/components/language-selector';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}
            <LanguagePopup />
        </AuthProvider>
    );
}