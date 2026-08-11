'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Config } from '../signup/config'
import Swal from 'sweetalert2'
import Topography from '../../Topography'
import Link from 'next/link'

export default function Home() {
  const [name, setName] = useState('')
  const [countWait, setCountWait] = useState(0)
  const [countDoing, setCountDoing] = useState(0)
  const [countSuccess, setCountSuccess] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': 'Bearer ' + token
      }
      
      // Fetch Member info
      const memberUrl = Config.apiUrl + '/members/info'
      const memberRes = await axios.get(memberUrl, { headers })
      if (memberRes.status === 200) {
        setName(memberRes.data.name)
      }

      // Fetch Dashboard counters
      const dashUrl = Config.apiUrl + '/todo/dashboard'
      const dashRes = await axios.get(dashUrl, { headers })
      if (dashRes.status === 200) {
        setCountWait(dashRes.data.countWait)
        setCountDoing(dashRes.data.countDoing)
        setCountSuccess(dashRes.data.countSuccess)
      }
    } catch (err) {
      // Don't show modal if token is not active yet (prevents annoying popup on first load)
      console.error(err)
    }
  }

  const totalTasks = countWait + countDoing + countSuccess

  return (
    <div className="flex-grow h-screen relative overflow-hidden bg-slate-955 text-slate-100">
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
      <div className="relative z-10 p-8 h-full overflow-y-auto">
        <div className="max-w-5xl mx-auto flex flex-col gap-8 w-full py-6">
          
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-md rounded-3xl p-10 text-slate-100 shadow-2xl border border-slate-800 flex flex-col gap-4 transition-all hover:border-purple-500/30 hover:shadow-purple-500/10 hover:scale-[1.005] duration-300 w-full text-center md:text-left">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-300">
                ระบบจัดการงานส่วนตัว
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                สวัสดี, คุณ {name || 'User'}! 🚀
              </h1>
              <p className="text-slate-350 text-sm md:text-base max-w-2xl font-medium">
                ยินดีต้อนรับเข้าสู่ระบบจัดการและวิเคราะห์บันทึกงานของคุณ เริ่มต้นจัดการงานวันนี้เพื่อบรรลุเป้าหมายที่ตั้งไว้กันเถอะ
              </p>
            </div>
          </div>

          {/* Quick Access Menu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Dashboard Card */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl rounded-3xl p-6 flex flex-col justify-between gap-6 transition-all hover:border-purple-500/50 hover:-translate-y-1 duration-300">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <i className="fa fa-chart-pie text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">ดูบอร์ดสถิติ</h3>
                  <p className="text-xs text-slate-400 mt-1">วิเคราะห์ภาพรวมการทำงาน อัตราความสำเร็จ และสัดส่วนงาน</p>
                </div>
                <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/50 flex justify-between text-xs">
                  <span className="text-slate-400">งานทั้งหมดในระบบ:</span>
                  <span className="font-bold text-white">{totalTasks} งาน</span>
                </div>
              </div>
              <Link href="/backoffice/home/dashboard" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/10 text-center transition-all">
                เปิดแดชบอร์ด
              </Link>
            </div>

            {/* Todo Card */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl rounded-3xl p-6 flex flex-col justify-between gap-6 transition-all hover:border-teal-500/50 hover:-translate-y-1 duration-300">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <i className="fa fa-tasks text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">บันทึกและจัดการงาน</h3>
                  <p className="text-xs text-slate-400 mt-1">เพิ่มข้อมูลงานใหม่ ตรวจสอบรายการ และอัปเดตสถานะการทำงาน</p>
                </div>
                <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/50 flex justify-between text-xs">
                  <span className="text-slate-400">งานกำลังดำเนินการ:</span>
                  <span className="font-bold text-teal-400">{countDoing} งาน</span>
                </div>
              </div>
              <Link href="/backoffice/home/todo" className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-teal-600/10 text-center transition-all">
                จัดการงาน
              </Link>
            </div>

            {/* Profile Card */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl rounded-3xl p-6 flex flex-col justify-between gap-6 transition-all hover:border-indigo-500/50 hover:-translate-y-1 duration-300">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <i className="fa fa-user-cog text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">ข้อมูลส่วนตัว</h3>
                  <p className="text-xs text-slate-400 mt-1">แก้ไขข้อมูลบัญชีผู้ใช้งาน และเปลี่ยนรหัสผ่านเพื่อความปลอดภัย</p>
                </div>
                <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/50 flex justify-between text-xs">
                  <span className="text-slate-400">ชื่อผู้ใช้งาน:</span>
                  <span className="font-bold text-white truncate max-w-[100px]">{name || 'User'}</span>
                </div>
              </div>
              <Link href="/backoffice/home/profile" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/10 text-center transition-all">
                แก้ไขข้อมูลส่วนตัว
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}


