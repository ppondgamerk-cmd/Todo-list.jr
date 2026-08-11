'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Config } from '../backoffice/signup/config'
import Swal from 'sweetalert2'
import { useRouter, usePathname } from 'next/navigation'

export default function Sidebar() {
  const [name, setName] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const fetchData = async () => {
    try {
      const url = Config.apiUrl + '/members/info'
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': 'Bearer ' + token
      }

      const res = await axios.get(url, { headers })

      if (res.status === 200) {
        setName(res.data.name)
      }
    } catch (err) {
      Swal.fire({
        title: 'error',
        text: (err as Error).message,
        icon: 'error'
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const signOut = async () => {
    const confirmButton = await Swal.fire({
      title: 'Signout',
      text: 'คุณต้องการออกจากระบบใช่ไหม',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b'
    })

    if (confirmButton.isConfirmed) {
      localStorage.removeItem('token')
      router.push('/backoffice/signin')
    }
  }

  const navItems = [
    { href: '/backoffice/home', label: 'หน้าแรก', icon: 'fa-home' },
    { href: '/backoffice/home/dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { href: '/backoffice/home/todo', label: 'บันทึกงาน', icon: 'fa-tasks' },
    { href: '/dashboard/home/report', label: 'รายงานสรุป', icon: 'fa-file-invoice' },
  ]

  return (
    <div className="flex items-center justify-between h-16 px-6 bg-slate-900 border-b border-slate-800/80 shadow-md relative z-50 w-full">
      {/* Left side: Logo/Header */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <i className="fa fa-check-double text-white text-base"></i>
        </div>
        <div className="hidden sm:block">
          <span className="text-base font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Todo Board</span>
          <span className="block text-[9px] text-slate-500 font-semibold tracking-wider uppercase leading-none">Workspace</span>
        </div>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex items-center gap-1.5 mx-4 flex-grow justify-start">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <i className={`fa ${item.icon} text-sm transition-transform group-hover:scale-110 ${
                isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
              }`}></i>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Right side: User Profile & Actions */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* User Info */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 font-bold uppercase text-xs shadow-inner">
            {name ? name.substring(0, 2) : <i className="fa fa-user"></i>}
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-semibold text-slate-200 leading-none">{name || 'User'}</span>
            <span className="block text-[9px] text-slate-500 font-medium mt-0.5">Member</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 border-l border-slate-800 pl-4">
          <button
            onClick={() => router.push('/backoffice/home/profile')}
            title="Settings"
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition-colors cursor-pointer"
          >
            <i className="fa fa-cog text-xs"></i>
          </button>
          <button
            onClick={signOut}
            title="Logout"
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/30 transition-colors cursor-pointer"
          >
            <i className="fa fa-sign-out-alt text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  )
}