"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSetupPage(){
  const router = useRouter();
  useEffect(()=>{ router.replace("/admin/login"); },[router]);
  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",fontFamily:"Arial, sans-serif"}}>Mengarahkan ke login admin…</main>;
}
