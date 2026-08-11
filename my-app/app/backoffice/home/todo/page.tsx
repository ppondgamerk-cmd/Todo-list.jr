'use client'

import { Config } from '../../signup/config'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Topography from '../../../Topography'

export default function Todo() {
  const [name, setName] = useState('')
  const [remark, setRemark] = useState('')
  const [id, setId] = useState(0)
  const [todos, setTodos] = useState([])
  const [statusList] = useState([
    { value: 'all', text: 'ทุกสถานะ' },
    { value: 'wait', text: 'รอทำ' },
    { value: 'doing', text: 'กำลังทำ' },
    { value: 'success', text: 'ทำเสร็จแล้ว' }
  ])
  const [status, setStatus] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterData()
  }, [status])

  const filterData = async () => {
    try {
      const url = Config.apiUrl + '/todo/filter/' + status
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': 'Bearer ' + token
      }

      const res = await axios.get(url, { headers })

      if (res.status === 200) {
        setTodos(res.data)
      }
    } catch (err) {
      Swal.fire({
        title: 'error',
        text: (err as Error).message,
        icon: 'error'
      })
    }
  }

  const fetchData = async () => {
    try {
      const url = Config.apiUrl + '/todo/list'
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': 'Bearer ' + token
      }
      const res = await axios.get(url, { headers })

      if (res.status === 200) {
        setTodos(res.data)
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
      if (!name.trim()) throw new Error('กรุณากรอกชื่อสิ่งที่ต้องทำ')
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': 'Bearer ' + token
      }
      const payload = {
        name: name,
        remark: remark
      }
      if (id === 0) {
        const url = Config.apiUrl + '/todo/create'
        await axios.post(url, payload, { headers })
      } else {
        const urlEdit = Config.apiUrl + '/todo/update/' + id
        await axios.put(urlEdit, payload, { headers })
      }

      Swal.fire({
        title: 'สำเร็จ',
        text: 'บันทึกรายการสำเร็จ',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
      fetchData()
      setName('')
      setRemark('')
      setId(0)
    } catch (err) {
      Swal.fire({
        title: 'error',
        text: (err as Error).message,
        icon: 'error'
      })
    }
  }

  const handleEdit = (todo: { id: number, name: string, remark: string }) => {
    setId(todo.id)
    setName(todo.name)
    setRemark(todo.remark)
  }

  const handleRemove = async (id: number) => {
    const confirmButton = await Swal.fire({
      title: 'ลบรายการ',
      text: 'คุณต้องการลบรายการใช่หรือไม่ ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    })

    if (confirmButton.isConfirmed) {
      const url = Config.apiUrl + '/todo/remove/' + id
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': 'Bearer ' + token
      }
      await axios.delete(url, { headers })
      fetchData()
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      const url = Config.apiUrl + '/todo/updateStatus/' + id
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': 'Bearer ' + token
      }
      const payload = {
        status: status
      }

      await axios.put(url, payload, { headers })
      fetchData()
    } catch (err) {
      Swal.fire({
        title: 'error',
        text: (err as Error).message,
        icon: 'error'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'wait' || status === 'use') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          รอทำ
        </span>
      )
    }
    if (status === 'doing') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          กำลังทำ
        </span>
      )
    }
    if (status === 'success') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          เสร็จสิ้น
        </span>
      )
    }
    return null
  }

  // Real-time counters calculated from todos array
  const countWait = todos.filter((t: { status: string }) => t.status === 'wait' || t.status === 'use').length
  const countDoing = todos.filter((t: { status: string }) => t.status === 'doing').length
  const countSuccess = todos.filter((t: { status: string }) => t.status === 'success').length

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
          
          {/* Header Banner */}
          <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 text-slate-100 shadow-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-purple-500/30 hover:shadow-purple-500/10 hover:scale-[1.005] duration-300 w-full">
            {/* Abstract Decorative Shapes inside Banner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                บันทึกรายการงาน 📝
              </h1>
              <p className="text-slate-350 text-sm mt-1.5 font-medium">
                จัดการ ลบ หรือแก้ไขงานที่ต้องทำในระบบของคุณได้อย่างง่ายดาย
              </p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Card */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl rounded-2xl p-6 h-fit flex flex-col gap-4 text-slate-100">
              <h2 className="text-lg font-bold text-white border-b border-slate-800/60 pb-3 flex items-center gap-2">
                <i className="fa fa-pen-fancy text-purple-400 text-sm"></i>
                {id === 0 ? 'บันทึกรายการใหม่' : 'แก้ไขรายการ'}
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">ชื่อสิ่งที่ต้องทำ</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 focus:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-white placeholder-slate-500"
                    placeholder="เช่น ประชุมเช้า..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">หมายเหตุ</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 focus:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-white placeholder-slate-500 resize-none"
                    placeholder="รายละเอียดเพิ่มเติม..."
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-600/10 hover:shadow-purple-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa fa-save"></i>
                บันทึกข้อมูล
              </button>
              {id !== 0 && (
                <button
                  onClick={() => { setId(0); setName(''); setRemark('') }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  ยกเลิกการแก้ไข
                </button>
              )}
            </div>

            {/* List and Table Card */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl rounded-2xl p-6 flex flex-col gap-4 text-slate-100">
              {/* Header / Filter */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/60 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <i className="fa fa-list-ul text-purple-400 text-sm"></i>
                  รายการที่ต้องทำ
                </h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">ตัวกรอง:</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {statusList.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table Area */}
              <div className="overflow-x-auto w-full">
                {todos.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">
                    <i className="fa fa-inbox text-4xl mb-3 block opacity-30"></i>
                    ไม่มีรายการที่พบในหมวดหมู่นี้
                  </div>
                ) : (
                  <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-850/30">
                      <tr>
                        <th className="py-3 px-4 text-slate-300 font-bold">รายการ</th>
                        <th className="py-3 px-4 text-slate-300 font-bold">หมายเหตุ</th>
                        <th className="py-3 px-4 text-slate-300 font-bold text-center">สถานะ</th>
                        <th className="py-3 px-4 text-slate-300 font-bold text-center">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todos.map((item: { id: number, name: string, remark: string, status: string }) => (
                        <tr key={item.id} className="border-b border-slate-800/40 bg-white/5 hover:bg-white/10 transition-colors">
                          <td className="py-4 px-4 font-semibold text-white">{item.name}</td>
                          <td className="py-4 px-4 text-slate-400">{item.remark || '-'}</td>
                          <td className="py-4 px-4 text-center">{getStatusBadge(item.status)}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              <button
                                onClick={() => updateStatus(item.id, 'use')}
                                className="text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-white px-2 py-1.5 rounded-lg border border-amber-500/20 transition-all cursor-pointer"
                              >
                                รอทำ
                              </button>
                              <button
                                onClick={() => updateStatus(item.id, 'doing')}
                                className="text-[10px] font-bold bg-teal-500/10 hover:bg-teal-500 text-teal-300 hover:text-white px-2 py-1.5 rounded-lg border border-teal-500/20 transition-all cursor-pointer"
                              >
                                ทำอยู่
                              </button>
                              <button
                                onClick={() => updateStatus(item.id, 'success')}
                                className="text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-white px-2 py-1.5 rounded-lg border border-indigo-500/20 transition-all cursor-pointer"
                              >
                                เสร็จ
                              </button>
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-xs bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white p-2 rounded-lg border border-sky-500/20 transition-all cursor-pointer"
                              >
                                <i className="fa fa-pencil-alt"></i>
                              </button>
                              <button
                                onClick={() => handleRemove(item.id)}
                                className="text-xs bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-lg border border-red-500/20 transition-all cursor-pointer"
                              >
                                <i className="fa fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}