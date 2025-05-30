'use client'

import React, { useState } from 'react'
import SidebarItem from './sidebar_item/page'

const Sidebar = () => {
    const [activeMenu, setActiveMenu] = useState('home')

    return (
        <div className='h-screen p-6 flex flex-col items-center gap-4 shadow-md justify-between'>
            <div className='flex flex-col items-center'>

                <img src="/img/logo.svg" className='w-16 mb-6' alt="logo" />
                <div className='flex-col'>
                    <SidebarItem
                        name="home"
                        active={activeMenu === 'home'}
                        onClick={() => setActiveMenu('home')}
                        activeSrc="/img/home_white.svg"
                        inactiveSrc="/img/home_pink.svg"
                    />

                    <SidebarItem
                        name="people"
                        active={activeMenu === 'people'}
                        onClick={() => setActiveMenu('people')}
                        activeSrc="/img/people_white.svg"
                        inactiveSrc="/img/people_pink.svg"
                    />

                    <SidebarItem
                        name="graph"
                        active={activeMenu === 'graph'}
                        onClick={() => setActiveMenu('graph')}
                        activeSrc="/img/graph_white.svg"
                        inactiveSrc="/img/graph_pink.svg"
                    />
                </div>
            </div>
            <SidebarItem
                name="graph"
                active={activeMenu === 'graph'}
                onClick={() => setActiveMenu('graph')}
                activeSrc="/img/graph_white.svg"
                inactiveSrc="/img/graph_pink.svg"
            />

        </div>
    )
}

export default Sidebar
