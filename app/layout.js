import './globals.css'
import { Inter } from 'next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: [ 'latin' ] })

export const metadata = {
  title: 'Type Fight',
  description: 'Type Fast, Fight Fast',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />

      <body className={inter.className}>{children}</body>
    </html>
  )
}
