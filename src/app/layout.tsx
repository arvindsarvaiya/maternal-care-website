import type { Metadata } from 'next';
import { Inter, Poppins, Playfair_Display, Noto_Sans_Devanagari, Yatra_One } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import '@/styles/globals.css';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-inter',
    display: 'swap',
});

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-body',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-display',
    display: 'swap',
});

const hindi = Noto_Sans_Devanagari({
    subsets: ['devanagari'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-hindi',
    display: 'swap',
});

const yatraOne = Yatra_One({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-yatra',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'MaternalCare — भारतीय गर्भावस्था सहायता प्रणाली | Indian Pregnancy Support',
        template: '%s | MaternalCare',
    },
    description:
        'A respectful, coordinated pregnancy care platform for Indian mothers and their support partners. Track your pregnancy week, coordinate care, and get guidance — together. भारतीय मातृत्व देखभाल।',
    keywords: [
        'pregnancy', 'maternal care', 'partner support', 'pregnancy tracker',
        'antenatal care', 'Indian pregnancy', 'गर्भावस्था', 'मातृत्व देखभाल',
        'prenatal care India', 'motherhood support'
    ],
    authors: [{ name: 'MaternalCare India' }],
    robots: { index: true, follow: true },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${poppins.variable} ${playfair.variable} ${hindi.variable} ${yatraOne.variable} font-body antialiased`}>
                <ThemeProvider attribute="class" forcedTheme="light" defaultTheme="light" disableTransitionOnChange>
                    <div className="min-h-screen flex flex-col">
                        {children}
                    </div>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            style: {
                                background: 'hsl(32, 64%, 97%)',
                                border: '1px solid rgba(222, 167, 105, 0.3)',
                                color: 'hsl(285, 60%, 20%)',
                                borderRadius: '0.75rem',
                            },
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}