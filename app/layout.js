// app/layout.js
import './globals.css'; 

export const metadata = {
  title: 'Jargon Buster · Hizaki Labs',
  description: 'AI-powered simplicity',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}