import React from 'react'
import Navbar from '../components/Navbar';

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='min-h-screen bg-background text-foreground'>
            <Navbar />
            <main className=''>{children}</main>
        </div>
    )
}

export default Layout;
