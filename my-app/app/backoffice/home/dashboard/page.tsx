'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Config } from '../../signup/config'
import Swal from 'sweetalert2'
import Topography from '../../../Topography'
import Link from 'next/link'

interface TodoItem {
  id: number;
  name: string;
  remark: string;
  status: string;
}

export default function Dashboard() {
  const [countWait, setCountWait] = useState(0)
  const [countDoing, setCountDoing] = useState(0)
  const [countSuccess, setCountSuccess] = useState(0)
  const [name, setName] = useState('')
  const [recentTodos, setRecentTodos] = useState<TodoItem[]>([])

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

      // Fetch Todos list for recent tasks
      const listUrl = Config.apiUrl + '/todo/list'
      const listRes = await axios.get(listUrl, { headers })
      if (listRes.status === 200) {
        const sorted = listRes.data.slice(-5).reverse()
        setRecentTodos(sorted)
      }
    } catch (err) {
      Swal.fire({
        title: 'error',
        text: (err as Error).message,
        icon: 'error'
      })
    }
  }

  const totalTasks = countWait + countDoing + countSuccess
  const completionRate = totalTasks > 0 ? Math.round((countSuccess / totalTasks) * 100) : 0

  const getStatusBadge = (status: string) => {
    if (status === 'wait' || status === 'use') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
          รอทำ
        </span>
      )
    }
    if (status === 'doing') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
          กำลังทำ
        </span>
      )
    }
    if (status === 'success') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          เสร็จสิ้น
        </span>
      )
    }
    return null
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
      <div className="relative z-10 p-8 h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 text-slate-100 shadow-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-purple-500/30 hover:shadow-purple-500/10 hover:scale-[1.005] duration-300 w-full">
            {/* Abstract Decorative Shapes inside Banner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                ยินดีต้อนรับกลับมา, คุณ {name || 'User'}! 👋
              </h1>
              <p className="text-slate-350 text-sm mt-1.5 font-medium">
                วันนี้คุณได้ทำงานเสร็จสิ้นไปแล้วบางส่วน มาพยายามต่อให้เสร็จกันเถอะ
              </p>
            </div>
            
            {/* Success Circle/Badge */}
            <div className="relative z-10 bg-purple-500/10 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20 text-center min-w-[150px] shadow-inner transition-transform hover:scale-105 duration-200">
              <span className="block text-[10px] uppercase tracking-widest font-black text-purple-200">ความสำเร็จวันนี้</span>
              <span className="block text-3xl font-black mt-1 text-purple-300">{completionRate}%</span>
            </div>
          </div>


          {/* Statistics Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Count Wait */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl text-slate-100 px-6 py-5 rounded-2xl flex items-center justify-between transition-all hover:scale-103 hover:shadow-lg">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">รอทำ</span>
                <span className="block text-4xl font-black mt-1 text-white">{countWait}</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <i className="fa fa-hourglass-start text-xl"></i>
              </div>
            </div>
            {/* Count Doing */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl text-slate-100 px-6 py-5 rounded-2xl flex items-center justify-between transition-all hover:scale-103 hover:shadow-lg">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">กำลังทำ</span>
                <span className="block text-4xl font-black mt-1 text-white">{countDoing}</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <i className="fa fa-spinner text-xl animate-spin-slow"></i>
              </div>
            </div>
            {/* Count Success */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl text-slate-100 px-6 py-5 rounded-2xl flex items-center justify-between transition-all hover:scale-103 hover:shadow-lg">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ทำเสร็จแล้ว</span>
                <span className="block text-4xl font-black mt-1 text-white">{countSuccess}</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <i className="fa fa-check-circle text-xl"></i>
              </div>
            </div>
          </div>

          {/* Lower Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Recent Tasks Table */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <i className="fa fa-history text-purple-400 text-sm"></i>
                  รายการงานล่าสุด
                </h2>
                <Link href="/backoffice/home/todo" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                  จัดการงานทั้งหมด
                  <i className="fa fa-arrow-right text-[10px]"></i>
                </Link>
              </div>

              <div className="overflow-x-auto">
                {recentTodos.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-sm">
                    ไม่มีงานคงเหลือในระบบ
                  </div>
                ) : (
                  <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800/30">
                      <tr>
                        <th className="py-2.5 px-3 text-slate-300 font-bold">รายการ</th>
                        <th className="py-2.5 px-3 text-slate-300 font-bold">หมายเหตุ</th>
                        <th className="py-2.5 px-3 text-slate-300 font-bold text-center">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTodos.map((item) => (
                        <tr key={item.id} className="border-b border-slate-800/40 bg-white/5 hover:bg-white/10 transition-colors">
                          <td className="py-3 px-3 font-semibold text-white">{item.name}</td>
                          <td className="py-3 px-3 text-slate-400 truncate max-w-[150px]">{item.remark || '-'}</td>
                          <td className="py-3 px-3 text-center">{getStatusBadge(item.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Quick Metrics Overview */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800/60 pb-3 flex items-center gap-2">
                <i className="fa fa-tasks text-purple-400 text-sm"></i>
                ภาพรวมงานทั้งหมด
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                    <span>อัตราความสำเร็จ</span>
                    <span>{completionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      งานที่ต้องทำ
                    </span>
                    <span className="font-bold text-white">{countWait}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                      กำลังดำเนินการ
                    </span>
                    <span className="font-bold text-white">{countDoing}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                      เสร็จสิ้นแล้ว
                    </span>
                    <span className="font-bold text-white">{countSuccess}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}