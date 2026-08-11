'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Config } from '../../signup/config'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import Topography from '../../../Topography'

export default function Profile() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

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
        setUsername(res.data.username)
      }
    } catch (err) {
      Swal.fire({
        title: 'error',
        text: (err as Error).message,
        icon: 'error'
      })
    }
  }

  const handleSave = async () => {
    try {
      if (password !== confirmPassword) throw new Error('โปรดป้อนยืนยันรหัสผ่านให้ตรงกัน')

      const payload = {
        name: name,
        username: username,
        password: password
      }

      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': 'Bearer ' + token
      }
      const url = Config.apiUrl + '/members/update'
      await axios.put(url, payload, { headers })

      Swal.fire({
        title: 'สำเร็จ',
        text: 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (err) {
      Swal.fire({
        title: 'error',
        text: (err as Error).message,
        icon: 'error'
      })
    }
  }

  return (
    <div className="flex-grow h-screen relative overflow-hidden bg-slate-950 text-slate-100">
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

      {/* Content Layer */}
      <div className="relative z-10 p-8 h-full overflow-y-auto flex flex-col items-center justify-start">
        <div className="w-full max-w-lg mt-8 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-slate-800/60 pb-4">
            <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/25">
              <i className="fa fa-user-cog text-base"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">แก้ไขข้อมูลส่วนตัว</h1>
              <span className="block text-xs text-slate-400">อัปเดตข้อมูลบัญชีผู้ใช้และรหัสผ่านของคุณ</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">ชื่อ</label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 focus:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-white placeholder-slate-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Username (ชื่อผู้ใช้)</label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 focus:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-white placeholder-slate-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">รหัสผ่านใหม่</label>
              <input
                type="password"
                placeholder="กรอกรหัสผ่านใหม่เพื่อเปลี่ยน..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 focus:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-white placeholder-slate-500"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                placeholder="ป้อนรหัสผ่านใหม่อีกครั้ง..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 focus:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-white placeholder-slate-500"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="block text-[10px] text-slate-500 mt-1 italic">* หากไม่ต้องการเปลี่ยนรหัสผ่าน ให้เว้นว่างช่องนี้ไว้</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-600/10 hover:shadow-purple-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="fa fa-save"></i>
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  )
}