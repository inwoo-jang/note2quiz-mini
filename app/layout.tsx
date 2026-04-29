import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Note2Quiz mini · 강의노트가 퀴즈가 되는 순간',
  description: 'PDF나 텍스트를 업로드하면 AI가 객관식 또는 O/X 퀴즈를 만들어줍니다.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
