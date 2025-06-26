import React from 'react'

const Navbar = () => {
    return (
        <>
            <nav className="flex items-center justify-between h-[80px] px-8 py-3 bg-inherit shadow-md text-white font-sans">
                {/* Logo */}
                <div className="flex items-center font-bold text-2xl tracking-wider">
                    <img src="/resources/logo-main.svg" alt="Logo" className="ml-[-7px] w-50 md:w-72 mr-2" />
                </div>
                {/* User Button */}
                <div className='items-center hidden md:flex'>
                    <button className="text-[#000] rounded-md px-5 py-2 mr-4 font-medium">
                        <div className="flex items-center ">
                            <span><img src="./resources/user.svg" alt="user" className='w-7 mr-2' /></span>
                            <span className='text-sm text-white'>Welcome</span>
                        </div>
                    </button>
                </div>
            </nav>
            <div className='w-[90%] h-[1px] bg-white my-2 mx-auto'></div>
        </>
    )
}

export default Navbar