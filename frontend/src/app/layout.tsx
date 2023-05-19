import './globals.css'

export const metadata = {
  title: 'Tx Fusion Swap',
  description: 'Tx Fusion Swap',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html>
        <body>
          {children}
        </body>
      </html>
  )
}
