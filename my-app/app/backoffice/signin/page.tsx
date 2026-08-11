'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { Config } from '../signup/config'
import axios from 'axios'
import Topography from '../../Topography'
import Link from 'next/link'

export default function SignIn() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      if (!username.trim() || !password.trim()) throw new Error('กรุณากรอก Username และ Password ให้ครบถ้วน')
      
      const payload = {
        username: username,
        password: password
      }
      const url = Config.apiUrl + '/members/signin'
      const res = await axios.post(url, payload)

      if (res.status === 200) {
        localStorage.setItem('token', res.data.token)
        router.push('/backoffice/home/dashboard') // Redirect straight to the dashboard
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          Swal.fire({
            title: 'Sign In Failed',
            text: 'Username หรือ Password ไม่ถูกต้อง',
            icon: 'warning',
            confirmButtonColor: '#ef4444'
          })
        } else {
          Swal.fire({
            title: 'error',
            text: err.response?.data?.message || err.message,
            icon: 'error'
          })
        }
      } else {
        Swal.fire({
          title: 'error',
          text: (err as Error).message,
          icon: 'error'
        })
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Topography Background */}
      <div className="absolute inset-0 z-0">
        <Topography
          lowColor="#cc68dc"
          midColor="#b689b5"
          highColor="#fffefeff"
          speed={0.35}
          morphAmount={3}
          morphSpeed={0.05}
          bands={2}
          thickness={0.01}
          scale={2}
          pixelSize={1}
          glow={0.5}
          colorMode="elevation"
          contrast={3}
          brightness={1}
          fillBands={false}
          opacity={1}
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseRadius={0.3}
          mouseStrength={0.4}
        />
      </div>

      {/* SignIn Card */}
      <div className="relative z-10 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-2xl rounded-3xl p-8 max-w-md w-full flex flex-col gap-6 mx-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <i className="fa fa-check-double text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">เข้าสู่ระบบ</h1>
            <p className="text-xs text-slate-400 mt-1">กรอกข้อมูลบัญชีเพื่อเข้าจัดการงานของคุณ</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Username (ชื่อผู้ใช้งาน)</label>
            <div className="relative flex items-center">
              <i className="fa fa-user absolute left-4 text-slate-400 text-sm"></i>
              <input 
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 focus:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-white placeholder-slate-500"
                placeholder="ป้อนชื่อผู้ใช้งาน..."
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Password (รหัสผ่าน)</label>
            <div className="relative flex items-center">
              <i className="fa fa-lock absolute left-4 text-slate-400 text-sm"></i>
              <input 
                type="password" 
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 focus:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-white placeholder-slate-500"
                placeholder="ป้อนรหัสผ่าน..."
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleSignIn} 
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa fa-sign-in-alt"></i>
          เข้าสู่ระบบเดี๋ยวนี้
        </button>

        {/* Footer Redirect */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-800/60 pt-4">
          ยังไม่มีบัญชีผู้ใช้งาน? {' '}
          <Link href="/backoffice/signup" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
            สมัครสมาชิกที่นี่
          </Link>
        </div>
      </div>
    </div>
  )
}