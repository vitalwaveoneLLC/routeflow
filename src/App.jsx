// RouteFlow WMS — Complete Edition with Edit Everywhere
import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "./supabase";
import StripePaymentModal from "./StripePaymentModal.jsx";

const GS = () => (
  <>
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet"/>
    <style>{`
      *{box-sizing:border-box;margin:0;padding:0;}
      body{background:#f5f5f5;}
      ::-webkit-scrollbar{width:5px;height:5px;}
      ::-webkit-scrollbar-track{background:#ebebeb;}
      ::-webkit-scrollbar-thumb{background:#c0c0c0;border-radius:3px;}
      .app{font-family:'Barlow',sans-serif;background:#f5f5f5;min-height:100vh;color:#212121;font-size:12px;}
      .btn{cursor:pointer;border:none;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:.06em;text-transform:uppercase;transition:all .15s;display:inline-flex;align-items:center;gap:5px;white-space:nowrap;font-size:12px;padding:0;}
      .ba{background:#7c3aed;color:#fff;padding:8px 16px;border-radius:6px;}
      .ba:hover{background:#6d28d9;transform:translateY(-1px);}
      .ba:disabled{background:#c4b5fd;color:#fff;cursor:not-allowed;transform:none;}
      .bb{background:#ede9fe;color:#5b21b6;padding:8px 14px;border-radius:6px;border:1px solid #ddd6fe;}
      .bb:hover{background:#ddd6fe;}
      .bg{background:#ecfdf5;color:#065f46;padding:8px 14px;border-radius:6px;border:1px solid #a7f3d0;}
      .bg:hover{background:#d1fae5;}
      .br{background:#fef2f2;color:#991b1b;padding:8px 14px;border-radius:6px;border:1px solid #fecaca;}
      .br:hover{background:#fee2e2;}
      .bp{background:#f5f3ff;color:#5b21b6;padding:8px 14px;border-radius:6px;border:1px solid #ddd6fe;}
      .bp:hover{background:#ede9fe;}
      .bgh{background:transparent;color:#6b7280;padding:8px 14px;border-radius:6px;border:1px solid #d1d5db;}
      .bgh:hover{border-color:#7c3aed;color:#7c3aed;}
      .bpr{background:#ecfdf5;color:#065f46;padding:8px 14px;border-radius:6px;border:1px solid #a7f3d0;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:.06em;text-transform:uppercase;display:inline-flex;align-items:center;gap:5px;font-size:12px;}
      .card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 1px 4px #00000008;}
      .cin{background:#f9fafb;border:1px solid #e5e7eb;border-radius:9px;}
      input,select,textarea{background:#fff;border:1px solid #d1d5db;color:#212121;border-radius:7px;padding:8px 12px;font-family:'Barlow',sans-serif;font-size:12px;width:100%;outline:none;transition:border .15s;}
      input:focus,select:focus,textarea:focus{border-color:#7c3aed;box-shadow:0 0 0 2px #7c3aed18;}
      input:disabled,select:disabled{opacity:.5;background:#f3f4f6;}
      select option{background:#fff;color:#212121;}
      label{font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.09em;display:block;margin-bottom:4px;}
      .bdg{display:inline-flex;align-items:center;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif;letter-spacing:.05em;}
      .bg2{background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;}
      .ba2{background:#fffbeb;color:#92400e;border:1px solid #fde68a;}
      .br2{background:#fef2f2;color:#991b1b;border:1px solid #fecaca;}
      .bb2{background:#ede9fe;color:#5b21b6;border:1px solid #ddd6fe;}
      .bgr{background:#f9fafb;color:#6b7280;border:1px solid #e5e7eb;}
      .bp2{background:#f5f3ff;color:#5b21b6;border:1px solid #ddd6fe;}
      .bt{background:#f0fdfa;color:#0f766e;border:1px solid #99f6e4;}
      .badm{background:#fdf4ff;color:#7e22ce;border:1px solid #e9d5ff;}
      table{width:100%;border-collapse:collapse;}
      th{text-align:left;padding:9px 13px;font-size:10px;color:#6b7280;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid #e5e7eb;font-family:'Barlow Condensed',sans-serif;background:#f9fafb;}
      td{padding:10px 13px;font-size:12px;border-bottom:1px solid #f3f4f6;vertical-align:middle;color:#212121;}
      tr:last-child td{border-bottom:none;}
      tbody tr:hover td{background:#f9f5ff;}
      .mo{position:fixed;inset:0;background:#00000040;display:flex;align-items:center;justify-content:center;z-index:300;padding:16px;backdrop-filter:blur(6px);}
      .mb{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:26px;max-width:620px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 8px 40px #00000018;}
      .mb.w{max-width:860px;}
      .mb.xw{max-width:1020px;}
      .ni{cursor:pointer;display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:600;transition:all .15s;color:#6b7280;border:none;background:none;font-family:'Barlow',sans-serif;width:100%;text-align:left;}
      .ni:hover{color:#212121;background:#e0e0e0;}
      .ni.act{color:#7c3aed;background:#ede9fe;border-left:3px solid #7c3aed;padding-left:9px;}
      @keyframes fu{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
      .fu{animation:fu .2s ease forwards;}
      @keyframes pu{0%,100%{opacity:1;}50%{opacity:.4;}}
      .pu{animation:pu 2s infinite;}
      @keyframes spin{to{transform:rotate(360deg);}}
      .spin{animation:spin .8s linear infinite;}
      .kpi{background:#fff;border:1px solid #e5e7eb;border-radius:11px;padding:18px;box-shadow:0 1px 4px #00000006;}
      .kv{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;}
      .kl{font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;margin-top:2px;}
      .pb{height:4px;background:#e5e7eb;border-radius:2px;overflow:hidden;}
      .pf{height:100%;border-radius:2px;transition:width .4s;}
      .tag{display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-family:'Barlow Condensed',sans-serif;}
      .tw{overflow-x:auto;}
      .sh{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#212121;margin-bottom:12px;}
      .wdoc{background:#fff;color:#111;font-family:'Barlow',sans-serif;border-radius:10px;overflow:hidden;}
      .sw{background:#fff;color:#111;border-radius:10px;padding:22px;font-family:'Barlow',sans-serif;}
      .ei{background:#fff;border:1px solid #d1d5db;color:#212121;border-radius:5px;padding:5px 8px;font-size:12px;font-family:'Barlow',sans-serif;width:100%;outline:none;}
      .ei:focus{border-color:#7c3aed;}
      @media print{
        .no-print{display:none!important;}
        body{background:#fff!important;}
        .mo{position:relative!important;background:transparent!important;padding:0!important;backdrop-filter:none!important;}
        .mb{border:none!important;max-height:none!important;overflow:visible!important;background:#fff!important;border-radius:0!important;box-shadow:none!important;}
      }
    `}</style>
  </>
);

// ── ICONS ─────────────────────────────────────────────────────────────────────
const ic={
  dash:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  box:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
  truck:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  inv:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
  ar:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  settle:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>,
  pl:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  users:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  gear:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  orders:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  plus:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  arr:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
  chk:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>,
  X:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  undo:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 101.82-5.45"/></svg>,
  prt:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  dl:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  edit:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  save:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>,
  logout:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const fmt=n=>`$${Number(n||0).toFixed(2)}`;
const uid=()=>Math.random().toString(36).slice(2,8).toUpperCase();
const nowStr=()=>new Date().toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"});
const dateLabel=()=>new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
const downloadCSV=(rows,fn)=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([rows.map(r=>r.map(c=>`"${String(c??'').replace(/"/g,'""')}"`).join(",")).join("\n")],{type:"text/csv"}));a.download=fn;a.click();};

