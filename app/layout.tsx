export const metadata = {
  title: 'Video Generator - Bảo hiểm',
  description: 'Generate video with Vietnamese insurance message',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
