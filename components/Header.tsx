"use client"

import { useRouter } from 'next/navigation'
import { BsArrowLeft } from 'react-icons/bs'

const Header = ({title, subtitle, showBackButton = true}:{title:string, subtitle:string, showBackButton?: boolean}) => {
const router = useRouter();
  return (
    <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.push("/")}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {showBackButton && <BsArrowLeft />} {showBackButton && "Dashboard"}
              </button>
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>
  )
}

export default Header
