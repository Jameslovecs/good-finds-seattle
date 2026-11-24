import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'好找 · Good Finds Seattle',description:'Hard-to-find ingredients, found by your neighbors. Explore and share specialty food discoveries around Seattle.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
