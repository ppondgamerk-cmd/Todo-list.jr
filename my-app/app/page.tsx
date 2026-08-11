'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/backoffice/signin');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-955 flex items-center justify-center text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <i className="fa fa-spinner animate-spin text-2xl text-purple-500"></i>
        <span className="text-sm font-semibold tracking-wide">กำลังเปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ...</span>
      </div>
    </div>
  );
}