const Divider=()=><div style={{height:1,background:"#e5e7eb",margin:"12px 0"}}/>;
const Empty=({icon,msg})=>(<div style={{textAlign:"center",padding:"32px 16px",color:"#1a3040"}}><div style={{fontSize:28,marginBottom:6}}>{icon}</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,letterSpacing:".05em"}}>{msg}</div></div>);
const Spinner=({msg=""})=>(<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:60,color:"#9ca3af",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:".08em",fontSize:14}}><svg className="spin" width="18" height="18" fill="none" stroke="#7c3aed" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>{msg||"LOADING…"}</div>);
const Modal=({title,onClose,children,wide,xwide})=>(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}><div className={`mb fu${wide?" w":""}${xwide?" xw":""}`}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>{title?<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:19,textTransform:"uppercase",letterSpacing:".04em",color:"#212121"}}>{title}</div>:<div/>}<button className="btn bgh" onClick={onClose}>{ic.X} Close</button></div>{children}</div></div>);

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const Login=({})=>{
  const[email,setEmail]=useState("");
  const[pw,setPw]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const[stage,setStage]=useState("login"); // login | enroll | verify
  const[qrCode,setQrCode]=useState("");
  const[secret,setSecret]=useState("");
  const[otp,setOtp]=useState("");

  const callMfa=async(action,params={})=>{
    const{data:{session}}=await supabase.auth.getSession();
    const SUPABASE_URL=import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY=import.meta.env.VITE_SUPABASE_ANON_KEY;
    const res=await fetch(`${SUPABASE_URL}/functions/v1/mfa-handler`,{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${session?.access_token}`,"apikey":SUPABASE_ANON_KEY},
      body:JSON.stringify({action,...params}),
    });
    const result=await res.json();
    if(result.error)throw new Error(result.error);
    return result;
  };

  const go=async e=>{
    e.preventDefault();
    setLoading(true);setErr("");
    try{
      // Sign in with password
      const{error}=await supabase.auth.signInWithPassword({email,password:pw});
      if(error)throw error;
      // Check if TOTP is set up
      const{hasTotp}=await callMfa("check");
      if(hasTotp){
        setStage("verify");
      } else {
        // First time — enroll
        const{qrCode:qr,secret:sec}=await callMfa("enroll");
        setQrCode(qr);
        setSecret(sec);
        setStage("enroll");
      }
    }catch(e){
      setErr(e.message);
      await supabase.auth.signOut();
    }
    setLoading(false);
  };

  const verifyEnroll=async()=>{
    setLoading(true);setErr("");
    try{
      await callMfa("verifyEnroll",{code:otp});
      setOtp("");
    }catch(e){setErr(e.message);}
    setLoading(false);
  };

  const verifyLogin=async()=>{
    setLoading(true);setErr("");
    try{
      await callMfa("verifyLogin",{code:otp});
      setOtp("");
    }catch(e){
      setErr(e.message);
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  if(stage==="enroll") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f5f5",padding:20}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div className="card" style={{padding:28}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:32,marginBottom:8}}>🔐</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#212121"}}>SET UP 2-FACTOR AUTH</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>One-time setup — scan this QR code with your authenticator app</div>
          </div>
          <div style={{textAlign:"center",marginBottom:16}}>
            <img src={qrCode} alt="QR Code" style={{width:200,height:200,borderRadius:10,border:"1px solid #e5e7eb"}}/>
          </div>
          <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"10px 14px",marginBottom:16}}>
            <div style={{fontSize:10,color:"#9ca3af",marginBottom:4,fontWeight:700,letterSpacing:".08em"}}>OR ENTER CODE MANUALLY</div>
            <div style={{fontFamily:"monospace",fontSize:13,color:"#212121",wordBreak:"break-all",letterSpacing:".1em"}}>{secret}</div>
          </div>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:14,lineHeight:1.7}}>
            1. Open <strong>Google Authenticator</strong> or <strong>Authy</strong><br/>
            2. Tap <strong>+</strong> → <strong>Scan QR code</strong><br/>
            3. Enter the 6-digit code shown in the app
          </div>
          {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:7,padding:"9px 13px",fontSize:12,color:"#dc2626",marginBottom:12}}>{err}</div>}
          <div><label>6-DIGIT CODE FROM APP</label>
            <input type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={otp}
              onChange={e=>setOtp(e.target.value.replace(/\D/g,""))}
              onKeyDown={e=>e.key==="Enter"&&verifyEnroll()}
              style={{textAlign:"center",fontSize:28,letterSpacing:"0.4em",fontWeight:700}}/>
          </div>
          <button onClick={verifyEnroll} className="btn ba" style={{width:"100%",justifyContent:"center",padding:"11px",marginTop:12}} disabled={loading||otp.length<6}>
            {loading?"Verifying…":"✓ Activate 2FA & Sign In"}
          </button>
        </div>
      </div>
    </div>
  );

  if(stage==="verify") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f5f5",padding:20}}>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{background:"#fff",borderRadius:20,padding:8,marginBottom:10,display:"inline-block"}}>
            <img src="/logo-sidebar.png" style={{width:120,height:120,objectFit:"contain",display:"block",borderRadius:14}}/>
          </div>
        </div>
        <div className="card" style={{padding:26}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:32,marginBottom:6}}>📱</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#212121"}}>ENTER YOUR CODE</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>Open Google Authenticator and enter the 6-digit code</div>
          </div>
          {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:7,padding:"9px 13px",fontSize:12,color:"#dc2626",marginBottom:12}}>{err}</div>}
          <div><label>6-DIGIT CODE</label>
            <input type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={otp}
              onChange={e=>setOtp(e.target.value.replace(/\D/g,""))}
              onKeyDown={e=>e.key==="Enter"&&verifyLogin()}
              style={{textAlign:"center",fontSize:28,letterSpacing:"0.4em",fontWeight:700}}
              autoFocus/>
          </div>
          <button onClick={verifyLogin} className="btn ba" style={{width:"100%",justifyContent:"center",padding:"11px",marginTop:12}} disabled={loading||otp.length<6}>
            {loading?"Verifying…":"🔓 Verify & Sign In"}
          </button>
          <button onClick={()=>{supabase.auth.signOut();setStage("login");setOtp("");setErr("");}}
            style={{width:"100%",background:"none",border:"none",color:"#9ca3af",fontSize:11,marginTop:10,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>
            ← Use different account
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"#9ca3af"}}>🔐 Protected by 2-Factor Authentication</div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f5f5",padding:20}}>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{background:"#fff",borderRadius:20,padding:8,marginBottom:10,display:"inline-block"}}>
            <img src="/logo-sidebar.png" style={{width:180,height:180,objectFit:"contain",display:"block",borderRadius:14}}/>
          </div>
        </div>
        <div className="card" style={{padding:26}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#6b7280",letterSpacing:".08em",marginBottom:18,textAlign:"center"}}>ADMIN SIGN IN</div>
          {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:7,padding:"9px 13px",fontSize:12,color:"#dc2626",marginBottom:12}}>{err}</div>}
          <form onSubmit={go} style={{display:"flex",flexDirection:"column",gap:13}}>
            <div><label>Email</label><input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required disabled={loading}/></div>
            <div><label>Password</label><input type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} required disabled={loading}/></div>
            <button type="submit" className="btn ba" style={{width:"100%",justifyContent:"center",padding:"11px",fontSize:13,marginTop:4}} disabled={loading}>
              {loading?<svg className="spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>:""}
              {loading?"Signing in…":"Sign In →"}
            </button>
          </form>
        </div>
        <div style={{textAlign:"center",marginTop:14,fontSize:11,color:"#9ca3af"}}>🔐 Admin access only · Protected by 2FA</div>
      </div>
    </div>
  );
};

  const go=async e=>{
    e.preventDefault();
    setLoading(true);setErr("");
    const{error}=await supabase.auth.signInWithPassword({email,password:pw});
    if(error){setErr(error.message);setLoading(false);return;}

    // Debug MFA state
    const{data:aalData,error:aalErr}=await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    console.log("AAL Data:",aalData,"Error:",aalErr);

    const{data:factors,error:fErr}=await supabase.auth.mfa.listFactors();
    console.log("Factors:",factors,"Error:",fErr);

    const currentLevel=aalData?.currentLevel;
    const nextLevel=aalData?.nextLevel;
    console.log("currentLevel:",currentLevel,"nextLevel:",nextLevel);

    if(nextLevel==="aal2"&&currentLevel==="aal1"){
      const totp=factors?.totp?.find(f=>f.status==="verified");
      console.log("Found verified TOTP:",totp);
      if(totp){setFactorId(totp.id);setStage("verify");setLoading(false);return;}
    }

    // Check for any verified factor
    const verified=factors?.totp?.find(f=>f.status==="verified");
    console.log("Verified factor:",verified);
    if(verified){setFactorId(verified.id);setStage("verify");setLoading(false);return;}

    // Enroll fresh
    console.log("Starting fresh enrollment...");
    const{data,error:enrollErr}=await supabase.auth.mfa.enroll({
      factorType:"totp",
      issuer:"VitalWaveOne LLC",
      friendlyName:"RouteFlow Admin",
    });
    console.log("Enroll result:",data,"Error:",enrollErr);
    if(enrollErr){setErr(enrollErr.message);setLoading(false);return;}
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setEnrollId(data.id);
    setStage("enroll");
    setLoading(false);
  };

  const verifyOtp=async()=>{
    setLoading(true);setErr("");
    try{
      if(stage==="enroll"){
        // Challenge then verify for first-time enrollment
        const{data:challenge,error:cErr}=await supabase.auth.mfa.challenge({factorId:enrollId});
        if(cErr)throw cErr;
        const{error:vErr}=await supabase.auth.mfa.verify({factorId:enrollId,challengeId:challenge.id,code:otp.replace(/\s/g,"")});
        if(vErr)throw vErr;
      } else {
        // Regular login verify
        const{data:challenge,error:cErr}=await supabase.auth.mfa.challenge({factorId});
        if(cErr)throw cErr;
        const{error:vErr}=await supabase.auth.mfa.verify({factorId,challengeId:challenge.id,code:otp.replace(/\s/g,"")});
        if(vErr)throw vErr;
      }
    }catch(e){setErr(e.message||"Invalid code — try again");setLoading(false);return;}
    setLoading(false);
  };

  if(stage==="enroll") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f5f5",padding:20}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div className="card" style={{padding:28}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:32,marginBottom:8}}>🔐</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#212121"}}>SET UP 2-FACTOR AUTH</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>One-time setup — scan this QR code with your authenticator app</div>
          </div>
          <div style={{textAlign:"center",marginBottom:16}}>
            <img src={qrCode} alt="QR Code" style={{width:180,height:180,borderRadius:10,border:"1px solid #e5e7eb"}}/>
          </div>
          <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"10px 14px",marginBottom:16}}>
            <div style={{fontSize:10,color:"#9ca3af",marginBottom:4,fontWeight:700,letterSpacing:".08em"}}>MANUAL ENTRY CODE</div>
            <div style={{fontFamily:"monospace",fontSize:13,color:"#212121",wordBreak:"break-all"}}>{secret}</div>
          </div>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:14,lineHeight:1.6}}>
            1. Open <strong>Google Authenticator</strong> or <strong>Authy</strong><br/>
            2. Tap <strong>+</strong> → <strong>Scan QR code</strong><br/>
            3. Enter the 6-digit code shown below
          </div>
          {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:7,padding:"9px 13px",fontSize:12,color:"#dc2626",marginBottom:12}}>{err}</div>}
          <div><label>6-DIGIT CODE FROM APP</label>
            <input type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))} onKeyDown={e=>e.key==="Enter"&&verifyOtp()}
              style={{textAlign:"center",fontSize:24,letterSpacing:"0.3em",fontWeight:700}}/>
          </div>
          <button onClick={verifyOtp} className="btn ba" style={{width:"100%",justifyContent:"center",padding:"11px",marginTop:12}} disabled={loading||otp.length<6}>
            {loading?"Verifying…":"✓ Activate 2FA & Sign In"}
          </button>
        </div>
      </div>
    </div>
  );

  if(stage==="verify") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f5f5",padding:20}}>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{background:"#fff",borderRadius:20,padding:8,marginBottom:10,display:"inline-block"}}>
            <img src="/logo-sidebar.png" style={{width:120,height:120,objectFit:"contain",display:"block",borderRadius:14}}/>
          </div>
        </div>
        <div className="card" style={{padding:26}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:32,marginBottom:6}}>📱</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#212121"}}>ENTER YOUR CODE</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>Open your authenticator app and enter the 6-digit code</div>
          </div>
          {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:7,padding:"9px 13px",fontSize:12,color:"#dc2626",marginBottom:12}}>{err}</div>}
          <div><label>6-DIGIT CODE</label>
            <input type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))} onKeyDown={e=>e.key==="Enter"&&verifyOtp()}
              style={{textAlign:"center",fontSize:28,letterSpacing:"0.4em",fontWeight:700}}/>
          </div>
          <button onClick={verifyOtp} className="btn ba" style={{width:"100%",justifyContent:"center",padding:"11px",marginTop:12}} disabled={loading||otp.length<6}>
            {loading?"Verifying…":"🔓 Verify & Sign In"}
          </button>
          <button onClick={()=>{supabase.auth.signOut();setStage("login");setOtp("");setErr("");}} style={{width:"100%",background:"none",border:"none",color:"#9ca3af",fontSize:11,marginTop:10,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>
            ← Use different account
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"#9ca3af"}}>🔐 Protected by TOTP 2-Factor Authentication</div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f5f5",padding:20}}>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{background:"#fff",borderRadius:20,padding:8,marginBottom:10,display:"inline-block"}}>
            <img src="/logo-sidebar.png" style={{width:180,height:180,objectFit:"contain",display:"block",borderRadius:14}}/>
          </div>
        </div>
        <div className="card" style={{padding:26}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#6b7280",letterSpacing:".08em",marginBottom:18,textAlign:"center"}}>ADMIN SIGN IN</div>
          {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:7,padding:"9px 13px",fontSize:12,color:"#dc2626",marginBottom:12}}>{err}</div>}
          <form onSubmit={go} style={{display:"flex",flexDirection:"column",gap:13}}>
            <div><label>Email</label><input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required disabled={loading}/></div>
            <div><label>Password</label><input type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} required disabled={loading}/></div>
            <button type="submit" className="btn ba" style={{width:"100%",justifyContent:"center",padding:"11px",fontSize:13,marginTop:4}} disabled={loading}>
              {loading?<svg className="spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>:""}
              {loading?"Signing in…":"Sign In →"}
            </button>
          </form>
        </div>
        <div style={{textAlign:"center",marginTop:14,fontSize:11,color:"#9ca3af"}}>🔐 Admin access only · Protected by 2FA</div>
      </div>
    </div>
  );
};

// ── INVOICE DOC ───────────────────────────────────────────────────────────────
const InvoiceDoc=({sale,products,customers,trucks,co,paid})=>{
  if(!sale)return null;
  const cust=customers.find(c=>c.id===sale.cust_id),truck=trucks.find(t=>t.id===sale.truck_id);
  const getP=pid=>products.find(p=>p.id===pid);
  const CARD_FEE=3;
  const tr=parseFloat(co?.tax_rate||8.25),sub=sale.total,tax=sub*(tr/100),gt=sub+tax;
  const cardFeeAmt=parseFloat((gt*CARD_FEE/100).toFixed(2));
  const gtCard=parseFloat((gt+cardFeeAmt).toFixed(2));
  return(
    <div className="wdoc">
      <div style={{background:"#7c3aed",padding:"20px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:26,color:"#fff"}}>INVOICE</div><div style={{fontSize:11,color:"#ddd6fe",marginTop:2}}>#{sale.id}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:"#fff"}}>{co?.name}</div><div style={{fontSize:10,color:"#ddd6fe",lineHeight:1.8,marginTop:2}}>{co?.address}<br/>{co?.phone} · {co?.email}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,padding:"16px 28px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
        <div>
          <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",letterSpacing:".1em",marginBottom:4,textTransform:"uppercase"}}>Bill To</div>
          <div style={{fontWeight:700,fontSize:14,color:"#111"}}>{cust?.name}</div>
          {cust?.address&&<div style={{fontSize:11,color:"#6b7280",lineHeight:1.6,marginTop:2}}>{cust.address}</div>}
          {cust?.phone&&<div style={{fontSize:11,color:"#6b7280"}}>{cust.phone}</div>}
          {cust?.email&&<div style={{fontSize:11,color:"#6b7280"}}>{cust.email}</div>}
        </div>
        <div>
          <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",letterSpacing:".1em",marginBottom:4,textTransform:"uppercase"}}>Driver / Route</div>
          <div style={{fontWeight:700,fontSize:14,color:"#111"}}>{truck?.driver}</div>
          <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{truck?.route} · {truck?.plate}</div>
        </div>
        <div>
          <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",letterSpacing:".1em",marginBottom:4,textTransform:"uppercase"}}>Invoice Date</div>
          <div style={{fontWeight:700,fontSize:14,color:"#111"}}>{sale.date}</div>
          <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>Load: {sale.load_id}</div>
          <div style={{marginTop:8}}><span style={{background:paid?"#dcfce7":"#fef9c3",color:paid?"#166534":"#854d0e",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{paid?"✓ PAID":"⏳ BALANCE DUE"}</span></div>
        </div>
      </div>
      <div style={{padding:"18px 28px"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["SKU","Product","Unit","Qty","Unit Price","Amount"].map(h=><th key={h} style={{textAlign:["Qty","Unit Price","Amount"].includes(h)?"right":"left",padding:"7px 8px",fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".07em",borderBottom:"2px solid #111",background:"transparent"}}>{h}</th>)}</tr></thead>
          <tbody>{(sale.items||[]).map((item,i)=>{const p=getP(item.pid);return(<tr key={i}>{[p?.sku,p?.name,p?.unit,item.qty,fmt(p?.price||0),fmt(item.qty*(p?.price||0))].map((v,j)=><td key={j} style={{padding:"9px 8px",borderBottom:"1px solid #f3f4f6",fontSize:13,textAlign:j>=3?"right":"left",fontWeight:j===5||j===3?700:400,color:j===0||j===2?"#9ca3af":"#111"}}>{v}</td>)}</tr>);})}</tbody>
        </table>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}>
          <div style={{width:300}}>
            {[["Subtotal",fmt(sub)],[`Tax (${tr}%)`,fmt(tax)]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f3f4f6"}}>
                <span style={{fontSize:13,color:"#6b7280"}}>{l}</span><span style={{fontSize:13}}>{v}</span>
              </div>
            ))}
            {/* Cash total */}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"2px solid #111",marginTop:3}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#111"}}>💵 CASH / CHECK TOTAL</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:"#059669"}}>{fmt(gt)}</span>
            </div>
            {/* Card surcharge line */}
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f3f4f6",background:"#faf5ff",margin:"0 -8px",padding:"6px 8px"}}>
              <span style={{fontSize:12,color:"#7c3aed"}}>💳 Card surcharge ({CARD_FEE}%)</span>
              <span style={{fontSize:12,color:"#7c3aed"}}>+{fmt(cardFeeAmt)}</span>
            </div>
            {/* Card total */}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#111"}}>💳 CARD TOTAL</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:"#7c3aed"}}>{fmt(gtCard)}</span>
            </div>
            {!paid&&<div style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:"#fef9c3",borderRadius:7,marginTop:3}}><span style={{fontWeight:700,fontSize:12,color:"#854d0e"}}>Balance Due</span><span style={{fontWeight:900,fontSize:15,color:"#854d0e"}}>{fmt(gt)}</span></div>}
          </div>
        </div>
        {/* Payment methods note */}
        <div style={{marginTop:16,background:"#f9fafb",borderRadius:8,padding:"10px 14px",fontSize:11,color:"#6b7280",lineHeight:1.7}}>
          <strong style={{color:"#212121"}}>Payment Methods:</strong> Cash · Check · Money Order · Zelle — <strong style={{color:"#059669"}}>No surcharge</strong> &nbsp;|&nbsp; Credit Card · Debit Card — <strong style={{color:"#7c3aed"}}>{CARD_FEE}% surcharge applies</strong>
        </div>
        <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between"}}><div style={{fontSize:10,color:"#9ca3af"}}>Thank you for your business · Payment due upon delivery</div><div style={{fontSize:10,color:"#9ca3af"}}>{co?.email}</div></div>
      </div>
    </div>
  );
};

// ── SETTLEMENT DOC ────────────────────────────────────────────────────────────
const SettleDoc=({truck,d,co,customers,payments})=>{
  const tr=parseFloat(co?.tax_rate||8.25);
  return(
    <div className="sw">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:13,borderBottom:"2px solid #7c3aed",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:21,color:"#111"}}>DAILY SETTLEMENT REPORT</div><div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{co?.name} · {dateLabel()}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:"#111"}}>{truck?.driver}</div><div style={{fontSize:11,color:"#6b7280"}}>{truck?.plate} · {truck?.route}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:800,color:"#6b7280",letterSpacing:".1em",marginBottom:8}}>UNIT RECONCILIATION</div>
          <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["Item","Units"].map(h=><th key={h} style={{textAlign:"left",padding:"7px 8px",fontSize:10,fontWeight:700,color:"#9ca3af",borderBottom:"1px solid #e5e7eb",background:"transparent"}}>{h}</th>)}</tr></thead>
          <tbody>{[["Loaded",d.loadedUnits],["Sold",d.soldUnits],["Returned",d.retUnits],["Variance",d.loadedUnits-d.soldUnits-d.retUnits]].map(([l,v])=><tr key={l}><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:13}}>{l}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontWeight:700,fontSize:14,color:l==="Variance"&&v!==0?"#dc2626":"#111"}}>{v}</td></tr>)}</tbody></table>
        </div>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:800,color:"#6b7280",letterSpacing:".1em",marginBottom:8}}>FINANCIAL SUMMARY</div>
          <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["Item","Amount"].map(h=><th key={h} style={{textAlign:"left",padding:"7px 8px",fontSize:10,fontWeight:700,color:"#9ca3af",borderBottom:"1px solid #e5e7eb",background:"transparent"}}>{h}</th>)}</tr></thead>
          <tbody>{[["Revenue",fmt(d.rev),false],["Tax",fmt(d.tax),false],["Grand Total",fmt(d.rev+d.tax),true],["COGS",fmt(d.cogs),false],["Gross Profit",fmt(d.prof),true],["Cash Collected",fmt(d.collected),false],["Outstanding",fmt(d.outstanding),false]].map(([l,v,b])=><tr key={l} style={{background:b?"#fffbeb":"transparent"}}><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:13,fontWeight:b?600:400}}>{l}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontWeight:b?800:500,fontSize:b?15:13,color:l==="Outstanding"?"#dc2626":l.includes("Profit")?"#16a34a":"#111"}}>{v}</td></tr>)}</tbody></table>
        </div>
      </div>
      {d.truckSales.length>0&&<><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:800,color:"#6b7280",letterSpacing:".1em",marginBottom:8}}>INVOICE DETAIL</div>
      <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["Invoice","Customer","Units","Subtotal","Tax","Total","Status"].map(h=><th key={h} style={{textAlign:"left",padding:"7px 8px",fontSize:10,fontWeight:700,color:"#9ca3af",borderBottom:"1px solid #e5e7eb",background:"transparent"}}>{h}</th>)}</tr></thead>
      <tbody>{d.truckSales.map(s=>{const cust=customers.find(c=>c.id===s.cust_id);const pmt=payments.find(p=>p.sale_id===s.id);return(<tr key={s.id}><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12,fontWeight:700,color:"#2563eb"}}>{s.id}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12}}>{cust?.name}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12}}>{(s.items||[]).reduce((a,i)=>a+i.qty,0)}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12}}>{fmt(s.total)}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12,color:"#7c3aed"}}>{fmt(s.total*(tr/100))}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:13,fontWeight:700}}>{fmt(s.total*(1+tr/100))}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb"}}><span style={{background:pmt?.status==="paid"?"#dcfce7":"#fef9c3",color:pmt?.status==="paid"?"#166534":"#854d0e",padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:700}}>{pmt?.status==="paid"?"PAID":"UNPAID"}</span></td></tr>);})}</tbody></table></>}
      <div style={{marginTop:20,paddingTop:10,borderTop:"1px solid #e5e7eb",fontSize:10,color:"#9ca3af",textAlign:"center"}}>{co?.name} · {co?.phone} · {dateLabel()}</div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const[session,setSession]=useState(null);
  const[profile,setProfile]=useState(null);
  const[authReady,setAuthReady]=useState(false);

  // Data
  const[co,setCo]=useState(null);
  const[products,setProducts]=useState([]);
  const[trucks,setTrucks]=useState([]);
  const[customers,setCustomers]=useState([]);
  const[loads,setLoads]=useState([]);
  const[sales,setSales]=useState([]);
  const[returns,setReturns]=useState([]);
  const[payments,setPayments]=useState([]);
  const[orders,setOrders]=useState([]);
  const[loading,setLoading]=useState(true);

  // UI
  const[tab,setTab]=useState("dashboard");
  const[modal,setModal]=useState(null);
  const[saving,setSaving]=useState(false);
  const[toast,setToast]=useState(null);
  const[arFilter,setArFilter]=useState("all");
  const[ordFilter,setOrdFilter]=useState("pending");
  const[viewSale,setViewSale]=useState(null);
  const[viewTruck,setViewTruck]=useState(null);
  const[stripeModal,setStripeModal]=useState(null);
  const[scanning,setScanning]=useState(false);
  const[scanInput,setScanInput]=useState("");
  const[scanMsg,setScanMsg]=useState(null);

  // Edit states — product
  const[editingPid,setEditingPid]=useState(null);
  const[editProd,setEditProd]=useState({});

  // Edit states — customer
  const[editingCid,setEditingCid]=useState(null);
  const[editCust,setEditCust]=useState({});

  // Edit states — truck
  const[editingTid,setEditingTid]=useState(null);
  const[editTruck,setEditTruck]=useState({});

  // Form states
  const[selTruck,setSelTruck]=useState("");
  const[selCust,setSelCust]=useState("");
  const[selLoad,setSelLoad]=useState(null);
  const[formItems,setFormItems]=useState([]);
  const[np,setNp]=useState({name:"",sku:"",cat:"Beverage",unit:"Case/24",cost:"",price:"",shelf:""});
  const[nt,setNt]=useState({driver:"",plate:"",route:""});
  const[nc,setNc]=useState({name:"",address:"",phone:"",email:"",notes:"",truck_id:""});
  const[rsPid,setRsPid]=useState("");
  const[rsQty,setRsQty]=useState("");
  const[coEdit,setCoEdit]=useState(null);

  const isAdmin=profile?.role==="admin";
  const taxRate=parseFloat(co?.tax_rate||8.25);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3200);};

  // Auth
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);if(session)loadProfile(session.user.id);else setAuthReady(true);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{setSession(session);if(session)loadProfile(session.user.id);else{setProfile(null);setAuthReady(true);setLoading(false);}});
    return()=>subscription.unsubscribe();
  },[]);

  const loadProfile=async uid=>{const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();setProfile(data);setAuthReady(true);};

  useEffect(()=>{if(authReady&&session&&profile)loadAll();},[authReady,session,profile]);

  const loadAll=useCallback(async()=>{
    setLoading(true);
    try{
      const[coR,prR,trR,cuR,ldR,saR,rtR,pmR,orR]=await Promise.all([
        supabase.from("company").select("*").single(),
        supabase.from("products").select("*").order("name"),
        supabase.from("trucks").select("*").order("driver"),
        supabase.from("customers").select("*").order("name"),
        supabase.from("loads").select("*").order("created_at",{ascending:false}),
        supabase.from("sales").select("*").order("created_at",{ascending:false}),
        supabase.from("returns").select("*").order("created_at",{ascending:false}),
        supabase.from("payments").select("*"),
        supabase.from("orders").select("*").order("created_at",{ascending:false}),
      ]);
      if(coR.data){setCo(coR.data);setCoEdit(coR.data);}
      if(prR.data)setProducts(prR.data);
      if(trR.data)setTrucks(trR.data);
      if(cuR.data)setCustomers(cuR.data);
      if(ldR.data)setLoads(ldR.data);
      if(saR.data)setSales(saR.data);
      if(rtR.data)setReturns(rtR.data);
      if(pmR.data)setPayments(pmR.data);
      if(orR.data)setOrders(orR.data);
    }catch(e){showToast("Error loading data","error");}
    setLoading(false);
  },[profile]);

  // Lookups
  const getP=id=>products.find(p=>p.id===id);
  const getT=id=>trucks.find(t=>t.id===id);
  const getC=id=>customers.find(c=>c.id===id);
  const activeLoad=tid=>loads.find(l=>l.truck_id===tid&&l.status==="out");
  const pmtFor=sid=>payments.find(p=>p.sale_id===sid);

  const truckInv=tid=>{
    const load=activeLoad(tid);if(!load)return[];
    const sm={},rm={};
    sales.filter(s=>s.load_id===load.id).forEach(s=>(s.items||[]).forEach(i=>{sm[i.pid]=(sm[i.pid]||0)+i.qty;}));
    returns.filter(r=>r.load_id===load.id).forEach(r=>(r.items||[]).forEach(i=>{rm[i.pid]=(rm[i.pid]||0)+i.qty;}));
    return(load.items||[]).map(i=>({pid:i.pid,loaded:i.qty,sold:sm[i.pid]||0,returned:rm[i.pid]||0,remaining:i.qty-(sm[i.pid]||0)-(rm[i.pid]||0)})).filter(i=>i.loaded>0);
  };

  const myTruckId=isAdmin?null:profile?.truck_id;
  const visTrucks=isAdmin?trucks:trucks.filter(t=>t.id===myTruckId);
  const visSales=isAdmin?sales:sales.filter(s=>s.truck_id===myTruckId);
  const visCustomers=isAdmin?customers:customers.filter(c=>c.truck_id===myTruckId);

  const totalRevenue=useMemo(()=>visSales.reduce((a,s)=>a+s.total,0),[visSales]);
  const totalProfit=useMemo(()=>visSales.reduce((a,s)=>a+s.profit,0),[visSales]);
  const totalTax=useMemo(()=>visSales.reduce((a,s)=>a+s.total*(taxRate/100),0),[visSales,taxRate]);
  const totalAR=useMemo(()=>visSales.filter(s=>pmtFor(s.id)?.status!=="paid").reduce((a,s)=>a+s.total*(1+taxRate/100),0),[visSales,payments,taxRate]);

  const settlementData=tid=>{
    const ts=sales.filter(s=>s.truck_id===tid),tr=returns.filter(r=>r.truck_id===tid),al=loads.filter(l=>l.truck_id===tid);
    const rev=ts.reduce((a,s)=>a+s.total,0),prof=ts.reduce((a,s)=>a+s.profit,0);
    return{truckSales:ts,loadedUnits:al.reduce((a,l)=>a+(l.items||[]).reduce((b,i)=>b+i.qty,0),0),soldUnits:ts.reduce((a,s)=>a+(s.items||[]).reduce((b,i)=>b+i.qty,0),0),retUnits:tr.reduce((a,r)=>a+(r.items||[]).reduce((b,i)=>b+i.qty,0),0),rev,prof,cogs:rev-prof,tax:rev*(taxRate/100),collected:ts.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+s.total*(1+taxRate/100),0),outstanding:ts.filter(s=>pmtFor(s.id)?.status!=="paid").reduce((a,s)=>a+s.total*(1+taxRate/100),0)};
  };

  // ── PRODUCT ACTIONS ────────────────────────────────────────────────────────
  const addProduct=async()=>{
    if(!np.name||!np.sku||!np.cost||!np.price)return showToast("Name, SKU, cost & price required","error");
    setSaving(true);
    const rec={id:"P"+uid(),name:np.name,sku:np.sku,cat:np.cat,unit:np.unit,cost:parseFloat(np.cost),price:parseFloat(np.price),shelf:parseInt(np.shelf)||0};
    const{error}=await supabase.from("products").insert(rec);
    if(error)showToast(error.message,"error");
    else{setProducts(prev=>[...prev,rec]);showToast(`${np.name} added`);setModal(null);setNp({name:"",sku:"",cat:"Beverage",unit:"Case/24",cost:"",price:"",shelf:""});}
    setSaving(false);
  };

  const startEditProduct=p=>{setEditingPid(p.id);setEditProd({...p});};
  const cancelEditProduct=()=>{setEditingPid(null);setEditProd({});};
  const saveEditProduct=async()=>{
    setSaving(true);
    const{id,...fields}=editProd;
    const update={name:fields.name,sku:fields.sku,cat:fields.cat,unit:fields.unit,cost:parseFloat(fields.cost)||0,price:parseFloat(fields.price)||0,shelf:parseInt(fields.shelf)||0};
    const{error}=await supabase.from("products").update(update).eq("id",id);
    if(error)showToast(error.message,"error");
    else{setProducts(prev=>prev.map(p=>p.id===id?{...p,...update}:p));showToast("Product updated");setEditingPid(null);}
    setSaving(false);
  };

  const confirmRestock=async()=>{
    if(!rsPid||parseInt(rsQty)<=0)return;
    setSaving(true);
    const p=getP(rsPid);const ns=p.shelf+parseInt(rsQty);
    const{error}=await supabase.from("products").update({shelf:ns}).eq("id",rsPid);
    if(error)showToast(error.message,"error");
    else{setProducts(prev=>prev.map(x=>x.id===rsPid?{...x,shelf:ns}:x));showToast(`${p.name} restocked`);setModal(null);setRsQty("");}
    setSaving(false);
  };

  // ── TRUCK ACTIONS ──────────────────────────────────────────────────────────
  const addTruck=async()=>{
    if(!nt.driver||!nt.plate)return showToast("Driver name & plate required","error");
    setSaving(true);
    const rec={id:"T"+uid(),driver:nt.driver,plate:nt.plate,route:nt.route||""};
    const{error}=await supabase.from("trucks").insert(rec);
    if(error)showToast(error.message,"error");
    else{setTrucks(prev=>[...prev,rec]);showToast(`${nt.driver} added`);setModal(null);setNt({driver:"",plate:"",route:""});}
    setSaving(false);
  };

  const startEditTruck=t=>{setEditingTid(t.id);setEditTruck({...t});};
  const saveEditTruck=async()=>{
    setSaving(true);
    const{id,...fields}=editTruck;
    const{error}=await supabase.from("trucks").update({driver:fields.driver,plate:fields.plate,route:fields.route}).eq("id",id);
    if(error)showToast(error.message,"error");
    else{setTrucks(prev=>prev.map(t=>t.id===id?{...t,...fields}:t));showToast("Driver updated");setEditingTid(null);}
    setSaving(false);
  };

  // ── CUSTOMER ACTIONS ───────────────────────────────────────────────────────
  const addCustomer=async()=>{
    if(!nc.name)return showToast("Business name required","error");
    setSaving(true);
    const rec={id:"C"+uid(),name:nc.name,address:nc.address||"",phone:nc.phone||"",email:nc.email||"",notes:nc.notes||"",truck_id:nc.truck_id||trucks[0]?.id||null};
    const{error}=await supabase.from("customers").insert(rec);
    if(error)showToast(error.message,"error");
    else{setCustomers(prev=>[...prev,rec]);showToast(`${nc.name} account opened`);setModal(null);setNc({name:"",address:"",phone:"",email:"",notes:"",truck_id:""});}
    setSaving(false);
  };

  const startEditCustomer=c=>{setEditingCid(c.id);setEditCust({...c});};
  const cancelEditCustomer=()=>{setEditingCid(null);setEditCust({});};
  const saveEditCustomer=async()=>{
    setSaving(true);
    const{id,...fields}=editCust;
    const update={name:fields.name,address:fields.address||"",phone:fields.phone||"",email:fields.email||"",notes:fields.notes||"",truck_id:fields.truck_id||null};
    const{error}=await supabase.from("customers").update(update).eq("id",id);
    if(error)showToast(error.message,"error");
    else{setCustomers(prev=>prev.map(c=>c.id===id?{...c,...update}:c));showToast("Customer updated");setEditingCid(null);}
    setSaving(false);
  };

  // ── LOAD / SALE / RETURN ───────────────────────────────────────────────────
  const openLoad=tid=>{if(activeLoad(tid))return showToast("Truck already has active load","error");setSelTruck(tid);setFormItems(products.map(p=>({pid:p.id,qty:0})));setModal("load");};
  const confirmLoad=async()=>{
    const items=formItems.filter(i=>i.qty>0);if(!items.length)return;
    for(const i of items){const p=getP(i.pid);if(i.qty>p.shelf)return showToast(`Not enough: ${p.name}`,"error");}
    setSaving(true);
    try{
      const load={id:"LD-"+uid(),truck_id:selTruck,date:nowStr(),items,status:"out"};
      await supabase.from("loads").insert(load);
      for(const i of items)await supabase.from("products").update({shelf:getP(i.pid).shelf-i.qty}).eq("id",i.pid);
      setLoads(prev=>[load,...prev]);
      setProducts(prev=>prev.map(p=>{const fi=items.find(i=>i.pid===p.id);return fi?{...p,shelf:p.shelf-fi.qty}:p;}));
      showToast("Truck loaded");setModal(null);
    }catch(e){showToast(e.message,"error");}
    setSaving(false);
  };

  const openSale=tid=>{
    const load=activeLoad(tid);if(!load)return showToast("Load truck first","error");
    const inv=truckInv(tid);if(!inv.length)return showToast("No inventory on truck","error");
    const cl=customers.filter(c=>c.truck_id===tid);if(!cl.length)return showToast("No customers for this truck","error");
    setSelTruck(tid);setSelLoad(load);setFormItems(inv.map(i=>({pid:i.pid,qty:0,max:i.remaining})));setSelCust(cl[0].id);setModal("sale");
  };
  const confirmSale=async()=>{
    const items=formItems.filter(i=>i.qty>0);if(!items.length)return;
    setSaving(true);
    try{
      const total=items.reduce((a,i)=>a+(getP(i.pid).price*i.qty),0);
      const profit=items.reduce((a,i)=>{const p=getP(i.pid);return a+(p.price-p.cost)*i.qty;},0);
      // Get next invoice number from Supabase sequence
      const {data:seqData} = await supabase.rpc("next_invoice_number");
      const invId = "INV-" + String(seqData||1).padStart(4,"0");
      const ns={id:invId,load_id:selLoad.id,truck_id:selTruck,cust_id:selCust,date:nowStr(),items,total,profit};
      await supabase.from("sales").insert(ns);
      await supabase.from("payments").insert({sale_id:ns.id,status:"unpaid"});
      setSales(prev=>[ns,...prev]);setPayments(prev=>[...prev,{sale_id:ns.id,status:"unpaid"}]);
      showToast("Sale recorded");setModal(null);setTimeout(()=>{setViewSale(ns);setModal("invoice");},80);
    }catch(e){showToast(e.message,"error");}
    setSaving(false);
  };

  const openReturn=tid=>{
    const load=activeLoad(tid);if(!load)return showToast("No active load","error");
    const inv=truckInv(tid).filter(i=>i.remaining>0);if(!inv.length)return showToast("Nothing to return","error");
    setSelTruck(tid);setSelLoad(load);setFormItems(inv.map(i=>({pid:i.pid,qty:0,max:i.remaining})));setModal("return");
  };
  const confirmReturn=async()=>{
    const items=formItems.filter(i=>i.qty>0);if(!items.length)return;
    setSaving(true);
    try{
      const rec={id:"RT-"+uid(),load_id:selLoad.id,truck_id:selTruck,date:nowStr(),items};
      await supabase.from("returns").insert(rec);
      for(const i of items)await supabase.from("products").update({shelf:getP(i.pid).shelf+i.qty}).eq("id",i.pid);
      const inv=truckInv(selTruck);const remAfter=inv.reduce((a,i)=>a+i.remaining,0)-items.reduce((a,i)=>a+i.qty,0);
      if(remAfter<=0)await supabase.from("loads").update({status:"closed"}).eq("id",selLoad.id);
      setReturns(prev=>[rec,...prev]);setProducts(prev=>prev.map(p=>{const fi=items.find(i=>i.pid===p.id);return fi?{...p,shelf:p.shelf+fi.qty}:p;}));
      if(remAfter<=0)setLoads(prev=>prev.map(l=>l.id===selLoad.id?{...l,status:"closed"}:l));
      showToast("Stock returned");setModal(null);
    }catch(e){showToast(e.message,"error");}
    setSaving(false);
  };

  // ── PAYMENTS ───────────────────────────────────────────────────────────────
  // ── PAYMENT STATE ──────────────────────────────────────────────────────────
  const[paymentsLog,setPaymentsLog]=useState([]);
  const[pmModal,setPmModal]=useState(false);
  const[pmForm,setPmForm]=useState({method:"cash",amount:"",check_number:"",bank_name:"",note:"",cust_id:"",truck_id:"",invoice_ids:[]});
  const[pmTab,setPmTab]=useState("log"); // "log" | "collect"

  // Load payments log
  useEffect(()=>{
    if(authReady&&session&&profile){
      supabase.from("payments_log").select("*").order("created_at",{ascending:false}).then(({data})=>{if(data)setPaymentsLog(data);});
    }
  },[authReady,session,profile]);

  const markPaid=async(sid,method="cash",amount=0,checkNum="",note="",collectedBy="")=>{
    const ex=pmtFor(sid);
    const sale=sales.find(s=>s.id===sid);
    const gt=sale?sale.total*(1+taxRate/100):0;
    const paidAmt=amount||gt;
    if(ex)await supabase.from("payments").update({status:"paid",method,amount:paidAmt,check_number:checkNum,note,collected_by:collectedBy,paid_at:new Date().toISOString()}).eq("sale_id",sid);
    else await supabase.from("payments").insert({sale_id:sid,status:"paid",method,amount:paidAmt,check_number:checkNum,note,collected_by:collectedBy,paid_at:new Date().toISOString()});
    setPayments(prev=>prev.map(p=>p.sale_id===sid?{...p,status:"paid",method,amount:paidAmt}:p));
    showToast("Payment recorded ✓");
  };
  const markUnpaid=async sid=>{await supabase.from("payments").update({status:"unpaid",paid_at:null}).eq("sale_id",sid);setPayments(prev=>prev.map(p=>p.sale_id===sid?{...p,status:"unpaid"}:p));showToast("Marked unpaid");};

  const deleteInvoice=async sid=>{
    if(!window.confirm(`Delete invoice ${sid} and all linked payments and orders? This cannot be undone.`)) return;
    try{
      // Delete from payments table
      await supabase.from("payments").delete().eq("sale_id",sid);
      // Delete from payments_log where invoice is linked
      await supabase.from("payments_log").delete().contains("invoice_ids",[sid]);
      // Delete linked orders (where this invoice ID was created from)
      const orderId="ORD-"+sid.replace("INV-","");
      await supabase.from("orders").delete().eq("id",orderId);
      // Delete the sale itself
      await supabase.from("sales").delete().eq("id",sid);
      // Update local state
      setSales(prev=>prev.filter(s=>s.id!==sid));
      setPayments(prev=>prev.filter(p=>p.sale_id!==sid));
      setPaymentsLog(prev=>prev.filter(p=>!(p.invoice_ids||[]).includes(sid)));
      setOrders(prev=>prev.filter(o=>o.id!==orderId));
      showToast(`Invoice ${sid} and linked records deleted`);
    }catch(e){
      showToast("Error deleting: "+e.message,"error");
    }
  };

  // ── CARD SURCHARGE ─────────────────────────────────────────────────────────
  const CARD_FEE_PCT = 3; // 3% surcharge on credit & debit cards only
  const cardMethods = ["credit_card","debit_card"];
  const hasSurcharge = m => cardMethods.includes(m);
  const calcSurcharge = (amount, method) => hasSurcharge(method) ? parseFloat((parseFloat(amount||0) * CARD_FEE_PCT/100).toFixed(2)) : 0;
  const pmSurcharge = useMemo(()=>calcSurcharge(pmForm.amount, pmForm.method),[pmForm.amount, pmForm.method]);
  const pmTotal = useMemo(()=>(parseFloat(pmForm.amount||0) + pmSurcharge).toFixed(2),[pmForm.amount, pmSurcharge]);

  const recordPayment=async()=>{
    if(!pmForm.amount||!pmForm.cust_id)return showToast("Amount and customer required","error");
    if((pmForm.method==="check"||pmForm.method==="money_order")&&!pmForm.check_number)return showToast("Check/MO number required","error");
    setSaving(true);
    try{
      const truck=trucks.find(t=>t.id===pmForm.truck_id);
      const base=parseFloat(pmForm.amount);
      const surcharge=calcSurcharge(base,pmForm.method);
      const totalCollected=parseFloat((base+surcharge).toFixed(2));
      const surchargeNote=surcharge>0?` | Card surcharge $${surcharge.toFixed(2)} (${CARD_FEE_PCT}%)`:"";
      const rec={
        id:"PMT-"+uid(),
        truck_id:pmForm.truck_id||null,
        cust_id:pmForm.cust_id,
        collected_by:truck?.driver||profile?.full_name||"Admin",
        method:pmForm.method,
        amount:totalCollected,
        check_number:pmForm.check_number||"",
        bank_name:pmForm.bank_name||"",
        note:(pmForm.note||"")+surchargeNote,
        invoice_ids:pmForm.invoice_ids,
        date:nowStr(),
        created_at:new Date().toISOString(),
      };
      await supabase.from("payments_log").insert(rec);
      for(const sid of pmForm.invoice_ids){
        await markPaid(sid,pmForm.method,totalCollected,pmForm.check_number,rec.note,rec.collected_by);
      }
      setPaymentsLog(prev=>[rec,...prev]);
      showToast(`${methodIcon(pmForm.method)} $${totalCollected.toFixed(2)} recorded${surcharge>0?` (incl. $${surcharge.toFixed(2)} card fee)`:""}`);
      setPmModal(false);
      setPmForm({method:"cash",amount:"",check_number:"",bank_name:"",note:"",cust_id:"",truck_id:"",invoice_ids:[]});
    }catch(e){showToast(e.message,"error");}
    setSaving(false);
  };

  const methodIcon=m=>({cash:"💵",check:"🏦",money_order:"📋",credit_card:"💳",debit_card:"🏧",zelle:"📱"}[m]||"💳");
  const methodLabel=m=>({cash:"Cash",check:"Check",money_order:"Money Order",credit_card:"Credit Card",debit_card:"Debit Card",zelle:"Zelle/Transfer"}[m]||m);

  const exportPayments=()=>{
    const rows=[["ID","Date","Customer","Driver","Method","Amount","Check#","Bank","Invoices","Note"]];
    paymentsLog.forEach(p=>{rows.push([p.id,p.date,getC(p.cust_id)?.name,p.collected_by,methodLabel(p.method),p.amount.toFixed(2),p.check_number,p.bank_name,(p.invoice_ids||[]).join(";"),p.note]);});
    downloadCSV(rows,"payments.csv");
  };

  // ── ORDERS ─────────────────────────────────────────────────────────────────
  // Auto-process new approved orders into invoices
  useEffect(()=>{
    const autoProcess = async () => {
      const newOrders = orders.filter(o=>o.status==="approved"&&!sales.some(s=>s.id==="INV-"+o.id.replace("ORD-","")));
      for(const order of newOrders){
        try{
          const truckId=customers.find(c=>c.id===order.cust_id)?.truck_id||trucks[0]?.id;
          if(!truckId) continue;
          let loadId=activeLoad(truckId)?.id;
          if(!loadId){
            const nl={id:"LD-"+uid(),truck_id:truckId,date:nowStr(),items:order.items,status:"out"};
            await supabase.from("loads").insert(nl);
            setLoads(prev=>[nl,...prev]);
            loadId=nl.id;
          }
          const profit=order.items.reduce((a,i)=>{const p=getP(i.pid);return a+((p?.price||0)-(p?.cost||0))*i.qty;},0);
          const ns={id:"INV-"+order.id.replace("ORD-",""),load_id:loadId,truck_id:truckId,cust_id:order.cust_id,date:nowStr(),items:order.items,total:order.subtotal,profit};
          const pmtStatus=order.payment_method==="card"?"paid":"unpaid";
          await supabase.from("sales").insert(ns);
          await supabase.from("payments").insert({sale_id:ns.id,status:pmtStatus,method:order.payment_method||"cash"});
          setSales(prev=>[ns,...prev]);
          setPayments(prev=>[...prev,{sale_id:ns.id,status:pmtStatus}]);
        }catch(e){console.error("Auto-process error:",e);}
      }
    };
    if(orders.length&&customers.length&&trucks.length) autoProcess();
  },[orders]);

  // ── SETTINGS ───────────────────────────────────────────────────────────────
  const saveSettings=async()=>{
    setSaving(true);
    const{error}=await supabase.from("company").update(coEdit).eq("id",co.id);
    if(error)showToast(error.message,"error");
    else{setCo(coEdit);showToast("Settings saved");setModal(null);}
    setSaving(false);
  };

  // ── CAMERA BARCODE SCANNER ─────────────────────────────────────────────────
  useEffect(()=>{
    if(!scanning) return;
    let scanner = null;

    const startScanner = async () => {
      // Load html5-qrcode from CDN if not already loaded
      if(!window.Html5Qrcode){
        await new Promise((resolve,reject)=>{
          const s=document.createElement("script");
          s.src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";
          s.onload=resolve; s.onerror=reject;
          document.head.appendChild(s);
        });
      }
      try{
        scanner = new window.Html5Qrcode("qr-reader");
        await scanner.start(
          {facingMode:"environment"}, // use back camera
          {fps:10, qrbox:{width:250,height:150}},
          (decodedText)=>{
            handleScan(decodedText);
          },
          ()=>{} // ignore errors during scanning
        );
      }catch(e){
        setScanMsg({type:"error", text:"Camera not available — use manual SKU entry below"});
      }
    };

    setTimeout(startScanner, 300);

    return ()=>{
      if(scanner){
        scanner.stop().catch(()=>{});
      }
    };
  },[scanning]);

  const handleLogout=async()=>{await supabase.auth.signOut();};
  const handleScan = (barcode) => {
    if(!barcode.trim()) return;
    const code = barcode.trim().toLowerCase();
    // Match against SKU or product ID on truck
    const match = formItems.find(fi=>{
      const p = getP(fi.pid);
      return p && (
        p.sku?.toLowerCase()===code ||
        p.id?.toLowerCase()===code ||
        p.sku?.toLowerCase().includes(code) ||
        code.includes(p.sku?.toLowerCase()||"___")
      );
    });
    if(match){
      const p = getP(match.pid);
      setFormItems(prev=>prev.map(fi=>
        fi.pid===match.pid ? {...fi, qty:Math.min(fi.max, fi.qty+1)} : fi
      ));
      setScanMsg({type:"success", text:`✓ ${p.name} — qty updated`});
    } else {
      setScanMsg({type:"error", text:`❌ No product found for: ${barcode}`});
    }
    setScanInput("");
    setTimeout(()=>setScanMsg(null), 2500);
  };

  // CSV
  const exportInvoices=()=>{const rows=[["Invoice","Date","Customer","Driver","Subtotal","Tax","Total","Profit","Status"]];visSales.forEach(s=>{const gt=s.total*(1+taxRate/100);rows.push([s.id,s.date,getC(s.cust_id)?.name,getT(s.truck_id)?.driver,s.total.toFixed(2),(s.total*taxRate/100).toFixed(2),gt.toFixed(2),s.profit.toFixed(2),pmtFor(s.id)?.status==="paid"?"Paid":"Unpaid"]);});downloadCSV(rows,"invoices.csv");};
  const exportAR=()=>{const rows=[["Invoice","Customer","Driver","Total","Balance","Status"]];visSales.forEach(s=>{const gt=s.total*(1+taxRate/100);rows.push([s.id,getC(s.cust_id)?.name,getT(s.truck_id)?.driver,gt.toFixed(2),pmtFor(s.id)?.status==="paid"?"0.00":gt.toFixed(2),pmtFor(s.id)?.status==="paid"?"Paid":"Unpaid"]);});downloadCSV(rows,"ar.csv");};
  const exportPL=()=>{const rows=[["Metric","Value"],["Revenue",totalRevenue.toFixed(2)],["Tax",totalTax.toFixed(2)],["COGS",(totalRevenue-totalProfit).toFixed(2)],["Gross Profit",totalProfit.toFixed(2)],["Margin %",totalRevenue>0?((totalProfit/totalRevenue)*100).toFixed(1)+"%":"0%"],["AR Outstanding",totalAR.toFixed(2)]];downloadCSV(rows,"pl.csv");};

  // NAV
  const navItems=[
    {id:"dashboard",label:"Dashboard",icon:ic.dash},
    {id:"warehouse",label:"Warehouse",icon:ic.box},
    {id:"trucks",label:"Trucks",icon:ic.truck},
    {id:"orders",label:"Orders",icon:ic.orders,badge:orders.filter(o=>o.payment_method!=="card"&&o.status==="approved").length||0},
    {id:"sales",label:"Sales & Invoices",icon:ic.inv},
    {id:"ar",label:"Accounts Receivable",icon:ic.ar},
    {id:"payments",label:"Payments",icon:ic.settle,badge:visSales.filter(s=>pmtFor(s.id)?.status!=="paid").length||0},
    {id:"settlement",label:"Daily Settlement",icon:ic.settle},
    ...(isAdmin?[{id:"pl",label:"P&L Report",icon:ic.pl}]:[]),
    {id:"customers",label:"Customers",icon:ic.users},
    ...(isAdmin?[{id:"settings",label:"Settings",icon:ic.gear}]:[]),
  ];

  // Guards
  if(!authReady)return<div className="app"><GS/><Spinner msg="STARTING UP…"/></div>;
  if(!session)return<div className="app"><GS/><Login/></div>;
  if(loading)return<div className="app"><GS/><Spinner msg="LOADING YOUR DATA…"/></div>;

  // ── ACCESS CONTROL ─────────────────────────────────────────────────────────
  // Only admins can access this dashboard — drivers & others go to order portal
  if(profile&&profile.role!=="admin"){
    return(
      <div className="app" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f5f5",padding:20}}>
        <GS/>
        <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
          <div style={{width:70,height:70,background:"#fef2f2",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 20px"}}>🚫</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:22,color:"#212121",marginBottom:8}}>ACCESS RESTRICTED</div>
          <div style={{fontSize:13,color:"#6b7280",lineHeight:1.7,marginBottom:24}}>
            This dashboard is for administrators only.<br/>
            Drivers and customers please use the order portal.
          </div>
          <a href="/order" style={{display:"inline-block",background:"#7c3aed",color:"#fff",padding:"12px 28px",borderRadius:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,textDecoration:"none",letterSpacing:".05em",marginBottom:12}}>
            🚚 Go to Driver / Customer Portal →
          </a>
          <div style={{marginTop:12}}>
            <button onClick={()=>supabase.auth.signOut()} style={{background:"none",border:"1px solid #e5e7eb",borderRadius:8,padding:"8px 16px",fontSize:12,color:"#6b7280",cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── INLINE EDIT HELPERS ────────────────────────────────────────────────────
  const EI=({val,onChange,type="text",style={}})=><input className="ei" type={type} value={val} onChange={e=>onChange(e.target.value)} style={style}/>;
  const ES=({val,onChange,options})=><select className="ei" value={val} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select>;

  return(
    <div className="app">
      <GS/>
      {toast&&<div style={{position:"fixed",bottom:22,right:22,zIndex:999,background:toast.type==="error"?"#1a0c0c":"#0a1e14",border:`1px solid ${toast.type==="error"?"#401414":"#143020"}`,color:toast.type==="error"?"#dc2626":"#059669",padding:"10px 18px",borderRadius:9,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,letterSpacing:".05em",boxShadow:"0 4px 20px #00000060"}}>{toast.msg}</div>}

      <div style={{display:"flex",minHeight:"100vh"}}>

        {/* SIDEBAR */}
        <div className="no-print" style={{width:222,background:"#ebebeb",borderRight:"1px solid #d1d5db",display:"flex",flexDirection:"column",padding:"0 8px",flexShrink:0}}>
          <div style={{padding:"10px 8px 6px"}}>
            <div style={{background:"#fff",borderRadius:12,padding:6}}>
              <img src="/logo-sidebar.png" style={{width:"100%",display:"block",borderRadius:8}}/>
            </div>
          </div>
          <div style={{height:1,background:"#d1d5db",margin:"0 0 6px"}}/>
          <div style={{padding:"7px 10px",marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:isAdmin?"#f5f3ff":"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{isAdmin?"👑":"🚚"}</div>
              <div><div style={{fontSize:10,color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:130}}>{session.user.email}</div><span className={`bdg ${isAdmin?"badm":"bb2"}`} style={{fontSize:9}}>{isAdmin?"ADMIN":"DRIVER"}</span></div>
            </div>
          </div>
          <div style={{height:1,background:"#d1d5db",marginBottom:6}}/>
          <div style={{display:"flex",flexDirection:"column",gap:1,flex:1}}>
            {navItems.map(n=>(
              <button key={n.id} className={`ni${tab===n.id?" act":""}`} onClick={()=>setTab(n.id)} style={{position:"relative"}}>
                {n.icon}{n.label}
                {n.badge>0&&<span style={{marginLeft:"auto",background:"#7c3aed",color:"#fff",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif"}}>{n.badge}</span>}
              </button>
            ))}
          </div>
          <div style={{padding:"8px 8px 14px"}}>
            <div style={{height:1,background:"#d1d5db",marginBottom:8}}/>
            <div style={{fontSize:9,color:"#9ca3af",letterSpacing:".1em",marginBottom:5,paddingLeft:3}}>{isAdmin?"COMPANY":"MY"} TOTALS</div>
            {[{l:"Revenue",v:fmt(totalRevenue),c:"#059669"},{l:"Profit",v:fmt(totalProfit),c:"#7c3aed"},{l:"AR Due",v:fmt(totalAR),c:"#dc2626"}].map(k=>(
              <div key={k.l} style={{display:"flex",justifyContent:"space-between",padding:"2px 3px"}}><span style={{fontSize:10,color:"#9ca3af"}}>{k.l}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:k.c}}>{k.v}</span></div>
            ))}
            <button className="btn bgh" style={{width:"100%",justifyContent:"center",marginTop:10,fontSize:11}} onClick={handleLogout}>{ic.logout} Sign Out</button>
          </div>
        </div>

        {/* MAIN */}
        <div style={{flex:1,overflow:"auto"}}>
          <div className="no-print" style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"0 24px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 4px #00000008"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,textTransform:"uppercase",letterSpacing:".05em",color:"#212121"}}>
              {navItems.find(n=>n.id===tab)?.label}
              {!isAdmin&&visTrucks[0]&&<span style={{fontFamily:"'Barlow',sans-serif",fontWeight:400,fontSize:11,color:"#6b7280",marginLeft:10,textTransform:"none"}}>— {visTrucks[0].driver}</span>}
            </div>
            <div style={{display:"flex",gap:7}}>
              {isAdmin&&<button className="btn bb" onClick={()=>{setRsPid(products[0]?.id||"");setRsQty("");setModal("restock");}}>{ic.plus} Restock</button>}
              <button className="btn ba" onClick={()=>{const tid=isAdmin?trucks[0]?.id:myTruckId;if(tid)openLoad(tid);}}>{ic.truck} Load Truck</button>
              <button className="btn bgh" style={{fontSize:11}} onClick={loadAll} title="Refresh">↻</button>
            </div>
          </div>

          <div style={{padding:"20px 24px"}}>

          {/* ══ DASHBOARD ══ */}
          {tab==="dashboard"&&<div className="fu">
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
              {[{l:"Revenue",v:fmt(totalRevenue),c:"#059669",s:`${visSales.length} invoices`},{l:"Gross Profit",v:fmt(totalProfit),c:"#7c3aed",s:totalRevenue>0?`${((totalProfit/totalRevenue)*100).toFixed(1)}% margin`:"—"},{l:"Tax Collected",v:fmt(totalTax),c:"#7c3aed",s:`${taxRate}%`},{l:"AR Outstanding",v:fmt(totalAR),c:"#dc2626",s:"unpaid"}].map(k=>(
                <div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div><div style={{fontSize:10,color:"#9ca3af",marginTop:4}}>{k.s}</div></div>
              ))}
            </div>
            {orders.filter(o=>o.status==="pending").length>0&&(
              <div style={{background:"#1e1400",border:"1px solid #7c3aed40",borderRadius:10,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>📦</span><div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:"#7c3aed"}}>{orders.filter(o=>o.status==="pending").length} PENDING ORDER{orders.filter(o=>o.status==="pending").length!==1?"S":""}</div><div style={{fontSize:11,color:"#4a3a20"}}>Waiting for your approval</div></div></div>
                <button className="btn ba" onClick={()=>setTab("orders")}>{ic.orders} Review Orders</button>
              </div>
            )}
            <div className="card" style={{padding:18,marginBottom:16}}>
              <div className="sh">📦 Inventory Flow</div>
              <div style={{display:"flex",alignItems:"stretch"}}>
                {[{l:"WAREHOUSE",e:"🏭",c:"#7c3aed",items:products.slice(0,5).map(p=>({n:p.name,v:p.shelf+" units"}))},null,{l:"ON TRUCKS",e:"🚚",c:"#7c3aed",items:visTrucks.map(t=>({n:t.driver,v:truckInv(t.id).reduce((a,i)=>a+i.remaining,0)+" units"}))},null,{l:"SOLD",e:"⛽",c:"#059669",items:visCustomers.filter(c=>visSales.some(s=>s.cust_id===c.id)).slice(0,5).map(c=>({n:c.name,v:fmt(visSales.filter(s=>s.cust_id===c.id).reduce((a,s)=>a+s.total,0))}))}].map((nd,i)=>{
                  if(!nd)return<div key={i} style={{color:"#7c3aed",display:"flex",alignItems:"center",padding:"0 8px",flexShrink:0}}>{ic.arr}</div>;
                  return(<div key={i} style={{flex:1,background:"#f9fafb",border:`1px solid ${nd.c}28`,borderRadius:10,padding:"12px 14px",textAlign:"center"}}><div style={{fontSize:18,marginBottom:4}}>{nd.e}</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,color:nd.c,letterSpacing:".1em",marginBottom:8}}>{nd.l}</div>{nd.items.length===0?<div style={{fontSize:10,color:"#9ca3af"}}>No data</div>:nd.items.map((it,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",background:"#0a1420",borderRadius:5,padding:"3px 7px",marginBottom:3}}><span style={{fontSize:10,color:"#2a4060",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:90}}>{it.n}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:nd.c,flexShrink:0,marginLeft:6}}>{it.v}</span></div>)}</div>);
                })}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:16}}>
              {visTrucks.map(t=>{
                const load=activeLoad(t.id),inv=truckInv(t.id);
                const rem=inv.reduce((a,i)=>a+i.remaining,0),loaded=inv.reduce((a,i)=>a+i.loaded,0);
                const pct=loaded>0?Math.round(rem/loaded*100):0;
                const ts=visSales.filter(s=>s.truck_id===t.id);
                return(<div key={t.id} className="card" style={{padding:14}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#212121"}}>{t.driver}</div><div style={{fontSize:10,color:"#9ca3af"}}>{t.plate}{t.route&&` · ${t.route}`}</div></div><span className={`bdg ${load?"ba2":"bgr"}`}>{load?"ACTIVE":"IDLE"}</span></div>{load&&<><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:10,color:"#6b7280"}}>Inventory</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:"#7c3aed"}}>{rem}/{loaded}</span></div><div className="pb"><div className="pf" style={{width:`${pct}%`,background:"#7c3aed"}}/></div></>}<div style={{display:"flex",justifyContent:"space-between",marginTop:8}}><span style={{fontSize:10,color:"#6b7280"}}>Revenue</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#059669"}}>{fmt(ts.reduce((a,s)=>a+s.total,0))}</span></div><div style={{display:"flex",gap:5,marginTop:8}}>{!load?<button className="btn bb" style={{flex:1,justifyContent:"center"}} onClick={()=>openLoad(t.id)}>{ic.truck} Load</button>:<><button className="btn bg" style={{flex:1,justifyContent:"center"}} onClick={()=>openSale(t.id)}>{ic.inv} Sell</button><button className="btn bgh" style={{flex:1,justifyContent:"center"}} onClick={()=>openReturn(t.id)}>{ic.undo} Rtn</button></>}</div></div>);
              })}
            </div>
            <div className="card">
              <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div className="sh" style={{marginBottom:0}}>Recent Invoices</div><button className="btn bgh" onClick={()=>setTab("sales")}>View All</button></div>
              {visSales.length===0?<Empty icon="💳" msg="NO SALES YET"/>:(
                <div className="tw"><table><thead><tr><th>Invoice</th><th>Customer</th><th>Date</th><th>Total</th><th>+Tax</th><th>Grand Total</th><th>Status</th><th></th></tr></thead>
                <tbody>{visSales.slice(0,6).map(s=>(
                  <tr key={s.id}><td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed"}}>{s.id}</span></td><td style={{color:"#212121"}}>{getC(s.cust_id)?.name}</td><td style={{color:"#6b7280",fontSize:11}}>{s.date}</td><td>{fmt(s.total)}</td><td style={{color:"#7c3aed"}}>{fmt(s.total*taxRate/100)}</td><td><span className="bdg bg2">{fmt(s.total*(1+taxRate/100))}</span></td><td><span className={`bdg ${pmtFor(s.id)?.status==="paid"?"bg2":"br2"}`}>{pmtFor(s.id)?.status==="paid"?"PAID":"UNPAID"}</span></td><td><button className="btn bb" style={{fontSize:10,padding:"4px 9px"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{ic.prt}</button></td>
                </tr>))}</tbody></table></div>
              )}
            </div>
          </div>}

          {/* ══ WAREHOUSE ══ */}
          {tab==="warehouse"&&<div className="fu">
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              {isAdmin&&<><button className="btn ba" onClick={()=>setModal("addProduct")}>{ic.plus} Add Product</button><button className="btn bb" onClick={()=>{setRsPid(products[0]?.id||"");setRsQty("");setModal("restock");}}>{ic.box} Restock</button></>}
              {!isAdmin&&<div style={{fontSize:12,color:"#6b7280",padding:"8px 0"}}>📦 View only — contact admin to edit</div>}
              <div style={{marginLeft:"auto",fontSize:11,color:"#6b7280",padding:"8px 0"}}>{editingPid?<span style={{color:"#7c3aed"}}>✏️ Editing — click Save or Cancel</span>:isAdmin?"Click ✏️ on any row to edit":""}
              </div>
            </div>
            <div className="card">
              <div className="tw"><table>
                <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Unit</th><th>Cost</th><th>Sale Price</th><th>Margin</th><th>Shelf</th><th>Value</th><th>Status</th>{isAdmin&&<th>Actions</th>}</tr></thead>
                <tbody>{products.map(p=>{
                  const isEditing=editingPid===p.id;
                  const mg=p.price>0?((p.price-p.cost)/p.price*100).toFixed(0):0;
                  const pct=Math.min(100,Math.round(p.shelf/Math.max(p.shelf,50)*100));
                  if(isEditing) return(
                    <tr key={p.id} style={{background:"#0a1e14"}}>
                      <td><EI val={editProd.name} onChange={v=>setEditProd(x=>({...x,name:v}))}/></td>
                      <td><EI val={editProd.sku} onChange={v=>setEditProd(x=>({...x,sku:v}))}/></td>
                      <td><ES val={editProd.cat} onChange={v=>setEditProd(x=>({...x,cat:v}))} options={["Beverage","Tobacco","Snack","Health","Misc","Other"]}/></td>
                      <td><EI val={editProd.unit} onChange={v=>setEditProd(x=>({...x,unit:v}))}/></td>
                      <td><EI val={editProd.cost} onChange={v=>setEditProd(x=>({...x,cost:v}))} type="number"/></td>
                      <td><EI val={editProd.price} onChange={v=>setEditProd(x=>({...x,price:v}))} type="number"/></td>
                      <td style={{color:"#059669"}}>{editProd.price>0?((editProd.price-editProd.cost)/editProd.price*100).toFixed(0):0}%</td>
                      <td><EI val={editProd.shelf} onChange={v=>setEditProd(x=>({...x,shelf:v}))} type="number"/></td>
                      <td style={{color:"#059669"}}>{fmt((editProd.shelf||0)*(editProd.cost||0))}</td>
                      <td>—</td>
                      <td><div style={{display:"flex",gap:5}}><button className="btn bg" style={{fontSize:10,padding:"4px 9px"}} onClick={saveEditProduct} disabled={saving}>{ic.save} Save</button><button className="btn bgh" style={{fontSize:10,padding:"4px 9px"}} onClick={cancelEditProduct}>{ic.X}</button></div></td>
                    </tr>
                  );
                  return(
                    <tr key={p.id}>
                      <td style={{color:"#212121",fontWeight:600}}>{p.name}</td>
                      <td><code style={{fontSize:11,color:"#6b7280"}}>{p.sku}</code></td>
                      <td><span className="bdg bt">{p.cat}</span></td>
                      <td style={{fontSize:11,color:"#6b7280"}}>{p.unit}</td>
                      <td style={{color:"#6b7280"}}>{fmt(p.cost)}</td>
                      <td style={{color:"#212121",fontWeight:600}}>{fmt(p.price)}</td>
                      <td><span className="bdg bg2">{mg}%</span></td>
                      <td><div style={{display:"flex",alignItems:"center",gap:7}}><div className="pb" style={{width:50}}><div className="pf" style={{width:`${pct}%`,background:p.shelf===0?"#dc2626":p.shelf<20?"#7c3aed":"#059669"}}/></div><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14}}>{p.shelf}</span></div></td>
                      <td style={{color:"#059669",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{fmt(p.shelf*p.cost)}</td>
                      <td><span className={`bdg ${p.shelf===0?"br2":p.shelf<20?"ba2":"bg2"}`}>{p.shelf===0?"OUT":p.shelf<20?"LOW":"OK"}</span></td>
                      {isAdmin&&<td><button className="btn bgh" style={{fontSize:10,padding:"4px 9px"}} onClick={()=>startEditProduct(p)}>{ic.edit} Edit</button></td>}
                    </tr>
                  );
                })}</tbody>
              </table></div>
              <div style={{padding:"10px 16px",borderTop:"1px solid #e5e7eb",display:"flex",gap:20,flexWrap:"wrap"}}>
                <div><span style={{fontSize:11,color:"#6b7280"}}>{products.length} products · Cost: </span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#7c3aed"}}>{fmt(products.reduce((a,p)=>a+p.shelf*p.cost,0))}</span></div>
                <div><span style={{fontSize:11,color:"#6b7280"}}>Retail: </span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#059669"}}>{fmt(products.reduce((a,p)=>a+p.shelf*p.price,0))}</span></div>
              </div>
            </div>
          </div>}

          {/* ══ TRUCKS ══ */}
          {tab==="trucks"&&<div className="fu">
            {isAdmin&&<div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}><button className="btn ba" onClick={()=>setModal("addTruck")}>{ic.plus} Add Driver & Truck</button></div>}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {trucks.map(t=>{
                const load=activeLoad(t.id),inv=truckInv(t.id);
                const ts=visSales.filter(s=>s.truck_id===t.id),tr=returns.filter(r=>r.truck_id===t.id);
                const isEditingT=editingTid===t.id;
                // Show all products with their truck quantity (0 if not loaded)
                const allProductsOnTruck = products.map(p=>{
                  const invItem = inv.find(i=>i.pid===p.id);
                  return {
                    pid: p.id,
                    name: p.name,
                    loaded: invItem?.loaded||0,
                    remaining: invItem?.remaining||0,
                    sold: invItem?(invItem.loaded-invItem.remaining):0,
                  };
                }).filter(p=>p.loaded>0||load); // show loaded items, or all if on route
                return(
                  <div key={t.id} className="card" style={{padding:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:11}}>
                        <div style={{width:42,height:42,background:"#f5f3ff",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🚚</div>
                        {isEditingT?(
                          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                            <div><label>Driver</label><EI val={editTruck.driver} onChange={v=>setEditTruck(x=>({...x,driver:v}))}/></div>
                            <div><label>Plate</label><EI val={editTruck.plate} onChange={v=>setEditTruck(x=>({...x,plate:v}))}/></div>
                            <div><label>Route</label><EI val={editTruck.route} onChange={v=>setEditTruck(x=>({...x,route:v}))}/></div>
                            <div style={{display:"flex",gap:6,marginTop:16}}><button className="btn bg" onClick={saveEditTruck} disabled={saving}>{ic.save} Save</button><button className="btn bgh" onClick={()=>setEditingTid(null)}>{ic.X}</button></div>
                          </div>
                        ):(
                          <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:17,color:"#212121"}}>{t.driver}</div><div style={{fontSize:11,color:"#6b7280"}}>{t.plate}{t.route&&<> · <span style={{color:"#7c3aed"}}>{t.route}</span></>}</div></div>
                        )}
                      </div>
                      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                        <span className={`bdg ${load?"ba2 pu":"bgr"}`}>{load?"ON ROUTE":"IDLE"}</span>
                        {!load?<button className="btn ba" onClick={()=>openLoad(t.id)}>{ic.truck} Load</button>:<><button className="btn bg" onClick={()=>openSale(t.id)}>{ic.inv} Sell</button><button className="btn bgh" onClick={()=>openReturn(t.id)}>{ic.undo} Return</button></>}
                        <button className="btn bp" onClick={()=>{setViewTruck(t.id);setModal("settlement");}}>{ic.settle} Settlement</button>
                        {isAdmin&&!isEditingT&&<button className="btn bgh" onClick={()=>startEditTruck(t)}>{ic.edit} Edit</button>}
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {/* Inventory */}
                      <div className="cin" style={{padding:12}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#7c3aed",letterSpacing:".08em",marginBottom:8}}>
                          TRUCK INVENTORY {load?<span style={{color:"#f59e0b"}}>● ACTIVE</span>:<span style={{color:"#9ca3af"}}>● NOT LOADED</span>}
                        </div>
                        {products.map(p=>{
                          const invItem=inv.find(i=>i.pid===p.id);
                          const loaded=invItem?.loaded||0;
                          const remaining=invItem?.remaining||0;
                          const pct=loaded>0?Math.round(remaining/loaded*100):0;
                          return(
                            <div key={p.id} style={{marginBottom:8,opacity:loaded===0?0.5:1}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                                <span style={{fontSize:11,color:"#6b7280"}}>{p.name}</span>
                                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:loaded===0?"#9ca3af":remaining===0?"#dc2626":"#212121"}}>
                                  {remaining}<span style={{color:"#9ca3af",fontWeight:400}}>/{loaded}</span>
                                </span>
                              </div>
                              {loaded>0?(
                                <div className="pb"><div className="pf" style={{width:`${pct}%`,background:pct<25?"#dc2626":pct<60?"#7c3aed":"#059669"}}/></div>
                              ):(
                                <div style={{height:4,background:"#f3f4f6",borderRadius:2}}/>
                              )}
                              {loaded>0&&<div style={{fontSize:9,color:"#9ca3af",marginTop:1}}>{invItem?.loaded-invItem?.remaining||0} sold · {remaining} remaining</div>}
                            </div>
                          );
                        })}
                      </div>
                      {/* Stats */}
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {[{l:"Revenue",v:fmt(ts.reduce((a,s)=>a+s.total,0)),c:"#059669"},{l:"Profit",v:fmt(ts.reduce((a,s)=>a+s.profit,0)),c:"#7c3aed"},{l:"Tax",v:fmt(ts.reduce((a,s)=>a+s.total*taxRate/100,0)),c:"#7c3aed"},{l:"Invoices",v:ts.length,c:"#7c3aed"},{l:"Returns",v:tr.reduce((a,r)=>a+(r.items||[]).reduce((b,i)=>b+i.qty,0),0)+" units",c:"#dc2626"}].map(k=>(
                          <div key={k.l} className="cin" style={{padding:"7px 11px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:10,color:"#6b7280"}}>{k.l}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:k.c}}>{k.v}</span></div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>}

          {/* ══ ORDERS ══ */}
          {tab==="orders"&&<div className="fu">
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
              {[{l:"Total Orders",v:orders.length,c:"#7c3aed"},{l:"💳 Paid Online",v:orders.filter(o=>o.payment_method==="card").length,c:"#059669"},{l:"💵 Pay on Delivery",v:orders.filter(o=>o.payment_method!=="card").length,c:"#f59e0b"}].map(k=>(
                <div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>
              ))}
            </div>
            <div style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:12,color:"#065f46",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>✅</span>
              <span><strong>Auto-approved:</strong> All orders are processed instantly. Invoices created automatically.</span>
            </div>
            <div style={{display:"flex",gap:7,marginBottom:14}}>
              {[{k:"all",l:"All Orders"},{k:"card",l:"💳 Paid Online"},{k:"delivery",l:"💵 Pay on Delivery"}].map(f=>(
                <button key={f.k} className={`btn ${ordFilter===f.k?"ba":"bgh"}`} style={{padding:"6px 14px"}} onClick={()=>setOrdFilter(f.k)}>{f.l}</button>
              ))}
            </div>
            {orders.filter(o=>ordFilter==="all"||(ordFilter==="card"&&o.payment_method==="card")||(ordFilter==="delivery"&&o.payment_method!=="card")).length===0
              ?<Empty icon="📦" msg="NO ORDERS YET"/>
              :<div style={{display:"flex",flexDirection:"column",gap:12}}>
                {orders.filter(o=>ordFilter==="all"||(ordFilter==="card"&&o.payment_method==="card")||(ordFilter==="delivery"&&o.payment_method!=="card")).map(o=>{
                  const isPaid=o.payment_method==="card";
                  return(
                    <div key={o.id} className="card" style={{padding:18,borderLeft:`4px solid ${isPaid?"#7c3aed":"#f59e0b"}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                            <span className="tag" style={{background:"#f5f3ff",color:"#7c3aed"}}>{o.id}</span>
                            <span className={`bdg ${isPaid?"bg2":"ba2"}`}>{isPaid?"💳 PAID ONLINE":"💵 PAY ON DELIVERY"}</span>
                            <span className="bdg bg2">✓ AUTO-APPROVED</span>
                          </div>
                          <div style={{fontWeight:700,fontSize:15,color:"#212121"}}>{o.customer_name}</div>
                          {o.customer_address&&<div style={{fontSize:11,color:"#6b7280",marginTop:2}}>📍 {o.customer_address}</div>}
                          {o.customer_phone&&<div style={{fontSize:11,color:"#6b7280"}}>📞 {o.customer_phone}</div>}
                          <div style={{fontSize:11,color:"#6b7280",marginTop:3}}>{o.date} · {(o.items||[]).length} item{(o.items||[]).length!==1?"s":""}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#7c3aed"}}>{fmt(o.total)}</div>
                          <div style={{fontSize:11,color:"#6b7280"}}>{isPaid?"Charged to card":"Due on delivery"}</div>
                        </div>
                      </div>
                      <div className="cin" style={{padding:12}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".08em",marginBottom:8}}>ORDER ITEMS</div>
                        <div style={{display:"grid",gridTemplateColumns:"70px 90px 1fr 80px 70px 90px",gap:6,marginBottom:6}}>
                          {["Stock #","SKU","Product","Unit","Qty","Amount"].map(h=><div key={h} style={{fontSize:9,color:"#9ca3af",fontWeight:700}}>{h}</div>)}
                        </div>
                        {(o.items||[]).map((item,i)=>{
                          const p=getP(item.pid);
                          return(
                            <div key={i} style={{display:"grid",gridTemplateColumns:"70px 90px 1fr 80px 70px 90px",gap:6,padding:"6px 0",borderTop:"1px solid #e5e7eb"}}>
                              <div style={{fontSize:10,color:"#9ca3af",fontFamily:"monospace"}}>{p?.id||"—"}</div>
                              <div style={{fontSize:10,color:"#9ca3af",fontFamily:"monospace"}}>{p?.sku||"—"}</div>
                              <div style={{fontSize:12,color:"#212121",fontWeight:600}}>{p?.name||item.name}</div>
                              <div style={{fontSize:11,color:"#6b7280"}}>{p?.unit||"—"}</div>
                              <div style={{fontWeight:700,fontSize:14,color:"#7c3aed"}}>{item.qty}</div>
                              <div style={{fontWeight:700,fontSize:13,color:"#059669"}}>{fmt(item.qty*(p?.price||0))}</div>
                            </div>
                          );
                        })}
                      </div>
                      {o.notes&&<div style={{marginTop:8,fontSize:11,color:"#6b7280",fontStyle:"italic"}}>📝 {o.notes}</div>}
                    </div>
                  );
                })}
              </div>
            }
          </div>}

          {/* ══ SALES & INVOICES ══ */}
          {tab==="sales"&&<div className="fu">
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
              {[{l:"Revenue",v:fmt(totalRevenue),c:"#059669"},{l:`Tax ${taxRate}%`,v:fmt(totalTax),c:"#7c3aed"},{l:"Grand Total",v:fmt(totalRevenue*(1+taxRate/100)),c:"#7c3aed"},{l:"Profit",v:fmt(totalProfit),c:"#7c3aed"}].map(k=><div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>)}
            </div>
            <div style={{display:"flex",gap:7,marginBottom:14}}><button className="btn bpr" onClick={exportInvoices}>{ic.dl} Export CSV</button></div>
            <div className="card">
              <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#212121"}}>INVOICES — {visSales.length} TOTAL</div>
              {visSales.length===0?<Empty icon="📄" msg="NO INVOICES YET"/>:(
                <div className="tw"><table><thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Driver</th><th>Subtotal</th><th>Tax</th><th>Grand Total</th><th>Profit</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{visSales.map(s=>{const gt=s.total*(1+taxRate/100),pmt=pmtFor(s.id);return(
                  <tr key={s.id}><td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed"}}>{s.id}</span></td><td style={{color:"#6b7280",fontSize:11}}>{s.date}</td><td style={{color:"#212121"}}>{getC(s.cust_id)?.name}</td><td style={{color:"#6b7280"}}>{getT(s.truck_id)?.driver}</td><td>{fmt(s.total)}</td><td style={{color:"#7c3aed"}}>{fmt(s.total*taxRate/100)}</td><td><span className="bdg bb2">{fmt(gt)}</span></td><td style={{color:"#059669",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{fmt(s.profit)}</td><td><span className={`bdg ${pmt?.status==="paid"?"bg2":"br2"}`}>{pmt?.status==="paid"?"PAID":"UNPAID"}</span></td>
                  <td><div style={{display:"flex",gap:5}}><button className="btn bb" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{ic.prt} Invoice</button>{pmt?.status!=="paid"?<button className="btn bg" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>markPaid(s.id)}>{ic.chk} Pay</button>:<button className="btn bgh" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>markUnpaid(s.id)}>Undo</button>}{isAdmin&&<button className="btn br" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>deleteInvoice(s.id)}>{ic.X}</button>}</div></td>
                </tr>);})}
                </tbody></table></div>
              )}
            </div>
          </div>}

          {/* ══ AR ══ */}
          {tab==="ar"&&<div className="fu">
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
              {[{l:"Total Billed",v:fmt(visSales.reduce((a,s)=>a+s.total*(1+taxRate/100),0)),c:"#7c3aed"},{l:"Collected",v:fmt(visSales.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+s.total*(1+taxRate/100),0)),c:"#059669"},{l:"Outstanding",v:fmt(totalAR),c:"#dc2626"}].map(k=><div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>)}
            </div>
            <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap"}}>
              {["all","unpaid","paid"].map(f=><button key={f} className={`btn ${arFilter===f?"ba":"bgh"}`} style={{padding:"6px 14px",textTransform:"capitalize"}} onClick={()=>setArFilter(f)}>{f}</button>)}
              <button className="btn bpr" style={{marginLeft:"auto"}} onClick={exportAR}>{ic.dl} Export CSV</button>
            </div>
            <div className="card">
              {visSales.length===0?<Empty icon="📋" msg="NO TRANSACTIONS"/>:(()=>{
                const filtered=visSales.filter(s=>arFilter==="all"||(arFilter==="unpaid"&&pmtFor(s.id)?.status!=="paid")||(arFilter==="paid"&&pmtFor(s.id)?.status==="paid"));
                return filtered.length===0?<Empty icon="🔍" msg="NO RECORDS MATCH"/>:(
                  <div className="tw"><table><thead><tr><th>Invoice</th><th>Customer</th><th>Date</th><th>Driver</th><th>Grand Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>{filtered.map(s=>{const gt=s.total*(1+taxRate/100),pmt=pmtFor(s.id),paid=pmt?.status==="paid"?gt:0,due=gt-paid;return(
                    <tr key={s.id}><td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed"}}>{s.id}</span></td><td style={{color:"#212121",fontWeight:600}}>{getC(s.cust_id)?.name}</td><td style={{color:"#6b7280",fontSize:11}}>{s.date}</td><td style={{color:"#6b7280"}}>{getT(s.truck_id)?.driver}</td><td style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{fmt(gt)}</td><td style={{color:"#059669",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{fmt(paid)}</td><td><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:due>0?"#dc2626":"#059669"}}>{fmt(due)}</span></td><td><span className={`bdg ${pmt?.status==="paid"?"bg2":"br2"}`}>{pmt?.status==="paid"?"PAID":"UNPAID"}</span></td>
                    <td><div style={{display:"flex",gap:5}}>{pmt?.status!=="paid"?<button className="btn bg" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>markPaid(s.id)}>{ic.chk} Pay</button>:<button className="btn bgh" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>markUnpaid(s.id)}>Undo</button>}<button className="btn bb" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{ic.inv}</button>{isAdmin&&<button className="btn br" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>deleteInvoice(s.id)}>{ic.X}</button>}</div></td>
                  </tr>);})}
                  </tbody></table></div>
                );
              })()}
            </div>
          </div>}

          {/* ══ PAYMENTS ══ */}
          {tab==="payments"&&<div className="fu">
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
              {[
                {l:"Total Collected",   v:`$${paymentsLog.reduce((a,p)=>a+p.amount,0).toFixed(2)}`,         c:"#059669"},
                {l:"💵 Cash",           v:`$${paymentsLog.filter(p=>p.method==="cash").reduce((a,p)=>a+p.amount,0).toFixed(2)}`,          c:"#059669"},
                {l:"🏦 Checks & MO",   v:`$${paymentsLog.filter(p=>["check","money_order"].includes(p.method)).reduce((a,p)=>a+p.amount,0).toFixed(2)}`, c:"#7c3aed"},
                {l:"💳 Cards & Zelle", v:`$${paymentsLog.filter(p=>["credit_card","debit_card","zelle"].includes(p.method)).reduce((a,p)=>a+p.amount,0).toFixed(2)}`, c:"#0ea5e9"},
              ].map(k=><div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>)}
            </div>

            {/* Action bar */}
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
              <button className="btn ba" onClick={()=>setPmModal(true)}>💳 Record Payment</button>
              <button className="btn bpr" onClick={exportPayments}>{ic.dl} Export CSV</button>
              <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                {["log","unpaid"].map(t=>(
                  <button key={t} className={`btn ${pmTab===t?"ba":"bgh"}`} style={{padding:"6px 14px",textTransform:"capitalize"}} onClick={()=>setPmTab(t)}>{t==="log"?"All Payments":"Unpaid Invoices"}</button>
                ))}
              </div>
            </div>

            {/* Unpaid invoices list */}
            {pmTab==="unpaid"&&<div className="card">
              <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#212121"}}>
                UNPAID INVOICES — {visSales.filter(s=>pmtFor(s.id)?.status!=="paid").length}
              </div>
              {visSales.filter(s=>pmtFor(s.id)?.status!=="paid").length===0
                ?<Empty icon="✅" msg="ALL INVOICES PAID"/>
                :<div className="tw"><table><thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Driver</th><th>Grand Total</th><th>Balance Due</th><th>Actions</th></tr></thead>
                <tbody>{visSales.filter(s=>pmtFor(s.id)?.status!=="paid").map(s=>{
                  const gt=s.total*(1+taxRate/100);
                  const cust=getC(s.cust_id);
                  return(
                    <tr key={s.id}>
                      <td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed"}}>{s.id}</span></td>
                      <td style={{fontSize:11,color:"#6b7280"}}>{s.date}</td>
                      <td style={{fontWeight:600}}>{cust?.name}</td>
                      <td style={{color:"#6b7280"}}>{getT(s.truck_id)?.driver}</td>
                      <td style={{fontWeight:700}}>${gt.toFixed(2)}</td>
                      <td><span style={{fontWeight:700,color:"#dc2626"}}>${gt.toFixed(2)}</span></td>
                      <td>
                        <div style={{display:"flex",gap:4}}>
                          <button className="btn bg" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>{
                            setPmForm(f=>({...f,cust_id:s.cust_id,truck_id:s.truck_id,amount:gt.toFixed(2),invoice_ids:[s.id]}));
                            setPmModal(true);
                          }}>💵 Cash/Check</button>
                          <button className="btn bp" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>setStripeModal({sale:s,customer:getC(s.cust_id),driver:getT(s.truck_id)?.driver})}>💳 Card</button>
                          <button className="btn bb" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>View</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}</tbody></table></div>
              }
            </div>}

            {/* Payment log */}
            {pmTab==="log"&&<div className="card">
              <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#212121"}}>
                PAYMENT LOG — {paymentsLog.length} ENTRIES
              </div>
              {paymentsLog.length===0?<Empty icon="💳" msg="NO PAYMENTS RECORDED YET"/>:(
                <div className="tw"><table>
                  <thead><tr><th>ID</th><th>Date</th><th>Customer</th><th>Driver</th><th>Method</th><th>Amount</th><th>Ref #</th><th>Invoices</th><th>Note</th></tr></thead>
                  <tbody>{paymentsLog.map(p=>(
                    <tr key={p.id}>
                      <td><span className="tag" style={{background:"#f0fdf4",color:"#065f46"}}>{p.id}</span></td>
                      <td style={{fontSize:11,color:"#6b7280"}}>{p.date}</td>
                      <td style={{fontWeight:600}}>{getC(p.cust_id)?.name}</td>
                      <td style={{color:"#6b7280"}}>{p.collected_by}</td>
                      <td>
                        <span className={`bdg ${p.method==="cash"?"bg2":p.method==="check"?"bb2":"ba2"}`}>
                          {methodIcon(p.method)} {methodLabel(p.method)}
                        </span>
                      </td>
                      <td><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#059669"}}>${p.amount.toFixed(2)}</span></td>
                      <td style={{fontFamily:"monospace",fontSize:11,color:"#6b7280"}}>{p.check_number||"—"}{p.bank_name&&<div style={{fontSize:9,color:"#9ca3af"}}>{p.bank_name}</div>}</td>
                      <td style={{fontSize:11,color:"#7c3aed"}}>{(p.invoice_ids||[]).join(", ")||"—"}</td>
                      <td style={{fontSize:11,color:"#6b7280",fontStyle:p.note?"normal":"italic"}}>{p.note||"—"}</td>
                    </tr>
                  ))}</tbody>
                </table></div>
              )}
            </div>}
          </div>}

          {/* ── PAYMENT MODAL ── */}
          {pmModal&&<Modal title="💳 Record Payment" onClose={()=>setPmModal(false)} wide>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>

              {/* Method selector */}
              <div>
                <label>Payment Method</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:6}}>
                  {[
                    {k:"cash",       l:"💵 Cash"},
                    {k:"check",      l:"🏦 Check"},
                    {k:"money_order",l:"📋 Money Order"},
                    {k:"credit_card",l:"💳 Credit Card"},
                    {k:"debit_card", l:"🏧 Debit Card"},
                    {k:"zelle",      l:"📱 Zelle / Transfer"},
                  ].map(m=>(
                    <button key={m.k} onClick={()=>setPmForm(f=>({...f,method:m.k}))}
                      style={{padding:"10px 8px",borderRadius:8,border:`2px solid ${pmForm.method===m.k?"#7c3aed":"#e5e7eb"}`,background:pmForm.method===m.k?"#f5f3ff":"#fff",color:pmForm.method===m.k?"#7c3aed":"#6b7280",fontWeight:pmForm.method===m.k?700:400,cursor:"pointer",fontSize:12,fontFamily:"'Barlow',sans-serif",transition:"all .15s",textAlign:"center"}}>
                      {m.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer + Driver */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><label>Customer *</label>
                  <select value={pmForm.cust_id} onChange={e=>setPmForm(f=>({...f,cust_id:e.target.value,invoice_ids:[]}))}>
                    <option value="">— Select Customer —</option>
                    {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label>Collected By (Driver)</label>
                  <select value={pmForm.truck_id} onChange={e=>setPmForm(f=>({...f,truck_id:e.target.value}))}>
                    <option value="">— Select Driver —</option>
                    {trucks.map(t=><option key={t.id} value={t.id}>{t.driver}</option>)}
                  </select>
                </div>
              </div>

              {/* Amount + Reference fields */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><label>Amount Received ($) *</label>
                  <input type="number" min="0" step="0.01" placeholder="0.00" value={pmForm.amount} onChange={e=>setPmForm(f=>({...f,amount:e.target.value}))}/>
                </div>
                {(pmForm.method==="check"||pmForm.method==="money_order")&&(
                  <div><label>{pmForm.method==="check"?"Check Number *":"Money Order Number *"}</label>
                    <input placeholder={pmForm.method==="check"?"e.g. 1042":"e.g. MO-8821"} value={pmForm.check_number} onChange={e=>setPmForm(f=>({...f,check_number:e.target.value}))}/>
                  </div>
                )}
                {(pmForm.method==="credit_card"||pmForm.method==="debit_card")&&(
                  <div><label>Last 4 Digits (optional)</label>
                    <input placeholder="e.g. 4242" maxLength={4} value={pmForm.check_number} onChange={e=>setPmForm(f=>({...f,check_number:e.target.value.replace(/\D/g,"").slice(0,4)}))}/>
                  </div>
                )}
                {pmForm.method==="zelle"&&(
                  <div><label>Transfer Reference / Phone</label>
                    <input placeholder="e.g. Zelle ref #12345 or phone" value={pmForm.check_number} onChange={e=>setPmForm(f=>({...f,check_number:e.target.value}))}/>
                  </div>
                )}
                {pmForm.method==="check"&&(
                  <div><label>Bank Name</label>
                    <input placeholder="e.g. Chase Bank" value={pmForm.bank_name} onChange={e=>setPmForm(f=>({...f,bank_name:e.target.value}))}/>
                  </div>
                )}
              </div>

              {/* Link to invoices */}
              {pmForm.cust_id&&(()=>{
                const custInvoices=visSales.filter(s=>s.cust_id===pmForm.cust_id&&pmtFor(s.id)?.status!=="paid");
                if(!custInvoices.length)return<div style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#065f46"}}>✅ All invoices for this customer are paid</div>;
                return(
                  <div>
                    <label>Apply to Invoices (select all that apply)</label>
                    <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:6,maxHeight:200,overflowY:"auto"}}>
                      {custInvoices.map(s=>{
                        const gt=s.total*(1+taxRate/100);
                        const isSelected=pmForm.invoice_ids.includes(s.id);
                        return(
                          <div key={s.id} onClick={()=>setPmForm(f=>({...f,invoice_ids:isSelected?f.invoice_ids.filter(x=>x!==s.id):[...f.invoice_ids,s.id]}))}
                            style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderRadius:8,border:`1.5px solid ${isSelected?"#7c3aed":"#e5e7eb"}`,background:isSelected?"#f5f3ff":"#fff",cursor:"pointer",transition:"all .15s"}}>
                            <div>
                              <div style={{fontWeight:600,fontSize:13,color:isSelected?"#7c3aed":"#111"}}>{s.id}</div>
                              <div style={{fontSize:11,color:"#6b7280"}}>{s.date}</div>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <span style={{fontWeight:700,color:"#dc2626"}}>${gt.toFixed(2)}</span>
                              <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${isSelected?"#7c3aed":"#d1d5db"}`,background:isSelected?"#7c3aed":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11}}>{isSelected?"✓":""}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {pmForm.invoice_ids.length>0&&(
                      <div style={{marginTop:8,fontSize:12,color:"#7c3aed",fontWeight:600}}>
                        {pmForm.invoice_ids.length} invoice{pmForm.invoice_ids.length!==1?"s":""} selected — Total due: ${custInvoices.filter(s=>pmForm.invoice_ids.includes(s.id)).reduce((a,s)=>a+s.total*(1+taxRate/100),0).toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Notes */}
              <div><label>Notes (optional)</label>
                <input placeholder="e.g. partial payment, split between cash and check..." value={pmForm.note} onChange={e=>setPmForm(f=>({...f,note:e.target.value}))}/>
              </div>

              {/* Surcharge summary */}
              {pmForm.amount&&<div style={{background:hasSurcharge(pmForm.method)?"#faf5ff":"#f0fdf4",border:`1px solid ${hasSurcharge(pmForm.method)?"#ddd6fe":"#a7f3d0"}`,borderRadius:9,padding:"12px 16px"}}>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#6b7280"}}>
                    <span>Invoice amount</span>
                    <span>${parseFloat(pmForm.amount||0).toFixed(2)}</span>
                  </div>
                  {hasSurcharge(pmForm.method)?(
                    <>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#7c3aed"}}>
                        <span>Card surcharge ({CARD_FEE_PCT}%) — charged to customer</span>
                        <span>+${pmSurcharge.toFixed(2)}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,borderTop:"1px solid #ddd6fe",paddingTop:6,color:"#212121"}}>
                        <span>Customer pays total</span>
                        <span style={{color:"#7c3aed"}}>${pmTotal}</span>
                      </div>
                    </>
                  ):(
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#059669"}}>
                      <span>✓ {methodLabel(pmForm.method)} — no surcharge</span>
                      <span>${parseFloat(pmForm.amount||0).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>}

              <div style={{height:1,background:"#f3f4f6"}}/>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button className="btn bgh" onClick={()=>setPmModal(false)}>Cancel</button>
                <button className="btn ba" onClick={recordPayment} disabled={saving}>{ic.chk} Record Payment</button>
              </div>
            </div>
          </Modal>}
          {tab==="settlement"&&<div className="fu">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
              {visTrucks.map(t=>{const d=settlementData(t.id),load=activeLoad(t.id);return(
                <div key={t.id} className="card" style={{padding:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#212121"}}>{t.driver}</div><div style={{fontSize:10,color:"#6b7280"}}>{t.route||t.plate}</div></div><span className={`bdg ${load?"ba2":"bgr"}`}>{load?"ACTIVE":"IDLE"}</span></div>
                  {[{l:"Loaded",v:d.loadedUnits,c:"#7c3aed"},{l:"Sold",v:d.soldUnits,c:"#059669"},{l:"Returned",v:d.retUnits,c:"#dc2626"},{l:"Variance",v:d.loadedUnits-d.soldUnits-d.retUnits,c:"#7c3aed"}].map(k=><div key={k.l} style={{display:"flex",justifyContent:"space-between",padding:"5px 9px",background:"#f9fafb",borderRadius:5,marginBottom:4}}><span style={{fontSize:10,color:"#6b7280"}}>{k.l}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:k.c}}>{k.v}</span></div>)}
                  <Divider/>
                  {[{l:"Revenue",v:fmt(d.rev),c:"#059669"},{l:"Tax",v:fmt(d.tax),c:"#7c3aed"},{l:"Profit",v:fmt(d.prof),c:"#7c3aed"},{l:"Collected",v:fmt(d.collected),c:"#059669"},{l:"Outstanding",v:fmt(d.outstanding),c:"#dc2626"}].map(k=><div key={k.l} style={{display:"flex",justifyContent:"space-between",padding:"5px 9px",background:"#f9fafb",borderRadius:5,marginBottom:4}}><span style={{fontSize:10,color:"#6b7280"}}>{k.l}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:k.c}}>{k.v}</span></div>)}
                  <button className="btn bp" style={{width:"100%",justifyContent:"center",marginTop:10}} onClick={()=>{setViewTruck(t.id);setModal("settlement");}}>{ic.prt} Full Report</button>
                </div>
              );})}
            </div>
          </div>}

          {/* ══ P&L ══ */}
          {tab==="pl"&&isAdmin&&<div className="fu">
            <div style={{display:"flex",gap:8,marginBottom:16}}><button className="btn bpr" onClick={()=>window.print()}>{ic.prt} Print</button><button className="btn bb" onClick={exportPL}>{ic.dl} Export CSV</button></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div className="card" style={{padding:22}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:19,color:"#212121",marginBottom:3}}>P&L STATEMENT</div>
                <div style={{fontSize:11,color:"#9ca3af",marginBottom:16}}>{co?.name} · {dateLabel()}</div>
                {[{s:"REVENUE",rows:[{l:"Gross Sales",v:fmt(totalRevenue),c:"#059669"},{l:`Tax (${taxRate}%)`,v:fmt(totalTax),c:"#7c3aed"},{l:"Total incl. Tax",v:fmt(totalRevenue*(1+taxRate/100)),c:"#7c3aed",b:true}]},{s:"COST & PROFIT",rows:[{l:"COGS",v:fmt(totalRevenue-totalProfit),c:"#dc2626"},{l:"Gross Profit",v:fmt(totalProfit),c:"#059669",b:true},{l:"Gross Margin",v:totalRevenue>0?`${((totalProfit/totalRevenue)*100).toFixed(1)}%`:"0%",c:"#7c3aed",b:true}]},{s:"INVENTORY",rows:[{l:"Shelf Value (cost)",v:fmt(products.reduce((a,p)=>a+p.shelf*p.cost,0)),c:"#6b7280"},{l:"Shelf Value (retail)",v:fmt(products.reduce((a,p)=>a+p.shelf*p.price,0)),c:"#059669"}]},{s:"RECEIVABLES",rows:[{l:"Total Invoiced",v:fmt(sales.reduce((a,s)=>a+s.total*(1+taxRate/100),0)),c:"#7c3aed"},{l:"Collected",v:fmt(sales.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+s.total*(1+taxRate/100),0)),c:"#059669"},{l:"Outstanding",v:fmt(totalAR),c:"#dc2626",b:true}]}].map(sec=>(
                  <div key={sec.s} style={{marginBottom:16}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:10,color:"#9ca3af",letterSpacing:".12em",marginBottom:6,paddingBottom:4,borderBottom:"1px solid #e5e7eb"}}>{sec.s}</div>
                  {sec.rows.map(row=><div key={row.l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #0a1420"}}><span style={{fontSize:12,color:row.b?"#a0b8d0":"#3a5870",fontWeight:row.b?600:400}}>{row.l}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:row.b?800:600,fontSize:row.b?16:14,color:row.c}}>{row.v}</span></div>)}
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:22}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:19,color:"#212121",marginBottom:16}}>DRIVER P&L</div>
                {trucks.map(t=>{const ts=sales.filter(s=>s.truck_id===t.id);const rev=ts.reduce((a,s)=>a+s.total,0),prof=ts.reduce((a,s)=>a+s.profit,0);const mg=rev>0?((prof/rev)*100).toFixed(1):0;return(<div key={t.id} style={{marginBottom:14,paddingBottom:14,borderBottom:"1px solid #e5e7eb"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:"#212121"}}>{t.driver}</span><span className="bdg bb2">{t.route||t.plate}</span></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>{[{l:"Revenue",v:fmt(rev),c:"#059669"},{l:"Profit",v:fmt(prof),c:"#7c3aed"},{l:"Margin",v:`${mg}%`,c:"#7c3aed"},{l:"Invoices",v:ts.length,c:"#7c3aed"}].map(k=><div key={k.l} style={{padding:"5px 8px",background:"#f9fafb",borderRadius:5}}><div style={{fontSize:9,color:"#9ca3af",letterSpacing:".08em"}}>{k.l}</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:k.c}}>{k.v}</div></div>)}</div></div>);})}
              </div>
            </div>
            <div className="card"><div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#212121"}}>PRODUCT BREAKDOWN</div>
            <div className="tw"><table><thead><tr><th>Product</th><th>Cat</th><th>Sold</th><th>Revenue</th><th>COGS</th><th>Profit</th><th>Margin</th><th>Shelf</th></tr></thead>
            <tbody>{products.map(p=>{const ps=sales.flatMap(s=>(s.items||[]).filter(i=>i.pid===p.id));const units=ps.reduce((a,i)=>a+i.qty,0),rev=units*p.price,cogs=units*p.cost,prof=rev-cogs;const mg=rev>0?((prof/rev)*100).toFixed(1):((p.price-p.cost)/p.price*100).toFixed(1);return(<tr key={p.id}><td style={{color:"#212121",fontWeight:600}}>{p.name}</td><td><span className="bdg bt">{p.cat}</span></td><td style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,color:"#6b7280"}}>{units}</td><td><span className="bdg bg2">{fmt(rev)}</span></td><td style={{color:"#dc2626"}}>{fmt(cogs)}</td><td style={{color:"#059669",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{fmt(prof)}</td><td><span className="bdg ba2">{mg}%</span></td><td style={{color:"#6b7280"}}>{p.shelf}</td></tr>);})}</tbody></table></div>
            </div>
          </div>}

          {/* ══ CUSTOMERS ══ */}
          {tab==="customers"&&<div className="fu">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:12,color:"#6b7280"}}>{visCustomers.length} customer account{visCustomers.length!==1?"s":""}{!isAdmin?" on your route":""}</div>
              <button className="btn ba" onClick={()=>setModal("addCustomer")}>{ic.plus} Open New Account</button>
            </div>
            {editingCid&&<div style={{background:"#0a1e14",border:"1px solid #143020",borderRadius:10,padding:"18px 20px",marginBottom:16}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:"#059669",marginBottom:12}}>✏️ EDITING CUSTOMER</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
                {[{l:"Business Name",k:"name"},{l:"Address",k:"address"},{l:"Phone",k:"phone"},{l:"Email",k:"email"}].map(f=>(
                  <div key={f.k}><label>{f.l}</label><input value={editCust[f.k]||""} onChange={e=>setEditCust(x=>({...x,[f.k]:e.target.value}))}/></div>
                ))}
                <div><label>Assigned Driver</label><select value={editCust.truck_id||""} onChange={e=>setEditCust(x=>({...x,truck_id:e.target.value}))}><option value="">— Unassigned —</option>{trucks.map(t=><option key={t.id} value={t.id}>{t.driver} ({t.route||t.plate})</option>)}</select></div>
                <div><label>Notes</label><input value={editCust.notes||""} onChange={e=>setEditCust(x=>({...x,notes:e.target.value}))}/></div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:14}}>
                <button className="btn bg" onClick={saveEditCustomer} disabled={saving}>{ic.save} Save Changes</button>
                <button className="btn bgh" onClick={cancelEditCustomer}>{ic.X} Cancel</button>
              </div>
            </div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
              {visCustomers.map(c=>{
                const cs=visSales.filter(s=>s.cust_id===c.id);
                const rev=cs.reduce((a,s)=>a+s.total,0),prof=cs.reduce((a,s)=>a+s.profit,0);
                const unpaid=cs.filter(s=>pmtFor(s.id)?.status!=="paid").reduce((a,s)=>a+s.total*(1+taxRate/100),0);
                const truck=getT(c.truck_id);
                const isEditingThis=editingCid===c.id;
                return(
                  <div key={c.id} className="card" style={{padding:16,borderLeft:isEditingThis?"3px solid #059669":"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                        <div style={{width:38,height:38,background:"#f9fafb",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>⛽</div>
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#212121"}}>{c.name}</div>
                          {c.address&&<div style={{fontSize:10,color:"#6b7280",marginTop:2,lineHeight:1.5}}>{c.address}</div>}
                          {c.phone&&<div style={{fontSize:10,color:"#6b7280",display:"flex",alignItems:"center",gap:4}}>📞 {c.phone}</div>}
                          {c.email&&<div style={{fontSize:10,color:"#6b7280",display:"flex",alignItems:"center",gap:4}}>✉️ {c.email}</div>}
                          {c.notes&&<div style={{fontSize:10,color:"#6b7280",fontStyle:"italic",marginTop:2}}>📝 {c.notes}</div>}
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end"}}>
                        {truck&&<span className="bdg bb2">{truck.route||truck.plate}</span>}
                        <button className="btn bgh" style={{fontSize:10,padding:"4px 9px"}} onClick={()=>isEditingThis?cancelEditCustomer():startEditCustomer(c)}>{isEditingThis?<>{ic.X} Cancel</>:<>{ic.edit} Edit</>}</button>
                      </div>
                    </div>
                    <Divider/>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                      {[{l:"Revenue",v:fmt(rev),c:"#059669"},{l:"Profit",v:fmt(prof),c:"#7c3aed"},{l:"Orders",v:cs.length,c:"#7c3aed"},{l:"Balance",v:fmt(unpaid),c:unpaid>0?"#dc2626":"#059669"}].map(k=>(
                        <div key={k.l} style={{textAlign:"center"}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:k.c}}>{k.v}</div><div style={{fontSize:9,color:"#9ca3af",letterSpacing:".05em",marginTop:1}}>{k.l}</div></div>
                      ))}
                    </div>
                    <div style={{fontSize:10,color:"#9ca3af",marginTop:10}}>Driver: <span style={{color:"#7c3aed"}}>{truck?.driver||"Unassigned"}</span></div>
                  </div>
                );
              })}
            </div>
          </div>}

          {/* ══ SETTINGS ══ */}
          {tab==="settings"&&isAdmin&&<div className="fu">
            <div style={{maxWidth:540}}>
              <div className="card" style={{padding:22,marginBottom:14}}>
                <div className="sh">Company Information</div>
                {coEdit&&<div style={{display:"flex",flexDirection:"column",gap:11}}>
                  {[{l:"Company Name",k:"name"},{l:"Address",k:"address"},{l:"Phone",k:"phone"},{l:"Email",k:"email"},{l:`Tax Rate (%) — currently ${co?.tax_rate}%`,k:"tax_rate"}].map(f=>(
                    <div key={f.k}><label>{f.l}</label><input value={coEdit[f.k]||""} onChange={e=>setCoEdit(prev=>({...prev,[f.k]:e.target.value}))}/></div>
                  ))}
                  <div style={{display:"flex",gap:8,marginTop:4}}>
                    <button className="btn ba" onClick={saveSettings} disabled={saving}>{ic.chk} Save</button>
                    <button className="btn bgh" onClick={()=>setCoEdit(co)}>Reset</button>
                  </div>
                </div>}
              </div>
              <div className="card" style={{padding:22,marginBottom:14}}>
                <div className="sh">Quick Actions</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button className="btn ba" onClick={()=>setModal("addProduct")}>{ic.plus} Add Product</button>
                  <button className="btn bb" onClick={()=>{setRsPid(products[0]?.id||"");setRsQty("");setModal("restock");}}>{ic.box} Restock</button>
                  <button className="btn bg" onClick={()=>setModal("addTruck")}>{ic.plus} Add Driver</button>
                  <button className="btn bp" onClick={()=>setModal("addCustomer")}>{ic.plus} Add Customer</button>
                </div>
              </div>
              <div className="card" style={{padding:22}}>
                <div className="sh">Order Portal Link</div>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>Share this link with your gas station customers so they can place orders:</div>
                <div style={{background:"#f9fafb",border:"1px solid #1a2e40",borderRadius:8,padding:"11px 14px",fontSize:13,color:"#059669",fontFamily:"monospace",wordBreak:"break-all"}}>
                  {window.location.origin}/order
                </div>
                <button className="btn bb" style={{marginTop:10}} onClick={()=>{navigator.clipboard.writeText(window.location.origin+"/order");showToast("Link copied!");}}>Copy Link</button>
              </div>
            </div>
          </div>}

          </div>
        </div>
      </div>

      {/* ════ MODALS ════ */}

      {modal==="addProduct"&&<Modal title="📦 Add New Product" onClose={()=>setModal(null)}>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label>Product Name *</label><input placeholder="e.g. Red Bull 250ml" value={np.name} onChange={e=>setNp(p=>({...p,name:e.target.value}))}/></div>
            <div><label>SKU *</label><input placeholder="e.g. RB-250" value={np.sku} onChange={e=>setNp(p=>({...p,sku:e.target.value}))}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label>Category</label><select value={np.cat} onChange={e=>setNp(p=>({...p,cat:e.target.value}))}>{["Beverage","Tobacco","Snack","Health","Misc","Other"].map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label>Unit</label><input placeholder="Case/24" value={np.unit} onChange={e=>setNp(p=>({...p,unit:e.target.value}))}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <div><label>Cost ($) *</label><input type="number" min="0" step="0.01" placeholder="0.00" value={np.cost} onChange={e=>setNp(p=>({...p,cost:e.target.value}))}/></div>
            <div><label>Price ($) *</label><input type="number" min="0" step="0.01" placeholder="0.00" value={np.price} onChange={e=>setNp(p=>({...p,price:e.target.value}))}/></div>
            <div><label>Starting Stock</label><input type="number" min="0" placeholder="0" value={np.shelf} onChange={e=>setNp(p=>({...p,shelf:e.target.value}))}/></div>
          </div>
          {np.cost&&np.price&&<div style={{background:"#f9fafb",borderRadius:7,padding:"8px 12px",fontSize:12,color:"#6b7280"}}>Margin: <span style={{color:"#059669",fontWeight:700}}>{parseFloat(np.price)>0?`${(((parseFloat(np.price)-parseFloat(np.cost))/parseFloat(np.price))*100).toFixed(1)}%`:"—"}</span></div>}
          <Divider/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn bgh" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn ba" onClick={addProduct} disabled={saving}>{ic.chk} Add Product</button>
          </div>
        </div>
      </Modal>}

      {modal==="addTruck"&&<Modal title="🚚 Add Driver & Truck" onClose={()=>setModal(null)}>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div><label>Driver Full Name *</label><input placeholder="e.g. Carlos Rivera" value={nt.driver} onChange={e=>setNt(p=>({...p,driver:e.target.value}))}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label>License Plate *</label><input placeholder="TX-4821" value={nt.plate} onChange={e=>setNt(p=>({...p,plate:e.target.value}))}/></div>
            <div><label>Route / Area</label><input placeholder="North Houston" value={nt.route} onChange={e=>setNt(p=>({...p,route:e.target.value}))}/></div>
          </div>
          <Divider/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn bgh" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn ba" onClick={addTruck} disabled={saving}>{ic.chk} Add Driver</button>
          </div>
        </div>
      </Modal>}

      {modal==="addCustomer"&&<Modal title="⛽ Open New Customer Account" onClose={()=>setModal(null)}>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div><label>Business Name *</label><input placeholder="Speedy Gas & Mart" value={nc.name} onChange={e=>setNc(p=>({...p,name:e.target.value}))}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label>Phone</label><input placeholder="(713) 555-0100" value={nc.phone} onChange={e=>setNc(p=>({...p,phone:e.target.value}))}/></div>
            <div><label>Email</label><input placeholder="owner@gasstation.com" value={nc.email} onChange={e=>setNc(p=>({...p,email:e.target.value}))}/></div>
          </div>
          <div><label>Full Address</label><input placeholder="1420 N Main St, Houston TX 77001" value={nc.address} onChange={e=>setNc(p=>({...p,address:e.target.value}))}/></div>
          <div><label>Assigned Driver / Truck</label><select value={nc.truck_id||trucks[0]?.id||""} onChange={e=>setNc(p=>({...p,truck_id:e.target.value}))}>{trucks.map(t=><option key={t.id} value={t.id}>{t.driver} ({t.route||t.plate})</option>)}</select></div>
          <div><label>Notes (optional)</label><input placeholder="e.g. owner contact, delivery instructions..." value={nc.notes} onChange={e=>setNc(p=>({...p,notes:e.target.value}))}/></div>
          <Divider/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn bgh" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn ba" onClick={addCustomer} disabled={saving}>{ic.chk} Open Account</button>
          </div>
        </div>
      </Modal>}

      {modal==="restock"&&<Modal title="📦 Restock Shelf" onClose={()=>setModal(null)}>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div><label>Product</label><select value={rsPid} onChange={e=>setRsPid(e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.name} — Stock: {p.shelf}</option>)}</select></div>
          <div><label>Quantity to Add</label><input type="number" min="1" placeholder="0" value={rsQty} onChange={e=>setRsQty(e.target.value)}/></div>
          {rsPid&&rsQty>0&&<div style={{background:"#f9fafb",borderRadius:7,padding:"8px 12px",fontSize:12,color:"#6b7280"}}>New stock: <span style={{color:"#059669",fontWeight:700}}>{(products.find(p=>p.id===rsPid)?.shelf||0)+parseInt(rsQty)}</span></div>}
          <Divider/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn bgh" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn ba" onClick={confirmRestock} disabled={saving}>{ic.chk} Add to Shelf</button>
          </div>
        </div>
      </Modal>}

      {modal==="load"&&<Modal title={`🚚 Load Truck — ${getT(selTruck)?.driver}`} onClose={()=>setModal(null)}>
        <div>
          {isAdmin&&<div style={{marginBottom:12}}><label>Select Truck</label><select value={selTruck} onChange={e=>{setSelTruck(e.target.value);setFormItems(products.map(p=>({pid:p.id,qty:0})));}}>{trucks.map(t=><option key={t.id} value={t.id}>{t.driver} — {t.plate}</option>)}</select></div>}
          <div style={{fontSize:10,color:"#6b7280",letterSpacing:".07em",fontWeight:700,marginBottom:8}}>QUANTITIES TO LOAD</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:300,overflowY:"auto",paddingRight:3}}>
            {products.map((p,idx)=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:9,background:"#f9fafb",borderRadius:7,padding:"8px 11px"}}>
                <div style={{flex:1}}><div style={{fontSize:12,color:"#212121",fontWeight:600}}>{p.name}</div><div style={{fontSize:10,color:"#9ca3af"}}>Available: <span style={{color:"#7c3aed"}}>{p.shelf}</span> · {p.unit}</div></div>
                <input type="number" min="0" max={p.shelf} value={formItems[idx]?.qty||0} onChange={e=>{const v=Math.min(p.shelf,Math.max(0,parseInt(e.target.value)||0));setFormItems(prev=>prev.map((fi,i)=>i===idx?{...fi,qty:v}:fi));}} style={{width:70,textAlign:"center"}}/>
              </div>
            ))}
          </div>
          <Divider/>
          <div style={{background:"#f9fafb",borderRadius:7,padding:"9px 12px",marginBottom:12,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:11,color:"#6b7280"}}>Total units</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:17,color:"#7c3aed"}}>{formItems.reduce((a,i)=>a+i.qty,0)}</span>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn bgh" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn ba" onClick={confirmLoad} disabled={saving}>{ic.truck} Confirm Load</button>
          </div>
        </div>
      </Modal>}

      {modal==="sale"&&<Modal title={`💳 Record Sale — ${getT(selTruck)?.driver}`} onClose={()=>{setModal(null);setScanning(false);setScanInput("");setScanMsg(null);}}>
        <div>
          <div style={{marginBottom:12}}><label>Customer</label><select value={selCust} onChange={e=>setSelCust(e.target.value)}>{customers.filter(c=>c.truck_id===selTruck).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          {selCust&&(()=>{const c=getC(selCust);return c&&(c.phone||c.address)&&<div style={{background:"#f9fafb",borderRadius:7,padding:"8px 12px",marginBottom:12,fontSize:11,color:"#6b7280"}}>{c.address&&<div>📍 {c.address}</div>}{c.phone&&<div>📞 {c.phone}</div>}</div>;})()}

          {/* ── SCAN / MANUAL TOGGLE ── */}
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            <button onClick={()=>{setScanning(false);setScanInput("");setScanMsg(null);}} style={{flex:1,padding:"8px",borderRadius:7,border:`1.5px solid ${!scanning?"#7c3aed":"#e5e7eb"}`,background:!scanning?"#f5f3ff":"#fff",color:!scanning?"#7c3aed":"#6b7280",fontWeight:!scanning?700:400,cursor:"pointer",fontSize:12,fontFamily:"'Barlow',sans-serif"}}>
              📋 Manual Entry
            </button>
            <button onClick={()=>{setScanning(true);setScanInput("");setScanMsg(null);}} style={{flex:1,padding:"8px",borderRadius:7,border:`1.5px solid ${scanning?"#7c3aed":"#e5e7eb"}`,background:scanning?"#f5f3ff":"#fff",color:scanning?"#7c3aed":"#6b7280",fontWeight:scanning?700:400,cursor:"pointer",fontSize:12,fontFamily:"'Barlow',sans-serif"}}>
              📷 Scan Barcode
            </button>
          </div>

          {/* ── SCAN INPUT ── */}
          {scanning&&<div style={{marginBottom:12}}>
            <div style={{background:"#f5f3ff",border:"2px solid #7c3aed",borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#7c3aed",letterSpacing:".06em",marginBottom:8}}>📷 POINT CAMERA AT BARCODE</div>

              {/* Camera viewfinder */}
              <div id="qr-reader" style={{width:"100%",borderRadius:8,overflow:"hidden",background:"#000",minHeight:200}}></div>

              {/* Fallback manual input */}
              <div style={{marginTop:10,borderTop:"1px solid #ddd6fe",paddingTop:10}}>
                <div style={{fontSize:10,color:"#9ca3af",marginBottom:6}}>Or type SKU / barcode manually:</div>
                <div style={{display:"flex",gap:8}}>
                  <input
                    id="scan-input"
                    type="text"
                    placeholder="Type SKU and press Enter..."
                    value={scanInput}
                    onChange={e=>setScanInput(e.target.value)}
                    onKeyDown={e=>{ if(e.key==="Enter"){handleScan(scanInput);} }}
                    style={{flex:1,background:"#fff",border:"1.5px solid #ddd6fe",borderRadius:7,padding:"8px 12px",fontSize:13,outline:"none",fontFamily:"'Barlow',sans-serif"}}
                  />
                  <button onClick={()=>handleScan(scanInput)} className="btn ba" style={{fontSize:11,padding:"8px 14px",flexShrink:0}}>Add</button>
                </div>
              </div>
            </div>
            {scanMsg&&<div style={{marginTop:8,padding:"8px 12px",borderRadius:7,background:scanMsg.type==="success"?"#f0fdf4":"#fef2f2",border:`1px solid ${scanMsg.type==="success"?"#a7f3d0":"#fecaca"}`,fontSize:12,color:scanMsg.type==="success"?"#065f46":"#dc2626",fontWeight:600}}>
              {scanMsg.text}
            </div>}
          </div>}

          {/* ── ITEMS LIST ── */}
          <div style={{fontSize:10,color:"#6b7280",letterSpacing:".07em",fontWeight:700,marginBottom:8}}>
            ITEMS TO SELL {formItems.filter(fi=>fi.qty>0).length>0&&<span style={{color:"#7c3aed"}}>— {formItems.filter(fi=>fi.qty>0).length} selected</span>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:270,overflowY:"auto",paddingRight:3}}>
            {formItems.map((fi,idx)=>{const p=getP(fi.pid);if(!p||fi.max===0)return null;return(
              <div key={fi.pid} style={{background:fi.qty>0?"#f5f3ff":"#f9fafb",borderRadius:7,padding:"8px 11px",border:fi.qty>0?"1.5px solid #ddd6fe":"1px solid transparent"}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:"#212121",fontWeight:600}}>{p.name}</div>
                    <div style={{fontSize:10,color:"#9ca3af"}}>
                      SKU: <span style={{fontFamily:"monospace"}}>{p.sku}</span> · On truck: <span style={{color:"#7c3aed"}}>{fi.max}</span> · <span style={{color:"#059669"}}>{fmt(p.price)}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <button onClick={()=>setFormItems(prev=>prev.map((x,i)=>i===idx?{...x,qty:Math.max(0,x.qty-1)}:x))} style={{width:26,height:26,borderRadius:"50%",border:"1.5px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <input type="number" min="0" max={fi.max} value={fi.qty} onChange={e=>{const v=Math.min(fi.max,Math.max(0,parseInt(e.target.value)||0));setFormItems(prev=>prev.map((x,i)=>i===idx?{...x,qty:v}:x));}} style={{width:54,textAlign:"center"}}/>
                    <button onClick={()=>setFormItems(prev=>prev.map((x,i)=>i===idx?{...x,qty:Math.min(x.max,x.qty+1)}:x))} style={{width:26,height:26,borderRadius:"50%",border:"1.5px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                </div>
                {fi.qty>0&&<div style={{fontSize:10,color:"#059669",marginTop:3,textAlign:"right"}}>{fmt(fi.qty*p.price)} + {fmt(fi.qty*p.price*taxRate/100)} tax = <strong>{fmt(fi.qty*p.price*(1+taxRate/100))}</strong></div>}
              </div>
            );})}
          </div>
          <Divider/>
          {(()=>{const sub=formItems.reduce((a,fi)=>{const p=getP(fi.pid);return a+(p?.price||0)*fi.qty;},0);const tax=sub*taxRate/100,gt=sub+tax,prof=formItems.reduce((a,fi)=>{const p=getP(fi.pid);return a+((p?.price||0)-(p?.cost||0))*fi.qty;},0);return<div style={{background:"#f9fafb",borderRadius:7,padding:"11px 13px",marginBottom:12}}>{[{l:"Subtotal",v:fmt(sub),c:"#6b7280"},{l:`Tax (${taxRate}%)`,v:fmt(tax),c:"#7c3aed"},{l:"Grand Total",v:fmt(gt),c:"#7c3aed"},{l:"Your Profit",v:fmt(prof),c:"#059669"}].map(k=><div key={k.l} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:"#6b7280"}}>{k.l}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:k.l==="Grand Total"?16:13,color:k.c}}>{k.v}</span></div>)}</div>;})()}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn bgh" onClick={()=>{setModal(null);setScanning(false);setScanInput("");}}>Cancel</button>
            <button className="btn bg" onClick={confirmSale} disabled={saving}>{ic.inv} Confirm & Invoice</button>
          </div>
        </div>
      </Modal>}

      {modal==="return"&&<Modal title={`↩️ Return Stock — ${getT(selTruck)?.driver}`} onClose={()=>setModal(null)}>
        <div>
          <div style={{fontSize:10,color:"#6b7280",letterSpacing:".07em",fontWeight:700,marginBottom:8}}>RETURN TO SHELF</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:300,overflowY:"auto",paddingRight:3}}>
            {formItems.map((fi,idx)=>{const p=getP(fi.pid);if(!p||fi.max===0)return null;return(
              <div key={fi.pid} style={{display:"flex",alignItems:"center",gap:9,background:"#f9fafb",borderRadius:7,padding:"8px 11px"}}>
                <div style={{flex:1}}><div style={{fontSize:12,color:"#212121",fontWeight:600}}>{p.name}</div><div style={{fontSize:10,color:"#9ca3af"}}>Remaining: <span style={{color:"#dc2626"}}>{fi.max}</span></div></div>
                <input type="number" min="0" max={fi.max} value={fi.qty} onChange={e=>{const v=Math.min(fi.max,Math.max(0,parseInt(e.target.value)||0));setFormItems(prev=>prev.map((x,i)=>i===idx?{...x,qty:v}:x));}} style={{width:70,textAlign:"center"}}/>
              </div>
            );})}
          </div>
          <Divider/>
          <div style={{background:"#130808",border:"1px solid #301414",borderRadius:7,padding:"9px 12px",marginBottom:12,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:11,color:"#3a2020"}}>Units returning</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:17,color:"#dc2626"}}>{formItems.reduce((a,i)=>a+i.qty,0)}</span>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn bgh" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn br" onClick={confirmReturn} disabled={saving}>{ic.undo} Confirm Return</button>
          </div>
        </div>
      </Modal>}

      {modal==="invoice"&&viewSale&&<Modal title="" onClose={()=>setModal(null)} wide>
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          <span className={`bdg ${pmtFor(viewSale.id)?.status==="paid"?"bg2":"br2"}`}>{pmtFor(viewSale.id)?.status==="paid"?"✓ PAID":"⏳ UNPAID"}</span>
          {pmtFor(viewSale.id)?.status!=="paid"?<button className="btn bg" onClick={()=>markPaid(viewSale.id)}>{ic.chk} Mark Paid</button>:<button className="btn bgh" style={{fontSize:11}} onClick={()=>markUnpaid(viewSale.id)}>Mark Unpaid</button>}
          {pmtFor(viewSale.id)?.status!=="paid"&&<button className="btn bp" style={{fontSize:11,padding:"7px 12px"}} onClick={()=>{setModal(null);setTimeout(()=>setStripeModal({sale:viewSale,customer:getC(viewSale.cust_id),driver:getT(viewSale.truck_id)?.driver}),100);}}>💳 Charge Card</button>}
          <div style={{marginLeft:"auto"}}><button className="btn bpr" onClick={()=>window.print()}>{ic.prt} Print / Save PDF</button></div>
        </div>
        <InvoiceDoc sale={viewSale} products={products} customers={customers} trucks={trucks} co={co} paid={pmtFor(viewSale.id)?.status==="paid"}/>
      </Modal>}

      {modal==="settlement"&&viewTruck&&(()=>{const t=getT(viewTruck),d=settlementData(viewTruck);return<Modal title="" onClose={()=>setModal(null)} xwide><div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}><button className="btn bpr" onClick={()=>window.print()}>{ic.prt} Print / Save PDF</button></div><SettleDoc truck={t} d={d} co={co} customers={customers} payments={payments}/></Modal>;})()}

      {/* ── STRIPE PAYMENT MODAL ── */}
      {stripeModal&&<StripePaymentModal
        sale={stripeModal.sale}
        customer={stripeModal.customer}
        driver={stripeModal.driver}
        taxRate={taxRate}
        onClose={()=>setStripeModal(null)}
        onSuccess={async(pd)=>{
          const truck=trucks.find(t=>t.id===stripeModal.sale.truck_id);
          const rec={
            id:"PMT-"+uid(),
            truck_id:stripeModal.sale.truck_id,
            cust_id:stripeModal.sale.cust_id,
            collected_by:truck?.driver||"Admin",
            method:"credit_card",
            amount:pd.amount,
            check_number:pd.paymentIntentId,
            bank_name:"Stripe",
            note:`Card surcharge $${pd.surcharge.toFixed(2)} (3%) included`,
            invoice_ids:[stripeModal.sale.id],
            date:nowStr(),
            created_at:new Date().toISOString(),
          };
          await supabase.from("payments_log").insert(rec);
          await markPaid(stripeModal.sale.id,"credit_card",pd.amount,pd.paymentIntentId,rec.note,rec.collected_by);
          setPaymentsLog(prev=>[rec,...prev]);
          setStripeModal(null);
          showToast(`💳 $${pd.amount.toFixed(2)} card payment successful!`);
        }}
      />}

    </div>
  );
}
