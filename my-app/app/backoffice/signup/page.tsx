'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { Config } from './config'
import axios from 'axios'
import Topography from '../../Topography'
import Link from 'next/link'

export default function SignUp() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignUp = async () => {
    try {
      if (!name.trim() || !username.trim() || !password.trim()) {
        throw new Error('กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง')
      }

      const url = Config.apiUrl + '/members/signup'
      const payload = {
        name: name,
        username: username,
        password: password
      }

      const res = await axios.post(url, payload)

      if (res.status === 200) {
        Swal.fire({
          title: 'สำเร็จ',
          text: 'สมัครสมาชิกและเข้าสู่ระบบเรียบร้อยแล้ว',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
        localStorage.setItem('token', res.data.token)
        router.push('/backoffice/signin')
      }
    } catch (err: unknown) {
      Swal.fire({
        title: 'error',
        text: (err as Error).message,
        icon: 'error'
      })
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

      {/* SignUp Card */}
      <div className="relative z-10 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-2xl rounded-3xl p-8 max-w-md w-full flex flex-col gap-6 mx-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <i className="fa fa-user-plus text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">สมัครสมาชิก</h1>
            <p className="text-xs text-slate-400 mt-1">สร้างบัญชีผู้ใช้งานใหม่ของคุณเพื่อเข้าสู่ระบบ</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Name (ชื่อ-นามสกุล)</label>
            <div className="relative flex items-center">
              <i className="fa fa-id-card absolute left-4 text-slate-400 text-sm"></i>
              <input 
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 focus:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-white placeholder-slate-500"
                placeholder="ป้อนชื่อ-นามสกุล..."
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Username (ชื่อผู้ใช้)</label>
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
                placeholder="กำหนดรหัสผ่าน..."
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleSignUp} 
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa fa-check"></i>
          ลงทะเบียนตอนนี้
        </button>

        {/* Footer Redirect */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-800/60 pt-4">
          มีบัญชีผู้ใช้งานอยู่แล้ว? {' '}
          <Link href="/backoffice/signin" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
            เข้าสู่ระบบที่นี่
          </Link>
        </div>
      </div>
    </div>
  )
}