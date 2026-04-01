import React from 'react'
const USER_IMAGE='https://res.cloudinary.com/dknvsbuyy/image/upload/v1686314044/1617826370281_30f9a2a96a.jpg'
import {HiArrowLeftOnRectangle, HiOutlinePencilSquare, HiOutlineHome  } from "react-icons/hi2";
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image'
import { useRouter } from 'next/router';
export default function Header() {
  const router=useRouter();
    const { data: session } = useSession();
  return (
    <div className='flex justify-between p-5 border-b-[2px]   border-[#FF3366]  bg-blue-50'>
        <img src="./Images/logo.png"width={150} alt='ninja'/>
        <div className='flex gap-4'>
        <button onClick={()=>router.push('/create-post')} className="bg-black text-white py-2 px-4 rounded-full"><span className='hidden sm:block'>CREATE POST</span><HiOutlinePencilSquare className='sm:hidden text-[20px]'/></button>
         {!session?<button className="bg-blue-500 text-white py-2 px-4 rounded-md"  onClick={()=>signIn()}><span className='hidden sm:block'>SIGN IN</span><HiOutlineHome className='sm:hidden text-[20px]' /></button>
                :<button className="bg-blue-500 text-white py-2 px-4 rounded-md"  onClick={()=>signOut()}><span className='hidden sm:block'>SIGN Out</span><HiOutlineHome className='sm:hidden text-[20px]' /></button>
        }
        <Image  src={session?session?.user?.image:USER_IMAGE}   width={40} 
  height={40} 
  // layout="intrinsic" 
  alt="User Profile"  className='rounded-full cursor-pointer' onClick={()=>router.push('/profile')}/>
  
        </div>
    </div>
  )
}

// export default Header
