// RouteFlow WMS - Complete Edition with Edit Everywhere
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { supabase } from "./supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
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

// -- ICONS ---------------------------------------------------------------------
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

// -- LOGIN ---------------------------------------------------------------------
// -- MFA GATE - verify 2FA even for cached sessions ----------------------------
const MFAGate=({onVerified})=>{
  const[otp,setOtp]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const[stage,setStage]=useState("checking"); // checking | enroll | verify

  const callMfa=async(action,params={})=>{
    const{data:{session}}=await supabase.auth.getSession();
    const res=await fetch(`${SUPABASE_URL}/functions/v1/mfa-handler`,{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${session?.access_token}`,"apikey":SUPABASE_ANON_KEY},
      body:JSON.stringify({action,...params}),
    });
    const result=await res.json();
    if(result.error)throw new Error(result.error);
    return result;
  };

  const[otpauth,setOtpauth]=useState("");
  const[secret,setSecret]=useState("");

  useEffect(()=>{
    const init=async()=>{
      try{
        const{hasTotp}=await callMfa("check");
        if(hasTotp){
          setStage("verify");
        } else {
          const{secret:sec,otpauthUrl}=await callMfa("enroll");
          setSecret(sec);
          setOtpauth(otpauthUrl);
          setStage("enroll");
        }
      }catch(e){
        setErr(e.message);
        setStage("verify");
      }
    };
    init();
  },[]);

  // Render QR code using qrcodejs library
  useEffect(()=>{
    if(!otpauth||stage!=="enroll")return;
    const renderQR=async()=>{
      if(!window.QRCode){
        await new Promise((resolve,reject)=>{
          const s=document.createElement("script");
          s.src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
          s.onload=resolve;s.onerror=reject;
          document.head.appendChild(s);
        });
      }
      const el=document.getElementById("mfa-qr");
      if(el){
        el.innerHTML="";
        new window.QRCode(el,{
          text:otpauth,width:200,height:200,
          colorDark:"#000000",colorLight:"#ffffff",
          correctLevel:window.QRCode?.CorrectLevel?.M||1,
        });
      }
    };
    setTimeout(renderQR,200);
  },[otpauth,stage]);

  const verifyEnroll=async()=>{
    setLoading(true);setErr("");
    try{
      await callMfa("verifyEnroll",{code:otp});
      onVerified();
    }catch(e){setErr(e.message);}
    setLoading(false);
  };

  const verifyLogin=async()=>{
    setLoading(true);setErr("");
    try{
      await callMfa("verifyLogin",{code:otp});
      onVerified();
    }catch(e){setErr(e.message);}
    setLoading(false);
  };

  if(stage==="checking") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f5f5"}}>
      <div style={{textAlign:"center",color:"#6b7280"}}>
        <svg className="spin" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{margin:"0 auto 12px"}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        <div style={{fontSize:13}}>Checking 2FA status…</div>
      </div>
    </div>
  );

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
            <div id="mfa-qr" style={{display:"inline-block",padding:10,background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}></div>
          </div>
          <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"10px 14px",marginBottom:16}}>
            <div style={{fontSize:10,color:"#9ca3af",marginBottom:4,fontWeight:700,letterSpacing:".08em"}}>MANUAL ENTRY CODE</div>
            <div style={{fontFamily:"monospace",fontSize:12,color:"#212121",wordBreak:"break-all",letterSpacing:".1em"}}>{secret}</div>
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
              style={{textAlign:"center",fontSize:28,letterSpacing:"0.4em",fontWeight:700}}
              autoFocus/>
          </div>
          <button onClick={verifyEnroll} className="btn ba" style={{width:"100%",justifyContent:"center",padding:"11px",marginTop:12}} disabled={loading||otp.length<6}>
            {loading?"Verifying…":"✓ Activate 2FA & Sign In"}
          </button>
          <button onClick={()=>supabase.auth.signOut()} style={{width:"100%",background:"none",border:"none",color:"#9ca3af",fontSize:11,marginTop:10,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>
            ← Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return(
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
          <button onClick={()=>supabase.auth.signOut()} style={{width:"100%",background:"none",border:"none",color:"#9ca3af",fontSize:11,marginTop:10,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>
            ← Sign out
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"#9ca3af"}}>🔐 Protected by 2-Factor Authentication</div>
      </div>
    </div>
  );
};

// -- LOGIN ---------------------------------------------------------------------
const Login=({})=>{
  const[email,setEmail]=useState("");
  const[pw,setPw]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const[stage,setStage]=useState("login"); // login | enroll | verify
  const[otpauth,setOtpauth]=useState("");
  const[secret,setSecret]=useState("");
  const[otp,setOtp]=useState("");

  const callMfa=async(action,params={})=>{
    const{data:{session}}=await supabase.auth.getSession();
    const res=await fetch(`${SUPABASE_URL}/functions/v1/mfa-handler`,{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${session?.access_token}`,"apikey":SUPABASE_ANON_KEY},
      body:JSON.stringify({action,...params}),
    });
    const result=await res.json();
    if(result.error)throw new Error(result.error);
    return result;
  };

  // Render QR code when otpauth changes
  useEffect(()=>{
    if(!otpauth||stage!=="enroll")return;
    const renderQR=async()=>{
      if(!window.QRCode){
        await new Promise((resolve,reject)=>{
          const s=document.createElement("script");
          s.src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
          s.onload=resolve;s.onerror=reject;
          document.head.appendChild(s);
        });
      }
      const el=document.getElementById("login-qr");
      if(el){
        el.innerHTML="";
        new window.QRCode(el,{
          text:otpauth,width:200,height:200,
          colorDark:"#000000",colorLight:"#ffffff",
          correctLevel:window.QRCode?.CorrectLevel?.M||1,
        });
      }
    };
    setTimeout(renderQR,200);
  },[otpauth,stage]);

  const go=async e=>{
    e.preventDefault();
    setLoading(true);setErr("");
    try{
      const{error}=await supabase.auth.signInWithPassword({email,password:pw});
      if(error)throw error;
      const{hasTotp}=await callMfa("check");
      if(hasTotp){
        setStage("verify");
      } else {
        const{secret:sec,otpauthUrl}=await callMfa("enroll");
        setSecret(sec);
        setOtpauth(otpauthUrl);
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
            <div id="login-qr" style={{display:"inline-block",padding:10,background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}></div>
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

// -- INVOICE DOC ---------------------------------------------------------------
// -- GLOBAL TAX HELPERS (module level - available to all components) ----------
const TAXABLE_CATS=["tobacco","nicotine","cigarette","cigar","vape","hookah","chew","dip","snuff"];
const isTaxableProd=p=>{const c=(p?.cat||"").toLowerCase().trim(),n=(p?.name||"").toLowerCase().trim();return["tobacco","nicotine","cigarette","cigar","vape","hookah","chew","dip","snuff","smoke","eliquid","e-liquid","pod","disposable"].some(t=>c.includes(t)||n.includes(t));};

const InvoiceDoc=({sale,products,customers,trucks,co,paid,stateTaxes})=>{
  if(!sale)return null;
  const cust=customers.find(c=>c.id===sale.cust_id),truck=trucks.find(t=>t.id===sale.truck_id);
  const getP=pid=>products.find(p=>p.id===pid);
  const CARD_FEE=3;
  const stateId=sale.state||cust?.state||"";
  const stData=stateTaxes?.find(s=>s.id===stateId);
  const stateRate=stData?.exempt?0:parseFloat(stData?.rate||0);
  const sub=sale.total;
  const taxable=(sale.items||[]).reduce((a,i)=>{const p=getP(i.pid);return isTaxableProd(p)?a+(p?.price||0)*i.qty:a;},0);
  const tax=parseFloat((taxable*stateRate/100).toFixed(2));
  const penalty=parseFloat(sale.check_penalty_applied||0);
  const prevBal=parseFloat(sale.previous_balance||0);
  const gt=sub+tax+prevBal; // previous_balance already contains penalty
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
          <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>State: {stateId} {stData?.exempt?"(Tax Exempt)":""}</div>
          <div style={{marginTop:8}}><span style={{background:paid?"#dcfce7":"#fef9c3",color:paid?"#166534":"#854d0e",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{paid?"✓ PAID":"⏳ BALANCE DUE"}</span></div>
        </div>
      </div>
      <div style={{padding:"18px 28px"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{(tax>0?["SKU","Product","Unit","Qty","Unit Price","Amount","Tax"]:["SKU","Product","Unit","Qty","Unit Price","Amount"]).map(h=><th key={h} style={{textAlign:["Qty","Unit Price","Amount","Tax"].includes(h)?"right":"left",padding:"7px 8px",fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".07em",borderBottom:"2px solid #111",background:"transparent"}}>{h}</th>)}</tr></thead>
          <tbody>{(sale.items||[]).map((item,i)=>{
            const p=getP(item.pid);
            const taxable=isTaxableProd(p)&&!stData?.exempt;
            const itemTax=taxable?parseFloat(((p?.price||0)*item.qty*stateRate/100).toFixed(2)):0;
            return(
              <tr key={i}>
                <td style={{padding:"9px 8px",borderBottom:"1px solid #f3f4f6",fontSize:12,color:"#9ca3af"}}>{p?.sku}</td>
                <td style={{padding:"9px 8px",borderBottom:"1px solid #f3f4f6",fontSize:13,fontWeight:600,color:"#111"}}>
                  {p?.name}
                  {taxable&&<span style={{fontSize:9,background:"#fef3c7",color:"#92400e",padding:"1px 4px",borderRadius:3,marginLeft:5,fontWeight:700}}>TAX</span>}
                </td>
                <td style={{padding:"9px 8px",borderBottom:"1px solid #f3f4f6",fontSize:12,color:"#9ca3af"}}>{p?.unit}</td>
                <td style={{padding:"9px 8px",borderBottom:"1px solid #f3f4f6",fontSize:13,fontWeight:700,textAlign:"right"}}>{item.qty}</td>
                <td style={{padding:"9px 8px",borderBottom:"1px solid #f3f4f6",fontSize:13,textAlign:"right"}}>{fmt(p?.price||0)}</td>
                <td style={{padding:"9px 8px",borderBottom:"1px solid #f3f4f6",fontSize:13,fontWeight:700,textAlign:"right"}}>{fmt(item.qty*(p?.price||0))}</td>
                {tax>0&&<td style={{padding:"9px 8px",borderBottom:"1px solid #f3f4f6",fontSize:12,textAlign:"right",color:taxable?"#059669":"#9ca3af"}}>{taxable?fmt(itemTax):"—"}</td>}
              </tr>
            );
          })}</tbody>
        </table>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}>
          <div style={{width:300}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f3f4f6"}}>
              <span style={{fontSize:13,color:"#6b7280"}}>Subtotal</span><span style={{fontSize:13}}>{fmt(sub)}</span>
            </div>
            {tax>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f3f4f6"}}>
              <span style={{fontSize:13,color:"#6b7280"}}>{`Tobacco/Vape Tax   -   ${stateId} (${stateRate}%)`}</span>
              <span style={{fontSize:13,color:"#059669"}}>{fmt(tax)}</span>
            </div>}
            {prevBal>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f3f4f6",background:"#fef2f2",margin:"0 -4px",padding:"6px 4px"}}>
              <span style={{fontSize:13,color:"#dc2626",fontWeight:600}}>{penalty>0?"🚨 Returned Check Penalty":`⚠️ Previous Balance (${sale.previous_invoice_ids||""})`}</span>
              <span style={{fontSize:13,color:"#dc2626",fontWeight:700}}>{fmt(prevBal)}</span>
            </div>}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"2px solid #111",marginTop:3}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#111"}}>💵 CASH / CHECK TOTAL</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:"#059669"}}>{fmt(gt)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 8px",background:"#faf5ff",margin:"0 -8px"}}>
              <span style={{fontSize:12,color:"#7c3aed"}}>💳 Card surcharge ({CARD_FEE}%)</span>
              <span style={{fontSize:12,color:"#7c3aed"}}>+{fmt(cardFeeAmt)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#111"}}>💳 CARD TOTAL</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:"#7c3aed"}}>{fmt(gtCard)}</span>
            </div>
            {!paid&&<div style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:"#fef9c3",borderRadius:7,marginTop:3}}><span style={{fontWeight:700,fontSize:12,color:"#854d0e"}}>Balance Due</span><span style={{fontWeight:900,fontSize:15,color:"#854d0e"}}>{fmt(gt)}</span></div>}
          </div>
        </div>
        <div style={{marginTop:16,background:"#f9fafb",borderRadius:8,padding:"10px 14px",fontSize:11,color:"#6b7280",lineHeight:1.7}}>
          <strong style={{color:"#212121"}}>Payment Methods:</strong> Cash · Check · Money Order · Zelle — <strong style={{color:"#059669"}}>No surcharge</strong> &nbsp;|&nbsp; Credit Card · Debit Card — <strong style={{color:"#7c3aed"}}>{CARD_FEE}% surcharge applies</strong>
        </div>
        <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between"}}><div style={{fontSize:10,color:"#9ca3af"}}>Thank you for your business · Payment due upon delivery</div><div style={{fontSize:10,color:"#9ca3af"}}>{co?.email}</div></div>
      </div>
    </div>
  );
};

// -- SETTLEMENT DOC ------------------------------------------------------------
const calcSettleTax=(sale,products,stateTaxes,co)=>{
  if(!co?.tax_enabled) return 0;
  const st=stateTaxes?.find(s=>s.id===(sale.state||""));
  const rate=st?.exempt?0:parseFloat(st?.rate||co?.tax_rate||0);
  if(!rate)return 0;
  return parseFloat(((sale.items||[]).reduce((a,i)=>{
    const p=products?.find(x=>x.id===i.pid);
    return isTaxableProd(p)?a+(p?.price||0)*i.qty:a;
  },0)*rate/100).toFixed(2));
};
const SettleDoc=({truck,d,co,customers,payments,products,stateTaxes})=>{
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
      <tbody>{d.truckSales.map(s=>{const cust=customers.find(c=>c.id===s.cust_id);const pmt=payments.find(p=>p.sale_id===s.id);return(<tr key={s.id}><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12,fontWeight:700,color:"#2563eb"}}>{s.id}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12}}>{cust?.name}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12}}>{(s.items||[]).reduce((a,i)=>a+i.qty,0)}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12}}>{fmt(s.total)}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12,color:"#7c3aed"}}>{fmt(calcSettleTax(s,products,stateTaxes,co))}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:13,fontWeight:700}}>{fmt(s.total+calcSettleTax(s,products,stateTaxes,co)+parseFloat(s.previous_balance||0))}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb"}}><span style={{background:pmt?.status==="paid"?"#dcfce7":"#fef9c3",color:pmt?.status==="paid"?"#166534":"#854d0e",padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:700}}>{pmt?.status==="paid"?"PAID":"UNPAID"}</span></td></tr>);})}</tbody></table></>}
      <div style={{marginTop:20,paddingTop:10,borderTop:"1px solid #e5e7eb",fontSize:10,color:"#9ca3af",textAlign:"center"}}>{co?.name} · {co?.phone} · {dateLabel()}</div>
    </div>
  );
};

// ==============================================================================
// MAIN APP
// ==============================================================================
// -- DRIVER TRUCK ASSIGNMENT ---------------------------------------------------
function DriverTruckAssignment({supabase, trucks, showToast}){
  const[profiles,setProfiles]=useState([]);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState({});

  useEffect(()=>{
    // profiles table blocked by RLS — skip entirely, show empty state
    setLoading(false);
  },[]);

  const assignTruck=async(profileId, truckId)=>{
    setSaving(prev=>({...prev,[profileId]:true}));
    const{error}=await supabase.from("profiles").update({truck_id:truckId}).eq("id",profileId);
    if(error) showToast(error.message,"error");
    else{
      setProfiles(prev=>prev.map(p=>p.id===profileId?{...p,truck_id:truckId}:p));
      showToast("✅ Truck assigned successfully");
    }
    setSaving(prev=>({...prev,[profileId]:false}));
  };

  if(loading) return <div style={{fontSize:12,color:"#9ca3af"}}>Loading drivers...</div>;
  if(!profiles.length) return <div style={{fontSize:12,color:"#9ca3af"}}>No driver profiles found</div>;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {profiles.map(p=>{
        const assignedTruck=trucks.find(t=>t.id===p.truck_id);
        return(
          <div key={p.id} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:120}}>
              <div style={{fontWeight:600,fontSize:13,color:"#212121"}}>👤 Driver</div>
              <div style={{fontSize:11,color:"#6b7280"}}>{p.email||p.id.slice(0,8)+"..."}</div>
            </div>
            <div style={{flex:2,minWidth:200}}>
              <label style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".08em",display:"block",marginBottom:4}}>ASSIGNED TRUCK</label>
              <select
                value={p.truck_id||""}
                onChange={e=>assignTruck(p.id,e.target.value)}
                style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:7,padding:"8px 10px",fontSize:12,fontFamily:"'Barlow',sans-serif",background:"#fff"}}>
                <option value="">— Select Truck —</option>
                {trucks.map(t=>(
                  <option key={t.id} value={t.id}>{t.driver} · {t.plate} {t.route?`  -   ${t.route}`:""}</option>
                ))}
              </select>
            </div>
            <div style={{flexShrink:0}}>
              {assignedTruck
                ?<span style={{background:"#f0fdf4",color:"#059669",padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:700}}>✓ {assignedTruck.driver}</span>
                :<span style={{background:"#fef2f2",color:"#dc2626",padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:700}}>⚠️ Unassigned</span>
              }
              {saving[p.id]&&<span style={{fontSize:11,color:"#9ca3af",marginLeft:6}}>Saving...</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// -- WALK-IN SALE COMPONENT ----------------------------------------------------
// -- IRS ALL STATES COMPONENT -------------------------------------------------
function IRSAllStates({stateTaxes, activeStateIds, stateSearch, setStateSearch}){
  const [irsStateTab,setIrsStateTab]=useState("otp");

  const filtered2=ALL_STATES_TAX.filter(s=>!stateSearch||s.name.toLowerCase().includes(stateSearch.toLowerCase())||s.id.toLowerCase().includes(stateSearch.toLowerCase()));

  return(<>
    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#212121",marginBottom:8}}>All States — Tax Reference Tables</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
      <div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:10,padding:"10px 14px",fontSize:11,color:"#854d0e"}}>
        <strong>🔋 OTP Tax (% of wholesale)</strong> — vapes, e-cigarettes, disposables, nicotine pouches, cigars, hookah, smokeless tobacco.
        <strong> Calculated in your invoices.</strong>
      </div>
      <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",fontSize:11,color:"#1e40af"}}>
        <strong>🚬 Cigarette Tax ($/pack)</strong> — separate per-pack stamp tax on cigarettes only.
        <strong> Reference only — not in invoices.</strong>
      </div>
    </div>
    <div style={{display:"flex",gap:0,marginBottom:14,border:"1.5px solid #e5e7eb",borderRadius:10,overflow:"hidden",width:"fit-content"}}>
      {[["otp","🔋 OTP / Vape / Nicotine"],["cig","🚬 Cigarette ($/pack)"]].map(([id,label])=>(
        <button key={id} onClick={()=>setIrsStateTab(id)}
          style={{padding:"9px 18px",border:"none",background:irsStateTab===id?"#0a1628":"#fff",color:irsStateTab===id?"#fff":"#6b7280",fontWeight:irsStateTab===id?700:400,fontSize:12,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>
          {label}
        </button>
      ))}
    </div>
    <input value={stateSearch} onChange={e=>setStateSearch(e.target.value)} placeholder="🔍 Search state..."
      style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"9px 14px",fontSize:13,marginBottom:12,boxSizing:"border-box"}}/>

    {irsStateTab==="otp"&&<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#0a1628",color:"#fff"}}>
          {["State","OTP Rate (% wholesale)","Status","Filing Due","Form","Note"].map(h=>(
            <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,letterSpacing:".06em",whiteSpace:"nowrap"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {filtered2.map(s=>{
            const isActive=activeStateIds.includes(s.id);
            const configured=stateTaxes.find(st=>st.id===s.id);
            return(
              <tr key={s.id} style={{borderBottom:"1px solid #f3f4f6",background:isActive?"#fefce8":configured?"#f5f3ff":"#fff"}}>
                <td style={{padding:"10px 14px"}}>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#0a1628"}}>{s.id}</span>
                    <span style={{fontSize:12,color:"#6b7280"}}>{s.name}</span>
                    {isActive&&<span style={{background:"#f59e0b",color:"#fff",padding:"1px 6px",borderRadius:4,fontSize:9,fontWeight:700}}>ACTIVE</span>}
                    {configured&&!isActive&&<span style={{background:"#7c3aed",color:"#fff",padding:"1px 6px",borderRadius:4,fontSize:9,fontWeight:700}}>CONFIGURED</span>}
                  </div>
                </td>
                <td style={{padding:"10px 14px"}}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:s.otp>=50?"#dc2626":s.otp>=25?"#f59e0b":"#059669"}}>{s.otp}%</span>
                </td>
                <td style={{padding:"10px 14px"}}>
                  {configured?(configured.exempt
                    ?<span style={{background:"#dcfce7",color:"#166534",padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:700}}>✅ Exempt</span>
                    :<span style={{background:"#fef9c3",color:"#854d0e",padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:700}}>🏛 {configured.rate}% active</span>)
                  :<span style={{fontSize:11,color:"#9ca3af"}}>Not set</span>}
                </td>
                <td style={{padding:"10px 14px"}}><span style={{background:"#f5f3ff",color:"#7c3aed",padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:600}}>{s.due}</span></td>
                <td style={{padding:"10px 14px",fontSize:11,color:"#6b7280",fontFamily:"monospace"}}>{s.form}</td>
                <td style={{padding:"10px 14px",fontSize:10,color:"#9ca3af"}}>{s.note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>}

    {irsStateTab==="cig"&&<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#1e40af",color:"#fff"}}>
          {["State","Cigarette Tax ($/pack)","Filing Form","Note"].map(h=>(
            <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,letterSpacing:".06em"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {[...filtered2].sort((a,b)=>b.cig-a.cig).map(s=>(
            <tr key={s.id} style={{borderBottom:"1px solid #f3f4f6"}}>
              <td style={{padding:"10px 14px"}}>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#1e40af"}}>{s.id}</span>
                  <span style={{fontSize:12,color:"#6b7280"}}>{s.name}</span>
                </div>
              </td>
              <td style={{padding:"10px 14px"}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:s.cig>=3?"#dc2626":s.cig>=1.5?"#f59e0b":"#059669"}}>${s.cig.toFixed(2)}/pack</span>
              </td>
              <td style={{padding:"10px 14px",fontSize:11,color:"#6b7280",fontFamily:"monospace"}}>{s.form}</td>
              <td style={{padding:"10px 14px",fontSize:10,color:"#9ca3af"}}>{s.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>}
  </>);
}

// -- IRS REPORTS COMPONENT -----------------------------------------------------
// All 50 states + DC OTP (Other Tobacco Products) tax rates
// Source: State revenue departments, Tax Foundation 2025
// OTP rates = % of wholesale price (how wholesalers are taxed)
let ALL_STATES_TAX = [
  {id:"AL",name:"Alabama",        otp:10,   cig:0.68, due:"20th",    form:"Tobacco Tax Return",      note:"OTP 10% wholesale"},
  {id:"AK",name:"Alaska",         otp:75,   cig:2.00, due:"Last day",form:"OTP Tax Return",          note:"OTP 75% wholesale"},
  {id:"AZ",name:"Arizona",        otp:65,   cig:2.00, due:"20th",    form:"TPT Return",              note:"OTP 65% wholesale"},
  {id:"AR",name:"Arkansas",       otp:68,   cig:1.15, due:"20th",    form:"ET-1 Return",             note:"OTP 68% manufacturer"},
  {id:"CA",name:"California",     otp:61.74,cig:2.87, due:"25th",    form:"BOE-501-T",               note:"OTP 61.74% wholesale"},
  {id:"CO",name:"Colorado",       otp:50,   cig:1.94, due:"20th",    form:"DR 0225",                 note:"OTP 50% manufacturer"},
  {id:"CT",name:"Connecticut",    otp:50,   cig:4.35, due:"Last day",form:"TPTP Return",             note:"OTP 50% wholesale"},
  {id:"DE",name:"Delaware",       otp:30,   cig:2.10, due:"15th",    form:"OTP Return",              note:"OTP 30% wholesale"},
  {id:"FL",name:"Florida",        otp:85,   cig:1.34, due:"20th",    form:"DR-15TOB",                note:"OTP 85% wholesale"},
  {id:"GA",name:"Georgia",        otp:23,   cig:0.37, due:"20th",    form:"TP-1 Return",             note:"OTP 23% wholesale"},
  {id:"HI",name:"Hawaii",         otp:70,   cig:3.20, due:"20th",    form:"OTP Return",              note:"OTP 70% wholesale"},
  {id:"ID",name:"Idaho",          otp:40,   cig:0.57, due:"20th",    form:"Tobacco Products Return", note:"OTP 40% wholesale"},
  {id:"IL",name:"Illinois",       otp:36,   cig:2.98, due:"15th",    form:"TP-1",                    note:"OTP 36% wholesale"},
  {id:"IN",name:"Indiana",        otp:24,   cig:1.00, due:"20th",    form:"TF-1 / OTP Return",       note:"OTP 24% wholesale"},
  {id:"IA",name:"Iowa",           otp:50,   cig:1.36, due:"Last day",form:"IA 81-018",               note:"OTP 50% wholesale"},
  {id:"KS",name:"Kansas",         otp:10,   cig:1.29, due:"25th",    form:"CT-10U",                  note:"OTP 10% wholesale"},
  {id:"KY",name:"Kentucky",       otp:15,   cig:1.10, due:"20th",    form:"72A190",                  note:"OTP 15% wholesale"},
  {id:"LA",name:"Louisiana",      otp:20,   cig:1.08, due:"20th",    form:"R-5604",                  note:"OTP 20% cost price"},
  {id:"ME",name:"Maine",          otp:43,   cig:2.00, due:"15th",    form:"Tobacco Products Return", note:"OTP 43% wholesale"},
  {id:"MD",name:"Maryland",       otp:30,   cig:3.00, due:"21st",    form:"MW508",                   note:"OTP 30% wholesale"},
  {id:"MA",name:"Massachusetts",  otp:40,   cig:3.51, due:"20th",    form:"Excise Return",           note:"OTP 40% wholesale"},
  {id:"MI",name:"Michigan",       otp:32,   cig:2.00, due:"20th",    form:"Form 4600",               note:"OTP 32% wholesale"},
  {id:"MN",name:"Minnesota",      otp:95,   cig:3.04, due:"18th",    form:"Tobacco Products Return", note:"OTP 95% — highest"},
  {id:"MS",name:"Mississippi",    otp:15,   cig:0.68, due:"20th",    form:"Tobacco Tax Return",      note:"OTP 15% wholesale"},
  {id:"MO",name:"Missouri",       otp:10,   cig:0.17, due:"15th",    form:"MO-860",                  note:"OTP 10% manufacturer"},
  {id:"MT",name:"Montana",        otp:50,   cig:1.70, due:"Last day",form:"Tobacco Return",          note:"OTP 50% wholesale"},
  {id:"NE",name:"Nebraska",       otp:20,   cig:0.64, due:"Last day",form:"Form 69",                 note:"OTP 20% wholesale"},
  {id:"NV",name:"Nevada",         otp:30,   cig:1.80, due:"Last day",form:"TXR-025",                note:"OTP 30% wholesale"},
  {id:"NH",name:"New Hampshire",  otp:19,   cig:1.78, due:"15th",    form:"OTP Return",              note:"OTP 19% wholesale"},
  {id:"NJ",name:"New Jersey",     otp:30,   cig:2.70, due:"20th",    form:"OTP-100",                 note:"OTP 30% wholesale"},
  {id:"NM",name:"New Mexico",     otp:25,   cig:2.00, due:"25th",    form:"TRD-41413",               note:"OTP 25% wholesale"},
  {id:"NY",name:"New York",       otp:75,   cig:5.35, due:"20th",    form:"MT-203",                  note:"OTP 75% wholesale"},
  {id:"NC",name:"North Carolina", otp:12.8, cig:0.45, due:"20th",    form:"NC-TP Return",            note:"OTP 12.8% wholesale"},
  {id:"ND",name:"North Dakota",   otp:28,   cig:0.44, due:"25th",    form:"SFN 21999",               note:"OTP 28% wholesale"},
  {id:"OH",name:"Ohio",           otp:17,   cig:1.60, due:"23rd",    form:"OTP Tax Return",          note:"OTP 17% wholesale"},
  {id:"OK",name:"Oklahoma",       otp:36,   cig:2.03, due:"20th",    form:"OTC 900",                 note:"OTP 36% manufacturer"},
  {id:"OR",name:"Oregon",         otp:65,   cig:1.34, due:"Last day",form:"OR-CIGT",                 note:"OTP 65% wholesale"},
  {id:"PA",name:"Pennsylvania",   otp:55,   cig:2.60, due:"20th",    form:"REV-1200",                note:"OTP 55% wholesale"},
  {id:"RI",name:"Rhode Island",   otp:80,   cig:4.25, due:"20th",    form:"OTP Return",              note:"OTP 80% wholesale"},
  {id:"SC",name:"South Carolina", otp:5,    cig:0.57, due:"20th",    form:"SC Tobacco Return",       note:"OTP 5% wholesale"},
  {id:"SD",name:"South Dakota",   otp:35,   cig:1.53, due:"Last day",form:"OTP Return",              note:"OTP 35% wholesale"},
  {id:"TN",name:"Tennessee",      otp:6.6,  cig:0.62, due:"20th",    form:"Tobacco Tax Return",      note:"OTP 6.6% wholesale"},
  {id:"TX",name:"Texas",          otp:1,    cig:1.41, due:"25th",    form:"AP-143",                  note:"OTP 1% manufacturer"},
  {id:"UT",name:"Utah",           otp:86,   cig:1.70, due:"Last day",form:"TC-105",                  note:"OTP 86% manufacturer"},
  {id:"VT",name:"Vermont",        otp:92,   cig:3.08, due:"25th",    form:"Tobacco Products Return", note:"OTP 92% wholesale"},
  {id:"VA",name:"Virginia",       otp:10,   cig:0.30, due:"20th",    form:"TT-1",                    note:"OTP 10% manufacturer"},
  {id:"WA",name:"Washington",     otp:95,   cig:3.03, due:"25th",    form:"Excise Tax Return",       note:"OTP 95% — tied highest"},
  {id:"WV",name:"West Virginia",  otp:12,   cig:1.20, due:"20th",    form:"WV/TFR-1",               note:"OTP 12% wholesale"},
  {id:"WI",name:"Wisconsin",      otp:71,   cig:2.52, due:"15th",    form:"TF-100",                  note:"OTP 71% manufacturer"},
  {id:"WY",name:"Wyoming",        otp:20,   cig:0.60, due:"Last day",form:"Tobacco Return",          note:"OTP 20% wholesale"},
  {id:"DC",name:"Washington DC",  otp:96,   cig:4.50, due:"20th",    form:"FR-800",                  note:"OTP 96% — highest overall"},
];

// -- EXPENSE CATEGORIES -------------------------------------------------------
const EXPENSE_CATS=[
  {k:"gas",e:"⛽",l:"Gas / Fuel",line:"Line 9"},
  {k:"mileage",e:"🚗",l:"Mileage",line:"Line 9"},
  {k:"parking_tolls",e:"🅿️",l:"Parking / Tolls",line:"Line 22"},
  {k:"maintenance",e:"🔧",l:"Maintenance",line:"Line 13"},
  {k:"truck_insurance",e:"🚘",l:"Truck Insurance",line:"Line 15"},
  {k:"inspection_registration",e:"🔍",l:"Inspection / Registration",line:"Line 22"},
  {k:"supplies",e:"📦",l:"Supplies",line:"Line 22"},
  {k:"phone",e:"📱",l:"Phone / Communication",line:"Line 25"},
  {k:"warehouse",e:"🏢",l:"Warehouse / Storage",line:"Line 20"},
  {k:"licenses_permits",e:"📜",l:"Licenses & Permits",line:"Line 23"},
  {k:"bank_fees",e:"🏦",l:"Bank / Processing Fees",line:"Line 27"},
  {k:"business_insurance",e:"🛡️",l:"Business Insurance",line:"Line 15"},
  {k:"excise_tax",e:"🧾",l:"Tobacco Excise Tax Paid",line:"Line 23"},
  {k:"legal_accounting",e:"⚖️",l:"Legal / Accounting",line:"Line 17"},
  {k:"food",e:"🍔",l:"Food & Meals",line:"Line 24"},
  {k:"accommodation",e:"🏨",l:"Accommodation",line:"Line 24"},
  {k:"other",e:"📋",l:"Other",line:"Line 22"},
];

// -- PURCHASE ORDERS & SUPPLIER MANAGEMENT ------------------------------------
function CreditMemosTab({creditMemos,setCreditMemos,customers,sales,calcSaleGrandTotal,supabase,showToast,showConfirm,fmt}){
  const uid4=()=>Math.random().toString(36).slice(2,8).toUpperCase();
  const[cmForm,setCmForm]=useState({cust_id:"",invoice_id:"",reason:"Return",amount:"",notes:""});
  const[cmSaving,setCmSaving]=useState(false);
  const openBalance=cid=>creditMemos.filter(m=>m.cust_id===cid&&m.status==="open").reduce((a,m)=>a+parseFloat(m.amount||0),0);
  const saveMemo=async()=>{
    if(!cmForm.cust_id||!cmForm.amount||parseFloat(cmForm.amount)<=0)return showToast("Customer and amount required","error");
    setCmSaving(true);
    const rec={id:"CM-"+uid4(),cust_id:cmForm.cust_id,invoice_id:cmForm.invoice_id||null,reason:cmForm.reason||"Return",amount:parseFloat(cmForm.amount),notes:cmForm.notes||"",status:"open",created_at:new Date().toISOString()};
    const{error}=await supabase.from("credit_memos").insert(rec);
    if(error){showToast(error.message,"error");setCmSaving(false);return;}
    setCreditMemos(prev=>[rec,...prev]);
    setCmForm({cust_id:"",invoice_id:"",reason:"Return",amount:"",notes:""});
    showToast("✅ Credit memo issued");
    setCmSaving(false);
  };
  const voidMemo=id=>showConfirm("Void this credit memo?",async()=>{
    await supabase.from("credit_memos").update({status:"voided"}).eq("id",id);
    setCreditMemos(prev=>prev.map(m=>m.id===id?{...m,status:"voided"}:m));
    showToast("Credit memo voided");
  });
  const applyMemo=async id=>{
    await supabase.from("credit_memos").update({status:"applied"}).eq("id",id);
    setCreditMemos(prev=>prev.map(m=>m.id===id?{...m,status:"applied"}:m));
    showToast("Credit applied to account");
  };
  const totalOpen=creditMemos.filter(m=>m.status==="open").reduce((a,m)=>a+parseFloat(m.amount||0),0);
  const statusBadge=s=>({open:<span className="bdg ba2">OPEN</span>,applied:<span className="bdg bg2">APPLIED</span>,voided:<span className="bdg br2">VOIDED</span>}[s]||<span className="bdg bgr">{s}</span>);
  return(
    <div className="fu">
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,marginBottom:4}}>📝 Credit Memos</div>
      <div style={{fontSize:12,color:"#9ca3af",marginBottom:16}}>Issue credits for product returns or billing adjustments. Open credits reduce the customer's outstanding balance.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
        {[{l:"Total Memos",v:creditMemos.length,c:"#7c3aed"},{l:"Open Credits",v:fmt(totalOpen),c:"#dc2626"},{l:"Applied",v:creditMemos.filter(m=>m.status==="applied").length,c:"#059669"},{l:"Voided",v:creditMemos.filter(m=>m.status==="voided").length,c:"#9ca3af"}].map(k=>(
          <div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:18,alignItems:"start"}}>
        <div className="card" style={{padding:20,borderTop:"3px solid #7c3aed"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,marginBottom:14}}>➕ Issue Credit Memo</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div><label>Customer *</label>
              <select value={cmForm.cust_id} onChange={e=>setCmForm(f=>({...f,cust_id:e.target.value,invoice_id:""}))}>
                <option value="">— Select Customer —</option>
                {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {cmForm.cust_id&&openBalance(cmForm.cust_id)>0&&(
              <div style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:7,padding:"7px 10px",fontSize:11,color:"#065f46"}}>
                💳 Existing open credit: <strong>{fmt(openBalance(cmForm.cust_id))}</strong>
              </div>
            )}
            <div><label>Related Invoice (optional)</label>
              <select value={cmForm.invoice_id} onChange={e=>setCmForm(f=>({...f,invoice_id:e.target.value}))}>
                <option value="">— No specific invoice —</option>
                {sales.filter(s=>!cmForm.cust_id||s.cust_id===cmForm.cust_id).slice(0,50).map(s=>(
                  <option key={s.id} value={s.id}>{s.id} · {s.date} · {fmt(calcSaleGrandTotal(s))}</option>
                ))}
              </select>
            </div>
            <div><label>Reason</label>
              <select value={cmForm.reason} onChange={e=>setCmForm(f=>({...f,reason:e.target.value}))}>
                {["Return","Damaged Goods","Billing Error","Overcharge","Goodwill","Short Shipment","Other"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div><label>Credit Amount ($) *</label>
              <input type="number" min="0" step="0.01" placeholder="0.00" value={cmForm.amount} onChange={e=>setCmForm(f=>({...f,amount:e.target.value}))}/>
            </div>
            <div><label>Internal Notes</label>
              <input placeholder="e.g. Customer returned 2 damaged cases" value={cmForm.notes} onChange={e=>setCmForm(f=>({...f,notes:e.target.value}))}/>
            </div>
            <button onClick={saveMemo} disabled={cmSaving} style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:9,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",opacity:cmSaving?0.7:1}}>
              {cmSaving?"Saving…":"📝 Issue Credit Memo"}
            </button>
          </div>
        </div>
        <div>
          {creditMemos.length===0
            ?<div className="card" style={{padding:40,textAlign:"center",color:"#9ca3af"}}>
                <div style={{fontSize:36,marginBottom:8}}>📝</div>
                <div style={{fontSize:14,fontWeight:600}}>No credit memos yet</div>
                <div style={{fontSize:12}}>Issue your first credit memo using the form</div>
              </div>
            :<div className="card" style={{overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{background:"#0a1628",color:"#fff"}}>
                    {["Memo #","Date","Customer","Invoice","Reason","Amount","Status","Actions"].map(h=>(
                      <th key={h} style={{padding:"9px 13px",textAlign:"left",fontSize:10,fontWeight:700}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {creditMemos.map(m=>{
                      const cust=customers.find(c=>c.id===m.cust_id);
                      return(
                        <tr key={m.id} style={{borderBottom:"1px solid #f3f4f6",background:m.status==="voided"?"#fafafa":"#fff"}}>
                          <td style={{padding:"9px 13px",fontWeight:700,color:"#7c3aed",fontSize:12}}>{m.id}</td>
                          <td style={{padding:"9px 13px",fontSize:11,color:"#6b7280"}}>{new Date(m.created_at).toLocaleDateString()}</td>
                          <td style={{padding:"9px 13px",fontWeight:600,fontSize:12}}>{cust?.name||"—"}</td>
                          <td style={{padding:"9px 13px",fontSize:11,color:"#6b7280"}}>{m.invoice_id||"—"}</td>
                          <td style={{padding:"9px 13px"}}><span className="bdg bb2">{m.reason}</span></td>
                          <td style={{padding:"9px 13px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:m.status==="voided"?"#9ca3af":"#dc2626"}}>{fmt(m.amount)}</td>
                          <td style={{padding:"9px 13px"}}>{statusBadge(m.status)}</td>
                          <td style={{padding:"9px 13px"}}>
                            <div style={{display:"flex",gap:5}}>
                              {m.status==="open"&&<button onClick={()=>applyMemo(m.id)} style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#065f46",cursor:"pointer",fontWeight:700}}>✅ Apply</button>}
                              {m.status==="open"&&<button onClick={()=>voidMemo(m.id)} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#dc2626",cursor:"pointer",fontWeight:700}}>✕ Void</button>}
                              {m.notes&&<span style={{fontSize:10,color:"#9ca3af",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"inline-block"}} title={m.notes}>📝 {m.notes}</span>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

function DeliverySchedule({trucks,setTrucks,customers,supabase,showToast}){
  const[schedTruck,setSchedTruck]=useState(trucks[0]?.id||"");
  const[schedDay,setSchedDay]=useState("Monday");
  const[saving2,setSaving2]=useState(false);
  const[optimizing,setOptimizing]=useState(false);
  const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const truck=trucks.find(t=>t.id===schedTruck);
  const getSchedule=()=>{try{return JSON.parse(truck?.schedule||"{}");}catch{return{};}};
  const sched=getSchedule();
  const dayStops=sched[schedDay]||[];
  const assignedCusts=customers.filter(c=>c.truck_id===schedTruck);
  const saveSchedule=async(newSched)=>{
    setSaving2(true);
    await supabase.from("trucks").update({schedule:JSON.stringify(newSched)}).eq("id",schedTruck);
    setTrucks(prev=>prev.map(t=>t.id===schedTruck?{...t,schedule:JSON.stringify(newSched)}:t));
    setSaving2(false);
  };
  const moveStop=(idx,dir)=>{
    const stops=[...dayStops];const newIdx=idx+dir;
    if(newIdx<0||newIdx>=stops.length)return;
    [stops[idx],stops[newIdx]]=[stops[newIdx],stops[idx]];
    saveSchedule({...sched,[schedDay]:stops});
  };
  const addStop=cid=>{
    if(dayStops.find(s=>s.cid===cid))return showToast("Already on this day's route","error");
    saveSchedule({...sched,[schedDay]:[...dayStops,{cid,note:""}]});
  };
  const removeStop=cid=>saveSchedule({...sched,[schedDay]:dayStops.filter(s=>s.cid!==cid)});
  const updateNote=(cid,note)=>saveSchedule({...sched,[schedDay]:dayStops.map(s=>s.cid===cid?{...s,note}:s)});

  // Geocode address using free Nominatim API
  const geocode=async(address)=>{
    try{
      const res=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,{headers:{"Accept-Language":"en-US"}});
      const data=await res.json();
      if(data[0])return{lat:parseFloat(data[0].lat),lng:parseFloat(data[0].lon)};
    }catch{}
    return null;
  };

  // Haversine distance in miles
  const haversine=(a,b)=>{
    const R=3958.8,dLat=(b.lat-a.lat)*Math.PI/180,dLng=(b.lng-a.lng)*Math.PI/180;
    const x=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
    return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
  };

  // Nearest-neighbor route optimization
  const optimizeRoute=async()=>{
    if(dayStops.length<3)return showToast("Need at least 3 stops to optimize","error");
    setOptimizing(true);
    showToast("🗺 Geocoding addresses… this may take a moment");
    try{
      // Geocode all stops
      const coords=[];
      for(const s of dayStops){
        const cust=customers.find(c=>c.id===s.cid);
        const addr=cust?.address;
        if(addr){
          await new Promise(r=>setTimeout(r,300)); // rate limit Nominatim
          const geo=await geocode(addr);
          coords.push({...s,lat:geo?.lat||null,lng:geo?.lng||null});
        }else{coords.push({...s,lat:null,lng:null});}
      }
      // Separate geocoded and non-geocoded
      const withCoords=coords.filter(s=>s.lat&&s.lng);
      const without=coords.filter(s=>!s.lat||!s.lng);
      if(withCoords.length<2){showToast("Not enough addresses geocoded — add addresses to customers","error");setOptimizing(false);return;}
      // Nearest-neighbor algorithm starting from first stop
      const unvisited=[...withCoords];
      const ordered=[unvisited.splice(0,1)[0]];
      while(unvisited.length>0){
        const last=ordered[ordered.length-1];
        let nearestIdx=0,nearestDist=Infinity;
        unvisited.forEach((s,i)=>{const d=haversine(last,s);if(d<nearestDist){nearestDist=d;nearestIdx=i;}});
        ordered.push(unvisited.splice(nearestIdx,1)[0]);
      }
      const optimized=[...ordered,...without];
      await saveSchedule({...sched,[schedDay]:optimized.map(s=>({cid:s.cid,note:s.note||""}))});
      showToast(`✅ Route optimized — ${ordered.length} stops sorted by distance`);
    }catch(e){showToast("Optimization failed: "+e.message,"error");}
    setOptimizing(false);
  };
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div className="card" style={{padding:14}}>
          <label>Select Driver / Truck</label>
          <select value={schedTruck} onChange={e=>setSchedTruck(e.target.value)}>
            {trucks.map(t=><option key={t.id} value={t.id}>{t.driver} — {t.plate} {t.route?`(${t.route})`:""}</option>)}
          </select>
        </div>
        <div className="card" style={{padding:14}}>
          <label>Day of Week</label>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:4}}>
            {days.map(d=>(
              <button key={d} onClick={()=>setSchedDay(d)}
                style={{padding:"5px 10px",borderRadius:20,border:`1.5px solid ${schedDay===d?"#0a1628":"#e5e7eb"}`,background:schedDay===d?"#0a1628":"#fff",color:schedDay===d?"#fff":"#6b7280",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                {d.slice(0,3)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card" style={{padding:18,borderTop:"3px solid #0a1628"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14}}>{truck?.driver} — {schedDay} Route</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {saving2&&<span style={{fontSize:11,color:"#9ca3af"}}>Saving…</span>}
              {dayStops.length>=3&&<button onClick={optimizeRoute} disabled={optimizing}
                style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:6,padding:"5px 10px",fontSize:10,fontWeight:700,cursor:"pointer",opacity:optimizing?0.7:1}}>
                {optimizing?"Optimizing…":"🗺 Optimize Route"}
              </button>}
            </div>
          </div>
          {dayStops.length===0
            ?<div style={{textAlign:"center",padding:"24px 0",color:"#9ca3af",fontSize:13}}>
                <div style={{fontSize:28,marginBottom:8}}>📍</div>No stops on {schedDay} yet.<br/>Add from the list →
              </div>
            :dayStops.map((s,idx)=>{
              const cust=customers.find(c=>c.id===s.cid);
              return(
                <div key={s.cid} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8,padding:"10px 12px",background:"#f9fafb",borderRadius:8,border:"1px solid #e5e7eb"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#0a1628",minWidth:24,textAlign:"center",lineHeight:1.4}}>{idx+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13}}>{cust?.name||s.cid}</div>
                    <div style={{fontSize:11,color:"#9ca3af"}}>{cust?.address||""}</div>
                    <input placeholder="Stop note" value={s.note||""} onChange={e=>updateNote(s.cid,e.target.value)}
                      style={{marginTop:4,width:"100%",border:"1px solid #e5e7eb",borderRadius:5,padding:"4px 8px",fontSize:11,boxSizing:"border-box"}}/>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:3}}>
                    <button onClick={()=>moveStop(idx,-1)} disabled={idx===0} style={{background:"#f3f4f6",border:"none",borderRadius:4,padding:"2px 6px",cursor:"pointer",fontSize:12,opacity:idx===0?0.3:1}}>▲</button>
                    <button onClick={()=>moveStop(idx,1)} disabled={idx===dayStops.length-1} style={{background:"#f3f4f6",border:"none",borderRadius:4,padding:"2px 6px",cursor:"pointer",fontSize:12,opacity:idx===dayStops.length-1?0.3:1}}>▼</button>
                    <button onClick={()=>removeStop(s.cid)} style={{background:"#fef2f2",border:"none",borderRadius:4,padding:"2px 6px",cursor:"pointer",fontSize:12,color:"#dc2626"}}>✕</button>
                  </div>
                </div>
              );
            })
          }
        </div>
        <div className="card" style={{padding:18,borderTop:"3px solid #7c3aed"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,marginBottom:12}}>➕ Add Stop — Assigned Customers</div>
          {assignedCusts.length===0
            ?<div style={{fontSize:12,color:"#9ca3af"}}>No customers assigned to this truck yet.</div>
            :assignedCusts.map(c=>{
              const already=!!dayStops.find(s=>s.cid===c.id);
              return(
                <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f3f4f6"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:12,color:already?"#9ca3af":"#212121"}}>{c.name}</div>
                    <div style={{fontSize:10,color:"#9ca3af"}}>{c.address||""}</div>
                  </div>
                  <button onClick={()=>addStop(c.id)} disabled={already}
                    style={{background:already?"#f3f4f6":"#ede9fe",border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,color:already?"#9ca3af":"#7c3aed",cursor:already?"default":"pointer",fontWeight:700}}>
                    {already?"✓ Added":"+ Add"}
                  </button>
                </div>
              );
            })
          }
        </div>
      </div>
      <div className="card" style={{padding:18,marginTop:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,marginBottom:12}}>📅 Weekly Overview — {truck?.driver}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
          {days.map(d=>{
            const stops=(sched[d]||[]);
            return(
              <div key={d} onClick={()=>setSchedDay(d)} style={{padding:"10px 8px",background:schedDay===d?"#0a1628":stops.length?"#f5f3ff":"#f9fafb",borderRadius:8,cursor:"pointer",textAlign:"center",border:`1px solid ${schedDay===d?"#0a1628":stops.length?"#ddd6fe":"#e5e7eb"}`}}>
                <div style={{fontSize:11,fontWeight:700,color:schedDay===d?"#fff":stops.length?"#7c3aed":"#9ca3af"}}>{d.slice(0,3).toUpperCase()}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:20,color:schedDay===d?"#fff":stops.length?"#7c3aed":"#d1d5db",marginTop:4}}>{stops.length}</div>
                <div style={{fontSize:9,color:schedDay===d?"#c4b5fd":"#9ca3af"}}>{stops.length===1?"stop":"stops"}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BankReconcile({paymentsLog,customers,getC,fmt}){
  const[bankRows,setBankRows]=useState([]);
  const[csvErr,setCsvErr]=useState("");
  const importBankCSV=async(file)=>{
    if(!file)return;
    setCsvErr("");
    const text=await file.text();
    const lines=text.trim().split("\n").filter(l=>l.trim());
    const rows=[];
    for(const line of lines.slice(1)){
      const parts=line.split(",").map(s=>s.replace(/^"|"$/g,"").trim());
      const date=parts[0]||"",desc=parts[1]||"";
      const amtRaw=parts.find(p=>parseFloat(p.replace(/[$,]/g,""))>0)||"0";
      const amt=parseFloat(amtRaw.replace(/[$,]/g,""))||0;
      if(amt>0)rows.push({date,desc,amount:amt,matched:null});
    }
    if(!rows.length){setCsvErr("No valid rows found. CSV needs: Date, Description, Amount columns.");return;}
    setBankRows(rows.map(r=>{
      const match=paymentsLog.find(p=>Math.abs(p.amount-r.amount)<0.01);
      return{...r,matched:match?.id||null};
    }));
  };
  const matched=bankRows.filter(r=>r.matched);
  const unmatched=bankRows.filter(r=>!r.matched);
  const bankTotal=bankRows.reduce((a,r)=>a+r.amount,0);
  const sysTotal=paymentsLog.reduce((a,p)=>a+p.amount,0);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        {[{l:"Bank Statement Total",v:fmt(bankTotal),c:"#0ea5e9"},{l:"System Recorded",v:fmt(sysTotal),c:"#059669"},{l:"Difference",v:fmt(Math.abs(bankTotal-sysTotal)),c:Math.abs(bankTotal-sysTotal)<0.01?"#059669":"#dc2626"}].map(k=>(
          <div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>
        ))}
      </div>
      <div className="card" style={{padding:18,marginBottom:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,marginBottom:10}}>📥 Import Bank Statement CSV</div>
        <div style={{fontSize:11,color:"#6b7280",marginBottom:10}}>Export transactions from your bank as CSV. Format: Date, Description, Amount (deposits only)</div>
        <input type="file" accept=".csv" onChange={e=>importBankCSV(e.target.files[0])}/>
        {csvErr&&<div style={{fontSize:11,color:"#dc2626",marginTop:6}}>{csvErr}</div>}
      </div>
      {bankRows.length>0&&(
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"10px 16px",borderBottom:"1px solid #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:"#6b7280"}}>{bankRows.length} TRANSACTIONS · {matched.length} MATCHED · {unmatched.length} UNMATCHED</div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#0a1628",color:"#fff"}}>
                {["Bank Date","Description","Amount","Match in System","Status"].map(h=>(
                  <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,fontWeight:700}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {bankRows.map((r,i)=>{
                  const sysMatch=r.matched?paymentsLog.find(p=>p.id===r.matched):null;
                  return(
                    <tr key={i} style={{borderBottom:"1px solid #f3f4f6",background:sysMatch?"#f0fdf4":"#fef2f2"}}>
                      <td style={{padding:"8px 12px",fontSize:11,color:"#6b7280"}}>{r.date}</td>
                      <td style={{padding:"8px 12px",fontSize:11,color:"#374151",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.desc}</td>
                      <td style={{padding:"8px 12px",fontWeight:700,color:"#059669"}}>{fmt(r.amount)}</td>
                      <td style={{padding:"8px 12px",fontSize:11}}>
                        {sysMatch
                          ?<span style={{color:"#059669",fontWeight:600}}>{sysMatch.id} · {getC(sysMatch.cust_id)?.name||"?"} · {sysMatch.method}</span>
                          :<select onChange={e=>setBankRows(prev=>prev.map((x,xi)=>xi===i?{...x,matched:e.target.value||null}:x))}
                            style={{fontSize:11,border:"1px solid #e5e7eb",borderRadius:5,padding:"4px 8px",width:"100%"}}>
                            <option value="">— Select match —</option>
                            {paymentsLog.filter(p=>Math.abs(p.amount-r.amount)<5).map(p=>(
                              <option key={p.id} value={p.id}>{p.id} · {getC(p.cust_id)?.name} · {fmt(p.amount)}</option>
                            ))}
                          </select>
                        }
                      </td>
                      <td style={{padding:"8px 12px"}}>{sysMatch?<span className="bdg bg2">✓ MATCHED</span>:<span className="bdg br2">UNMATCHED</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function PromotionsTab({promotions,setPromotions,products,customers,supabase,showToast,showConfirm,fmt}){
  const uid6=()=>Math.random().toString(36).slice(2,8).toUpperCase();
  const[form,setForm]=useState({code:"",type:"percent",value:"",min_order:"",product_id:"",applies_to:"all",expiry:"",active:true,description:""});
  const[saving,setSaving]=useState(false);
  const[showForm,setShowForm]=useState(false);

  const savePromo=async()=>{
    if(!form.code.trim()||!form.value||parseFloat(form.value)<=0)return showToast("Code and discount value required","error");
    setSaving(true);
    const rec={id:"PROMO-"+uid6(),code:form.code.trim().toUpperCase(),type:form.type,value:parseFloat(form.value),min_order:parseFloat(form.min_order)||0,product_id:form.product_id||null,applies_to:form.applies_to,expiry:form.expiry||null,active:true,description:form.description,uses:0,created_at:new Date().toISOString()};
    const{error}=await supabase.from("promotions").insert(rec);
    if(error){showToast(error.message,"error");setSaving(false);return;}
    setPromotions(prev=>[rec,...prev]);
    setForm({code:"",type:"percent",value:"",min_order:"",product_id:"",applies_to:"all",expiry:"",active:true,description:""});
    setShowForm(false);
    showToast("✅ Promotion created");
    setSaving(false);
  };

  const togglePromo=async(id,active)=>{
    await supabase.from("promotions").update({active:!active}).eq("id",id);
    setPromotions(prev=>prev.map(p=>p.id===id?{...p,active:!active}:p));
    showToast(!active?"Promotion activated":"Promotion paused");
  };

  const deletePromo=id=>showConfirm("Delete this promotion?",async()=>{
    await supabase.from("promotions").delete().eq("id",id);
    setPromotions(prev=>prev.filter(p=>p.id!==id));
    showToast("Promotion deleted");
  });

  const discountLabel=p=>p.type==="percent"?`${p.value}% off`:p.type==="fixed"?`${fmt(p.value)} off`:p.type==="bogo"?"Buy 1 Get 1":p.type==="free_shipping"?"Free Delivery":`${p.value} off`;

  return(
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22}}>🏷️ Promotions & Discounts</div>
          <div style={{fontSize:12,color:"#9ca3af"}}>Promo codes, volume discounts, and time-limited offers</div>
        </div>
        <button className="btn ba" onClick={()=>setShowForm(s=>!s)}>+ New Promotion</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        {[{l:"Total Promos",v:promotions.length,c:"#7c3aed"},{l:"Active",v:promotions.filter(p=>p.active).length,c:"#059669"},{l:"Total Uses",v:promotions.reduce((a,p)=>a+(p.uses||0),0),c:"#0ea5e9"},{l:"Expired",v:promotions.filter(p=>p.expiry&&new Date(p.expiry)<new Date()).length,c:"#9ca3af"}].map(k=>(
          <div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>
        ))}
      </div>

      {showForm&&<div className="card" style={{padding:20,marginBottom:16,borderTop:"3px solid #7c3aed"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,marginBottom:14}}>🏷️ New Promotion</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
          <div><label>Promo Code *</label><input placeholder="e.g. SAVE10" value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value.toUpperCase()}))}/></div>
          <div><label>Discount Type</label>
            <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
              <option value="percent">% Percentage off</option>
              <option value="fixed">$ Fixed amount off</option>
              <option value="bogo">Buy 1 Get 1 Free</option>
              <option value="free_shipping">Free Delivery</option>
            </select>
          </div>
          {form.type!=="bogo"&&form.type!=="free_shipping"&&<div><label>{form.type==="percent"?"Discount %":"Discount $"} *</label><input type="number" min="0" placeholder={form.type==="percent"?"10":"5.00"} value={form.value} onChange={e=>setForm(f=>({...f,value:e.target.value}))}/></div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:10}}>
          <div><label>Min Order ($)</label><input type="number" min="0" placeholder="0 = no minimum" value={form.min_order} onChange={e=>setForm(f=>({...f,min_order:e.target.value}))}/></div>
          <div><label>Applies To</label>
            <select value={form.applies_to} onChange={e=>setForm(f=>({...f,applies_to:e.target.value}))}>
              <option value="all">All Products</option>
              <option value="product">Specific Product</option>
            </select>
          </div>
          {form.applies_to==="product"&&<div><label>Product</label>
            <select value={form.product_id} onChange={e=>setForm(f=>({...f,product_id:e.target.value}))}>
              <option value="">— Select —</option>
              {products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>}
          <div><label>Expiry Date</label><input type="date" value={form.expiry} onChange={e=>setForm(f=>({...f,expiry:e.target.value}))}/></div>
        </div>
        <div style={{marginBottom:12}}><label>Description / Internal Note</label><input placeholder="e.g. Summer promotion for loyal customers" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button className="btn bgh" onClick={()=>setShowForm(false)}>Cancel</button>
          <button className="btn ba" onClick={savePromo} disabled={saving}>{saving?"Saving…":"💾 Save Promotion"}</button>
        </div>
      </div>}

      {promotions.length===0&&!showForm
        ?<div className="card" style={{padding:40,textAlign:"center",color:"#9ca3af"}}>
            <div style={{fontSize:36,marginBottom:8}}>🏷️</div>
            <div style={{fontWeight:600,fontSize:14}}>No promotions yet</div>
            <div style={{fontSize:12}}>Create a promo code or discount to apply at checkout</div>
          </div>
        :<div className="card" style={{overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#0a1628",color:"#fff"}}>
                {["Code","Type","Discount","Min Order","Applies To","Expiry","Uses","Status","Actions"].map(h=>(
                  <th key={h} style={{padding:"9px 13px",textAlign:"left",fontSize:10,fontWeight:700}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {promotions.map(p=>{
                  const expired=p.expiry&&new Date(p.expiry)<new Date();
                  const prod=products.find(x=>x.id===p.product_id);
                  return(
                    <tr key={p.id} style={{borderBottom:"1px solid #f3f4f6",background:expired?"#fafafa":"#fff",opacity:expired||!p.active?0.7:1}}>
                      <td style={{padding:"9px 13px"}}><span style={{fontFamily:"monospace",fontWeight:700,fontSize:13,background:"#f5f3ff",color:"#7c3aed",padding:"2px 8px",borderRadius:4}}>{p.code}</span></td>
                      <td style={{padding:"9px 13px",fontSize:11,color:"#6b7280",textTransform:"capitalize"}}>{p.type.replace("_"," ")}</td>
                      <td style={{padding:"9px 13px",fontWeight:700,color:"#059669"}}>{discountLabel(p)}</td>
                      <td style={{padding:"9px 13px",fontSize:11,color:"#6b7280"}}>{p.min_order>0?fmt(p.min_order):"—"}</td>
                      <td style={{padding:"9px 13px",fontSize:11,color:"#6b7280"}}>{p.applies_to==="product"&&prod?prod.name:"All products"}</td>
                      <td style={{padding:"9px 13px",fontSize:11,color:expired?"#dc2626":"#6b7280"}}>{p.expiry||"—"}{expired&&<span className="bdg br2" style={{marginLeft:4,fontSize:9}}>EXP</span>}</td>
                      <td style={{padding:"9px 13px",fontSize:12,fontWeight:600,color:"#7c3aed"}}>{p.uses||0}</td>
                      <td style={{padding:"9px 13px"}}><span className={`bdg ${p.active&&!expired?"bg2":"bgr"}`}>{p.active&&!expired?"ACTIVE":"INACTIVE"}</span></td>
                      <td style={{padding:"9px 13px"}}>
                        <div style={{display:"flex",gap:5}}>
                          {!expired&&<button onClick={()=>togglePromo(p.id,p.active)} style={{background:p.active?"#fff7ed":"#f0fdf4",border:`1px solid ${p.active?"#fed7aa":"#a7f3d0"}`,borderRadius:6,padding:"3px 8px",fontSize:10,color:p.active?"#c2410c":"#065f46",cursor:"pointer",fontWeight:700}}>{p.active?"Pause":"Activate"}</button>}
                          <button onClick={()=>deletePromo(p.id)} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:"3px 8px",fontSize:10,color:"#dc2626",cursor:"pointer",fontWeight:700}}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  );
}

function RecurringOrdersTab({recurringOrders,setRecurringOrders,customers,products,trucks,supabase,showToast,showConfirm,fmt}){
  const uid5=()=>Math.random().toString(36).slice(2,8).toUpperCase();
  const[form,setForm]=useState({cust_id:"",truck_id:"",frequency:"Weekly",day:"Monday",items:[],notes:"",active:true});
  const[saving,setSaving]=useState(false);
  const[showForm,setShowForm]=useState(false);
  const[generating,setGenerating]=useState({});
  const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const freqs=["Daily","Weekly","Bi-weekly","Monthly"];
  const todayName=new Date().toLocaleDateString("en-US",{weekday:"long"});

  // Determine if a recurring order is due today
  const isDue=r=>{
    if(!r.active)return false;
    if(r.frequency==="Daily")return true;
    if(r.frequency==="Weekly")return r.day===todayName;
    if(r.frequency==="Bi-weekly"){
      if(r.day!==todayName)return false;
      if(!r.last_run)return true;
      const last=new Date(r.last_run);
      const diff=Math.floor((new Date()-last)/(1000*60*60*24));
      return diff>=14;
    }
    if(r.frequency==="Monthly"){
      if(!r.last_run)return r.day===todayName;
      const last=new Date(r.last_run);
      const diff=Math.floor((new Date()-last)/(1000*60*60*24));
      return diff>=28&&r.day===todayName;
    }
    return false;
  };

  // Generate an actual order from a recurring template
  const generateOrder=async(r)=>{
    setGenerating(prev=>({...prev,[r.id]:true}));
    try{
      const cust=customers.find(c=>c.id===r.cust_id);
      const truck=trucks.find(t=>t.id===r.truck_id);
      const total=r.items.reduce((a,it)=>{const p=products.find(x=>x.id===it.pid);return a+(p?.price||0)*it.qty;},0);
      const rec={
        id:"ORD-"+uid5(),
        cust_id:r.cust_id,
        customer_name:cust?.name||r.cust_name,
        customer_address:cust?.address||"",
        customer_phone:cust?.phone||"",
        date:new Date().toLocaleDateString(),
        items:r.items,
        subtotal:total,
        tax:0,
        total,
        notes:`Auto-generated from recurring order ${r.id}${r.notes?` — ${r.notes}`:""}`,
        status:"approved",
        payment_method:"delivery",
        truck_id:r.truck_id||null,
        created_at:new Date().toISOString(),
      };
      const{error}=await supabase.from("orders").insert(rec);
      if(error)throw error;
      // Update last_run
      await supabase.from("recurring_orders").update({last_run:new Date().toISOString()}).eq("id",r.id);
      setRecurringOrders(prev=>prev.map(x=>x.id===r.id?{...x,last_run:new Date().toISOString()}:x));
      showToast(`✅ Order generated for ${cust?.name||r.cust_name}`);
    }catch(e){showToast(e.message,"error");}
    setGenerating(prev=>({...prev,[r.id]:false}));
  };

  const addItem=()=>setForm(f=>({...f,items:[...f.items,{pid:products[0]?.id||"",qty:1}]}));
  const updateItem=(idx,k,v)=>setForm(f=>({...f,items:f.items.map((it,i)=>i===idx?{...it,[k]:v}:it)}));
  const removeItem=idx=>setForm(f=>({...f,items:f.items.filter((_,i)=>i!==idx)}));

  const saveRec=async()=>{
    if(!form.cust_id||!form.items.length)return showToast("Customer and at least one item required","error");
    setSaving(true);
    const cust=customers.find(c=>c.id===form.cust_id);
    const rec={id:"REC-"+uid5(),cust_id:form.cust_id,cust_name:cust?.name||"",truck_id:form.truck_id||null,frequency:form.frequency,day:form.day,items:form.items,notes:form.notes,active:true,last_run:null,created_at:new Date().toISOString()};
    const{error}=await supabase.from("recurring_orders").insert(rec);
    if(error){showToast(error.message,"error");setSaving(false);return;}
    setRecurringOrders(prev=>[rec,...prev]);
    setForm({cust_id:"",truck_id:"",frequency:"Weekly",day:"Monday",items:[],notes:"",active:true});
    setShowForm(false);
    showToast("✅ Recurring order created");
    setSaving(false);
  };

  const toggleActive=async(id,active)=>{
    await supabase.from("recurring_orders").update({active:!active}).eq("id",id);
    setRecurringOrders(prev=>prev.map(r=>r.id===id?{...r,active:!active}:r));
    showToast(!active?"Recurring order activated":"Recurring order paused");
  };

  const deleteRec=id=>showConfirm("Delete this recurring order?",async()=>{
    await supabase.from("recurring_orders").delete().eq("id",id);
    setRecurringOrders(prev=>prev.filter(r=>r.id!==id));
    showToast("Recurring order deleted");
  });

  const orderTotal=items=>items.reduce((a,it)=>{const p=products.find(x=>x.id===it.pid);return a+(p?.price||0)*(it.qty||0);},0);
  const dueToday=recurringOrders.filter(isDue);

  return(
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22}}>🔁 Recurring Orders</div>
          <div style={{fontSize:12,color:"#9ca3af"}}>Scheduled orders — generates automatically based on frequency</div>
        </div>
        <button className="btn ba" onClick={()=>setShowForm(s=>!s)}>+ New Recurring Order</button>
      </div>

      {/* Due Today Banner */}
      {dueToday.length>0&&(
        <div style={{background:"#f0fdf4",border:"1.5px solid #a7f3d0",borderRadius:10,padding:"14px 18px",marginBottom:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#065f46",marginBottom:10}}>
            🗓 {dueToday.length} ORDER{dueToday.length!==1?"S":""} DUE TODAY ({todayName})
          </div>
          {dueToday.map(r=>(
            <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #d1fae5"}}>
              <div>
                <div style={{fontWeight:600,fontSize:13,color:"#0a1628"}}>{r.cust_name}</div>
                <div style={{fontSize:11,color:"#6b7280"}}>{r.frequency} · {r.items.length} item{r.items.length!==1?"s":""} · Est. {fmt(orderTotal(r.items))}</div>
              </div>
              <button onClick={()=>generateOrder(r)} disabled={!!generating[r.id]}
                style={{background:"#059669",color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",opacity:generating[r.id]?0.7:1}}>
                {generating[r.id]?"Generating…":"⚡ Generate Order"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        {[{l:"Total Templates",v:recurringOrders.length,c:"#7c3aed"},{l:"Active",v:recurringOrders.filter(r=>r.active).length,c:"#059669"},{l:"Due Today",v:dueToday.length,c:dueToday.length>0?"#f59e0b":"#9ca3af"},{l:"Paused",v:recurringOrders.filter(r=>!r.active).length,c:"#9ca3af"}].map(k=>(
          <div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>
        ))}
      </div>

      {showForm&&<div className="card" style={{padding:20,marginBottom:16,borderTop:"3px solid #7c3aed"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,marginBottom:14}}>🔁 New Recurring Order Template</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:12}}>
          <div><label>Customer *</label>
            <select value={form.cust_id} onChange={e=>setForm(f=>({...f,cust_id:e.target.value}))}>
              <option value="">— Select —</option>
              {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label>Driver / Truck</label>
            <select value={form.truck_id} onChange={e=>setForm(f=>({...f,truck_id:e.target.value}))}>
              <option value="">— Any —</option>
              {trucks.map(t=><option key={t.id} value={t.id}>{t.driver}</option>)}
            </select>
          </div>
          <div><label>Frequency</label>
            <select value={form.frequency} onChange={e=>setForm(f=>({...f,frequency:e.target.value}))}>
              {freqs.map(f=><option key={f}>{f}</option>)}
            </select>
          </div>
          <div><label>Day</label>
            <select value={form.day} onChange={e=>setForm(f=>({...f,day:e.target.value}))}>
              {days.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#6b7280",marginBottom:6}}>ORDER ITEMS</div>
        {form.items.map((it,idx)=>(
          <div key={idx} style={{display:"grid",gridTemplateColumns:"2fr 1fr auto",gap:8,marginBottom:6,alignItems:"center"}}>
            <select value={it.pid} onChange={e=>updateItem(idx,"pid",e.target.value)}>
              {products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input type="number" min="1" placeholder="Qty" value={it.qty} onChange={e=>updateItem(idx,"qty",parseInt(e.target.value)||1)}/>
            <button onClick={()=>removeItem(idx)} style={{background:"#fef2f2",border:"none",borderRadius:6,padding:"6px 10px",color:"#dc2626",cursor:"pointer",fontWeight:700}}>✕</button>
          </div>
        ))}
        <div style={{display:"flex",gap:8,marginTop:8,marginBottom:12,alignItems:"center"}}>
          <button className="btn bb" onClick={addItem}>+ Add Item</button>
          {form.items.length>0&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#7c3aed",marginLeft:"auto"}}>Est. {fmt(orderTotal(form.items))}/order</span>}
        </div>
        <div><label>Notes</label><input placeholder="e.g. Ring doorbell, collect cash" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:14}}>
          <button className="btn bgh" onClick={()=>setShowForm(false)}>Cancel</button>
          <button className="btn ba" onClick={saveRec} disabled={saving}>{saving?"Saving…":"💾 Save Template"}</button>
        </div>
      </div>}

      {recurringOrders.length===0&&!showForm
        ?<div className="card" style={{padding:40,textAlign:"center",color:"#9ca3af"}}>
            <div style={{fontSize:36,marginBottom:8}}>🔁</div>
            <div style={{fontWeight:600,fontSize:14}}>No recurring orders yet</div>
            <div style={{fontSize:12}}>Create a template for customers who order on a regular schedule</div>
          </div>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
          {recurringOrders.map(r=>{
            const due=isDue(r);
            return(
            <div key={r.id} className="card" style={{padding:16,borderLeft:`3px solid ${due?"#f59e0b":r.active?"#059669":"#e5e7eb"}`,opacity:r.active?1:0.7}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#0a1628"}}>{r.cust_name}</div>
                  <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>🔁 {r.frequency} · Every {r.day}</div>
                  {r.last_run&&<div style={{fontSize:10,color:"#9ca3af"}}>Last run: {new Date(r.last_run).toLocaleDateString()}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                  <span className={`bdg ${r.active?"bg2":"bgr"}`}>{r.active?"ACTIVE":"PAUSED"}</span>
                  {due&&<span className="bdg ba2">DUE TODAY</span>}
                </div>
              </div>
              <div style={{marginBottom:8}}>
                {(r.items||[]).map((it,i)=>{const p=products.find(x=>x.id===it.pid);return p?(
                  <div key={i} style={{fontSize:11,color:"#6b7280",display:"flex",justifyContent:"space-between"}}>
                    <span>{p.name}</span><span style={{fontWeight:600}}>×{it.qty} — {fmt(p.price*it.qty)}</span>
                  </div>
                ):null;})}
              </div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:"#7c3aed",marginBottom:8}}>
                Est. {fmt(orderTotal(r.items||[]))}/order
              </div>
              {r.notes&&<div style={{fontSize:10,color:"#9ca3af",marginBottom:8}}>📝 {r.notes}</div>}
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {due&&<button onClick={()=>generateOrder(r)} disabled={!!generating[r.id]}
                  style={{flex:2,background:"#059669",color:"#fff",border:"none",borderRadius:6,padding:"7px",fontSize:11,cursor:"pointer",fontWeight:700,opacity:generating[r.id]?0.7:1}}>
                  {generating[r.id]?"Generating…":"⚡ Generate Order"}
                </button>}
                <button onClick={()=>toggleActive(r.id,r.active)} style={{flex:1,background:r.active?"#fff7ed":"#f0fdf4",border:`1px solid ${r.active?"#fed7aa":"#a7f3d0"}`,borderRadius:6,padding:"5px",fontSize:11,color:r.active?"#c2410c":"#065f46",cursor:"pointer",fontWeight:700}}>
                  {r.active?"⏸ Pause":"▶ Activate"}
                </button>
                <button onClick={()=>deleteRec(r.id)} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:"5px 10px",fontSize:11,color:"#dc2626",cursor:"pointer",fontWeight:700}}>🗑</button>
              </div>
            </div>
            );
          })}
        </div>
      }
    </div>
  );
}

function DriverPerformance({trucks,sales,payments,customers,returns,expenses,loads,fmt,calcSaleGrandTotal,pmtFor}){
  const[period,setPeriod]=useState("month");
  const[selTruck,setSelTruck]=useState("all");
  const now=new Date();
  const inPeriod=d=>{
    const dt=new Date(d);if(isNaN(dt))return false;
    if(period==="week"){const w=new Date(now);w.setDate(now.getDate()-7);return dt>=w;}
    if(period==="month")return dt.getMonth()===now.getMonth()&&dt.getFullYear()===now.getFullYear();
    if(period==="quarter"){const q=Math.floor(now.getMonth()/3);return Math.floor(dt.getMonth()/3)===q&&dt.getFullYear()===now.getFullYear();}
    if(period==="ytd")return dt.getFullYear()===now.getFullYear();
    return true;
  };
  const stats=trucks.map(t=>{
    const ts=sales.filter(s=>s.truck_id===t.id&&inPeriod(s.created_at||s.date));
    const revenue=ts.reduce((a,s)=>a+calcSaleGrandTotal(s),0);
    const profit=ts.reduce((a,s)=>a+parseFloat(s.profit||0),0);
    const collected=ts.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0);
    const collectionRate=revenue>0?((collected/revenue)*100).toFixed(0):0;
    const custCount=new Set(ts.map(s=>s.cust_id)).size;
    const tLoads=loads.filter(l=>l.truck_id===t.id&&inPeriod(l.created_at));
    const tExp=expenses.filter(e=>e.truck_id===t.id&&inPeriod(e.created_at)).reduce((a,e)=>a+parseFloat(e.amount||0),0);
    const netProfit=profit-tExp;
    const avgOrderVal=ts.length>0?(revenue/ts.length):0;
    const returnCount=returns.filter(r=>r.truck_id===t.id&&inPeriod(r.created_at)).length;
    return{t,revenue,profit,collected,collectionRate,custCount,invoices:ts.length,loads:tLoads.length,expenses:tExp,netProfit,avgOrderVal,returnCount};
  }).sort((a,b)=>b.revenue-a.revenue);

  const vis=selTruck==="all"?stats:stats.filter(s=>s.t.id===selTruck);
  const totalRev=stats.reduce((a,s)=>a+s.revenue,0);

  return(
    <div>
      {/* Controls */}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:6}}>
          {[["week","This Week"],["month","This Month"],["quarter","This Quarter"],["ytd","This Year"],["all","All Time"]].map(([k,l])=>(
            <button key={k} onClick={()=>setPeriod(k)}
              style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${period===k?"#0a1628":"#e5e7eb"}`,background:period===k?"#0a1628":"#fff",color:period===k?"#fff":"#6b7280",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              {l}
            </button>
          ))}
        </div>
        <select value={selTruck} onChange={e=>setSelTruck(e.target.value)} style={{marginLeft:"auto",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"7px 12px",fontSize:12}}>
          <option value="all">All Drivers</option>
          {trucks.map(t=><option key={t.id} value={t.id}>{t.driver}</option>)}
        </select>
      </div>

      {/* Leaderboard */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14,marginBottom:20}}>
        {vis.map((s,i)=>{
          const share=totalRev>0?((s.revenue/totalRev)*100).toFixed(0):0;
          const medals=["🥇","🥈","🥉"];
          return(
            <div key={s.t.id} className="card" style={{padding:18,borderTop:`3px solid ${i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#b45309":"#e5e7eb"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#0a1628"}}>
                    {medals[i]||`#${i+1}`} {s.t.driver}
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af"}}>{s.t.plate} · {s.t.route||"No route"}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#059669"}}>{fmt(s.revenue)}</div>
                  <div style={{fontSize:10,color:"#9ca3af"}}>revenue</div>
                </div>
              </div>
              {/* Revenue share bar */}
              <div style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#9ca3af",marginBottom:3}}>
                  <span>Revenue share</span><span>{share}%</span>
                </div>
                <div style={{height:5,background:"#e5e7eb",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${share}%`,background:i===0?"#f59e0b":"#7c3aed",borderRadius:3}}/>
                </div>
              </div>
              {/* KPI grid */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {[
                  {l:"Invoices",v:s.invoices,c:"#7c3aed"},
                  {l:"Customers",v:s.custCount,c:"#0ea5e9"},
                  {l:"Avg Order",v:fmt(s.avgOrderVal),c:"#059669"},
                  {l:"Collection",v:`${s.collectionRate}%`,c:s.collectionRate>=80?"#059669":"#dc2626"},
                  {l:"Expenses",v:fmt(s.expenses),c:"#f59e0b"},
                  {l:"Net Profit",v:fmt(s.netProfit),c:s.netProfit>=0?"#059669":"#dc2626"},
                ].map(k=>(
                  <div key={k.l} style={{textAlign:"center",padding:"6px 4px",background:"#f9fafb",borderRadius:6}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:k.c}}>{k.v}</div>
                    <div style={{fontSize:9,color:"#9ca3af",marginTop:1}}>{k.l}</div>
                  </div>
                ))}
              </div>
              {s.returnCount>0&&<div style={{marginTop:8,fontSize:10,color:"#dc2626",fontWeight:600}}>⚠️ {s.returnCount} return{s.returnCount!==1?"s":""} this period</div>}
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{padding:"10px 16px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:"#6b7280"}}>DETAILED COMPARISON</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"#0a1628",color:"#fff"}}>
              {["Rank","Driver","Revenue","Profit","Net Profit","Collection %","Invoices","Customers","Avg Order","Expenses","Returns"].map(h=>(
                <th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {vis.map((s,i)=>(
                <tr key={s.t.id} style={{borderBottom:"1px solid #f3f4f6",background:i%2===0?"#fff":"#fafafa"}}>
                  <td style={{padding:"9px 12px",fontWeight:800,color:"#9ca3af"}}>#{i+1}</td>
                  <td style={{padding:"9px 12px",fontWeight:700,color:"#0a1628"}}>{s.t.driver}</td>
                  <td style={{padding:"9px 12px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:"#059669",fontSize:14}}>{fmt(s.revenue)}</td>
                  <td style={{padding:"9px 12px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#7c3aed"}}>{fmt(s.profit)}</td>
                  <td style={{padding:"9px 12px",fontWeight:700,color:s.netProfit>=0?"#059669":"#dc2626"}}>{fmt(s.netProfit)}</td>
                  <td style={{padding:"9px 12px"}}><span style={{fontWeight:700,color:s.collectionRate>=80?"#059669":"#dc2626"}}>{s.collectionRate}%</span></td>
                  <td style={{padding:"9px 12px",color:"#6b7280"}}>{s.invoices}</td>
                  <td style={{padding:"9px 12px",color:"#6b7280"}}>{s.custCount}</td>
                  <td style={{padding:"9px 12px",color:"#6b7280"}}>{fmt(s.avgOrderVal)}</td>
                  <td style={{padding:"9px 12px",color:"#f59e0b",fontWeight:700}}>{fmt(s.expenses)}</td>
                  <td style={{padding:"9px 12px",color:s.returnCount>0?"#dc2626":"#9ca3af",fontWeight:s.returnCount>0?700:400}}>{s.returnCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PurchaseOrders({products,setProducts,supabase,showToast,showConfirm}){
  const uid3=()=>Math.random().toString(36).slice(2,8).toUpperCase();
  const fmt3=n=>`$${Number(n||0).toFixed(2)}`;

  // State
  const[suppliers,setSuppliers]=useState([]);
  const[pos,setPos]=useState([]);
  const[subTab,setSubTab]=useState("pos"); // "pos" | "suppliers"
  const[loading,setLoading]=useState(true);

  // Supplier form
  const[supForm,setSupForm]=useState({name:"",contact:"",phone:"",email:"",address:"",payment_terms:"Net 30",notes:""});
  const[savingSup,setSavingSup]=useState(false);
  const[editSupId,setEditSupId]=useState(null);

  // PO form
  const[poForm,setPoForm]=useState({supplier_id:"",expected_date:"",notes:"",items:[]});
  const[showPoForm,setShowPoForm]=useState(false);
  const[savingPo,setSavingPo]=useState(false);
  const[viewPo,setViewPo]=useState(null);
  const[receivingPo,setReceivingPo]=useState(null);
  const[receivedQtys,setReceivedQtys]=useState({});

  // Load data
  useEffect(()=>{
    const load=async()=>{
      setLoading(true);
      try{
        const[supR,poR]=await Promise.all([
          supabase.from("suppliers").select("*").order("name"),
          supabase.from("purchase_orders").select("*").order("created_at",{ascending:false}),
        ]);
        if(supR.data)setSuppliers(supR.data);
        if(poR.data)setPos(poR.data);
      }catch(e){showToast("Could not load PO data — tables may need setup","error");}
      setLoading(false);
    };
    load();
  },[]);

  // Supplier CRUD
  const saveSup=async()=>{
    if(!supForm.name.trim())return showToast("Supplier name required","error");
    setSavingSup(true);
    try{
      if(editSupId){
        const{error}=await supabase.from("suppliers").update(supForm).eq("id",editSupId);
        if(error)throw error;
        setSuppliers(prev=>prev.map(s=>s.id===editSupId?{...s,...supForm}:s));
        showToast("Supplier updated");setEditSupId(null);
      }else{
        const rec={id:"SUP-"+uid3(),...supForm,created_at:new Date().toISOString()};
        const{error}=await supabase.from("suppliers").insert(rec);
        if(error)throw error;
        setSuppliers(prev=>[rec,...prev]);
        showToast("✅ Supplier added");
      }
      setSupForm({name:"",contact:"",phone:"",email:"",address:"",payment_terms:"Net 30",notes:""});
    }catch(e){showToast(e.message,"error");}
    setSavingSup(false);
  };

  const deleteSup=async(id,name)=>{
    showConfirm(`Delete supplier "${name}"?`,async()=>{
      await supabase.from("suppliers").delete().eq("id",id);
      setSuppliers(prev=>prev.filter(s=>s.id!==id));
      showToast("Supplier deleted");
    });
  };

  // PO item management
  const addPoItem=()=>{
    if(!products.length)return;
    setPoForm(f=>({...f,items:[...f.items,{pid:products[0].id,qty:"",unit_cost:""}]}));
  };
  const updatePoItem=(idx,field,val)=>setPoForm(f=>({...f,items:f.items.map((it,i)=>i===idx?{...it,[field]:val}:it)}));
  const removePoItem=idx=>setPoForm(f=>({...f,items:f.items.filter((_,i)=>i!==idx)}));

  const poTotal=poForm.items.reduce((a,it)=>a+(parseFloat(it.qty)||0)*(parseFloat(it.unit_cost)||0),0);

  // Save PO
  const savePo=async()=>{
    if(!poForm.supplier_id)return showToast("Select a supplier","error");
    const items=poForm.items.filter(it=>it.pid&&parseInt(it.qty)>0&&parseFloat(it.unit_cost)>0);
    if(!items.length)return showToast("Add at least one item with qty and cost","error");
    setSavingPo(true);
    try{
      const sup=suppliers.find(s=>s.id===poForm.supplier_id);
      const rec={
        id:"PO-"+uid3(),
        supplier_id:poForm.supplier_id,
        supplier_name:sup?.name||"",
        status:"draft",
        items:items.map(it=>({pid:it.pid,qty:parseInt(it.qty),unit_cost:parseFloat(it.unit_cost),received_qty:0})),
        total:items.reduce((a,it)=>a+(parseInt(it.qty))*(parseFloat(it.unit_cost)),0),
        expected_date:poForm.expected_date||null,
        notes:poForm.notes||"",
        created_at:new Date().toISOString(),
      };
      const{error}=await supabase.from("purchase_orders").insert(rec);
      if(error)throw error;
      setPos(prev=>[rec,...prev]);
      setPoForm({supplier_id:"",expected_date:"",notes:"",items:[]});
      setShowPoForm(false);
      showToast("✅ Purchase order created");
    }catch(e){showToast(e.message,"error");}
    setSavingPo(false);
  };

  // Approve PO
  const logAuditLocal=async(action,entity,detail)=>{
    try{
      await supabase.from("audit_log").insert({id:Math.random().toString(36).slice(2,10).toUpperCase(),user_email:"admin",action,entity,detail,created_at:new Date().toISOString()});
    }catch{}
  };

  const approvePo=async(po)=>{
    const{error}=await supabase.from("purchase_orders").update({status:"ordered"}).eq("id",po.id);
    if(error)return showToast(error.message,"error");
    setPos(prev=>prev.map(p=>p.id===po.id?{...p,status:"ordered"}:p));
    showToast("PO approved & sent to supplier");
    logAuditLocal("APPROVE","PO",`Approved PO ${po.id} — ${po.supplier_name}`);
  };

  const receiveAll=async(po)=>{
    const updates=po.items.map(it=>({...it,received_qty:parseInt(receivedQtys[it.pid]||it.qty)}));
    const allReceived=updates.every(it=>it.received_qty>=it.qty);
    try{
      for(const it of updates){
        if(it.received_qty>0){
          const prod=products.find(p=>p.id===it.pid);
          if(prod){
            const newShelf=prod.shelf+it.received_qty;
            await supabase.from("products").update({shelf:newShelf,cost:it.unit_cost}).eq("id",it.pid);
            setProducts(prev=>prev.map(p=>p.id===it.pid?{...p,shelf:newShelf,cost:it.unit_cost}:p));
          }
        }
      }
      const newStatus=allReceived?"received":"partial";
      await supabase.from("purchase_orders").update({status:newStatus,items:updates,received_at:new Date().toISOString()}).eq("id",po.id);
      setPos(prev=>prev.map(p=>p.id===po.id?{...p,status:newStatus,items:updates}:p));
      setReceivingPo(null);setReceivedQtys({});
      showToast(allReceived?"✅ PO fully received — stock updated":"⚠️ Partial receipt recorded");
      logAuditLocal("RECEIVE","PO",`${allReceived?"Fully":"Partially"} received PO ${po.id}`);
    }catch(e){showToast(e.message,"error");}
  };

  const deletePo=async(id)=>{
    showConfirm("Delete this purchase order?",async()=>{
      await supabase.from("purchase_orders").delete().eq("id",id);
      setPos(prev=>prev.filter(p=>p.id!==id));
      showToast("PO deleted");
      logAuditLocal("DELETE","PO",`Deleted PO ${id}`);
    });
  };

  const statusBadge=(s)=>({
    draft:<span className="bdg bgr">DRAFT</span>,
    ordered:<span className="bdg ba2">ORDERED</span>,
    partial:<span className="bdg" style={{background:"#fff7ed",color:"#c2410c",border:"1px solid #fed7aa"}}>PARTIAL</span>,
    received:<span className="bdg bg2">RECEIVED</span>,
    cancelled:<span className="bdg br2">CANCELLED</span>,
  }[s]||<span className="bdg bgr">{s}</span>);

  const totalPending=pos.filter(p=>["draft","ordered"].includes(p.status)).reduce((a,p)=>a+parseFloat(p.total||0),0);
  const totalReceived=pos.filter(p=>p.status==="received").reduce((a,p)=>a+parseFloat(p.total||0),0);

  if(loading)return<div style={{padding:60,textAlign:"center",color:"#9ca3af"}}>Loading…</div>;

  return(
    <div className="fu">
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#212121"}}>🛒 Purchase Orders</div>
          <div style={{fontSize:12,color:"#9ca3af"}}>Supplier management, POs, and receiving — tracks all inbound inventory</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[["pos","📋 Purchase Orders"],["suppliers","🏭 Suppliers"]].map(([k,l])=>(
            <button key={k} onClick={()=>setSubTab(k)}
              style={{padding:"8px 16px",borderRadius:20,border:`1.5px solid ${subTab===k?"#0a1628":"#e5e7eb"}`,background:subTab===k?"#0a1628":"#fff",color:subTab===k?"#fff":"#6b7280",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:20}}>
        {[
          {l:"Total POs",v:pos.length,c:"#7c3aed"},
          {l:"Pending Value",v:fmt3(totalPending),c:"#f59e0b"},
          {l:"Received Value",v:fmt3(totalReceived),c:"#059669"},
          {l:"Suppliers",v:suppliers.length,c:"#0ea5e9"},
        ].map(k=><div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>)}
      </div>

      {/* ── PURCHASE ORDERS ── */}
      {subTab==="pos"&&<>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
          <button className="btn ba" onClick={()=>{setShowPoForm(true);setPoForm({supplier_id:suppliers[0]?.id||"",expected_date:"",notes:"",items:[{pid:products[0]?.id||"",qty:"",unit_cost:""}]});}}>
            + New Purchase Order
          </button>
        </div>

        {/* New PO form */}
        {showPoForm&&(
          <div className="card" style={{padding:22,marginBottom:20,borderTop:"3px solid #7c3aed"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,marginBottom:14}}>📋 New Purchase Order</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
              <div>
                <label>Supplier *</label>
                <select value={poForm.supplier_id} onChange={e=>setPoForm(f=>({...f,supplier_id:e.target.value}))}>
                  <option value="">— Select Supplier —</option>
                  {suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                {!suppliers.length&&<div style={{fontSize:10,color:"#dc2626",marginTop:4}}>⚠️ Add suppliers first</div>}
              </div>
              <div><label>Expected Delivery Date</label><input type="date" value={poForm.expected_date} onChange={e=>setPoForm(f=>({...f,expected_date:e.target.value}))}/></div>
              <div><label>Notes / Reference #</label><input placeholder="e.g. Ref #12345" value={poForm.notes} onChange={e=>setPoForm(f=>({...f,notes:e.target.value}))}/></div>
            </div>

            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:"#6b7280",marginBottom:8}}>ORDER ITEMS</div>
            {poForm.items.map((it,idx)=>{
              const prod=products.find(p=>p.id===it.pid);
              return(
                <div key={idx} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr auto",gap:8,marginBottom:8,alignItems:"end"}}>
                  <div>
                    {idx===0&&<label>Product</label>}
                    <select value={it.pid} onChange={e=>updatePoItem(idx,"pid",e.target.value)}>
                      {products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    {idx===0&&<label>Qty *</label>}
                    <input type="number" min="1" placeholder="0" value={it.qty} onChange={e=>updatePoItem(idx,"qty",e.target.value)}/>
                  </div>
                  <div>
                    {idx===0&&<label>Unit Cost ($) *</label>}
                    <input type="number" min="0" step="0.01" placeholder={prod?.cost?.toFixed(2)||"0.00"} value={it.unit_cost} onChange={e=>updatePoItem(idx,"unit_cost",e.target.value)}/>
                  </div>
                  <div>
                    {idx===0&&<label>Line Total</label>}
                    <div style={{padding:"8px 12px",background:"#f9fafb",borderRadius:7,fontWeight:700,color:"#059669",fontSize:13}}>{fmt3((parseFloat(it.qty)||0)*(parseFloat(it.unit_cost)||0))}</div>
                  </div>
                  <button onClick={()=>removePoItem(idx)} style={{padding:"8px 10px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:7,color:"#dc2626",cursor:"pointer",fontWeight:700,marginTop:idx===0?16:0}}>✕</button>
                </div>
              );
            })}
            <div style={{display:"flex",gap:8,alignItems:"center",marginTop:10}}>
              <button className="btn bb" onClick={addPoItem}>+ Add Item</button>
              <div style={{marginLeft:"auto",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#7c3aed"}}>
                PO TOTAL: {fmt3(poTotal)}
              </div>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16,borderTop:"1px solid #e5e7eb",paddingTop:14}}>
              <button className="btn bgh" onClick={()=>setShowPoForm(false)}>Cancel</button>
              <button className="btn ba" onClick={savePo} disabled={savingPo}>{savingPo?"Saving…":"💾 Save Draft"}</button>
            </div>
          </div>
        )}

        {/* PO List */}
        {pos.length===0
          ?<div className="card" style={{padding:40,textAlign:"center",color:"#9ca3af"}}>
              <div style={{fontSize:36,marginBottom:8}}>📋</div>
              <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>No purchase orders yet</div>
              <div style={{fontSize:12}}>Create your first PO to start tracking supplier orders</div>
            </div>
          :<div className="card" style={{overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#0a1628",color:"#fff"}}>
                  {["PO #","Date","Supplier","Items","Total","Expected","Status","Actions"].map(h=>(
                    <th key={h} style={{padding:"9px 13px",textAlign:"left",fontSize:10,fontWeight:700}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {pos.map(po=>(
                    <tr key={po.id} style={{borderBottom:"1px solid #f3f4f6"}}>
                      <td><span style={{fontWeight:700,color:"#7c3aed",fontSize:12}}>{po.id}</span></td>
                      <td style={{fontSize:11,color:"#6b7280"}}>{new Date(po.created_at).toLocaleDateString()}</td>
                      <td style={{fontWeight:600,fontSize:12}}>{po.supplier_name||"—"}</td>
                      <td style={{fontSize:11,color:"#6b7280"}}>{(po.items||[]).length} item{(po.items||[]).length!==1?"s":""}</td>
                      <td style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#7c3aed"}}>{fmt3(po.total)}</td>
                      <td style={{fontSize:11,color:"#6b7280"}}>{po.expected_date||"—"}</td>
                      <td>{statusBadge(po.status)}</td>
                      <td>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                          <button onClick={()=>setViewPo(po)} style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#7c3aed",cursor:"pointer",fontWeight:700}}>View</button>
                          {po.status==="draft"&&<button onClick={()=>approvePo(po)} style={{background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#065f46",cursor:"pointer",fontWeight:700}}>✓ Approve</button>}
                          {["ordered","partial"].includes(po.status)&&<button onClick={()=>{setReceivingPo(po);const init={};(po.items||[]).forEach(it=>{init[it.pid]=it.qty-( it.received_qty||0);});setReceivedQtys(init);}} style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#92400e",cursor:"pointer",fontWeight:700}}>📦 Receive</button>}
                          {po.status==="draft"&&<button onClick={()=>deletePo(po.id)} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#dc2626",cursor:"pointer",fontWeight:700}}>🗑</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        }

        {/* View PO modal */}
        {viewPo&&(
          <div style={{position:"fixed",inset:0,background:"#00000060",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:"#fff",borderRadius:16,padding:24,maxWidth:680,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 8px 40px #00000030"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20}}>{viewPo.id}</div>
                  <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{viewPo.supplier_name} · {new Date(viewPo.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {statusBadge(viewPo.status)}
                  <button onClick={()=>setViewPo(null)} style={{background:"#f3f4f6",border:"none",borderRadius:7,padding:"6px 12px",cursor:"pointer",fontWeight:700}}>✕</button>
                </div>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse",marginBottom:16}}>
                <thead><tr style={{background:"#f9fafb"}}><th style={{padding:"8px 12px",textAlign:"left",fontSize:11}}>Product</th><th style={{padding:"8px 12px",textAlign:"left",fontSize:11}}>Ordered</th><th style={{padding:"8px 12px",textAlign:"left",fontSize:11}}>Received</th><th style={{padding:"8px 12px",textAlign:"left",fontSize:11}}>Unit Cost</th><th style={{padding:"8px 12px",textAlign:"left",fontSize:11}}>Line Total</th></tr></thead>
                <tbody>{(viewPo.items||[]).map((it,i)=>{const prod=products.find(p=>p.id===it.pid);return(
                  <tr key={i} style={{borderBottom:"1px solid #f3f4f6"}}>
                    <td style={{padding:"10px 12px",fontWeight:600}}>{prod?.name||it.pid}</td>
                    <td style={{padding:"10px 12px"}}>{it.qty}</td>
                    <td style={{padding:"10px 12px",color:it.received_qty>=it.qty?"#059669":"#f59e0b",fontWeight:700}}>{it.received_qty||0}</td>
                    <td style={{padding:"10px 12px"}}>{fmt3(it.unit_cost)}</td>
                    <td style={{padding:"10px 12px",fontWeight:700,color:"#7c3aed"}}>{fmt3(it.qty*it.unit_cost)}</td>
                  </tr>
                );})}
                <tr style={{background:"#f9fafb",borderTop:"2px solid #e5e7eb"}}>
                  <td colSpan={4} style={{padding:"10px 12px",fontWeight:800}}>TOTAL</td>
                  <td style={{padding:"10px 12px"}}><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#7c3aed"}}>{fmt3(viewPo.total)}</span></td>
                </tr></tbody>
              </table>
              {viewPo.notes&&<div style={{background:"#f9fafb",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#6b7280",marginBottom:12}}>📝 {viewPo.notes}</div>}
              {viewPo.expected_date&&<div style={{fontSize:12,color:"#6b7280"}}>Expected: {viewPo.expected_date}</div>}
            </div>
          </div>
        )}

        {/* Receive PO modal */}
        {receivingPo&&(
          <div style={{position:"fixed",inset:0,background:"#00000060",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:"#fff",borderRadius:16,padding:24,maxWidth:600,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 8px 40px #00000030"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,marginBottom:4}}>📦 Receive Inventory — {receivingPo.id}</div>
              <div style={{fontSize:12,color:"#6b7280",marginBottom:16}}>Enter actual quantities received. Stock will be added to warehouse shelf.</div>
              {(receivingPo.items||[]).map((it,i)=>{const prod=products.find(p=>p.id===it.pid);const remaining=it.qty-(it.received_qty||0);return(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:12,alignItems:"center",marginBottom:10,padding:"10px 14px",background:"#f9fafb",borderRadius:8}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{prod?.name||it.pid}</div>
                    <div style={{fontSize:11,color:"#9ca3af"}}>Ordered: {it.qty} · Previously received: {it.received_qty||0} · Remaining: {remaining}</div>
                  </div>
                  <div style={{fontSize:11,color:"#6b7280"}}>Receive:</div>
                  <input type="number" min="0" max={remaining} value={receivedQtys[it.pid]||""} onChange={e=>setReceivedQtys(prev=>({...prev,[it.pid]:e.target.value}))}
                    style={{width:80,textAlign:"center",border:"1.5px solid #ddd6fe",borderRadius:7,padding:"7px",fontSize:14,fontWeight:700}}/>
                </div>
              );})}
              <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16,borderTop:"1px solid #e5e7eb",paddingTop:14}}>
                <button className="btn bgh" onClick={()=>{setReceivingPo(null);setReceivedQtys({});}}>Cancel</button>
                <button className="btn ba" onClick={()=>receiveAll(receivingPo)}>✅ Confirm Receipt</button>
              </div>
            </div>
          </div>
        )}
      </>}

      {/* ── SUPPLIERS ── */}
      {subTab==="suppliers"&&<>
        <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:18,alignItems:"start"}}>
          {/* Add/Edit form */}
          <div className="card" style={{padding:20,borderTop:"3px solid #0a1628"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,marginBottom:14}}>{editSupId?"✏️ Edit Supplier":"➕ Add Supplier"}</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div><label>Supplier Name *</label><input placeholder="e.g. McLane Company" value={supForm.name} onChange={e=>setSupForm(f=>({...f,name:e.target.value}))}/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label>Contact Name</label><input placeholder="e.g. John Smith" value={supForm.contact} onChange={e=>setSupForm(f=>({...f,contact:e.target.value}))}/></div>
                <div><label>Phone</label><input placeholder="e.g. 555-0100" value={supForm.phone} onChange={e=>setSupForm(f=>({...f,phone:e.target.value}))}/></div>
              </div>
              <div><label>Email</label><input type="email" placeholder="supplier@email.com" value={supForm.email} onChange={e=>setSupForm(f=>({...f,email:e.target.value}))}/></div>
              <div><label>Address</label><input placeholder="e.g. 123 Supply Ave, Dallas TX" value={supForm.address} onChange={e=>setSupForm(f=>({...f,address:e.target.value}))}/></div>
              <div><label>Payment Terms</label>
                <select value={supForm.payment_terms} onChange={e=>setSupForm(f=>({...f,payment_terms:e.target.value}))}>
                  {["Net 7","Net 15","Net 30","Net 60","COD","Prepaid"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label>Notes</label><input placeholder="e.g. Primary tobacco supplier" value={supForm.notes} onChange={e=>setSupForm(f=>({...f,notes:e.target.value}))}/></div>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:14}}>
              {editSupId&&<button className="btn bgh" onClick={()=>{setEditSupId(null);setSupForm({name:"",contact:"",phone:"",email:"",address:"",payment_terms:"Net 30",notes:""});}}>Cancel</button>}
              <button className="btn ba" onClick={saveSup} disabled={savingSup}>{savingSup?"Saving…":editSupId?"💾 Update":"➕ Add Supplier"}</button>
            </div>
          </div>

          {/* Supplier list */}
          <div>
            {suppliers.length===0
              ?<div className="card" style={{padding:40,textAlign:"center",color:"#9ca3af"}}>
                  <div style={{fontSize:36,marginBottom:8}}>🏭</div>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>No suppliers yet</div>
                  <div style={{fontSize:12}}>Add your first supplier to start creating purchase orders</div>
                </div>
              :suppliers.map(s=>(
                <div key={s.id} className="card" style={{padding:"14px 18px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#0a1628",marginBottom:3}}>{s.name}</div>
                    {s.contact&&<div style={{fontSize:11,color:"#6b7280"}}>👤 {s.contact}</div>}
                    {s.phone&&<div style={{fontSize:11,color:"#6b7280"}}>📞 {s.phone}</div>}
                    {s.email&&<div style={{fontSize:11,color:"#6b7280"}}>✉️ {s.email}</div>}
                    {s.address&&<div style={{fontSize:11,color:"#6b7280"}}>📍 {s.address}</div>}
                    <div style={{marginTop:6,display:"flex",gap:6,flexWrap:"wrap"}}>
                      <span className="bdg bb2">{s.payment_terms}</span>
                      <span style={{fontSize:11,color:"#9ca3af"}}>{pos.filter(p=>p.supplier_id===s.id).length} PO{pos.filter(p=>p.supplier_id===s.id).length!==1?"s":""}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <button onClick={()=>{setEditSupId(s.id);setSupForm({name:s.name,contact:s.contact||"",phone:s.phone||"",email:s.email||"",address:s.address||"",payment_terms:s.payment_terms||"Net 30",notes:s.notes||""});}} style={{background:"#ede9fe",border:"1px solid #ddd6fe",borderRadius:6,padding:"4px 10px",fontSize:11,color:"#5b21b6",cursor:"pointer",fontWeight:700}}>✏️ Edit</button>
                    <button onClick={()=>deleteSup(s.id,s.name)} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:"4px 10px",fontSize:11,color:"#dc2626",cursor:"pointer",fontWeight:700}}>🗑</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </>}
    </div>
  );
}

function ExpensesManager({expenses,setExpenses,trucks,supabase,showToast,showConfirm}){
  const [expForm,setExpForm]=useState({category:"gas",amount:"",description:"",truck_id:"",date:new Date().toLocaleDateString(),receipt_url:""});
  const [saving,setSaving]=useState(false);
  const [filter,setFilter]=useState("all");
  const [catFilter,setCatFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [viewReceipt,setViewReceipt]=useState(null);
  const [uploading,setUploading]=useState(false);
  const uid2=()=>Math.random().toString(36).slice(2,8).toUpperCase();
  const fmt2=n=>`$${Number(n||0).toFixed(2)}`;

  const catMap=Object.fromEntries(EXPENSE_CATS.map(c=>[c.k,c]));

  const submit=async()=>{
    if(!expForm.amount||parseFloat(expForm.amount)<=0)return showToast("Amount required","error");
    setSaving(true);
    try{
      const truck=trucks.find(t=>t.id===expForm.truck_id);
      const rec={
        id:"EXP-"+uid2(),
        truck_id:expForm.truck_id||null,
        driver_name:truck?.driver||"Admin",
        category:expForm.category,
        amount:parseFloat(expForm.amount),
        description:expForm.description||"",
        receipt_url:expForm.receipt_url||"",
        date:expForm.date||new Date().toLocaleDateString(),
        created_at:new Date().toISOString(),
      };
      const{error}=await supabase.from("expenses").insert(rec);
      if(error)throw error;
      setExpenses(prev=>[rec,...prev]);
      setExpForm({category:"gas",amount:"",description:"",truck_id:"",date:new Date().toLocaleDateString(),receipt_url:""});
      showToast("✅ Expense recorded");
    }catch(e){showToast(e.message,"error");}
    setSaving(false);
  };

  const uploadReceipt=async(file)=>{
    if(!file)return;
    setUploading(true);
    try{
      const ext=file.name.split(".").pop();
      const path=`expenses/EXP-${uid2()}.${ext}`;
      const{error:upErr}=await supabase.storage.from("receipts").upload(path,file,{upsert:true});
      if(upErr)throw upErr;
      const url=supabase.storage.from("receipts").getPublicUrl(path).data.publicUrl;
      setExpForm(f=>({...f,receipt_url:url}));
      showToast("📸 Receipt uploaded");
    }catch(e){showToast("Upload failed: "+e.message,"error");}
    setUploading(false);
  };

  const deleteExp=async(id)=>{
    showConfirm("Delete this expense?",async()=>{
      const{error}=await supabase.from("expenses").delete().eq("id",id);
      if(error){showToast(error.message,"error");return;}
      setExpenses(prev=>prev.filter(e=>e.id!==id));
      showToast("Expense deleted");
    });
  };

  // Filtered list
  const now2=new Date();
  let filtered=expenses.filter(e=>{
    if(catFilter!=="all"&&e.category!==catFilter)return false;
    if(filter==="month"){const d=new Date(e.created_at);return d.getMonth()===now2.getMonth()&&d.getFullYear()===now2.getFullYear();}
    if(filter==="q"){const d=new Date(e.created_at);return Math.floor(d.getMonth()/3)===Math.floor(now2.getMonth()/3)&&d.getFullYear()===now2.getFullYear();}
    if(filter==="ytd"){const d=new Date(e.created_at);return d.getFullYear()===now2.getFullYear();}
    return true;
  });
  if(search.trim())filtered=filtered.filter(e=>(e.driver_name||"").toLowerCase().includes(search.toLowerCase())||(e.description||"").toLowerCase().includes(search.toLowerCase())||(e.category||"").toLowerCase().includes(search.toLowerCase()));

  const total=filtered.reduce((a,e)=>a+parseFloat(e.amount||0),0);
  const byCat=EXPENSE_CATS.map(c=>({...c,amt:filtered.filter(e=>e.category===c.k).reduce((a,e)=>a+parseFloat(e.amount||0),0)})).filter(c=>c.amt>0);

  const selectedCat=catMap[expForm.category]||EXPENSE_CATS[0];

  return(
    <div className="fu">
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#212121"}}>💸 Expenses</div>
          <div style={{fontSize:12,color:"#9ca3af"}}>All driver + operating expenses — linked to IRS Schedule C</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["all","All Time"],["ytd","This Year"],["q","This Quarter"],["month","This Month"]].map(([k,l])=>(
            <button key={k} onClick={()=>setFilter(k)}
              style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${filter===k?"#0a1628":"#e5e7eb"}`,background:filter===k?"#0a1628":"#fff",color:filter===k?"#fff":"#6b7280",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:20}}>
        {[
          {l:"Total Expenses",v:fmt2(total),c:"#dc2626"},
          {l:"This Month",v:fmt2(expenses.filter(e=>{const d=new Date(e.created_at);return d.getMonth()===now2.getMonth()&&d.getFullYear()===now2.getFullYear();}).reduce((a,e)=>a+parseFloat(e.amount||0),0)),c:"#f59e0b"},
          {l:"# Records",v:filtered.length,c:"#7c3aed"},
          {l:"Drivers",v:[...new Set(filtered.map(e=>e.driver_name).filter(Boolean))].length,c:"#0ea5e9"},
        ].map(k=>(
          <div key={k.l} className="kpi">
            <div className="kv" style={{color:k.c}}>{k.v}</div>
            <div className="kl">{k.l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:18,alignItems:"start"}}>

        {/* ADD FORM */}
        <div className="card" style={{padding:20,borderTop:"3px solid #dc2626"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,marginBottom:14}}>➕ Record Expense</div>

          {/* Category grid */}
          <label>Category</label>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginBottom:12,marginTop:4}}>
            {EXPENSE_CATS.map(c=>(
              <button key={c.k} onClick={()=>setExpForm(f=>({...f,category:c.k}))}
                title={c.line}
                style={{padding:"7px 4px",borderRadius:8,border:`1.5px solid ${expForm.category===c.k?"#dc2626":"#e5e7eb"}`,background:expForm.category===c.k?"#fef2f2":"#fff",cursor:"pointer",textAlign:"center",fontFamily:"'Inter',sans-serif",transition:"all .12s"}}>
                <div style={{fontSize:16}}>{c.e}</div>
                <div style={{fontSize:9,fontWeight:600,color:expForm.category===c.k?"#dc2626":"#6b7280",marginTop:2,lineHeight:1.2}}>{c.l}</div>
              </button>
            ))}
          </div>

          <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:7,padding:"6px 10px",fontSize:11,color:"#5b21b6",marginBottom:12}}>
            📋 {selectedCat.line} — Schedule C
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div><label>Amount ($) *</label><input type="number" min="0" step="0.01" placeholder="0.00" value={expForm.amount} onChange={e=>setExpForm(f=>({...f,amount:e.target.value}))}/></div>
            <div><label>Date</label><input type="date" value={expForm.date?new Date(expForm.date).toISOString().slice(0,10):""} onChange={e=>setExpForm(f=>({...f,date:new Date(e.target.value).toLocaleDateString()}))}/></div>
          </div>

          <div style={{marginBottom:10}}>
            <label>Driver / Truck (optional)</label>
            <select value={expForm.truck_id} onChange={e=>setExpForm(f=>({...f,truck_id:e.target.value}))}>
              <option value="">— Admin / General —</option>
              {trucks.map(t=><option key={t.id} value={t.id}>{t.driver} ({t.route||t.plate})</option>)}
            </select>
          </div>

          <div style={{marginBottom:10}}>
            <label>Description</label>
            <input placeholder="e.g. Shell gas station, truck oil change…" value={expForm.description} onChange={e=>setExpForm(f=>({...f,description:e.target.value}))}/>
          </div>

          <div style={{marginBottom:14}}>
            <label>Receipt Photo {uploading?"(uploading…)":""}</label>
            {expForm.receipt_url
              ?<div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:12,color:"#059669",fontWeight:600}}>✅ Receipt attached</span>
                  <button onClick={()=>setExpForm(f=>({...f,receipt_url:""}))} style={{fontSize:11,background:"#fef2f2",border:"1px solid #fecaca",borderRadius:5,padding:"3px 8px",cursor:"pointer",color:"#dc2626"}}>Remove</button>
                </div>
              :<input type="file" accept="image/*,application/pdf" onChange={e=>uploadReceipt(e.target.files[0])} disabled={uploading}/>
            }
          </div>

          <button onClick={submit} disabled={saving||uploading}
            style={{width:"100%",background:"#dc2626",color:"#fff",border:"none",borderRadius:9,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",opacity:saving?0.7:1}}>
            {saving?"Saving…":"💸 Record Expense"}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div>
          {/* Category breakdown */}
          {byCat.length>0&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8,marginBottom:16}}>
              {byCat.map(c=>(
                <div key={c.k} className="card" style={{padding:"12px 14px",borderLeft:`3px solid ${catFilter===c.k?"#dc2626":"#e5e7eb"}`,cursor:"pointer"}}
                  onClick={()=>setCatFilter(p=>p===c.k?"all":c.k)}>
                  <div style={{fontSize:20,marginBottom:4}}>{c.e}</div>
                  <div style={{fontSize:9,color:"#9ca3af",fontWeight:700,letterSpacing:".06em",marginBottom:3}}>{c.l.toUpperCase()}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#f59e0b"}}>{fmt2(c.amt)}</div>
                  <div style={{fontSize:9,color:"#9ca3af"}}>{c.line}</div>
                </div>
              ))}
            </div>
          )}

          {/* Search + filter */}
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
            <input placeholder="🔍 Search driver, description, category…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:200}}/>
            {catFilter!=="all"&&<button onClick={()=>setCatFilter("all")} style={{padding:"7px 12px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:7,fontSize:11,color:"#dc2626",cursor:"pointer",fontWeight:700}}>✕ Clear filter</button>}
          </div>

          {/* Table */}
          {filtered.length===0
            ?<div className="card" style={{padding:40,textAlign:"center",color:"#9ca3af"}}>
                <div style={{fontSize:32,marginBottom:8}}>📋</div>
                <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>No expenses recorded</div>
                <div style={{fontSize:12}}>Add your first expense using the form on the left</div>
              </div>
            :<div className="card" style={{overflow:"hidden"}}>
              <div style={{padding:"10px 16px",borderBottom:"1px solid #f3f4f6",background:"#f9fafb",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:"#6b7280"}}>{filtered.length} RECORDS · {catFilter!=="all"?`FILTERED: ${(catMap[catFilter]?.l||catFilter).toUpperCase()}`:"ALL CATEGORIES"}</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#dc2626"}}>TOTAL: {fmt2(total)}</span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{background:"#0a1628",color:"#fff"}}>
                    {["Date","Driver","Category","Line","Amount","Description","Receipt","Action"].map(h=>(
                      <th key={h} style={{padding:"9px 13px",textAlign:"left",fontSize:10,fontWeight:700}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtered.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map(e=>{
                      const cat=catMap[e.category]||{e:"📋",l:e.category,line:"Line 22"};
                      return(
                        <tr key={e.id} style={{borderBottom:"1px solid #f3f4f6"}}>
                          <td style={{padding:"9px 13px",fontSize:12,color:"#6b7280",whiteSpace:"nowrap"}}>{e.date}</td>
                          <td style={{padding:"9px 13px",fontSize:12,color:"#212121",fontWeight:600}}>{e.driver_name||"Admin"}</td>
                          <td style={{padding:"9px 13px"}}>
                            <span style={{background:"#f5f3ff",color:"#7c3aed",padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>
                              {cat.e} {cat.l}
                            </span>
                          </td>
                          <td style={{padding:"9px 13px"}}><span style={{fontSize:10,color:"#9ca3af",fontFamily:"monospace"}}>{cat.line}</span></td>
                          <td style={{padding:"9px 13px",fontWeight:800,color:"#dc2626",fontFamily:"'Barlow Condensed',sans-serif",fontSize:15}}>{fmt2(parseFloat(e.amount||0))}</td>
                          <td style={{padding:"9px 13px",fontSize:12,color:"#6b7280",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.description||"—"}</td>
                          <td style={{padding:"9px 13px"}}>
                            {e.receipt_url
                              ?<button onClick={()=>setViewReceipt(e.receipt_url)} style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#065f46",cursor:"pointer",fontWeight:700}}>📸 View</button>
                              :<span style={{fontSize:11,color:"#d1d5db"}}>—</span>}
                          </td>
                          <td style={{padding:"9px 13px"}}>
                            <button onClick={()=>deleteExp(e.id)} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#dc2626",cursor:"pointer",fontWeight:700}}>🗑</button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr style={{background:"#fef9c3",borderTop:"2px solid #fde68a"}}>
                      <td colSpan={4} style={{padding:"11px 13px",fontWeight:800,fontSize:13}}>TOTAL DEDUCTIBLE (Schedule C)</td>
                      <td style={{padding:"11px 13px"}}><span style={{background:"#f59e0b",color:"#fff",padding:"4px 12px",borderRadius:6,fontSize:14,fontWeight:800}}>{fmt2(total)}</span></td>
                      <td colSpan={3}/>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      </div>

      {/* Receipt viewer */}
      {viewReceipt&&(
        <div style={{position:"fixed",inset:0,background:"#00000080",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",borderRadius:16,padding:20,maxWidth:600,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:15}}>📸 Receipt</div>
              <button onClick={()=>setViewReceipt(null)} style={{background:"#f3f4f6",border:"none",borderRadius:7,padding:"6px 12px",cursor:"pointer",fontWeight:700}}>✕ Close</button>
            </div>
            {viewReceipt.toLowerCase().includes(".pdf")?<iframe src={viewReceipt} style={{width:"100%",height:500,border:"none",borderRadius:8}}/>:<img src={viewReceipt} alt="receipt" style={{width:"100%",borderRadius:8,border:"1px solid #e5e7eb"}}/>}
            <a href={viewReceipt} target="_blank" rel="noreferrer" style={{display:"block",marginTop:10,textAlign:"center",background:"#0a1628",color:"#fff",padding:"10px",borderRadius:8,fontSize:13,fontWeight:700,textDecoration:"none"}}>🔗 Open Full Size</a>
          </div>
        </div>
      )}
    </div>
  );
}

function IRSReports({sales,payments,paymentsLog,products,customers,trucks,expenses,stateTaxes,setStateTaxes,calcSaleTax,calcSaleGrandTotal,isTaxableProd,pmtFor,fmt,supabase,showToast}){
  const [irsTab,setIrsTab]=useState("overview");
  const [period,setPeriod]=useState("all");
  const [depositFilter,setDepositFilter]=useState("all");
  const [viewReceipt,setViewReceipt]=useState(null);
  const [localExpenses,setLocalExpenses]=useState(expenses);
  const [stateSearch,setStateSearch]=useState("");
  useEffect(()=>{setLocalExpenses(expenses);},[expenses]);

  const now=new Date();
  const filterByPeriod=(arr)=>{
    if(period==="all")return arr;
    return arr.filter(s=>{
      const d=new Date(s.created_at);
      if(period==="q1")return d.getMonth()<3&&d.getFullYear()===now.getFullYear();
      if(period==="q2")return d.getMonth()>=3&&d.getMonth()<6&&d.getFullYear()===now.getFullYear();
      if(period==="q3")return d.getMonth()>=6&&d.getMonth()<9&&d.getFullYear()===now.getFullYear();
      if(period==="q4")return d.getMonth()>=9&&d.getFullYear()===now.getFullYear();
      if(period==="ytd")return d.getFullYear()===now.getFullYear();
      if(period==="last30")return(now-d)/(1000*60*60*24)<=30;
      return true;
    });
  };

  const filteredSales=filterByPeriod(sales);
  const paidSales=filteredSales.filter(s=>pmtFor(s.id)?.status==="paid");

  // CORRECT financials
  const grossRevenue=filteredSales.reduce((a,s)=>a+parseFloat(s.total||0),0);
  const taxCollected=filteredSales.reduce((a,s)=>a+calcSaleTax(s),0);
  const grossReceipts=grossRevenue+taxCollected; // Schedule C Line 1
  const cogs=filteredSales.reduce((a,s)=>a+(s.items||[]).reduce((b,i)=>{const p=products.find(x=>x.id===i.pid);return b+(p?.cost||0)*i.qty;},0),0);
  const grossProfit=grossRevenue-cogs; // Line 5
  const grossMargin=grossRevenue>0?((grossProfit/grossRevenue)*100).toFixed(1):"0";
  const totalExpenses2=localExpenses.reduce((a,e)=>a+parseFloat(e.amount||0),0);
  const netProfit=grossProfit-totalExpenses2; // Line 31
  const collected=paidSales.reduce((a,s)=>a+calcSaleGrandTotal(s),0);
  const outstanding=filteredSales.filter(s=>pmtFor(s.id)?.status!=="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0);

  // Tax by state (your configured states)
  const taxByState=stateTaxes.filter(st=>!st.exempt).map(st=>{
    const stSales=filteredSales.filter(s=>(s.state||"")===st.id);
    const tax=stSales.reduce((a,s)=>a+calcSaleTax(s),0);
    const taxable=stSales.reduce((a,s)=>a+(s.items||[]).reduce((b,i)=>{const p=products.find(x=>x.id===i.pid);return isTaxableProd(p)?b+(p?.price||0)*i.qty:b;},0),0);
    const allInfo=ALL_STATES_TAX.find(x=>x.id===st.id);
    return{state:st.id,name:st.name,rate:st.rate,tax,taxable,count:stSales.length,due:allInfo?.due||"20th",form:allInfo?.form||"OTP Return"};
  }).filter(x=>x.count>0);

  const activeStateIds=[...new Set(filteredSales.map(s=>s.state).filter(Boolean))];
  const thisMonth=now.toLocaleString("default",{month:"long",year:"numeric"});

  const byMethod={};
  filteredSales.forEach(s=>{const pm=pmtFor(s.id);if(pm?.status==="paid"){const m=pm.method||"cash";if(!byMethod[m])byMethod[m]={count:0,amount:0};byMethod[m].count++;byMethod[m].amount+=calcSaleGrandTotal(s);}});

  const allCollected=payments.filter(p=>p.status==="paid").sort((a,b)=>new Date(b.collected_at||0)-new Date(a.collected_at||0));
  const filteredDeposits=depositFilter==="all"?allCollected:allCollected.filter(p=>p.method===depositFilter);
  const totalDeposits=filteredDeposits.reduce((a,p)=>a+parseFloat(p.amount||0),0);

  const qData=[0,1,2,3].map(q=>{
    const qS=sales.filter(s=>{const d=new Date(s.created_at);return d.getFullYear()===now.getFullYear()&&Math.floor(d.getMonth()/3)===q;});
    return{label:["Q1 (Jan-Mar)","Q2 (Apr-Jun)","Q3 (Jul-Sep)","Q4 (Oct-Dec)"][q],rev:qS.reduce((a,s)=>a+parseFloat(s.total||0),0),tax:qS.reduce((a,s)=>a+calcSaleTax(s),0),col:qS.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0),count:qS.length};
  });

  const deleteExpense=async(id)=>{
    showConfirm("Delete this expense?",async()=>{
      const{error}=await supabase.from("expenses").delete().eq("id",id);
      if(error){showToast(error.message,"error");return;}
      setLocalExpenses(prev=>prev.filter(e=>e.id!==id));
      showToast("Expense deleted");
    });
  };

  const exportIRS=()=>{
    const rows=[
      ["VitalWaveOne LLC — IRS Report"],["Period",period.toUpperCase()],["Generated",new Date().toLocaleDateString()],[],
      ["SCHEDULE C"],
      ["Line 1 — Gross receipts or sales",grossReceipts.toFixed(2)],
      ["Line 4 — Cost of goods sold",cogs.toFixed(2)],
      ["Line 5 — Gross profit",grossProfit.toFixed(2)],
      ["Line 23 — Tobacco excise tax remitted",taxCollected.toFixed(2)],
      ["Line 28 — Total expenses",totalExpenses2.toFixed(2)],
      ["Line 31 — Net profit",netProfit.toFixed(2)],[],
      ["COLLECTIONS"],["Collected",collected.toFixed(2)],["Outstanding",outstanding.toFixed(2)],[],
      ["TAX BY STATE"],["State","Rate","Taxable","Tax Collected","Invoices","Due","Form"],
      ...taxByState.map(t=>[t.state,t.rate+"%",t.taxable.toFixed(2),t.tax.toFixed(2),t.count,t.due,t.form]),
      [],["EXPENSES"],["Date","Driver","Category","Amount","Description"],
      ...localExpenses.map(e=>[e.date,e.driver_name,e.category,parseFloat(e.amount).toFixed(2),e.description||""]),
      [],["DEPOSIT LEDGER"],["Sale ID","Method","Amount","Date","Check#","Receipt"],
      ...allCollected.map(p=>[p.sale_id,p.method,parseFloat(p.amount).toFixed(2),p.collected_at?.slice(0,10)||"",p.check_number||"",p.receipt_url?"YES":"NO"]),
    ];
    const csv=rows.map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");
    a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);
    a.download="IRS_Report_"+period+"_"+new Date().toISOString().slice(0,10)+".csv";
    a.click();
    showToast("IRS report exported!");
  };

  const tabs2=[{id:"overview",label:"📊 Overview"},{id:"quarterly",label:"📅 Quarterly"},{id:"monthly",label:"📋 Monthly Filing"},{id:"allstates",label:"🗺 All States"},{id:"tax",label:"🏛 Tax by State"},{id:"methods",label:"💳 Payment Methods"},{id:"expenses",label:"🚗 Expenses"},{id:"deposits",label:"💰 Deposit Ledger"}];

  const Card2=({label,value,sub,color="#212121"})=>(
    <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 16px"}}>
      <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:".08em",marginBottom:4}}>{label}</div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color}}>{value}</div>
      {sub&&<div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{sub}</div>}
    </div>
  );

  return(
    <div style={{display:"flex",height:"calc(100vh - 120px)",overflow:"hidden"}}>

      {/* LEFT SIDEBAR */}
      <div style={{width:220,flexShrink:0,borderRight:"1px solid #e5e7eb",background:"#f9fafb",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 16px",borderBottom:"1px solid #e5e7eb"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:"#212121"}}>🏛 IRS Reports</div>
          <div style={{fontSize:10,color:"#9ca3af",marginTop:2}}>Audit-ready documentation</div>
        </div>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb"}}>
          <label style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".08em",display:"block",marginBottom:6}}>PERIOD</label>
          <select value={period} onChange={e=>setPeriod(e.target.value)} style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:7,padding:"8px 10px",fontSize:12,background:"#fff"}}>
            <option value="all">All Time</option>
            <option value="ytd">Year to Date</option>
            <option value="last30">Last 30 Days</option>
            <option value="q1">Q1 (Jan–Mar)</option>
            <option value="q2">Q2 (Apr–Jun)</option>
            <option value="q3">Q3 (Jul–Sep)</option>
            <option value="q4">Q4 (Oct–Dec)</option>
          </select>
        </div>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb"}}>
          {[["Gross Receipts",fmt(grossReceipts),"#059669"],["Tax to Remit",fmt(taxCollected),"#dc2626"],["Net Profit",fmt(netProfit),netProfit>=0?"#059669":"#dc2626"],["AR Outstanding",fmt(outstanding),"#f59e0b"]].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f3f4f6"}}>
              <span style={{fontSize:10,color:"#6b7280"}}>{l}</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:c}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
          {tabs2.map(t=>(
            <button key={t.id} onClick={()=>setIrsTab(t.id)}
              style={{width:"100%",textAlign:"left",padding:"9px 12px",borderRadius:8,border:"none",background:irsTab===t.id?"#7c3aed":"transparent",color:irsTab===t.id?"#fff":"#374151",fontSize:12,fontWeight:irsTab===t.id?700:400,cursor:"pointer",marginBottom:2,fontFamily:"'Barlow',sans-serif"}}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{padding:"12px 16px",borderTop:"1px solid #e5e7eb"}}>
          <button onClick={exportIRS} style={{width:"100%",padding:"10px",background:"#0a1628",color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:".04em"}}>
            📥 EXPORT IRS CSV
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"20px"}}>

        {/* OVERVIEW */}
        {irsTab==="overview"&&<>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#212121",marginBottom:12}}>Income Summary — Schedule C / Form 1120S</div>
          <div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px",fontSize:12,color:"#854d0e",marginBottom:16}}>
            <strong>⚠️ Schedule C Note:</strong> Tobacco tax collected from customers ({fmt(taxCollected)}) is included in
            Gross Receipts (Line 1). You deduct the same amount on <strong>Line 23</strong> when remitted to states. Net effect on profit = $0.
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10,marginBottom:20}}>
            <Card2 label="GROSS REVENUE" value={fmt(grossRevenue)} sub={filteredSales.length+" invoices"} color="#059669"/>
            <Card2 label="TOBACCO TAX COLLECTED" value={fmt(taxCollected)} sub="Remit to states monthly" color="#dc2626"/>
            <Card2 label="GROSS RECEIPTS (Line 1)" value={fmt(grossReceipts)} sub="Revenue + tax" color="#0ea5e9"/>
            <Card2 label="COGS (Line 4)" value={fmt(cogs)} sub="Cost of goods sold" color="#dc2626"/>
            <Card2 label="GROSS PROFIT (Line 5)" value={fmt(grossProfit)} sub={grossMargin+"% margin"} color="#059669"/>
            <Card2 label="EXPENSES (Line 28)" value={fmt(totalExpenses2)} sub="Driver + operating" color="#f59e0b"/>
            <Card2 label="NET PROFIT (Line 31)" value={fmt(netProfit)} sub="Before income tax" color={netProfit>=0?"#059669":"#dc2626"}/>
            <Card2 label="TOTAL COLLECTED" value={fmt(collected)} sub="Cash received" color="#059669"/>
          </div>
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,overflow:"hidden",marginBottom:16}}>
            <div style={{background:"#0a1628",color:"#fff",padding:"12px 16px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,letterSpacing:".06em"}}>SCHEDULE C — PROFIT OR LOSS FROM BUSINESS</div>
            {[
              ["Line 1","Gross receipts or sales",fmt(grossReceipts),"#212121",false],
              ["Line 4","Cost of goods sold (COGS)",fmt(cogs),"#dc2626",false],
              ["Line 5","Gross profit",fmt(grossProfit),"#059669",true],
              ["Line 23","Tobacco excise tax remitted to states",fmt(taxCollected),"#dc2626",false],
              ["Line 28","Total deductible expenses",fmt(totalExpenses2),"#f59e0b",false],
              ["Line 31","Net profit",fmt(netProfit),netProfit>=0?"#059669":"#dc2626",true],
            ].map(([code,label,value,color,bold])=>(
              <div key={code} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid #f3f4f6",background:bold?"#f9fafb":"#fff"}}>
                <div style={{display:"flex",gap:16,alignItems:"center"}}>
                  <span style={{fontSize:10,color:"#9ca3af",fontFamily:"monospace",minWidth:50}}>{code}</span>
                  <span style={{fontSize:13,color:"#374151",fontWeight:bold?600:400}}>{label}</span>
                </div>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:bold?800:600,fontSize:bold?18:14,color}}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:10,padding:"12px 16px",fontSize:12,color:"#065f46"}}>
            <strong>📦 Inventory Note:</strong> Current inventory at cost = {fmt(products.reduce((a,p)=>a+p.shelf*(p.cost||0),0))}. Keep all supplier invoices to support COGS.
          </div>
        </>}

        {/* QUARTERLY */}
        {irsTab==="quarterly"&&<>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#212121",marginBottom:16}}>Quarterly Revenue — {now.getFullYear()}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {qData.map(q=>(
              <div key={q.label} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#0a1628",marginBottom:12}}>{q.label}</div>
                {[["Revenue",fmt(q.rev),"#059669"],["Tax Collected",fmt(q.tax),"#dc2626"],["Collected",fmt(q.col),"#0ea5e9"],[q.count+" invoices","","#6b7280"]].map(([l,v,c])=>l&&(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f3f4f6"}}>
                    <span style={{fontSize:12,color:"#6b7280"}}>{l}</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:c}}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:"#9ca3af",letterSpacing:".1em",marginBottom:10}}>ANNUAL TOTALS</div>
            {[["Total Revenue",fmt(qData.reduce((a,q)=>a+q.rev,0)),"#059669"],["Total Tax",fmt(qData.reduce((a,q)=>a+q.tax,0)),"#dc2626"],["Total Collected",fmt(qData.reduce((a,q)=>a+q.col,0)),"#0ea5e9"],["Total Invoices",qData.reduce((a,q)=>a+q.count,0)+" invoices","#6b7280"]].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f3f4f6"}}>
                <span style={{fontSize:13,color:"#374151",fontWeight:600}}>{l}</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:c}}>{v}</span>
              </div>
            ))}
          </div>
        </>}

        {/* MONTHLY FILING */}
        {irsTab==="monthly"&&<>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#212121",marginBottom:8}}>Monthly Filing Checklist — {thisMonth}</div>
          <div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px",fontSize:12,color:"#854d0e",marginBottom:16}}>
            <strong>📋 Rule:</strong> File a state OTP return + pay tax for every state where you sold tobacco/vape products last month.
            Due by the date shown. Late filing = 5–25% penalty per state.
          </div>
          {activeStateIds.length===0?(
            <div style={{textAlign:"center",color:"#9ca3af",padding:"40px"}}>No sales recorded for this period</div>
          ):(
            <>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#9ca3af",letterSpacing:".1em",marginBottom:10}}>STATES WITH ACTIVE SALES — FILING REQUIRED</div>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                {activeStateIds.map(sid=>{
                  const stInfo=ALL_STATES_TAX.find(x=>x.id===sid);
                  const taxInfo=taxByState.find(x=>x.state===sid);
                  const configSt=stateTaxes.find(s=>s.id===sid);
                  return(
                    <div key={sid} style={{background:"#fff",border:"2px solid #e5e7eb",borderRadius:12,padding:"16px",display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                      <div style={{background:"#0a1628",color:"#fff",borderRadius:8,padding:"8px 14px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,flexShrink:0}}>{sid}</div>
                      <div style={{flex:1,minWidth:160}}>
                        <div style={{fontWeight:700,fontSize:14,color:"#212121"}}>{stInfo?.name||sid}</div>
                        <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>Form: <strong>{stInfo?.form||configSt?.form||"OTP Return"}</strong></div>
                        <div style={{fontSize:11,color:"#6b7280"}}>OTP Rate: <strong>{stInfo?.otp||configSt?.rate||"?"}%</strong> wholesale · {stInfo?.note||""}</div>
                      </div>
                      <div style={{textAlign:"center",minWidth:110}}>
                        <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:".08em"}}>TAX COLLECTED</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#dc2626"}}>{fmt(taxInfo?.tax||0)}</div>
                        <div style={{fontSize:10,color:"#9ca3af"}}>{taxInfo?.count||0} invoices</div>
                      </div>
                      <div style={{textAlign:"center",minWidth:110}}>
                        <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:".08em"}}>DUE DATE</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,color:"#7c3aed"}}>{stInfo?.due||"20th"} of month</div>
                      </div>
                      <span style={{background:"#fef9c3",color:"#854d0e",padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:700}}>⏳ File by {stInfo?.due||"20th"}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{background:"#fff",border:"2px solid #dc2626",borderRadius:12,padding:"16px"}}>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>TOTAL TAX TO REMIT THIS MONTH</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:"#dc2626"}}>{fmt(taxCollected)}</div>
                <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>Across {activeStateIds.length} state{activeStateIds.length!==1?"s":""}</div>
              </div>
            </>
          )}
        </>}

        {/* ALL STATES */}
        {irsTab==="allstates"&&<IRSAllStates
            stateTaxes={stateTaxes}
            setStateTaxes={setStateTaxes}
            activeStateIds={activeStateIds}
            stateSearch={stateSearch}
            setStateSearch={setStateSearch}
            supabase={supabase}
            showToast={showToast}
          />}

        {/* TAX BY STATE */}
        {irsTab==="tax"&&<>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#212121",marginBottom:12}}>Tax by State — Your Active States</div>

          {/* OTP Section */}
          <div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px",fontSize:12,color:"#854d0e",marginBottom:12}}>
            <strong>🚬 OTP Tax</strong> collected from customers must be remitted to each state monthly.
            Keep remittance receipts as proof. This is the tax your invoices calculate.
          </div>
          {taxByState.length===0?(
            <div style={{textAlign:"center",color:"#9ca3af",padding:"30px",background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",marginBottom:16}}>No OTP taxable sales for this period</div>
          ):(
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,overflow:"hidden",marginBottom:20}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#0a1628",color:"#fff"}}>
                  {["State","Your OTP Rate","Invoices","Taxable Sales","OTP Tax Collected","Filing Due","Form"].map(h=>(
                    <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {taxByState.map(t=>(
                    <tr key={t.state} style={{borderBottom:"1px solid #f3f4f6"}}>
                      <td style={{padding:"12px 14px",fontWeight:700,color:"#0a1628"}}>{t.state} — {t.name}</td>
                      <td style={{padding:"12px 14px",color:"#7c3aed",fontWeight:700}}>{t.rate}% wholesale</td>
                      <td style={{padding:"12px 14px",color:"#6b7280"}}>{t.count}</td>
                      <td style={{padding:"12px 14px"}}>{fmt(t.taxable)}</td>
                      <td style={{padding:"12px 14px"}}><span style={{background:"#fef9c3",color:"#854d0e",padding:"4px 10px",borderRadius:6,fontSize:12,fontWeight:700}}>{fmt(t.tax)}</span></td>
                      <td style={{padding:"12px 14px",fontSize:12,color:"#7c3aed",fontWeight:600}}>{t.due}</td>
                      <td style={{padding:"12px 14px",fontSize:11,color:"#6b7280",fontFamily:"monospace"}}>{t.form}</td>
                    </tr>
                  ))}
                  <tr style={{background:"#f9fafb",borderTop:"2px solid #e5e7eb"}}>
                    <td colSpan={4} style={{padding:"12px 14px",fontWeight:800}}>TOTAL OTP TO REMIT</td>
                    <td style={{padding:"12px 14px"}}><span style={{background:"#dc2626",color:"#fff",padding:"4px 12px",borderRadius:6,fontSize:13,fontWeight:800}}>{fmt(taxByState.reduce((a,t)=>a+t.tax,0))}</span></td>
                    <td colSpan={2}/>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Cigarette Section */}
          <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"12px 16px",fontSize:12,color:"#1e40af",marginBottom:12}}>
            <strong>🚬 Cigarette Tax ($/pack)</strong> — reference rates for your active states.
            This is a separate per-pack stamp tax paid when purchasing cigarettes from manufacturers/distributors.
            Not calculated per invoice — shown for planning and compliance awareness.
          </div>
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#1e40af",color:"#fff"}}>
                {["State","Cigarette Tax","Filing Form","Note"].map(h=>(
                  <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {activeStateIds.map(sid=>{
                  const stInfo=ALL_STATES_TAX.find(x=>x.id===sid);
                  if(!stInfo)return null;
                  return(
                    <tr key={sid} style={{borderBottom:"1px solid #f3f4f6"}}>
                      <td style={{padding:"11px 14px",fontWeight:700,color:"#1e40af"}}>{sid} — {stInfo.name}</td>
                      <td style={{padding:"11px 14px"}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:stInfo.cig>=3?"#dc2626":stInfo.cig>=1.5?"#f59e0b":"#059669"}}>${stInfo.cig.toFixed(2)}/pack</span>
                      </td>
                      <td style={{padding:"11px 14px",fontSize:11,color:"#6b7280",fontFamily:"monospace"}}>{stInfo.form}</td>
                      <td style={{padding:"11px 14px",fontSize:10,color:"#9ca3af"}}>{stInfo.note}</td>
                    </tr>
                  );
                })}
                {activeStateIds.length===0&&<tr><td colSpan={4} style={{padding:"24px",textAlign:"center",color:"#9ca3af"}}>No active states configured</td></tr>}
              </tbody>
            </table>
          </div>
        </>}

        {/* PAYMENT METHODS */}
        {irsTab==="methods"&&<>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#212121",marginBottom:16}}>Payment Method Breakdown</div>
          <div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px",fontSize:12,color:"#854d0e",marginBottom:16}}>
            <strong>⚠️ Form 8300:</strong> Cash transactions over $10,000 (single or related) require filing Form 8300 within 15 days.
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginBottom:16}}>
            {Object.entries(byMethod).map(([m,d])=>(
              <div key={m} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px",textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:8}}>{{cash:"💵",check:"🏦",money_order:"📋",credit_card:"💳",debit_card:"🏧",zelle:"📱",card:"💳"}[m]||"💳"}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,color:"#9ca3af",letterSpacing:".1em",marginBottom:4}}>{m.replace(/_/g," ").toUpperCase()}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:"#059669"}}>{fmt(d.amount)}</div>
                <div style={{fontSize:11,color:"#9ca3af",marginTop:4}}>{d.count} transactions</div>
              </div>
            ))}
          </div>
          {Object.keys(byMethod).length>0&&<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px"}}>
            {Object.entries(byMethod).map(([m,d])=>{
              const pct=collected>0?((d.amount/collected)*100).toFixed(1):"0";
              return(
                <div key={m} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,color:"#374151"}}>{m.replace(/_/g," ")}</span>
                    <span style={{fontSize:12,fontWeight:700,color:"#059669"}}>{fmt(d.amount)} ({pct}%)</span>
                  </div>
                  <div style={{height:6,background:"#f3f4f6",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:pct+"%",background:"#7c3aed",borderRadius:3}}/>
                  </div>
                </div>
              );
            })}
          </div>}
        </>}

        {/* EXPENSES */}
        {irsTab==="expenses"&&<>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#212121",marginBottom:16}}>Business Expense Deductions</div>
          <div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px",fontSize:12,color:"#854d0e",marginBottom:16}}>
            <strong>Schedule C:</strong> Gas/mileage → Line 9. Other → Line 22. Total deductible: <strong>{fmt(totalExpenses2)}</strong>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:16}}>
            {Object.entries(localExpenses.reduce((acc,e)=>{const c=e.category||"other";acc[c]=(acc[c]||0)+parseFloat(e.amount||0);return acc;},{})).map(([cat,amt])=>(
              <div key={cat} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px"}}>
                <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:".08em",marginBottom:4}}>{cat.toUpperCase()}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:"#f59e0b"}}>{fmt(amt)}</div>
              </div>
            ))}
          </div>
          {localExpenses.length===0?<div style={{textAlign:"center",color:"#9ca3af",padding:"30px"}}>No expenses recorded</div>:(
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#0a1628",color:"#fff"}}>
                  {["Date","Driver","Category","Amount","Description","Receipt / Action"].map(h=>(
                    <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {localExpenses.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=>(
                    <tr key={e.id} style={{borderBottom:"1px solid #f3f4f6"}}>
                      <td style={{padding:"10px 14px",fontSize:12,color:"#6b7280"}}>{e.date}</td>
                      <td style={{padding:"10px 14px",fontSize:12,color:"#212121"}}>{e.driver_name}</td>
                      <td style={{padding:"10px 14px"}}><span style={{background:"#f5f3ff",color:"#7c3aed",padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:700}}>{e.category}</span></td>
                      <td style={{padding:"10px 14px",fontWeight:700,color:"#f59e0b"}}>{fmt(parseFloat(e.amount||0))}</td>
                      <td style={{padding:"10px 14px",fontSize:12,color:"#6b7280"}}>{e.description||"—"}</td>
                      <td style={{padding:"10px 14px"}}>
                        <div style={{display:"flex",gap:6}}>
                          {e.receipt_url?<button onClick={()=>setViewReceipt(e.receipt_url)} style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#065f46",cursor:"pointer",fontWeight:700}}>📸 View</button>:<span style={{fontSize:11,color:"#d1d5db"}}>None</span>}
                          <button onClick={()=>deleteExpense(e.id)} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#dc2626",cursor:"pointer",fontWeight:700}}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr style={{background:"#f9fafb",borderTop:"2px solid #e5e7eb"}}>
                    <td colSpan={3} style={{padding:"12px 14px",fontWeight:800}}>TOTAL DEDUCTIBLE</td>
                    <td style={{padding:"12px 14px"}}><span style={{background:"#f59e0b",color:"#fff",padding:"4px 10px",borderRadius:6,fontSize:13,fontWeight:800}}>{fmt(totalExpenses2)}</span></td>
                    <td colSpan={2}/>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>}

        {/* DEPOSIT LEDGER */}
        {irsTab==="deposits"&&<>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:"#212121",marginBottom:8}}>Deposit Ledger — All Collected Payments</div>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            <select value={depositFilter} onChange={e=>setDepositFilter(e.target.value)} style={{border:"1.5px solid #e5e7eb",borderRadius:7,padding:"7px 12px",fontSize:12,background:"#fff"}}>
              <option value="all">All Methods</option>
              <option value="cash">💵 Cash</option>
              <option value="check">🏦 Check</option>
              <option value="money_order">📋 Money Order</option>
              <option value="zelle">📱 Zelle</option>
              <option value="card">💳 Card</option>
            </select>
            <div style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:8,padding:"7px 14px",fontSize:12,color:"#065f46",fontWeight:700}}>
              {filteredDeposits.length} payments · {fmt(totalDeposits)} total · {filteredDeposits.filter(p=>p.receipt_url).length} receipts
            </div>
          </div>
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#0a1628",color:"#fff"}}>
                {["Invoice","Date Collected","Method","Amount","Check/Ref#","Bank","Receipt"].map(h=>(
                  <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filteredDeposits.length===0?<tr><td colSpan={7} style={{padding:"30px",textAlign:"center",color:"#9ca3af"}}>No deposits found</td></tr>:filteredDeposits.map(p=>(
                  <tr key={p.id||p.sale_id} style={{borderBottom:"1px solid #f3f4f6"}}>
                    <td style={{padding:"10px 14px"}}><span style={{background:"#f5f3ff",color:"#7c3aed",padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:700}}>{p.sale_id}</span></td>
                    <td style={{padding:"10px 14px",fontSize:12,color:"#6b7280"}}>{p.collected_at?new Date(p.collected_at).toLocaleDateString():"—"}</td>
                    <td style={{padding:"10px 14px"}}><span style={{background:"#f9fafb",border:"1px solid #e5e7eb",padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:600,color:"#374151"}}>{p.method}</span></td>
                    <td style={{padding:"10px 14px",fontWeight:700,color:"#059669",fontFamily:"'Barlow Condensed',sans-serif",fontSize:15}}>{fmt(parseFloat(p.amount||0))}</td>
                    <td style={{padding:"10px 14px",fontSize:12,color:"#6b7280"}}>{p.check_number||"—"}</td>
                    <td style={{padding:"10px 14px",fontSize:12,color:"#6b7280"}}>{p.bank_name||"—"}</td>
                    <td style={{padding:"10px 14px"}}>
                      {p.receipt_url?<button onClick={()=>setViewReceipt(p.receipt_url)} style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:6,padding:"4px 10px",fontSize:11,color:"#065f46",cursor:"pointer",fontWeight:700}}>📸 View</button>:<span style={{fontSize:11,color:"#d1d5db"}}>No receipt</span>}
                    </td>
                  </tr>
                ))}
                {filteredDeposits.length>0&&(
                  <tr style={{background:"#f9fafb",borderTop:"2px solid #e5e7eb"}}>
                    <td colSpan={3} style={{padding:"12px 14px",fontWeight:800}}>TOTAL DEPOSITED</td>
                    <td style={{padding:"12px 14px"}}><span style={{background:"#059669",color:"#fff",padding:"4px 12px",borderRadius:6,fontSize:14,fontWeight:800}}>{fmt(totalDeposits)}</span></td>
                    <td colSpan={3}/>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>}

        {/* Receipt viewer */}
        {viewReceipt&&(
          <div style={{position:"fixed",inset:0,background:"#00000080",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:"#fff",borderRadius:16,padding:20,maxWidth:600,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:15}}>📸 Receipt</div>
                <button onClick={()=>setViewReceipt(null)} style={{background:"#f3f4f6",border:"none",borderRadius:7,padding:"6px 12px",cursor:"pointer",fontWeight:700}}>✕ Close</button>
              </div>
              {viewReceipt.toLowerCase().includes(".pdf")?<iframe src={viewReceipt} style={{width:"100%",height:500,border:"none",borderRadius:8}}/>:<img src={viewReceipt} alt="receipt" style={{width:"100%",borderRadius:8,border:"1px solid #e5e7eb"}}/>}
              <a href={viewReceipt} target="_blank" rel="noreferrer" style={{display:"block",marginTop:10,textAlign:"center",background:"#0a1628",color:"#fff",padding:"10px",borderRadius:8,fontSize:13,fontWeight:700,textDecoration:"none"}}>🔗 Open Full Size</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// -- STATE ACTIVATION COMPONENT -----------------------------------------------
// Simple: activate/deactivate states only. Rate config is in IRS Reports > All States
function StateTaxManager({stateTaxes,setStateTaxes,supabase,showToast}){
  const [search,setSearch]=useState("");
  const [adding,setAdding]=useState(false);
  const [editingId,setEditingId]=useState(null);
  const [editVals,setEditVals]=useState({otp:"",cig:""});
  const [savingEdit,setSavingEdit]=useState(false);

  const activeIds=new Set(stateTaxes.map(s=>s.id));
  const ref=(id)=>ALL_STATES_TAX.find(s=>s.id===id)||{otp:0,cig:0,due:"20th",form:"OTP Return"};

  const activate=async(stData,exempt=false)=>{
    const r=ref(stData.id);
    const rec={id:stData.id,name:stData.name,rate:exempt?0:r.otp,cig_tax:r.cig,exempt};
    const{error}=await supabase.from("state_taxes").upsert(rec);
    if(error){showToast(error.message,"error");return;}
    setStateTaxes(prev=>{
      const exists=prev.find(s=>s.id===rec.id);
      return exists?prev.map(s=>s.id===rec.id?rec:s):[...prev,rec];
    });
    showToast(`[OK] ${stData.id}  -  ${stData.name} ${exempt?"added as exempt":"activated"}`);
    setAdding(false);
  };

  const remove=async(id)=>{
    showConfirm(`Remove ${id} from active states?`,async()=>{
      await supabase.from("state_taxes").delete().eq("id",id);
      setStateTaxes(prev=>prev.filter(s=>s.id!==id));
      showToast(`${id} removed`);
    });
  };

  const startEdit=(st)=>{
    setEditingId(st.id);
    setEditVals({otp:String(st.rate??ref(st.id).otp??0),cig:String(st.cig_tax??ref(st.id).cig??0)});
  };

  const saveEdit=async(st)=>{
    setSavingEdit(true);
    const newRate=parseFloat(editVals.otp)||0;
    const newCig=parseFloat(editVals.cig)||0;
    const updated={...st,rate:newRate,cig_tax:newCig};
    const{error}=await supabase.from("state_taxes").upsert(updated);
    if(error){showToast(error.message,"error");setSavingEdit(false);return;}
    setStateTaxes(prev=>prev.map(s=>s.id===st.id?updated:s));
    showToast(`[OK] ${st.id} rates updated  -  OTP ${newRate}%   -   Cig $${newCig.toFixed(2)}/pack`);
    setEditingId(null);
    setSavingEdit(false);
  };

  const notAdded=ALL_STATES_TAX.filter(s=>
    !activeIds.has(s.id)&&
    (!search||s.name.toLowerCase().includes(search.toLowerCase())||s.id.toLowerCase().includes(search.toLowerCase()))
  );

  return(
    <div className="fu">
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:20,color:"#212121"}}>⚙️ State Activation</div>
          <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>Activate states and customize OTP &amp; cigarette tax rates per state.</div>
        </div>
        <button onClick={()=>setAdding(!adding)}
          style={{padding:"9px 16px",background:adding?"#f3f4f6":"#0a1628",color:adding?"#6b7280":"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>
          {adding?"✕ Cancel":"+ Add State"}
        </button>
      </div>

      {/* Connected note */}
      <div style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:10,padding:"10px 16px",fontSize:11,color:"#065f46",marginBottom:16,display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:16}}>✅</span>
        <span>Activated states are automatically used across <strong>all platforms</strong>: driver invoices · walk-in sales · customer orders · IRS reports · emails</span>
      </div>

      {/* Active States list */}
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#9ca3af",letterSpacing:".1em",marginBottom:10}}>
        ACTIVE STATES ({stateTaxes.length})
      </div>

      {stateTaxes.length===0&&!adding&&(
        <div style={{background:"#f9fafb",border:"1px dashed #e5e7eb",borderRadius:10,padding:"24px",textAlign:"center",color:"#9ca3af",fontSize:13,marginBottom:16}}>
          No states activated yet. Click <strong>"+ Add State"</strong> to begin.
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
        {stateTaxes.map(st=>{
          const isEditing=editingId===st.id;
          return(
            <div key={st.id} style={{background:"#fff",border:`1.5px solid ${isEditing?"#7c3aed":"#e5e7eb"}`,borderRadius:12,padding:"14px 16px",transition:"border-color .15s"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                {/* State badge */}
                <div style={{background:"#0a1628",color:"#fff",borderRadius:8,padding:"6px 12px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,flexShrink:0,minWidth:44,textAlign:"center"}}>
                  {st.id}
                </div>
                {/* Name + rates */}
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#212121"}}>{st.name}</div>
                  {!isEditing&&(
                    <div style={{fontSize:11,color:"#9ca3af",marginTop:2,display:"flex",gap:10}}>
                      <span>OTP <strong style={{color:"#7c3aed"}}>{st.exempt?"—":`${st.rate??ref(st.id).otp}%`}</strong></span>
                      <span>Cig <strong style={{color:"#0a1628"}}>${(st.cig_tax??ref(st.id).cig).toFixed(2)}/pack</strong></span>
                      <span style={{color:"#d1d5db"}}>·</span>
                      <span>{ref(st.id).due} of month</span>
                    </div>
                  )}
                </div>
                {/* Status badge */}
                {st.exempt
                  ?<span style={{background:"#dcfce7",color:"#166534",padding:"4px 12px",borderRadius:6,fontSize:12,fontWeight:700,flexShrink:0}}>✅ Exempt</span>
                  :<span style={{background:"#fef9c3",color:"#854d0e",padding:"4px 12px",borderRadius:6,fontSize:12,fontWeight:700,flexShrink:0}}>🏛 Active</span>
                }
                {/* Edit button — always show, even on exempt states */}
                <button onClick={()=>isEditing?setEditingId(null):startEdit(st)}
                  style={{background:isEditing?"#ede9fe":"#f5f3ff",border:`1px solid ${isEditing?"#7c3aed":"#ddd6fe"}`,borderRadius:7,padding:"6px 10px",fontSize:12,color:"#7c3aed",cursor:"pointer",fontWeight:700,flexShrink:0}}>
                  {isEditing?"✕":"✏️"}
                </button>
                {/* Remove */}
                <button onClick={()=>remove(st.id)}
                  style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:7,padding:"6px 10px",fontSize:12,color:"#dc2626",cursor:"pointer",fontWeight:700,flexShrink:0}}>
                  🗑
                </button>
              </div>

              {/* Inline edit panel */}
              {isEditing&&(
                <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #ede9fe",display:"flex",gap:12,alignItems:"flex-end",flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:120}}>
                    <label style={{fontSize:10,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",letterSpacing:".08em",display:"block",marginBottom:4}}>🔋 OTP Rate (%)</label>
                    <input type="number" min="0" max="200" step="0.01"
                      value={editVals.otp}
                      onChange={e=>setEditVals(v=>({...v,otp:e.target.value}))}
                      style={{border:"1.5px solid #7c3aed",borderRadius:7,padding:"7px 10px",fontSize:14,fontWeight:700,width:"100%",color:"#7c3aed"}}
                    />
                    <div style={{fontSize:10,color:"#9ca3af",marginTop:3}}>% of wholesale price</div>
                  </div>
                  <div style={{flex:1,minWidth:120}}>
                    <label style={{fontSize:10,fontWeight:700,color:"#0a1628",textTransform:"uppercase",letterSpacing:".08em",display:"block",marginBottom:4}}>🚬 Cigarette Tax ($/pack)</label>
                    <input type="number" min="0" max="20" step="0.01"
                      value={editVals.cig}
                      onChange={e=>setEditVals(v=>({...v,cig:e.target.value}))}
                      style={{border:"1.5px solid #0a1628",borderRadius:7,padding:"7px 10px",fontSize:14,fontWeight:700,width:"100%",color:"#0a1628"}}
                    />
                    <div style={{fontSize:10,color:"#9ca3af",marginTop:3}}>per pack (reference only)</div>
                  </div>
                  <button onClick={()=>saveEdit(st)} disabled={savingEdit}
                    style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:7,padding:"9px 18px",fontSize:12,fontWeight:700,cursor:savingEdit?"not-allowed":"pointer",flexShrink:0,opacity:savingEdit?.6:1}}>
                    {savingEdit?"Saving…":"💾 Save Rates"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add State Panel */}
      {adding&&<>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#9ca3af",letterSpacing:".1em",marginBottom:10}}>
          SELECT STATE TO ACTIVATE
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search state..."
          style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"9px 14px",fontSize:13,marginBottom:12,boxSizing:"border-box"}}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8}}>
          {notAdded.map(s=>(
            <div key={s.id} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:"#0a1628",minWidth:28}}>{s.id}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:"#212121"}}>{s.name}</div>
                <div style={{fontSize:10,color:"#9ca3af"}}>OTP {s.otp}% · Cig ${s.cig.toFixed(2)}/pack</div>
              </div>
              <div style={{display:"flex",gap:4}}>
                <button onClick={()=>activate(s,false)}
                  style={{background:"#0a1628",color:"#fff",border:"none",borderRadius:6,padding:"5px 10px",fontSize:10,fontWeight:700,cursor:"pointer"}}>
                  Activate
                </button>
                <button onClick={()=>activate(s,true)}
                  style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:6,padding:"5px 8px",fontSize:10,fontWeight:700,color:"#065f46",cursor:"pointer"}}>
                  Exempt
                </button>
              </div>
            </div>
          ))}
          {notAdded.length===0&&<div style={{color:"#9ca3af",fontSize:13,padding:"10px"}}>All states already added</div>}
        </div>
      </>}
    </div>
  );
}


// -- IRS ALL STATES COMPONENT -------------------------------------------------


// -- IRS REPORTS COMPONENT -----------------------------------------------------
// All 50 states + DC OTP (Other Tobacco Products) tax rates
// Source: State revenue departments, Tax Foundation 2025
// OTP rates = % of wholesale price (how wholesalers are taxed)


// -- STATE CONFIG COMPONENT ----------------------------------------------------
// Simple: activate states, set OTP rate + cigarette tax per state


export default function App(){
  const[session,setSession]=useState(null);
  const[profile,setProfile]=useState(null);
  const[authReady,setAuthReady]=useState(false);
  const[mfaVerified,setMfaVerified]=useState(false);

  // Data
  const[co,setCo]=useState(null);
  const[products,setProducts]=useState([]);
  const[trucks,setTrucks]=useState([]);
  const[customers,setCustomers]=useState([]);
  const[stateTaxes,setStateTaxes]=useState([]);
  const[loads,setLoads]=useState([]);
  const[sales,setSales]=useState([]);
  const[returns,setReturns]=useState([]);
  const[payments,setPayments]=useState([]);
  const[orders,setOrders]=useState([]);
  const[expenses,setExpenses]=useState([]);
  const[creditMemos,setCreditMemos]=useState([]);
  const[auditLog,setAuditLog]=useState([]);
  const[recurringOrders,setRecurringOrders]=useState([]);
  const[promotions,setPromotions]=useState([]);
  const[warehouses,setWarehouses]=useState([{id:"main",name:"Main Warehouse",location:""}]);
  const[paymentsLog,setPaymentsLog]=useState([]);
  const[walkinRegs,setWalkinRegs]=useState([]);
  const[driverProfiles,setDriverProfiles]=useState([]);
  const[truckResets,setTruckResets]=useState([]); // pending/approved/rejected inventory reset requests
  // Truck Management tab state
  const[tmTab,setTmTab]=useState("overview");
  const[driverForm,setDriverForm]=useState({driver:"",plate:"",route:"",email:""});
  const[driverSaving,setDriverSaving]=useState(false);
  const[assignCid,setAssignCid]=useState("");
  const[assignTid,setAssignTid]=useState("");
  const mapRef=useRef(null);
  const mapInst=useRef(null);
  const[sysResetStep,setSysResetStep]=useState(0); // 0=idle, 1=confirm, 2=running, 3=done
  const[loading,setLoading]=useState(true);

  // UI
  const[tab,setTab]=useState("dashboard");
  const[modal,setModal]=useState(null);
  const[saving,setSaving]=useState(false);
  const[showNotifs,setShowNotifs]=useState(false);
  const[toast,setToast]=useState(null);
  const[arFilter,setArFilter]=useState("all");
  const[ordFilter,setOrdFilter]=useState("all");
  const[selState,setSelState]=useState("ALL");
  // Separate filters for summary and invoices tables
  const[sumFilter,setSumFilter]=useState({type:"all",date:"",month:"",year:""});
  const[invFilter,setInvFilter]=useState({type:"all",date:"",month:"",year:""});
  const[viewSale,setViewSale]=useState(null);
  const[viewTruck,setViewTruck]=useState(null);
  const[stripeModal,setStripeModal]=useState(null);
  const[amendSale,setAmendSale]=useState(null);
  const[amendItems,setAmendItems]=useState({});
  const[amendSaving,setAmendSaving]=useState(false);
  const[penaltyEdit,setPenaltyEdit]=useState("50");
  const[penaltySaving,setPenaltySaving]=useState(false);
  const[confirmDialog,setConfirmDialog]=useState(null); // {msg, onConfirm}

  const showConfirm=(msg,onConfirm)=>setConfirmDialog({msg,onConfirm});
  const[scanning,setScanning]=useState(false);
  const[rcModal,setRcModal]=useState(null); // {saleId, custId} for returned check upload
  const[rcUploading,setRcUploading]=useState(false);
  const[scanInput,setScanInput]=useState("");
  const[scanMsg,setScanMsg]=useState(null);

  // Edit states - product
  const[editingPid,setEditingPid]=useState(null);
  const[editProd,setEditProd]=useState({});

  // Edit states - customer
  const[editingCid,setEditingCid]=useState(null);
  const[editCust,setEditCust]=useState({});

  // Edit states - truck
  const[editingTid,setEditingTid]=useState(null);
  const[editTruck,setEditTruck]=useState(null);

  // Form states
  const[selTruck,setSelTruck]=useState("");
  const[selCust,setSelCust]=useState("");
  const[selLoad,setSelLoad]=useState(null);
  const[formItems,setFormItems]=useState([]);
  const[np,setNp]=useState({name:"",sku:"",cat:"Beverage",unit:"Case",case_qty:"24",cost:"",price:"",shelf:"",reorder_point:"5"});
  const[nt,setNt]=useState({driver:"",plate:"",route:""});
  const[nc,setNc]=useState({name:"",address:"",city:"",zip:"",state:"",phone:"",email:"",notes:"",truck_id:"",custom_pricing:false,custom_prices:{},credit_limit:""});
  const[rsPid,setRsPid]=useState("");
  const[rsQty,setRsQty]=useState("");
  const[coEdit,setCoEdit]=useState(null);

  const isAdmin=profile?.role==="admin";
  const pendingApprovals=walkinRegs.filter(r=>r.status==="pending").length;
  const taxRate=0;// tax handled per-product via calcSaleTax

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3200);};

  // Auth
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);if(session)loadProfile(session.user.id);else setAuthReady(true);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{setSession(session);if(session)loadProfile(session.user.id);else{setProfile(null);setMfaVerified(false);setAuthReady(true);setLoading(false);}});
    return()=>subscription.unsubscribe();
  },[]);

  const loadProfile=async uid=>{
    const{data,error}=await supabase.from("profiles").select("*").eq("id",uid).single();
    if(!error&&data) setProfile(data);
    else setProfile({id:uid,role:"admin"}); // fallback if RLS blocks
    setAuthReady(true);
  };

  useEffect(()=>{if(authReady&&session&&profile)loadAll();},[authReady,session,profile]);
  useEffect(()=>{if(co?.check_penalty!=null)setPenaltyEdit(String(co.check_penalty));},[co?.check_penalty]);

  // -- LEAFLET MAP --------------------------------------------------------------
  useEffect(()=>{
    if(tab!=="truckmanagement"||tmTab!=="map") return;

    // Load Leaflet CSS
    if(!document.getElementById("leaflet-css")){
      const link=document.createElement("link");
      link.id="leaflet-css"; link.rel="stylesheet";
      link.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    let cancelled=false;

    const initMap=()=>{
      // Defer until after React paints the DOM so mapRef.current is populated
      setTimeout(()=>{
        if(cancelled||!mapRef.current) return;

        // Destroy previous instance cleanly
        if(mapInst.current){ mapInst.current.remove(); mapInst.current=null; }

        const L=window.L;
        const map=L.map(mapRef.current,{zoomControl:true}).setView([32.7,-97.3],9);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
          attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom:19,
        }).addTo(map);
        mapInst.current=map;

        // -- CUSTOMER PINS - structured geocoding via Nominatim ---------------
        const custWithAddr=customers.filter(c=>c.address&&c.address.trim());
        custWithAddr.forEach((c,i)=>{
          const truck=trucks.find(t=>t.id===c.truck_id);

          const makeIcon=(found)=>L.divIcon({
            className:"",
            html:`<div style="background:${found?"#0a1628":"#dc2626"};color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;border:2px solid #fff;box-shadow:0 2px 8px #0004;font-family:monospace">${i+1}</div>`,
            iconSize:[28,28],iconAnchor:[14,14],
          });

          const popup=`<b style="font-size:13px">${c.name}</b><br/><span style="color:#6b7280;font-size:11px">📍 ${c.address}</span><br/><span style="font-size:11px">🚚 ${truck?.driver||"Unassigned"}</span>${c.phone?`<br/><span style="font-size:11px">📞 ${c.phone}</span>`:""}<br/><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}" target="_blank" style="color:#0ea5e9;font-size:11px;font-weight:700">Open in Maps</a>`;

          // Parse address - strip apt/unit for structured geocoding
          const parseAddress=(addr)=>{
            const parts=addr.split(',').map(s=>s.trim());
            if(parts.length>=3){
              const streetRaw=parts[0];
              // Strip apt/unit/suite suffix from street for structured queries
              // e.g. "5861 Shadowview Way Apt D" -> "5861 Shadowview Way"
              const streetClean=streetRaw
                .replace(/\s+(apt|apartment|unit|ste|suite|#|bldg|building|fl|floor|rm|room|no\.?)\s*[\w-]+$/i,'')
                .trim();
              const cityPart=parts[1];
              const stateZip=parts[2]||'';
              const stateMatch=stateZip.match(/^([A-Z]{2})\s*(\d{5}(-\d{4})?)?/);
              return{
                streetRaw,          // original with apt
                street:streetClean, // without apt
                city:cityPart,
                state:stateMatch?stateMatch[1]:'',
                postalcode:stateMatch&&stateMatch[2]?stateMatch[2].slice(0,5):'',
              };
            } else if(parts.length===2){
              const streetRaw=parts[0];
              const street=streetRaw.replace(/\s+(apt|unit|ste|suite|#)\s*[\w-]+$/i,'').trim();
              return{streetRaw,street,city:parts[1],state:'',postalcode:''};
            }
            return null;
          };

          // Pick best result - prefer street-level over city/admin
          const pickBest=(data)=>{
            if(!data||!data.length) return null;
            const streetLevel=['house','building','shop','amenity','commercial','retail','residential','apartments','yes'];
            const best=data.find(d=>streetLevel.includes(d.type)||streetLevel.includes(d.class));
            return best||data[0];
          };

          setTimeout(()=>{
            if(cancelled) return;
            const currentMap=mapInst.current;
            if(!currentMap) return;

            const parsed=parseAddress(c.address);

            // Build strategies: most specific first
            const strategies=[];

            if(parsed&&parsed.street&&parsed.city&&parsed.state){
              // 1. Structured: clean street (no apt) + city + state + zip
              const p=new URLSearchParams({format:'json',limit:'5',countrycodes:'us',
                street:parsed.street,city:parsed.city,state:parsed.state,
                ...(parsed.postalcode?{postalcode:parsed.postalcode}:{})
              });
              strategies.push(`https://nominatim.openstreetmap.org/search?${p}`);
            }

            if(parsed&&parsed.street&&parsed.postalcode){
              // 2. Structured: clean street + ZIP (no city needed)
              const p=new URLSearchParams({format:'json',limit:'5',countrycodes:'us',
                street:parsed.street,postalcode:parsed.postalcode
              });
              strategies.push(`https://nominatim.openstreetmap.org/search?${p}`);
            }

            if(parsed&&parsed.postalcode){
              // 3. Freeform: "123 Main St, 46241" - ZIP alone is very precise
              strategies.push(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(parsed.street+', '+parsed.postalcode)}&limit=5&countrycodes=us&addressdetails=1`
              );
            }

            // 4. Freeform: full original address (with apt)
            strategies.push(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(c.address)}&limit=5&countrycodes=us&addressdetails=1`
            );

            // 5. Freeform: clean street + city (drop apt and state)
            if(parsed&&parsed.street&&parsed.city){
              strategies.push(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(parsed.street+', '+parsed.city)}&limit=5&countrycodes=us`
              );
            }

            const tryStrategy=(idx)=>{
              if(idx>=strategies.length){
                console.warn(`[Map] Failed all strategies for: "${c.address}"`);
                return;
              }
              fetch(strategies[idx],{headers:{"Accept-Language":"en","User-Agent":"VitalWaveOne/1.0"}})
              .then(r=>r.ok?r.json():Promise.reject(r.status))
              .then(data=>{
                if(cancelled) return;
                const m=mapInst.current; if(!m) return;
                const result=pickBest(data);
                if(result){
                  const lat=parseFloat(result.lat),lon=parseFloat(result.lon);
                  const imp=parseFloat(result.importance||0);
                  // Skip city-level results if we still have better strategies
                  if(idx<strategies.length-1&&imp<0.25&&(result.type==='city'||result.type==='administrative')){
                    tryStrategy(idx+1); return;
                  }
                  L.marker([lat,lon],{icon:makeIcon(true)}).addTo(m).bindPopup(popup);
                  allLatLngs.push([lat,lon]);
                  // Re-fit bounds to include this new pin
                  try{ m.fitBounds(allLatLngs,{padding:[50,50],maxZoom:14,animate:true}); }catch(e){}
                  console.log(`[Map] "${c.name}" -> ${result.display_name.slice(0,60)} (type:${result.type}, imp:${imp.toFixed(2)}, strategy:${idx+1})`);
                } else {
                  tryStrategy(idx+1);
                }
              })
              .catch(()=>tryStrategy(idx+1));
            };
            tryStrategy(0);
          }, i*1200);
        });

        // -- DRIVER LOCATION PINS ----------------------------------------------
        const allLatLngs = []; // collect all pin coords for auto-fit

        driverProfiles.filter(p=>p.lat&&p.lng).forEach(p=>{
          if(cancelled||!mapInst.current) return;
          const truck=trucks.find(t=>t.id===p.truck_id);
          const driverIcon=L.divIcon({
            className:"",
            html:`<div style="background:#0ea5e9;color:#fff;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid #fff;box-shadow:0 2px 10px #0004">🚚</div>`,
            iconSize:[30,30],iconAnchor:[15,15],
          });
          L.marker([p.lat,p.lng],{icon:driverIcon})
            .addTo(mapInst.current)
            .bindPopup(`<b>🚚 ${truck?.driver||"Driver"}</b><br/>Last seen: ${p.last_seen?new Date(p.last_seen).toLocaleTimeString():"Unknown"}<br/>Route: ${truck?.route||" - "}`);
          allLatLngs.push([p.lat,p.lng]);
        });

        // -- AUTO-FIT BOUNDS ---------------------------------------------------
        // Customer pins geocode asynchronously - fit after the LAST one resolves
        // We also fit immediately if we already have driver pins, then re-fit as
        // customer pins come in
        const fitMap=()=>{
          const m=mapInst.current; if(!m||cancelled) return;
          if(allLatLngs.length>0){
            try{
              m.fitBounds(allLatLngs,{padding:[50,50],maxZoom:14,animate:true});
            }catch(e){}
          }
        };

        // Fit immediately on driver pins (if any)
        if(allLatLngs.length>0) fitMap();

        // Hook into the geocoding to collect customer coords and re-fit
        // Inject a callback that runs after each customer pin is placed
        // We do this by scheduling a final fit after all geocodes complete
        const totalCustomers=custWithAddr.length;
        if(totalCustomers>0){
          // Schedule fit after the LAST customer geocode finishes
          // Last geocode fires at index (totalCustomers-1) * 1200ms + network time
          // Add generous buffer for network round-trip
          const lastGeoDelay=(totalCustomers-1)*1200+5000;
          setTimeout(()=>{
            if(cancelled||!mapInst.current) return;
            // Collect all marker positions from the map
            const bounds=[];
            mapInst.current.eachLayer(layer=>{
              if(layer.getLatLng) bounds.push([layer.getLatLng().lat,layer.getLatLng().lng]);
            });
            if(bounds.length>0){
              try{
                mapInst.current.fitBounds(bounds,{padding:[50,50],maxZoom:14,animate:true});
              }catch(e){}
            }
          }, lastGeoDelay);

          // Also do an intermediate fit after first customer pin (fast feedback)
          setTimeout(()=>{
            if(cancelled||!mapInst.current) return;
            const bounds=[];
            mapInst.current.eachLayer(layer=>{
              if(layer.getLatLng) bounds.push([layer.getLatLng().lat,layer.getLatLng().lng]);
            });
            if(bounds.length>0){
              try{
                mapInst.current.fitBounds(bounds,{padding:[50,50],maxZoom:14,animate:true});
              }catch(e){}
            }
          }, 1200+3000); // after first customer pin + network buffer
        }
      },100); // 100ms defer - enough for React to finish painting
    };

    // Load Leaflet JS if needed, then init
    if(window.L){ initMap(); }
    else{
      // Remove any stale script tag before adding new one
      const existing=document.getElementById("leaflet-js");
      if(!existing){
        const script=document.createElement("script");
        script.id="leaflet-js";
        script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload=initMap;
        document.head.appendChild(script);
      } else {
        // Script already loading - wait for it
        existing.addEventListener("load",initMap,{once:true});
        if(window.L) initMap(); // already loaded between checks
      }
    }

    return()=>{
      cancelled=true;
      if(mapInst.current){ mapInst.current.remove(); mapInst.current=null; }
    };
  },[tab,tmTab,customers,driverProfiles,trucks]);

  const loadAll=useCallback(async()=>{
    setLoading(true);
    try{
      const[coR,prR,trR,cuR,ldR,saR,rtR,pmR,orR,stR,exR,wiR,cmR,alR,rrR,proR]=await Promise.all([
        supabase.from("company").select("*").single(),
        supabase.from("products").select("*").order("name"),
        supabase.from("trucks").select("*").order("driver"),
        supabase.from("customers").select("*").order("name"),
        supabase.from("loads").select("*").order("created_at",{ascending:false}),
        supabase.from("sales").select("*").order("created_at",{ascending:false}),
        supabase.from("returns").select("*").order("created_at",{ascending:false}),
        supabase.from("payments").select("*"),
        supabase.from("orders").select("*").order("created_at",{ascending:false}),
        supabase.from("state_taxes").select("*").order("name"),
        supabase.from("expenses").select("*").order("created_at",{ascending:false}),
        supabase.from("walkin_registrations").select("*").order("created_at",{ascending:false}),
        supabase.from("credit_memos").select("*").order("created_at",{ascending:false}),
        supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(500),
        supabase.from("recurring_orders").select("*").order("created_at",{ascending:false}),
        supabase.from("promotions").select("*").order("created_at",{ascending:false}),
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
      if(stR.data)setStateTaxes(stR.data);
      if(exR.data)setExpenses(exR.data);
      if(wiR.data)setWalkinRegs(wiR.data);
      if(cmR.data)setCreditMemos(cmR.data);
      if(alR.data)setAuditLog(alR.data);
      if(rrR.data)setRecurringOrders(rrR.data);
      if(proR.data)setPromotions(proR.data);
      // Load truck reset requests (graceful fallback if table doesn't exist yet)
      try{
        const{data:rr}=await supabase.from("truck_resets").select("*").order("created_at",{ascending:false});
        if(rr)setTruckResets(rr);
      }catch{setTruckResets([]);}
      // profiles table blocked by RLS — driver location features unavailable
      // setDriverProfiles stays [] — live map shows no markers, online status shows offline
      // Also reload paymentsLog
      const pmLR = await supabase.from("payments_log").select("*").order("created_at",{ascending:false});
      if(pmLR.data)setPaymentsLog(pmLR.data);
    }catch(e){showToast("Error loading data","error");}
    setLoading(false);
  },[profile]);

  // Email helper — uses Gmail SMTP via Supabase Edge Function
  const sendEmail=async(to,subject,html)=>{
    if(!co?.gmail_user||!co?.gmail_app_password||!co?.from_email)return{ok:false,err:"Email not configured — add Gmail credentials in Settings"};
    if(!to||!to.includes("@"))return{ok:false,err:"No valid email address"};
    try{
      const{data:{session}}=await supabase.auth.getSession();
      const res=await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invoice-email`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${session?.access_token}`,
        },
        body:JSON.stringify({
          to,
          subject,
          html,
          gmail_user:co.gmail_user,
          gmail_app_password:co.gmail_app_password,
          from_name:co.name||"VitalWaveOne",
          from_email:co.from_email||co.gmail_user,
        }),
      });
      const data=await res.json();
      if(!res.ok)return{ok:false,err:data.error||"Send failed"};
      return{ok:true};
    }catch(e){return{ok:false,err:e.message};}
  };

  // Build invoice email HTML
  const buildInvoiceEmail=(sale,cust)=>{
    const items=(sale.items||[]).map(it=>{const p=getP(it.pid);return`<tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb">${p?.name||it.pid}</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:center">${it.qty}</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">$${((p?.price||0)*it.qty).toFixed(2)}</td></tr>`;}).join("");
    return`<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;color:#212121">
      <div style="background:#0a1628;padding:20px;border-radius:8px 8px 0 0;text-align:center">
        <div style="color:#fff;font-size:22px;font-weight:700">${co?.name||"Your Supplier"}</div>
        <div style="color:#94a3b8;font-size:12px;margin-top:4px">Invoice ${sale.id} · ${sale.date}</div>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:20px;border-radius:0 0 8px 8px">
        <p>Hi <strong>${cust?.name||"Customer"}</strong>,</p>
        <p>Please find your invoice details below. Payment is due upon delivery.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead><tr style="background:#f9fafb"><th style="padding:8px 10px;text-align:left;font-size:12px">Product</th><th style="padding:8px 10px;text-align:center;font-size:12px">Qty</th><th style="padding:8px 10px;text-align:right;font-size:12px">Amount</th></tr></thead>
          <tbody>${items}</tbody>
        </table>
        <div style="border-top:2px solid #0a1628;padding-top:12px;display:flex;justify-content:space-between">
          <strong>Total Due</strong><strong style="color:#0a1628;font-size:18px">$${(calcSaleGrandTotal(sale)).toFixed(2)}</strong>
        </div>
        <p style="margin-top:20px;font-size:12px;color:#6b7280">Questions? Contact us at ${co?.phone||""} · ${co?.email||""}</p>
      </div>
    </body></html>`;
  };

  // Logaudit helper already defined above
  const logAudit=async(action,entity,detail="")=>{
    try{
      const rec={id:Math.random().toString(36).slice(2,10).toUpperCase(),user_email:session?.user?.email||"unknown",action,entity,detail,created_at:new Date().toISOString()};
      await supabase.from("audit_log").insert(rec);
      setAuditLog(prev=>[rec,...prev].slice(0,500));
    }catch{}// silent — audit failures should never break the app
  };

  // Lookups
  // O(1) lookup maps — rebuilt only when source arrays change
  const productMap=useMemo(()=>Object.fromEntries(products.map(p=>[p.id,p])),[products]);
  const truckMap  =useMemo(()=>Object.fromEntries(trucks.map(t=>[t.id,t])),[trucks]);
  const customerMap=useMemo(()=>Object.fromEntries(customers.map(c=>[c.id,c])),[customers]);
  const pmtMap=useMemo(()=>Object.fromEntries(payments.map(p=>[p.sale_id,p])),[payments]);
  const getP=id=>productMap[id];
  const getT=id=>truckMap[id];
  const getC=id=>customerMap[id];
  const pmtFor=sid=>pmtMap[sid];
  const activeLoads=useMemo(()=>{const m={};loads.filter(l=>l.status==="out").forEach(l=>{if(!m[l.truck_id])m[l.truck_id]=[];m[l.truck_id].push(l);});return m;},[loads]);
  const activeLoad=tid=>(activeLoads[tid]||[]).sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0))[0];

  // -- CUSTOM PRICING -----------------------------------------------------------------------------
  // Parse custom prices once per customer — memoized map avoids JSON.parse in render loops
  const customPriceMap=useMemo(()=>{
    const m={};
    customers.forEach(c=>{try{const mt=(c?.notes||"").match(/CUSTOM_PRICES:({.*?})/);m[c.id]=mt?JSON.parse(mt[1]):{};}catch{m[c.id]={};}});
    return m;
  },[customers]);
  const parseCustomPrices=cust=>customPriceMap[cust?.id]||{};
  const hasReturnedCheck=cust=>!!(cust?.notes||"").includes("RETURNED_CHECK:1");
  const RETURNED_CHECK_FEE=parseFloat(co?.check_penalty||50);
  const markCheckReturned=async(custId)=>{
    const cust=getC(custId);if(!cust)return;
    if((cust.notes||"").includes("RETURNED_CHECK:1"))return; // already flagged
    const newNotes=(cust.notes||"").trim()+"\nRETURNED_CHECK:1";
    await supabase.from("customers").update({notes:newNotes}).eq("id",custId);
    setCustomers(prev=>prev.map(c=>c.id===custId?{...c,notes:newNotes}:c));
  };
  const clearReturnedCheck=async(custId)=>{
    const cust=getC(custId);if(!cust)return;
    const newNotes=(cust.notes||"").replace(/\nRETURNED_CHECK:1/g,"").replace(/RETURNED_CHECK:1\n?/g,"").trim();
    await supabase.from("customers").update({notes:newNotes}).eq("id",custId);
    setCustomers(prev=>prev.map(c=>c.id===custId?{...c,notes:newNotes}:c));
    showToast("✅ Returned check flag cleared");
  };

  const uploadReturnedCheck=async(file,saleId,custId)=>{
    if(!file)return showToast("No file selected","error");
    setRcUploading(true);
    const cust=getC(custId);
    try{
      const ext=file.name.split(".").pop();
      const path=`returned-checks/RC-${saleId}-${uid()}.${ext}`;
      const{error:upErr}=await supabase.storage.from("receipts").upload(path,file,{upsert:true});
      if(upErr)throw upErr;
      const rcUrl=supabase.storage.from("receipts").getPublicUrl(path).data.publicUrl;
      // Update payment record: set returned_check_url and status to "returned_check"
      const ex=pmtFor(saleId);
      if(ex){
        await supabase.from("payments").update({returned_check_url:rcUrl,status:"returned_check"}).eq("sale_id",saleId);
      } else {
        await supabase.from("payments").insert({sale_id:saleId,status:"returned_check",returned_check_url:rcUrl});
      }
      setPayments(prev=>prev.map(p=>p.sale_id===saleId?{...p,status:"returned_check",returned_check_url:rcUrl}:p));

      // -- ADD PENALTY TO LATEST UNPAID INVOICE ------------------------------
      const penalty=parseFloat(co?.check_penalty||50);
      // Find all unpaid invoices for this customer (excluding the returned check one)
      const custSales=sales.filter(s=>s.cust_id===custId);
      const unpaidSales=custSales.filter(s=>{
        const p=pmtFor(s.id);
        return !p||(p.status!=="paid"&&s.id!==saleId);
      });
      // Sort by date descending - add penalty to the most recent unpaid invoice
      unpaidSales.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
      const targetSale=unpaidSales[0];
      if(targetSale){
        const newPrevBal=parseFloat(targetSale.previous_balance||0)+penalty;
        await supabase.from("sales").update({
          previous_balance:newPrevBal,
          check_penalty_applied:penalty,
          check_penalty_invoice:saleId,
        }).eq("id",targetSale.id);
        setSales(prev=>prev.map(s=>s.id===targetSale.id?{...s,previous_balance:newPrevBal,check_penalty_applied:penalty,check_penalty_invoice:saleId}:s));
      } else {
        // No unpaid invoice - create a standalone penalty record on the returned check invoice
        const newPrevBal=parseFloat(sales.find(s=>s.id===saleId)?.previous_balance||0)+penalty;
        await supabase.from("sales").update({
          previous_balance:newPrevBal,
          check_penalty_applied:penalty,
        }).eq("id",saleId);
        setSales(prev=>prev.map(s=>s.id===saleId?{...s,previous_balance:newPrevBal,check_penalty_applied:penalty}:s));
      }
      // ----------------------------------------------------------------------

      // Auto-flag the customer
      await markCheckReturned(custId);
      setRcModal(null);
      // Single consolidated toast
      if(targetSale){
        showToast(`🔴 Returned check recorded — ${cust?.name} flagged, $${penalty} penalty added to invoice ${targetSale.id}`);
      } else {
        showToast(`🔴 Returned check recorded — ${cust?.name} flagged, $${penalty} penalty added to invoice ${saleId}`);
      }
    }catch(e){showToast(e.message,"error");}
    setRcUploading(false);
  };
  const getEffectivePrice=(custId,pid)=>{const cust=getC(custId);const cp=parseCustomPrices(cust);const custom=cp[pid];return(custom&&parseFloat(custom)>0)?parseFloat(custom):(getP(pid)?.price||0);};
  const saveCustomPrices=async(custId,newPrices)=>{
    const cust=getC(custId);if(!cust)return;
    const baseNotes=(cust.notes||"").replace(/CUSTOM_PRICES:\{[^{}]*\}/g,"").trim();
    const hasAny=Object.values(newPrices).some(v=>v&&parseFloat(v)>0);
    const filtered=Object.fromEntries(Object.entries(newPrices).filter(([,v])=>v&&parseFloat(v)>0).map(([k,v])=>[k,parseFloat(v)]));
    const newNotes=hasAny?(baseNotes+(baseNotes?"\n":"")+"CUSTOM_PRICES:"+JSON.stringify(filtered)):baseNotes;
    const{error}=await supabase.from("customers").update({notes:newNotes}).eq("id",custId);
    if(error)throw error;
    setCustomers(prev=>prev.map(c=>c.id===custId?{...c,notes:newNotes}:c));
  };

  // -- STATE TAX HELPERS ------------------------------------------------------
  // isTaxableProd defined at module level - used consistently everywhere

  const getStateTaxRate = stateId => {
    if(!stateId) return parseFloat(co?.tax_rate||0);
    const st = stateTaxes.find(s=>s.id===stateId);
    if(!st) return parseFloat(co?.tax_rate||0);
    return st.exempt ? 0 : parseFloat(st.rate||0);
  };

  // Calculate tax for a sale - only on taxable products
  const calcSaleTax = (sale) => {
    // Global tax toggle - if disabled return 0
    if(!co?.tax_enabled) return 0;
    const cust = getC(sale.cust_id);
    const stateId = sale.state || cust?.state || "";
    const rate = getStateTaxRate(stateId);
    if(rate === 0) return 0;
    // Sum only taxable items (tobacco/nicotine only)
    const taxableSubtotal = (sale.items||[]).reduce((a,item)=>{
      const p = getP(item.pid);
      return isTaxableProd(p) ? a + (p?.price||0)*item.qty : a;
    }, 0);
    return parseFloat((taxableSubtotal * rate / 100).toFixed(2));
  };

  const calcSaleGrandTotal = sale => sale.total + calcSaleTax(sale) + parseFloat(sale.previous_balance||0);
  const getSaleState = sale => {
    const cust = getC(sale.cust_id);
    return sale.state || cust?.state || "";
  };

  // truckInv: aggregate ALL active loads for a truck (driver may load multiple times)
  const truckInv=tid=>{
    const allLoads=loads.filter(l=>l.truck_id===tid&&l.status==="out");
    if(!allLoads.length) return [];
    const allLoadIds=new Set(allLoads.map(l=>l.id));

    // Aggregate loaded qty per product across all active loads
    const loadedMap={};
    allLoads.forEach(load=>(load.items||[]).forEach(i=>{
      loadedMap[i.pid]=(loadedMap[i.pid]||0)+i.qty;
    }));

    // Aggregate sold qty per product across all sales tied to these loads
    const soldMap={};
    sales.filter(s=>allLoadIds.has(s.load_id)).forEach(s=>
      (s.items||[]).forEach(i=>{soldMap[i.pid]=(soldMap[i.pid]||0)+i.qty;})
    );

    // Aggregate returned qty
    const retMap={};
    returns.filter(r=>allLoadIds.has(r.load_id)).forEach(r=>
      (r.items||[]).forEach(i=>{retMap[i.pid]=(retMap[i.pid]||0)+i.qty;})
    );

    return Object.entries(loadedMap)
      .map(([pid,loaded])=>({
        pid,
        loaded,
        sold:soldMap[pid]||0,
        returned:retMap[pid]||0,
        remaining:Math.max(0,loaded-(soldMap[pid]||0)-(retMap[pid]||0)),
      }))
      .filter(i=>i.loaded>0);
  };

  const myTruckId=isAdmin?null:profile?.truck_id;
  const visTrucks=isAdmin?trucks:trucks.filter(t=>t.id===myTruckId);
  const visSales=isAdmin?sales:sales.filter(s=>s.truck_id===myTruckId);
  const visCustomers=isAdmin?customers:customers.filter(c=>c.truck_id===myTruckId);

  const totalRevenue=useMemo(()=>visSales.reduce((a,s)=>a+s.total,0),[visSales]);
  const totalProfit=useMemo(()=>visSales.reduce((a,s)=>a+s.profit,0),[visSales]);
  const totalTax=useMemo(()=>visSales.reduce((a,s)=>a+calcSaleTax(s),0),[visSales,stateTaxes,products,customers]);
  const totalAR=useMemo(()=>visSales.filter(s=>pmtFor(s.id)?.status!=="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0),[visSales,payments,stateTaxes,products,customers]);
  // Collected (paid only)
  const paidSales=useMemo(()=>visSales.filter(s=>pmtFor(s.id)?.status==="paid"),[visSales,payments]);
  const collectedRevenue=useMemo(()=>paidSales.reduce((a,s)=>a+s.total,0),[paidSales]);
  const collectedProfit=useMemo(()=>paidSales.reduce((a,s)=>a+s.profit,0),[paidSales]);
  const totalBilled=useMemo(()=>visSales.reduce((a,s)=>a+calcSaleGrandTotal(s),0),[visSales,payments,stateTaxes,products,customers]);
  const paidGrandTotal=useMemo(()=>paidSales.reduce((a,s)=>a+calcSaleGrandTotal(s),0),[paidSales,stateTaxes,products,customers]);

  // settlementData memoized per truck — avoids recomputing on every render
  const settlementDataMap=useMemo(()=>{
    const m={};
    trucks.forEach(({id:tid})=>{
      const ts=sales.filter(s=>s.truck_id===tid),tr=returns.filter(r=>r.truck_id===tid),al=loads.filter(l=>l.truck_id===tid);
      const rev=ts.reduce((a,s)=>a+s.total,0),prof=ts.reduce((a,s)=>a+s.profit,0);
      m[tid]={truckSales:ts,loadedUnits:al.reduce((a,l)=>a+(l.items||[]).reduce((b,i)=>b+i.qty,0),0),soldUnits:ts.reduce((a,s)=>a+(s.items||[]).reduce((b,i)=>b+i.qty,0),0),retUnits:tr.reduce((a,r)=>a+(r.items||[]).reduce((b,i)=>b+i.qty,0),0),rev,prof,cogs:rev-prof,tax:ts.reduce((a,s)=>a+calcSaleTax(s),0),collected:ts.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0),outstanding:ts.filter(s=>pmtFor(s.id)?.status!=="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0)};
    });
    return m;
  },[trucks,sales,returns,loads,payments,stateTaxes,products,customers]);
  const settlementData=tid=>settlementDataMap[tid]||{truckSales:[],loadedUnits:0,soldUnits:0,retUnits:0,rev:0,prof:0,cogs:0,tax:0,collected:0,outstanding:0};

  // -- CSV IMPORT -------------------------------------------------------------
  const[csvPreview,setCsvPreview]=useState([]);
  const[csvErrors,setCsvErrors]=useState([]);
  const[csvImporting,setCsvImporting]=useState(false);

  const CSV_TEMPLATE = [
    ["name","sku","cat","unit","cost","price","shelf"],
    ["Royal Honey 24pk","122151456+6","tobacco","Case/24","8.00","15.00","100"],
    ["Pop Cake Box","654789963","nicotine","Box/10","4.00","8.00","50"],
    ["Energy Drink 12pk","049000050103","beverage","Case/12","12.00","20.00","30"],
  ];

  const downloadTemplate=()=>{
    downloadCSV(CSV_TEMPLATE,"product-import-template.csv");
  };

  const parseCSV=text=>{
    const lines=text.trim().split("\n");
    const headers=lines[0].split(",").map(h=>h.trim().replace(/"/g,"").toLowerCase());
    const required=["name","sku","price","cost"];
    const missing=required.filter(r=>!headers.includes(r));
    if(missing.length>0){setCsvErrors([`Missing required columns: ${missing.join(", ")}`]);return[];}
    const rows=[];
    const errors=[];
    for(let i=1;i<lines.length;i++){
      if(!lines[i].trim())continue;
      const vals=lines[i].split(",").map(v=>v.trim().replace(/"/g,""));
      const row={};
      headers.forEach((h,j)=>row[h]=vals[j]||"");
      if(!row.name){errors.push(`Row ${i+1}: name is required`);continue;}
      if(!row.sku){errors.push(`Row ${i+1}: SKU is required`);continue;}
      if(isNaN(parseFloat(row.price))||parseFloat(row.price)<=0){errors.push(`Row ${i+1}: invalid price "${row.price}"`);continue;}
      if(isNaN(parseFloat(row.cost))||parseFloat(row.cost)<0){errors.push(`Row ${i+1}: invalid cost "${row.cost}"`);continue;}
      rows.push({
        id:"P"+uid(),
        name:row.name,
        sku:row.sku,
        cat:row.cat||"general",
        unit:row.unit||"unit",
        cost:parseFloat(row.cost),
        price:parseFloat(row.price),
        shelf:parseInt(row.shelf)||0,
      });
    }
    setCsvErrors(errors);
    return rows;
  };

  const handleCSVFile=e=>{
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const rows=parseCSV(ev.target.result);
      setCsvPreview(rows);
    };
    reader.readAsText(file);
  };

  const importCSV=async()=>{
    if(!csvPreview.length)return;
    setCsvImporting(true);
    try{
      // Check for duplicate SKUs
      const existingSKUs=products.map(p=>p.sku);
      const toInsert=csvPreview.filter(r=>!existingSKUs.includes(r.sku));
      const toUpdate=csvPreview.filter(r=>existingSKUs.includes(r.sku));
      let inserted=0,updated=0;
      if(toInsert.length){
        const{error}=await supabase.from("products").insert(toInsert);
        if(error)throw error;
        setProducts(prev=>[...prev,...toInsert]);
        inserted=toInsert.length;
      }
      if(toUpdate.length){
        await Promise.all(toUpdate.map(p=>{
          const existing=products.find(x=>x.sku===p.sku);
          if(!existing)return Promise.resolve();
          return supabase.from("products").update({name:p.name,cat:p.cat,unit:p.unit,cost:p.cost,price:p.price,shelf:p.shelf}).eq("id",existing.id);
        }));
        setProducts(prev=>prev.map(x=>{const u=toUpdate.find(p=>p.sku===x.sku);return u?{...x,...u,id:x.id}:x;}));
        updated=toUpdate.length;
      }
      showToast(`[OK] Imported: ${inserted} added, ${updated} updated`);
      setCsvPreview([]);setCsvErrors([]);setModal(null);
    }catch(e){showToast(e.message,"error");}
    setCsvImporting(false);
  };

  // -- PRODUCT ACTIONS --------------------------------------------------------
  const addProduct=async()=>{
    if(!np.name||!np.sku||!np.cost||!np.price)return showToast("Name, SKU, cost & price required","error");
    setSaving(true);
    const rec={id:"P"+uid(),name:np.name,sku:np.sku,cat:np.cat,unit:np.unit,case_qty:parseInt(np.case_qty)||1,cost:parseFloat(np.cost),price:parseFloat(np.price),shelf:parseInt(np.shelf)||0,reorder_point:parseInt(np.reorder_point)||5};
    const{error}=await supabase.from("products").insert(rec);
    if(error)showToast(error.message,"error");
    else{setProducts(prev=>[...prev,rec]);showToast(`${np.name} added`);setModal(null);setNp({name:"",sku:"",cat:"Beverage",unit:"Case",case_qty:"24",cost:"",price:"",shelf:"",reorder_point:"5"});logAudit("ADD","Product",`Added ${np.name} SKU:${np.sku}`);}
    setSaving(false);
  };

  const startEditProduct=p=>{setEditingPid(p.id);setEditProd({...p});};
  const cancelEditProduct=()=>{setEditingPid(null);setEditProd({});};
  const saveEditProduct=async()=>{
    setSaving(true);
    const{id,...fields}=editProd;
    const update={name:fields.name,sku:fields.sku,cat:fields.cat,unit:fields.unit,case_qty:parseInt(fields.case_qty)||1,cost:parseFloat(fields.cost)||0,price:parseFloat(fields.price)||0,shelf:parseInt(fields.shelf)||0,reorder_point:parseInt(fields.reorder_point)||5};
    const{error}=await supabase.from("products").update(update).eq("id",id);
    if(error)showToast(error.message,"error");
    else{setProducts(prev=>prev.map(p=>p.id===id?{...p,...update}:p));showToast("Product updated");setEditingPid(null);logAudit("EDIT","Product",`Edited ${fields.name}`);}
    setSaving(false);
  };

  const confirmRestock=async()=>{
    if(!rsPid||parseInt(rsQty)<=0)return;
    setSaving(true);
    const p=getP(rsPid);const ns=p.shelf+parseInt(rsQty);
    const{error}=await supabase.from("products").update({shelf:ns}).eq("id",rsPid);
    if(error)showToast(error.message,"error");
    else{setProducts(prev=>prev.map(x=>x.id===rsPid?{...x,shelf:ns}:x));showToast(`${p.name} restocked`);setModal(null);setRsQty("");logAudit("RESTOCK","Product",`Restocked ${p.name} +${rsQty} units → ${ns} total`);}
    setSaving(false);
  };

  // -- TRUCK ACTIONS ----------------------------------------------------------
  const addTruck=async()=>{
    if(!nt.driver||!nt.plate)return showToast("Driver name & plate required","error");
    setSaving(true);
    const rec={id:"T"+uid(),driver:nt.driver,plate:nt.plate,route:nt.route||""};
    const{error}=await supabase.from("trucks").insert(rec);
    if(error)showToast(error.message,"error");
    else{setTrucks(prev=>[...prev,rec]);showToast(`${nt.driver} added`);setModal(null);setNt({driver:"",plate:"",route:""});logAudit("ADD","Truck",`Added driver ${nt.driver} plate ${nt.plate}`);}
    setSaving(false);
  };

  const startEditTruck=t=>{setEditingTid(t.id);setEditTruck({...t});};
  const saveEditTruck=async()=>{
    setSaving(true);
    const{id,...fields}=editTruck;
    const{error}=await supabase.from("trucks").update({driver:fields.driver,plate:fields.plate,route:fields.route}).eq("id",id);
    if(error)showToast(error.message,"error");
    else{setTrucks(prev=>prev.map(t=>t.id===id?{...t,...fields}:t));showToast("Driver updated");setEditingTid(null);logAudit("EDIT","Truck",`Edited driver ${fields.driver}`);}
    setSaving(false);
  };

  // -- CUSTOMER ACTIONS -------------------------------------------------------
  const addCustomer=async()=>{
    if(!nc.name)return showToast("Business name required","error");
    setSaving(true);
    const rec={id:"C"+uid(),name:nc.name,address:nc.address||"",phone:nc.phone||"",email:nc.email||"",notes:nc.notes||"",truck_id:nc.truck_id||trucks[0]?.id||null,credit_limit:parseFloat(nc.credit_limit)||0,state:nc.state||""};
    if(nc.custom_pricing&&nc.custom_prices&&Object.keys(nc.custom_prices).length>0){
      rec.notes=(rec.notes?rec.notes+"\n":"")+"CUSTOM_PRICES:"+JSON.stringify(nc.custom_prices);
    }
    const{error}=await supabase.from("customers").insert(rec);
    if(error)showToast(error.message,"error");
    else{setCustomers(prev=>[...prev,rec]);showToast(`${nc.name} account opened`);setModal(null);setNc({name:"",address:"",city:"",zip:"",state:"",phone:"",email:"",notes:"",truck_id:"",custom_pricing:false,custom_prices:{},credit_limit:""});logAudit("ADD","Customer",`Added ${nc.name}`);}
    setSaving(false);
  };

  const startEditCustomer=c=>{setEditingCid(c.id);setEditCust({...c});};
  const cancelEditCustomer=()=>{setEditingCid(null);setEditCust({});};
  const saveEditCustomer=async()=>{
    setSaving(true);
    const{id,...fields}=editCust;
    const update={name:fields.name,address:fields.address||"",phone:fields.phone||"",email:fields.email||"",notes:fields.notes||"",truck_id:fields.truck_id||null,credit_limit:parseFloat(fields.credit_limit)||0};
    const{error}=await supabase.from("customers").update(update).eq("id",id);
    if(error)showToast(error.message,"error");
    else{setCustomers(prev=>prev.map(c=>c.id===id?{...c,...update}:c));showToast("Customer updated");setEditingCid(null);logAudit("EDIT","Customer",`Edited ${fields.name}`);}
    setSaving(false);
  };

  const deleteCustomer=async(id,name)=>{
    showConfirm(`Delete customer "${name}"? This cannot be undone.`,async()=>{
      try{
        await supabase.from("customers").delete().eq("id",id);
        setCustomers(prev=>prev.filter(c=>c.id!==id));
        showToast(`"${name}" deleted`);
        logAudit("DELETE","Customer",`Deleted customer ${name}`);
      }catch(e){showToast(e.message,"error");}
    });
  };

  const deleteProduct=async(id,name)=>{
    showConfirm(`Delete product "${name}"? This cannot be undone.`,async()=>{
      try{
        await supabase.from("products").delete().eq("id",id);
        setProducts(prev=>prev.filter(p=>p.id!==id));
        showToast(`"${name}" deleted`);
        logAudit("DELETE","Product",`Deleted product ${name}`);
      }catch(e){showToast(e.message,"error");}
    });
  };

  const deleteTruck=async(id,driver)=>{
    showConfirm(`Delete truck for "${driver}"? Remaining inventory will be returned to shelf. This cannot be undone.`,async()=>{
      try{
        const inv=truckInv(id);
        if(inv.length>0){
          const toReturn=inv.filter(item=>item.remaining>0&&getP(item.pid));
          await Promise.all(toReturn.map(item=>{
            const newShelf=getP(item.pid).shelf+item.remaining;
            return supabase.from("products").update({shelf:newShelf}).eq("id",item.pid);
          }));
          setProducts(prev=>prev.map(x=>{
            const item=toReturn.find(i=>i.pid===x.id);
            return item?{...x,shelf:x.shelf+item.remaining}:x;
          }));
          showToast(`↩️ ${toReturn.reduce((a,i)=>a+i.remaining,0)} units returned to warehouse`);
        }
        await supabase.from("loads").delete().eq("truck_id",id);
        await supabase.from("trucks").delete().eq("id",id);
        setTrucks(prev=>prev.filter(t=>t.id!==id));
        setLoads(prev=>prev.filter(l=>l.truck_id!==id));
        showToast(`"${driver}" truck deleted  -  inventory returned to shelf`);
        logAudit("DELETE","Truck",`Deleted truck for driver ${driver}`);
      }catch(e){showToast(e.message,"error");}
    });
  };

  // State tax is now managed in StateTaxManager component (State Activation tab)

  // -- LOAD / SALE / RETURN ---------------------------------------------------
  const lockTruck=async(tid)=>{
    await supabase.from("trucks").update({locked:true}).eq("id",tid);
    setTrucks(prev=>prev.map(t=>t.id===tid?{...t,locked:true}:t));
    showToast("🔒 Truck locked — no more loads allowed");
  };

  const unlockTruck=async(tid)=>{
    await supabase.from("trucks").update({locked:false}).eq("id",tid);
    setTrucks(prev=>prev.map(t=>t.id===tid?{...t,locked:false}:t));
    showToast("🔓 Truck unlocked — loading enabled");
  };

  // -- TRUCK INVENTORY RESET --------------------------------------------------
  const approveReset=async(req)=>{
    try{
      // Get ALL active loads for this truck (not just the first one)
      const allActiveLoads=loads.filter(l=>l.truck_id===req.truck_id&&l.status==="out");
      const allLoadIds=new Set(allActiveLoads.map(l=>l.id));

      // Compute full remaining inventory across all active loads
      const loadedMap={};
      allActiveLoads.forEach(load=>(load.items||[]).forEach(i=>{
        loadedMap[i.pid]=(loadedMap[i.pid]||0)+i.qty;
      }));
      const soldMap={};
      sales.filter(s=>allLoadIds.has(s.load_id)).forEach(s=>
        (s.items||[]).forEach(i=>{soldMap[i.pid]=(soldMap[i.pid]||0)+i.qty;})
      );
      const retMap={};
      returns.filter(r=>allLoadIds.has(r.load_id)).forEach(r=>
        (r.items||[]).forEach(i=>{retMap[i.pid]=(retMap[i.pid]||0)+i.qty;})
      );

      // Build list of items to return to shelf
      const toReturn=Object.entries(loadedMap)
        .map(([pid,loaded])=>({
          pid,
          remaining:Math.max(0,loaded-(soldMap[pid]||0)-(retMap[pid]||0)),
        }))
        .filter(i=>i.remaining>0&&getP(i.pid));

      // Return remaining stock to shelf in one batch
      if(toReturn.length>0){
        await Promise.all(toReturn.map(i=>supabase.from("products")
          .update({shelf:Math.max(0,(getP(i.pid)?.shelf||0)+i.remaining)})
          .eq("id",i.pid)));
        setProducts(prev=>prev.map(p=>{
          const item=toReturn.find(i=>i.pid===p.id);
          return item?{...p,shelf:Math.max(0,p.shelf+item.remaining)}:p;
        }));
      }

      // Close ALL active loads for this truck (not just one)
      if(allActiveLoads.length>0){
        await supabase.from("loads").update({status:"reset"})
          .in("id",allActiveLoads.map(l=>l.id));
        setLoads(prev=>prev.map(l=>
          allLoadIds.has(l.id)?{...l,status:"reset"}:l
        ));
      }

      // Mark request approved
      await supabase.from("truck_resets").update({
        status:"approved",
        reviewed_at:new Date().toISOString(),
      }).eq("id",req.id);
      setTruckResets(prev=>prev.map(r=>
        r.id===req.id?{...r,status:"approved",reviewed_at:new Date().toISOString()}:r
      ));

      const truck=getT(req.truck_id);
      const totalReturned=toReturn.reduce((a,i)=>a+i.remaining,0);
      showToast(`[OK] ${truck?.driver||"Truck"} reset - ${totalReturned} units returned from ${allActiveLoads.length} load(s)`);
    }catch(e){showToast("Reset failed: "+e.message,"error");}
  };

  const rejectReset=async(req)=>{
    await supabase.from("truck_resets").update({status:"rejected",reviewed_at:new Date().toISOString()}).eq("id",req.id);
    setTruckResets(prev=>prev.map(r=>r.id===req.id?{...r,status:"rejected",reviewed_at:new Date().toISOString()}:r));
    const truck=getT(req.truck_id);
    showToast(`[X] Reset request for ${truck?.driver||"truck"} rejected`);
  };

  const openLoad=tid=>{
    const truck=trucks.find(t=>t.id===tid);
    if(truck?.locked)return showToast("Truck is locked — admin must unlock it first","error");
    setSelTruck(tid);
    setFormItems(products.map(p=>({pid:p.id,qty:0})));
    setModal("load");
  };
  const confirmLoad=async()=>{
    const items=formItems.filter(i=>i.qty>0);if(!items.length)return;
    // Hard validation - ensure no qty exceeds actual shelf stock
    const overLimit=items.find(i=>{const p=getP(i.pid);return !p||i.qty>p.shelf;});
    if(overLimit){
      const p=getP(overLimit.pid);
      return showToast(`[!]️ Not enough shelf stock for "${p?.name}"  -  only ${p?.shelf} available`,"error");
    }
    setSaving(true);
    try{
      const load={id:"LD-"+uid(),truck_id:selTruck,date:nowStr(),items,status:"out"};
      await supabase.from("loads").insert(load);
      await Promise.all(items.map(i=>supabase.from("products").update({shelf:Math.max(0,getP(i.pid).shelf-i.qty)}).eq("id",i.pid)));
      setLoads(prev=>[load,...prev]);
      setProducts(prev=>prev.map(p=>{const fi=items.find(i=>i.pid===p.id);return fi?{...p,shelf:Math.max(0,p.shelf-fi.qty)}:p;}));
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
      const total=items.reduce((a,i)=>a+(getEffectivePrice(selCust,i.pid)*i.qty),0);
      const profit=items.reduce((a,i)=>{const p=getP(i.pid);return a+(getEffectivePrice(selCust,i.pid)-p.cost)*i.qty;},0);
      // Get next invoice number from Supabase sequence
      const {data:seqData} = await supabase.rpc("next_invoice_number");
      const invId = "INV-" + String(seqData||1).padStart(4,"0");
      const ns={id:invId,load_id:selLoad.id,truck_id:selTruck,cust_id:selCust,date:nowStr(),items,total,profit};
      await supabase.from("sales").insert(ns);
      await supabase.from("payments").insert({sale_id:ns.id,status:"unpaid"});
      setSales(prev=>[ns,...prev]);setPayments(prev=>[...prev,{sale_id:ns.id,status:"unpaid"}]);
      showToast("Sale recorded");setModal(null);setTimeout(()=>{setViewSale(ns);setModal("invoice");},80);
      // Auto-email invoice if enabled
      if(co?.email_invoices&&co?.gmail_user&&co?.gmail_app_password){
        const cust=getC(ns.cust_id);
        if(cust?.email?.includes("@")){
          sendEmail(cust.email,`Invoice ${ns.id} from ${co?.name||"Your Supplier"}`,buildInvoiceEmail(ns,cust))
            .then(r=>r.ok?showToast(`✅ Invoice emailed to ${cust.email}`):null);
        }
      }
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
      await Promise.all(items.map(i=>supabase.from("products").update({shelf:getP(i.pid).shelf+i.qty}).eq("id",i.pid)));
      const inv=truckInv(selTruck);const remAfter=inv.reduce((a,i)=>a+i.remaining,0)-items.reduce((a,i)=>a+i.qty,0);
      if(remAfter<=0)await supabase.from("loads").update({status:"closed"}).eq("id",selLoad.id);
      setReturns(prev=>[rec,...prev]);setProducts(prev=>prev.map(p=>{const fi=items.find(i=>i.pid===p.id);return fi?{...p,shelf:p.shelf+fi.qty}:p;}));
      if(remAfter<=0)setLoads(prev=>prev.map(l=>l.id===selLoad.id?{...l,status:"closed"}:l));
      showToast("Stock returned");setModal(null);
    }catch(e){showToast(e.message,"error");}
    setSaving(false);
  };

  // -- PAYMENTS ---------------------------------------------------------------
  // -- PAYMENT STATE ----------------------------------------------------------
  const[pmModal,setPmModal]=useState(false);
  const[pmForm,setPmForm]=useState({method:"cash",amount:"",check_number:"",bank_name:"",note:"",cust_id:"",truck_id:"",invoice_ids:[],receipt_url:""});
  const[pmTab,setPmTab]=useState("log"); // "log" | "collect"

  const markPaid=async(sid,method="cash",amount=0,checkNum="",note="",collectedBy="",receiptUrl="")=>{
    const ex=pmtFor(sid);
    const sale=sales.find(s=>s.id===sid);
    const gt=sale?calcSaleGrandTotal(sale):0;
    const paidAmt=amount||gt;
    const payRec={status:"paid",method,amount:paidAmt,check_number:checkNum,note,collected_by:collectedBy,paid_at:new Date().toISOString(),receipt_url:receiptUrl||""};
    if(ex)await supabase.from("payments").update(payRec).eq("sale_id",sid);
    else await supabase.from("payments").insert({sale_id:sid,...payRec});
    setPayments(prev=>prev.map(p=>p.sale_id===sid?{...p,status:"paid",method,amount:paidAmt,receipt_url:receiptUrl||""}:p));
    showToast("Payment recorded ✓");
    logAudit("PAY","Invoice",`Marked ${sid} paid via ${method} — ${fmt(paidAmt)}`);
  };
  const markUnpaid=async sid=>{await supabase.from("payments").update({status:"unpaid",paid_at:null}).eq("sale_id",sid);setPayments(prev=>prev.map(p=>p.sale_id===sid?{...p,status:"unpaid"}:p));showToast("Marked unpaid");logAudit("UNPAY","Invoice",`Marked ${sid} unpaid`);};

  const deleteInvoice=async sid=>{
    showConfirm(`Delete invoice ${sid} and all linked payments? This cannot be undone.`,async()=>{
      try{
        await supabase.from("payments").delete().eq("sale_id",sid);
        await supabase.from("payments_log").delete().contains("invoice_ids",[sid]);
        const orderId="ORD-"+sid.replace("INV-","");
        await supabase.from("orders").delete().eq("id",orderId);
        await supabase.from("sales").delete().eq("id",sid);
        setSales(prev=>prev.filter(s=>s.id!==sid));
        setPayments(prev=>prev.filter(p=>p.sale_id!==sid));
        setPaymentsLog(prev=>prev.filter(p=>!(p.invoice_ids||[]).includes(sid)));
        setOrders(prev=>prev.filter(o=>o.id!==orderId));
        showToast(`Invoice ${sid} deleted`);
        logAudit("DELETE","Invoice",`Deleted invoice ${sid}`);
      }catch(e){showToast("Error deleting: "+e.message,"error");}
    });
  };

  const openAmend=(sale)=>{
    const init={};
    (sale.items||[]).forEach(i=>{init[i.pid]=i.qty;});
    setAmendItems(init);
    setAmendSale(sale);
    setModal("amend");
  };

  const savePenalty=async()=>{
    const val=parseFloat(penaltyEdit);
    if(isNaN(val)||val<0)return showToast("Enter a valid amount","error");
    setPenaltySaving(true);
    await supabase.from("company").update({check_penalty:val}).eq("id",co.id);
    setCo(prev=>({...prev,check_penalty:val}));
    setCoEdit(prev=>({...prev,check_penalty:val}));
    setPenaltySaving(false);
    showToast(`[OK] Penalty fee updated to $${val}`);
  };

  const saveAmend=async()=>{
    if(!amendSale)return;
    setAmendSaving(true);
    try{
      const cust=getC(amendSale.cust_id);
      const custSt=(cust?.state||"").trim();
      const st=stateTaxes.find(x=>x.id?.toUpperCase()===custSt.toUpperCase()||x.name?.toLowerCase()===custSt.toLowerCase());
      const tRate=(!co?.tax_enabled||st?.exempt)?0:parseFloat(st?.rate||co?.tax_rate||0);

      const newItems=Object.entries(amendItems)
        .filter(([,q])=>parseInt(q)>0)
        .map(([pid,qty])=>({pid,qty:parseInt(qty)}));
      if(!newItems.length){showToast("Must keep at least one product","error");setAmendSaving(false);return;}

      // Validate: if increasing qty, check shelf has enough stock to cover the increase
      const oldMap={};(amendSale.items||[]).forEach(i=>{oldMap[i.pid]=i.qty;});
      const stockErr=newItems.find(i=>{
        const increase=i.qty-(oldMap[i.pid]||0);
        if(increase<=0)return false; // reducing qty - always ok
        const prod=getP(i.pid);
        return !prod||increase>prod.shelf; // need more than what's on shelf
      });
      if(stockErr){
        const prod=getP(stockErr.pid);
        const increase=stockErr.qty-(oldMap[stockErr.pid]||0);
        showToast(`[!]️ Not enough shelf stock for "${prod?.name}"  -  need ${increase} more but only ${prod?.shelf} on shelf`,"error");
        setAmendSaving(false);return;
      }

      const newSub=newItems.reduce((a,i)=>a+(getEffectivePrice(amendSale.cust_id,i.pid)||0)*i.qty,0);
      const newTaxable=newItems.reduce((a,i)=>{const p=getP(i.pid);return isTaxableProd(p)?a+(getEffectivePrice(amendSale.cust_id,i.pid)||0)*i.qty:a;},0);
      const newProfit=newItems.reduce((a,i)=>{const p=getP(i.pid);return a+(getEffectivePrice(amendSale.cust_id,i.pid)-(p?.cost||0))*i.qty;},0);

      // Adjust shelf: return old qty, deduct new qty - batched
      const allPids=[...new Set([...Object.keys(oldMap),...newItems.map(i=>i.pid)])];
      const shelfUpdates=allPids.map(pid=>{
        const diff=(oldMap[pid]||0)-parseInt(amendItems[pid]||0);
        if(diff===0)return null;
        const prod=getP(pid); if(!prod)return null;
        return{pid,newShelf:Math.max(0,prod.shelf+diff)};
      }).filter(Boolean);
      await Promise.all(shelfUpdates.map(u=>supabase.from("products").update({shelf:u.newShelf}).eq("id",u.pid)));
      setProducts(prev=>prev.map(p=>{const u=shelfUpdates.find(x=>x.pid===p.id);return u?{...p,shelf:u.newShelf}:p;}));

      await supabase.from("sales").update({
        items:newItems, total:newSub, profit:newProfit,
        amended_at:new Date().toISOString(),
      }).eq("id",amendSale.id);

      setSales(prev=>prev.map(s=>s.id===amendSale.id
        ?{...s,items:newItems,total:newSub,profit:newProfit,amended_at:new Date().toISOString()}
        :s
      ));
      showToast(`[OK] Invoice ${amendSale.id} amended`);
      setModal(null);setAmendSale(null);setAmendItems({});
    }catch(e){showToast("Error: "+e.message,"error");}
    setAmendSaving(false);
  };

  // -- CARD SURCHARGE ---------------------------------------------------------
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
      // Upload receipt if provided
      let receiptUrl = "";
      if(pmForm.receipt_file){
        const ext = pmForm.receipt_file.name.split(".").pop();
        const path = `receipts/PMT-${uid()}.${ext}`;
        const {data:upData,error:upErr} = await supabase.storage.from("receipts").upload(path, pmForm.receipt_file, {upsert:true});
        if(!upErr) receiptUrl = supabase.storage.from("receipts").getPublicUrl(path).data.publicUrl;
      }
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
        receipt_url:receiptUrl,
        date:nowStr(),
        created_at:new Date().toISOString(),
      };
      await supabase.from("payments_log").insert(rec);
      for(const sid of pmForm.invoice_ids){
        await markPaid(sid,pmForm.method,totalCollected,pmForm.check_number,rec.note,rec.collected_by,receiptUrl);
      }
      setPaymentsLog(prev=>[rec,...prev]);
      showToast(`${methodIcon(pmForm.method)} $${totalCollected.toFixed(2)} recorded${surcharge>0?` (incl. $${surcharge.toFixed(2)} card fee)`:""}`);
      setPmModal(false);
      setPmForm({method:"cash",amount:"",check_number:"",bank_name:"",note:"",cust_id:"",truck_id:"",invoice_ids:[],receipt_url:""});
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

  // -- ORDERS -----------------------------------------------------------------
  // Auto-process new approved orders into invoices - runs once per new order
  const processedOrderIds=useRef(new Set());
  useEffect(()=>{
    const autoProcess = async () => {
      const newOrders = orders.filter(o=>
        o.status==="approved" &&
        !processedOrderIds.current.has(o.id) &&
        !sales.some(s=>s.id==="INV-"+o.id.replace("ORD-",""))
      );
      if(!newOrders.length) return;
      newOrders.forEach(o=>processedOrderIds.current.add(o.id));
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
          const profit=order.items.reduce((a,i)=>{const p=getP(i.pid);return a+(getEffectivePrice(order.cust_id,i.pid)-(p?.cost||0))*i.qty;},0);
          const penalty=parseFloat(order.check_penalty_applied||0);
          const ns={id:"INV-"+order.id.replace("ORD-",""),load_id:loadId,truck_id:truckId,cust_id:order.cust_id,date:nowStr(),items:order.items,total:order.subtotal,profit,previous_balance:order.previous_balance||0,previous_invoice_ids:order.previous_invoice_ids||"",check_penalty_applied:penalty};
          const pmtStatus=order.payment_method==="card"?"paid":"unpaid";
          await supabase.from("sales").insert(ns);
          await supabase.from("payments").insert({sale_id:ns.id,status:pmtStatus,method:order.payment_method||"cash"});
          setSales(prev=>[ns,...prev]);
          setPayments(prev=>[...prev,{sale_id:ns.id,status:pmtStatus}]);
        }catch(e){console.error("Auto-process error:",e);}
      }
    };
    if(orders.length&&customers.length&&trucks.length) autoProcess();
  },[orders,sales,customers,trucks]);

  // -- SETTINGS ---------------------------------------------------------------
  const saveSettings=async()=>{
    setSaving(true);
    const{error}=await supabase.from("company").update(coEdit).eq("id",co.id);
    if(error)showToast(error.message,"error");
    else{setCo(coEdit);showToast("Settings saved");setModal(null);}
    setSaving(false);
  };

  // -- CAMERA BARCODE SCANNER -------------------------------------------------
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
      setScanMsg({type:"success", text:`[OK] ${p.name}  -  qty updated`});
    } else {
      setScanMsg({type:"error", text:`[X] No product found for: ${barcode}`});
    }
    setScanInput("");
    setTimeout(()=>setScanMsg(null), 2500);
  };

  // CSV
  const exportInvoices=()=>{const rows=[["Invoice","Date","Customer","Driver","Subtotal","Tax (Tobacco)","Total","Profit","Status"]];visSales.forEach(s=>{const tax=calcSaleTax(s);const gt=calcSaleGrandTotal(s);rows.push([s.id,s.date,getC(s.cust_id)?.name,getT(s.truck_id)?.driver,s.total.toFixed(2),tax.toFixed(2),gt.toFixed(2),s.profit.toFixed(2),pmtFor(s.id)?.status==="paid"?"Paid":"Unpaid"]);});downloadCSV(rows,"invoices.csv");};
  const exportAR=()=>{const rows=[["Invoice","Customer","Driver","Subtotal","Tax (Tobacco)","Total","Balance","Status"]];visSales.forEach(s=>{const gt=calcSaleGrandTotal(s);rows.push([s.id,getC(s.cust_id)?.name,getT(s.truck_id)?.driver,s.total.toFixed(2),calcSaleTax(s).toFixed(2),gt.toFixed(2),pmtFor(s.id)?.status==="paid"?"0.00":gt.toFixed(2),pmtFor(s.id)?.status==="paid"?"Paid":"Unpaid"]);});downloadCSV(rows,"ar.csv");};
  const exportPL=()=>{const rows=[["Metric","Value"],["Revenue",totalRevenue.toFixed(2)],["Tax",totalTax.toFixed(2)],["COGS",(totalRevenue-totalProfit).toFixed(2)],["Gross Profit",totalProfit.toFixed(2)],["Margin %",totalRevenue>0?((totalProfit/totalRevenue)*100).toFixed(1)+"%":"0%"],["AR Outstanding",totalAR.toFixed(2)]];downloadCSV(rows,"pl.csv");};

  // NAV
  const navItems=[
    {id:"dashboard",label:"Dashboard",icon:ic.dash},
    {id:"inventory",label:"Inventory",icon:ic.box},
    ...(isAdmin?[{id:"purchaseorders",label:"Purchase Orders",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:13}}>🛒</span>}]:[]),
    {id:"orders",label:"Orders",icon:ic.orders,badge:orders.filter(o=>o.payment_method!=="card"&&o.status==="approved").length||0},
    ...(isAdmin?[{id:"recurring",label:"Recurring Orders",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:12}}>🔁</span>}]:[]),
    ...(isAdmin?[{id:"promotions",label:"Promotions",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:12}}>🏷️</span>}]:[]),
    {id:"sales",label:"Sales & Invoices",icon:ic.inv},
    ...(isAdmin?[{id:"creditmemos",label:"Credit Memos",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:12}}>📝</span>}]:[]),
    {id:"taxinvoices",label:"Tax Invoices",icon:ic.inv},
    {id:"statetax",label:"State Activation",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:13}}>⚙️</span>},
    {id:"ar",label:"Accounts Receivable",icon:ic.ar},
    {id:"payments",label:"Payments",icon:ic.settle,badge:visSales.filter(s=>pmtFor(s.id)?.status!=="paid").length||0},
    {id:"settlement",label:"Daily Settlement",icon:ic.settle},
    ...(isAdmin?[{id:"truckmanagement",label:"Truck Management",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:13}}>🚚</span>,badge:truckResets.filter(r=>r.status==="pending").length||0}]:[]),
    ...(isAdmin?[{id:"returnedchecks",label:"Returned Checks",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:13}}>🔴</span>,badge:payments.filter(p=>p.status==="returned_check").length||0}]:[]),
    ...(isAdmin?[{id:"pl",label:"P&L Report",icon:ic.pl}]:[]),
    ...(isAdmin?[{id:"expenses",label:"Expenses",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:13}}>💸</span>}]:[]),
    ...(isAdmin?[{id:"irs",label:"IRS Reports",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:13,marginRight:0}}>🏛</span>}]:[]),
    {id:"customers",label:"Customers",icon:ic.users},
    ...(isAdmin?[{id:"userapprovals",label:"New Users Approval",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:13}}>👥</span>,badge:pendingApprovals}]:[]),
    ...(isAdmin?[{id:"auditlog",label:"Audit Log",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:12}}>🔍</span>}]:[]),
    ...(isAdmin?[{id:"settings",label:"Settings",icon:ic.gear}]:[]),
  ];

  // Guards
  if(!authReady)return<div className="app"><GS/><Spinner msg="STARTING UP…"/></div>;
  if(!session)return<div className="app"><GS/><Login/></div>;
  if(loading)return<div className="app"><GS/><Spinner msg="LOADING YOUR DATA…"/></div>;

  // -- 2FA GATE ---------------------------------------------------------------
  // Force 2FA verification even for cached sessions
  if(!mfaVerified&&profile?.role==="admin"){
    return<div className="app"><GS/><MFAGate onVerified={()=>setMfaVerified(true)}/></div>;
  }

  // -- ACCESS CONTROL ---------------------------------------------------------
  // Only admins can access this dashboard - drivers & others go to order portal
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

  // -- INLINE EDIT HELPERS ----------------------------------------------------
  const EI=({val,onChange,type="text",style={}})=><input className="ei" type={type} value={val} onChange={e=>onChange(e.target.value)} style={style}/>;
  const ES=({val,onChange,options})=><select className="ei" value={val} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select>;

  return(
    <div className="app">
      <GS/>
      {/* ── CONFIRM DIALOG ── */}
      {confirmDialog&&<div style={{position:"fixed",inset:0,background:"#00000070",display:"flex",alignItems:"center",justifyContent:"center",zIndex:998,backdropFilter:"blur(3px)"}}>
        <div style={{background:"#fff",borderRadius:14,padding:"24px 28px",maxWidth:420,width:"90%",boxShadow:"0 8px 40px #00000030"}}>
          <div style={{fontWeight:700,fontSize:15,color:"#0a1628",marginBottom:8}}>⚠️ Confirm Action</div>
          <div style={{fontSize:13,color:"#374151",lineHeight:1.6,marginBottom:20}}>{confirmDialog.msg}</div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button className="btn bgh" style={{padding:"9px 20px"}} onClick={()=>setConfirmDialog(null)}>Cancel</button>
            <button className="btn br" style={{padding:"9px 20px"}} onClick={()=>{const fn=confirmDialog.onConfirm;setConfirmDialog(null);fn();}}>Confirm</button>
          </div>
        </div>
      </div>}

      {toast&&<div style={{position:"fixed",bottom:22,right:22,zIndex:999,background:toast.type==="error"?"#1a0c0c":"#0a1e14",border:`1px solid ${toast.type==="error"?"#401414":"#143020"}`,color:toast.type==="error"?"#dc2626":"#059669",padding:"10px 18px",borderRadius:9,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,letterSpacing:".05em",boxShadow:"0 4px 20px #00000060"}}>{toast.msg}</div>}

      <div style={{display:"flex",minHeight:"100vh"}}>

        {/* SIDEBAR */}
        <div className="no-print" style={{width:222,background:"#ebebeb",borderRight:"1px solid #d1d5db",display:"flex",flexDirection:"column",padding:"0 8px",flexShrink:0,overflowY:"auto",height:"100vh",position:"sticky",top:0}}>
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
          <div style={{padding:"8px 8px 14px",overflowY:"auto",flex:1}}>

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
            <div style={{display:"flex",gap:7,alignItems:"center"}}>
              {isAdmin&&(()=>{
                // Build live notifications
                const now=new Date();
                const notifs=[];
                // Overdue invoices
                visSales.filter(s=>pmtFor(s.id)?.status!=="paid").forEach(s=>{
                  const d=new Date(s.created_at||s.date);
                  if(!isNaN(d)){
                    const days=Math.floor((now-d)/(1000*60*60*24));
                    if(days>=30) notifs.push({type:"overdue",icon:"⏰",msg:`Invoice ${s.id} — ${getC(s.cust_id)?.name||"?"} is ${days}d overdue`,severity:days>=90?"high":days>=60?"med":"low",tab:"ar"});
                  }
                });
                // Low stock
                products.filter(p=>p.shelf<=(p.reorder_point||5)).forEach(p=>{
                  notifs.push({type:"stock",icon:"📦",msg:`${p.name} — ${p.shelf===0?"OUT OF STOCK":`only ${p.shelf} left`}`,severity:p.shelf===0?"high":"low",tab:"inventory"});
                });
                // Returned checks
                payments.filter(p=>p.status==="returned_check").forEach(p=>{
                  const c=customers.find(x=>x.id===p.cust_id);
                  if(c) notifs.push({type:"check",icon:"🚨",msg:`Returned check — ${c.name}`,severity:"high",tab:"returnedchecks"});
                });
                if(!notifs.length) return(
                  <button className="btn bgh" style={{fontSize:11,position:"relative"}} onClick={()=>setTab("auditlog")} title="No new notifications">🔔</button>
                );
                return(
                  <div style={{position:"relative"}}>
                    <button onClick={()=>setShowNotifs(s=>!s)}
                      style={{background:"#fff",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"6px 10px",cursor:"pointer",position:"relative",fontSize:14}}>
                      🔔
                      <span style={{position:"absolute",top:-4,right:-4,background:notifs.some(n=>n.severity==="high")?"#dc2626":"#f59e0b",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif"}}>
                        {notifs.length}
                      </span>
                    </button>
                    {showNotifs&&(
                      <div style={{position:"absolute",right:0,top:36,width:340,background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,boxShadow:"0 8px 32px #00000018",zIndex:999,overflow:"hidden"}}>
                        <div style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14}}>🔔 Notifications ({notifs.length})</div>
                          <button onClick={()=>setShowNotifs(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#9ca3af"}}>✕</button>
                        </div>
                        <div style={{maxHeight:320,overflowY:"auto"}}>
                          {notifs.map((n,i)=>(
                            <div key={i} onClick={()=>{setTab(n.tab);setShowNotifs(false);}}
                              style={{padding:"10px 16px",borderBottom:"1px solid #f9fafb",cursor:"pointer",display:"flex",gap:10,alignItems:"flex-start",background:n.severity==="high"?"#fef2f2":n.severity==="med"?"#fff7ed":"#fff"}}>
                              <span style={{fontSize:16,flexShrink:0}}>{n.icon}</span>
                              <div style={{fontSize:12,color:"#374151",lineHeight:1.4}}>{n.msg}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{padding:"8px 16px",borderTop:"1px solid #f3f4f6",fontSize:11,color:"#9ca3af",textAlign:"center"}}>Click any item to navigate</div>
                      </div>
                    )}
                  </div>
                );
              })()}
              {isAdmin&&<button className="btn bb" onClick={()=>{setRsPid(products[0]?.id||"");setRsQty("");setModal("restock");}}>{ic.plus} Restock</button>}
              <button className="btn ba" onClick={()=>{const tid=isAdmin?trucks[0]?.id:myTruckId;if(tid)openLoad(tid);}}>{ic.truck} Load Truck</button>
              <button className="btn bgh" style={{fontSize:11}} onClick={loadAll} title="Refresh">↻</button>
            </div>
          </div>

          <div style={{padding:"20px 24px"}}>

          {/* ══ DASHBOARD ══ */}
          {tab==="dashboard"&&<div className="fu">
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
              {[{l:"Collected",v:fmt(collectedRevenue),c:"#059669",s:`${paidSales.length} paid / ${visSales.length} total`},{l:"Gross Profit",v:fmt(collectedProfit),c:"#7c3aed",s:collectedRevenue>0?`${((collectedProfit/collectedRevenue)*100).toFixed(1)}% margin`:"—"},{l:"Tax Collected",v:fmt(totalTax),c:"#7c3aed",s:"tobacco only"},{l:"AR Outstanding",v:fmt(totalAR),c:"#dc2626",s:"unpaid"}].map(k=>(
                <div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div><div style={{fontSize:10,color:"#9ca3af",marginTop:4}}>{k.s}</div></div>
              ))}
            </div>
            {orders.filter(o=>o.status==="pending").length>0&&(
              <div style={{background:"#1e1400",border:"1px solid #7c3aed40",borderRadius:10,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>📦</span><div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:"#7c3aed"}}>{orders.filter(o=>o.status==="pending").length} PENDING ORDER{orders.filter(o=>o.status==="pending").length!==1?"S":""}</div><div style={{fontSize:11,color:"#4a3a20"}}>Waiting for your approval</div></div></div>
                <button className="btn ba" onClick={()=>setTab("orders")}>{ic.orders} Review Orders</button>
              </div>
            )}
            {(()=>{const lowProds=products.filter(p=>p.shelf<=(p.reorder_point||5));if(!lowProds.length)return null;const outProds=lowProds.filter(p=>p.shelf===0);const warnProds=lowProds.filter(p=>p.shelf>0);return(
              <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:22}}>⚠️</span>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#c2410c"}}>
                      REORDER ALERT — {lowProds.length} PRODUCT{lowProds.length!==1?"S":""} NEED ATTENTION
                    </div>
                    <div style={{fontSize:11,color:"#9a3412",marginTop:2}}>
                      {outProds.length>0&&<span style={{marginRight:10}}>🔴 Out of stock: {outProds.map(p=>p.name).join(", ")}</span>}
                      {warnProds.length>0&&<span>🟡 Low stock: {warnProds.map(p=>`${p.name} (${p.shelf} left)`).join(", ")}</span>}
                    </div>
                  </div>
                </div>
                <button className="btn" style={{background:"#c2410c",color:"#fff",padding:"8px 16px",borderRadius:6}} onClick={()=>setTab("purchaseorders")}>🛒 Create Purchase Order</button>
              </div>
            );})()}
            <div className="card" style={{padding:18,marginBottom:16}}>
              <div className="sh">📦 Inventory Flow</div>
              <div style={{display:"flex",alignItems:"stretch"}}>
                {[
                  {l:"WAREHOUSE",e:"🏭",c:"#7c3aed",items:products.slice(0,5).map(p=>({n:p.name,v:p.shelf+" units"}))},
                  null,
                  {l:"ON TRUCKS",e:"🚚",c:"#0ea5e9",items:visTrucks.map(t=>({n:t.driver,v:truckInv(t.id).reduce((a,i)=>a+i.remaining,0)+" units"}))},
                  null,
                  {l:"TOTAL INVENTORY",e:"📊",c:"#059669",items:products.map(p=>{
                    const onTruck=visTrucks.reduce((a,t)=>{const inv=truckInv(t.id);return a+(inv.find(i=>i.pid===p.id)?.remaining||0);},0);
                    return {n:p.name,v:(p.shelf+onTruck)+" units"};
                  }).filter(i=>parseInt(i.v)>0).slice(0,5)},
                  null,
                  {l:"SOLD",e:"⛽",c:"#f59e0b",items:visCustomers.filter(c=>paidSales.some(s=>s.cust_id===c.id)).slice(0,5).map(c=>({n:c.name,v:fmt(paidSales.filter(s=>s.cust_id===c.id).reduce((a,s)=>a+s.total,0))}))}
                ].map((nd,i)=>{
                  if(!nd)return<div key={i} style={{color:"#d1d5db",display:"flex",alignItems:"center",padding:"0 8px",flexShrink:0}}>{ic.arr}</div>;
                  return(<div key={i} style={{flex:1,background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 14px",textAlign:"center"}}><div style={{fontSize:18,marginBottom:4}}>{nd.e}</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,color:nd.c,letterSpacing:".1em",marginBottom:8}}>{nd.l}</div>{nd.items.length===0?<div style={{fontSize:10,color:"#9ca3af"}}>No data</div>:nd.items.map((it,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:5,padding:"4px 8px",marginBottom:3}}><span style={{fontSize:11,color:"#212121",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:90}}>{it.n}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:nd.c,flexShrink:0,marginLeft:6}}>{it.v}</span></div>)}</div>);
                })}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:16}}>
              {visTrucks.map(t=>{
                const load=activeLoad(t.id),inv=truckInv(t.id);
                const rem=inv.reduce((a,i)=>a+i.remaining,0),loaded=inv.reduce((a,i)=>a+i.loaded,0);
                const pct=loaded>0?Math.round(rem/loaded*100):0;
                const ts=visSales.filter(s=>s.truck_id===t.id);
                return(
                  <div key={t.id} className="card" style={{padding:14}}>
                    {/* Header */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#212121"}}>{t.driver}</div>
                        <div style={{fontSize:10,color:"#9ca3af"}}>{t.plate}{t.route&&`   -   ${t.route}`}</div>
                      </div>
                      <span className={`bdg ${t.locked?"br2":load?"ba2":"bgr"}`}>{t.locked?"🔒 LOCKED":load?"ACTIVE":"IDLE"}</span>
                    </div>
                    {/* Inventory bar */}
                    {load&&<>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                        <span style={{fontSize:10,color:"#6b7280"}}>Inventory</span>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:"#7c3aed"}}>{rem}/{loaded}</span>
                      </div>
                      <div className="pb"><div className="pf" style={{width:`${pct}%`,background:"#7c3aed"}}/></div>
                    </>}
                    {/* Revenue */}
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                      <span style={{fontSize:10,color:"#6b7280"}}>Revenue</span>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#059669"}}>{fmt(ts.reduce((a,s)=>a+s.total,0))}</span>
                    </div>
                    {/* Action buttons — all inside the card */}
                    <div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}>
                      {!t.locked&&<button className="btn bb" style={{flex:1,justifyContent:"center"}} onClick={()=>openLoad(t.id)}>{ic.truck} {load?"Reload":"Load"}</button>}
                      {load&&<><button className="btn bg" style={{flex:1,justifyContent:"center"}} onClick={()=>openSale(t.id)}>{ic.inv} Sell</button><button className="btn bgh" style={{flex:1,justifyContent:"center"}} onClick={()=>openReturn(t.id)}>{ic.undo} Rtn</button></>}
                    </div>
                    {/* Admin lock/unlock — inside the card */}
                    {isAdmin&&<div style={{display:"flex",gap:5,marginTop:6}}>
                      {t.locked
                        ?<button className="btn bg" style={{flex:1,justifyContent:"center",fontSize:11}} onClick={()=>unlockTruck(t.id)}>🔓 Unlock Truck</button>
                        :<button className="btn br" style={{flex:1,justifyContent:"center",fontSize:11}} onClick={()=>lockTruck(t.id)}>🔒 Lock Truck</button>
                      }
                    </div>}
                  </div>
                );
              })}
            </div>
            <div className="card">
              <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div className="sh" style={{marginBottom:0}}>Recent Invoices</div><button className="btn bgh" onClick={()=>setTab("sales")}>View All</button></div>
              {visSales.length===0?<Empty icon="💳" msg="NO SALES YET"/>:(
                <div className="tw"><table><thead><tr><th>Invoice</th><th>Customer</th><th>Date</th><th>Total</th><th>+Tax</th><th>Grand Total</th><th>Status</th><th></th></tr></thead>
                <tbody>{visSales.slice(0,6).map(s=>(
                  <tr key={s.id}><td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed",cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{s.id}</span></td><td style={{color:"#212121"}}>{getC(s.cust_id)?.name}</td><td style={{color:"#6b7280",fontSize:11}}>{s.date}</td><td>{fmt(s.total)}</td><td style={{color:"#7c3aed"}}>{fmt(calcSaleTax(s))}</td><td><span className="bdg bg2">{fmt(calcSaleGrandTotal(s))}</span></td><td><span className={`bdg ${pmtFor(s.id)?.status==="paid"?"bg2":"br2"}`}>{pmtFor(s.id)?.status==="paid"?"PAID":"UNPAID"}</span></td><td><button className="btn bb" style={{fontSize:10,padding:"4px 9px"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{ic.prt}</button></td>
                </tr>))}</tbody></table></div>
              )}
            </div>
          </div>}

          {/* ══ INVENTORY ══ */}
          {tab==="inventory"&&<div className="fu">
            {/* Header actions */}
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
              {isAdmin&&<>
                <button className="btn ba" onClick={()=>setModal("addProduct")}>{ic.plus} Add Product</button>
                <button className="btn bb" onClick={()=>{setRsPid(products[0]?.id||"");setRsQty("");setModal("restock");}}>{ic.box} Restock</button>
                <button className="btn bp" onClick={()=>setModal("csvImport")}>📥 Import CSV</button>
                <button className="btn ba" onClick={()=>openLoad(trucks[0]?.id)}>{ic.truck} Load Truck</button>
              </>}
              <div style={{marginLeft:"auto",fontSize:11,color:"#6b7280"}}>{editingPid?<span style={{color:"#7c3aed"}}>✏️ Editing — click Save or Cancel</span>:isAdmin?"Click ✏️ on any row to edit":""}</div>
            </div>

            {/* KPI Summary */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:16}}>
              {[
                {l:"Total Products",v:products.length,c:"#7c3aed"},
                {l:"Total Shelf Units",v:products.reduce((a,p)=>a+p.shelf,0),c:"#059669"},
                {l:"Total On Trucks",v:trucks.reduce((a,t)=>a+truckInv(t.id).reduce((b,i)=>b+i.remaining,0),0),c:"#0ea5e9"},
                {l:"Low Stock",v:products.filter(p=>p.shelf<=(p.reorder_point||5)&&p.shelf>0).length,c:"#f59e0b"},
                {l:"Out of Stock",v:products.filter(p=>p.shelf===0).length,c:"#dc2626"},
              ].map(k=><div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>)}
            </div>

            {/* WAREHOUSE SECTION */}
            <div className="card" style={{marginBottom:16}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#212121"}}>🏭 WAREHOUSE — Shelf Stock</div>
                <div style={{fontSize:11,color:"#6b7280"}}>{products.length} products · {products.reduce((a,p)=>a+p.shelf,0)} total units</div>
              </div>
              <div className="tw"><table>
                <thead><tr>
                  <th>Product</th><th>SKU</th><th>Category</th><th>Sell By</th><th>Case Qty</th>
                  <th>Cost</th><th>Price</th><th>Unit Price</th><th>Margin</th><th>Shelf</th><th>Reorder At</th><th>Status</th>
                  {isAdmin&&<th>Actions</th>}
                </tr></thead>
                <tbody>{products.map(p=>{
                  const isE=editingPid===p.id;
                  const margin=p.price>0?((p.price-p.cost)/p.price*100).toFixed(0):0;
                  const low=p.shelf<=(p.reorder_point||5)&&p.shelf>0;
                  const unitPrice=p.case_qty>1?(p.price/(p.case_qty||1)).toFixed(2):null;
                  return(
                    <tr key={p.id} style={{background:isE?"#f5f3ff":p.shelf===0?"#fef2f2":low?"#fff7ed":"#fff"}}>
                      {isE?(
                        <>
                          <td><input className="ei" value={editProd.name} onChange={e=>setEditProd(x=>({...x,name:e.target.value}))}/></td>
                          <td><input className="ei" value={editProd.sku} onChange={e=>setEditProd(x=>({...x,sku:e.target.value}))}/></td>
                          <td><input className="ei" value={editProd.cat} onChange={e=>setEditProd(x=>({...x,cat:e.target.value}))}/></td>
                          <td><input className="ei" value={editProd.unit} onChange={e=>setEditProd(x=>({...x,unit:e.target.value}))}/></td>
                          <td><input className="ei" type="number" min="1" value={editProd.case_qty||1} onChange={e=>setEditProd(x=>({...x,case_qty:e.target.value}))}/></td>
                          <td><input className="ei" type="number" value={editProd.cost} onChange={e=>setEditProd(x=>({...x,cost:e.target.value}))}/></td>
                          <td><input className="ei" type="number" value={editProd.price} onChange={e=>setEditProd(x=>({...x,price:e.target.value}))}/></td>
                          <td>—</td>
                          <td>—</td>
                          <td><input className="ei" type="number" value={editProd.shelf} onChange={e=>setEditProd(x=>({...x,shelf:e.target.value}))}/></td>
                          <td><input className="ei" type="number" value={editProd.reorder_point||5} onChange={e=>setEditProd(x=>({...x,reorder_point:e.target.value}))}/></td>
                          <td>—</td>
                          <td><div style={{display:"flex",gap:4}}><button className="btn bg" onClick={saveEditProduct} disabled={saving}>{ic.save}</button><button className="btn bgh" onClick={()=>setEditingPid(null)}>{ic.X}</button></div></td>
                        </>
                      ):(
                        <>
                          <td style={{fontWeight:600,color:"#212121"}}>{p.name}</td>
                          <td style={{fontFamily:"monospace",fontSize:11,color:"#6b7280"}}>{p.sku}</td>
                          <td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed"}}>{p.cat}</span></td>
                          <td style={{color:"#6b7280",fontSize:11}}>{p.unit}</td>
                          <td style={{color:"#6b7280",fontSize:11,textAlign:"center"}}>{p.case_qty||1}</td>
                          <td style={{color:"#6b7280"}}>{fmt(p.cost)}</td>
                          <td style={{fontWeight:600,color:"#059669"}}>{fmt(p.price)}</td>
                          <td style={{fontSize:11,color:"#9ca3af"}}>{unitPrice?`$${unitPrice}/ea`:"—"}</td>
                          <td><span style={{fontSize:11,color:margin>30?"#059669":margin>15?"#f59e0b":"#dc2626",fontWeight:600}}>{margin}%</span></td>
                          <td>
                            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:p.shelf===0?"#dc2626":low?"#f59e0b":"#059669"}}>{p.shelf}</span>
                          </td>
                          <td style={{fontSize:11,color:"#6b7280"}}>{p.reorder_point||5}</td>
                          <td>
                            {p.shelf===0?<span className="bdg br2">OUT</span>:low?<span className="bdg ba2">⚠️ LOW</span>:<span className="bdg bg2">OK</span>}
                          </td>
                          {isAdmin&&<td><div style={{display:"flex",gap:4}}>
                            <button className="btn bgh" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>startEditProduct(p)}>{ic.edit}</button>
                            <button className="btn bb" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>{setRsPid(p.id);setRsQty("");setModal("restock");}}>{ic.plus}</button>
                            <button className="btn br" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>deleteProduct(p.id,p.name)}>{ic.X}</button>
                          </div></td>}
                        </>
                      )}
                    </tr>
                  );
                })}</tbody>
              </table></div>
            </div>

            {/* TRUCKS SECTION */}
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#212121",marginBottom:12}}>🚚 TRUCKS — Route Inventory</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {trucks.map(t=>{
                const load=activeLoad(t.id),inv=truckInv(t.id);
                const ts=visSales.filter(s=>s.truck_id===t.id),tr=returns.filter(r=>r.truck_id===t.id);
                const isEditingT=editingTid===t.id;
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
                          <div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:17,color:"#212121"}}>{t.driver}</div>
                            <div style={{fontSize:11,color:"#6b7280"}}>{t.plate}{t.route&&<> · <span style={{color:"#7c3aed"}}>{t.route}</span></>}</div>
                          </div>
                        )}
                      </div>
                      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                        <span className={`bdg ${t.locked?"br2":load?"ba2 pu":"bgr"}`}>{t.locked?"🔒 LOCKED":load?"ON ROUTE":"IDLE"}</span>
                        {!t.locked&&<button className="btn ba" onClick={()=>openLoad(t.id)}>{ic.truck} {load?"Reload":"Load"}</button>}
                        {load&&!t.locked&&<><button className="btn bg" onClick={()=>openSale(t.id)}>{ic.inv} Sell</button><button className="btn bgh" onClick={()=>openReturn(t.id)}>{ic.undo} Return</button></>}
                        <button className="btn bp" onClick={()=>{setViewTruck(t.id);setModal("settlement");}}>{ic.settle} Settlement</button>
                        {isAdmin&&!isEditingT&&<>
                          <button className="btn bgh" onClick={()=>startEditTruck(t)}>{ic.edit} Edit</button>
                          {t.locked
                            ?<button className="btn bg" style={{fontSize:11}} onClick={()=>unlockTruck(t.id)}>🔓 Unlock</button>
                            :<button className="btn br" style={{fontSize:11}} onClick={()=>lockTruck(t.id)}>🔒 Lock</button>
                          }
                          <button className="btn br" style={{fontSize:11}} onClick={()=>deleteTruck(t.id,t.driver)}>{ic.X} Delete</button>
                        </>}
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
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
                            <div key={p.id} style={{marginBottom:8,opacity:loaded===0?0.4:1}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                                <span style={{fontSize:11,color:"#212121"}}>{p.name}</span>
                                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:loaded===0?"#9ca3af":remaining===0?"#dc2626":"#212121"}}>
                                  {remaining}<span style={{color:"#9ca3af",fontWeight:400}}>/{loaded}</span>
                                </span>
                              </div>
                              {loaded>0?(
                                <div className="pb"><div className="pf" style={{width:`${pct}%`,background:pct<25?"#dc2626":pct<60?"#7c3aed":"#059669"}}/></div>
                              ):(
                                <div style={{height:4,background:"#f3f4f6",borderRadius:2}}/>
                              )}
                              {loaded>0&&<div style={{fontSize:9,color:"#9ca3af",marginTop:1}}>{loaded-remaining} sold · {remaining} remaining</div>}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {[
                          {l:"Collected",v:fmt(ts.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+s.total,0)),c:"#059669"},
                          {l:"Invoiced",v:fmt(ts.reduce((a,s)=>a+s.total,0)),c:"#9ca3af"},
                          {l:"Profit",v:fmt(ts.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+s.profit,0)),c:"#7c3aed"},
                          {l:"Tax",v:fmt(ts.reduce((a,s)=>a+calcSaleTax(s),0)),c:"#7c3aed"},
                          {l:"Invoices",v:ts.length,c:"#7c3aed"},
                          {l:"Returns",v:tr.reduce((a,r)=>a+(r.items||[]).reduce((b,i)=>b+i.qty,0),0)+" units",c:"#dc2626"},
                        ].map(k=>(
                          <div key={k.l} className="cin" style={{padding:"7px 11px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <span style={{fontSize:10,color:"#6b7280"}}>{k.l}</span>
                            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:k.c}}>{k.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>}

          {/* ══ RECURRING ORDERS ══ */}
          {tab==="recurring"&&isAdmin&&<RecurringOrdersTab
            recurringOrders={recurringOrders}
            setRecurringOrders={setRecurringOrders}
            customers={customers}
            products={products}
            trucks={trucks}
            supabase={supabase}
            showToast={showToast}
            showConfirm={showConfirm}
            fmt={fmt}
          />}

          {tab==="promotions"&&isAdmin&&<PromotionsTab
            promotions={promotions}
            setPromotions={setPromotions}
            products={products}
            customers={customers}
            supabase={supabase}
            showToast={showToast}
            showConfirm={showConfirm}
            fmt={fmt}
          />}

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
              {[{l:"Revenue",v:fmt(totalRevenue),c:"#059669"},{l:"Tax (Tobacco only)",v:fmt(totalTax),c:"#7c3aed"},{l:"Grand Total",v:fmt(totalRevenue+totalTax),c:"#7c3aed"},{l:"Profit",v:fmt(totalProfit),c:"#7c3aed"}].map(k=><div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>)}
            </div>
            <div style={{display:"flex",gap:7,marginBottom:14}}><button className="btn bpr" onClick={exportInvoices}>{ic.dl} Export CSV</button></div>
            <div className="card">
              <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#212121"}}>INVOICES — {visSales.length} TOTAL</div>
              {visSales.length===0?<Empty icon="📄" msg="NO INVOICES YET"/>:(
                <div className="tw"><table><thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Driver</th><th>Subtotal</th><th>Tax</th><th>Grand Total</th><th>Profit</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{visSales.map(s=>{const gt=calcSaleGrandTotal(s),pmt=pmtFor(s.id);
                  const isReturnedCheck=pmt?.status==="returned_check";
                  const isPaid=pmt?.status==="paid";
                  return(
                  <tr key={s.id} style={{background:isReturnedCheck?"#fff5f5":""}}>
                    <td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed",cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{s.id}</span></td>
                    <td style={{color:"#6b7280",fontSize:11}}>{s.date}</td>
                    <td style={{color:"#212121",fontWeight:isReturnedCheck?700:400}}>
                      {getC(s.cust_id)?.name}
                      {isReturnedCheck&&<div style={{fontSize:9,color:"#dc2626",fontWeight:700}}>🚨 RETURNED CHECK</div>}
                    </td>
                    <td style={{color:"#6b7280"}}>{getT(s.truck_id)?.driver||"Walk-in"}</td>
                    <td>{fmt(s.total)}{s.previous_balance>0&&<span style={{fontSize:9,color:"#dc2626",marginLeft:4}}>+{fmt(s.previous_balance)} {s.check_penalty_applied>0?"penalty":"prev"}</span>}</td>
                    <td style={{color:"#7c3aed"}}>{fmt(calcSaleTax(s))}</td>
                    <td><span className="bdg bb2">{fmt(gt)}</span></td>
                    <td style={{color:"#059669",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{fmt(s.profit)}</td>
                    <td>
                      {isReturnedCheck
                        ?<span className="bdg br2" style={{animation:"pu 1.5s infinite"}}>🔴 RETURNED CHECK</span>
                        :isPaid
                          ?<span className="bdg bg2">✅ PAID</span>
                          :<span className="bdg ba2">⏳ UNPAID</span>
                      }
                    </td>
                    <td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      <button className="btn bb" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{ic.prt} Invoice</button>
                      {isAdmin&&<button className="btn bp" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>openAmend(s)}>✏️ Amend</button>}
                      {isAdmin&&pmt?.returned_check_url&&<button onClick={()=>window.open(pmt.returned_check_url,"_blank")} style={{background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",borderRadius:6,padding:"4px 8px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>📄 Check</button>}
                      {isAdmin&&!isReturnedCheck&&(pmt?.method==="check"||paymentsLog.some(pl=>pl.method==="check"&&(pl.invoice_ids||[]).includes(s.id)))&&<button onClick={()=>setRcModal({saleId:s.id,custId:s.cust_id})} style={{background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",borderRadius:6,padding:"4px 8px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",whiteSpace:"nowrap"}}>🔴 Returned?</button>}
                      {!isPaid&&!isReturnedCheck&&<button className="btn bg" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>markPaid(s.id)}>{ic.chk} Pay</button>}
                      {isPaid&&<button className="btn bgh" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>markUnpaid(s.id)}>Undo</button>}
                      {isAdmin&&<button className="btn br" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>deleteInvoice(s.id)}>{ic.X}</button>}
                    </div></td>
                  </tr>);})}
                </tbody></table></div>
              )}
            </div>
          </div>}

          {/* ══ TAX INVOICES ══ */}
          {tab==="taxinvoices"&&(()=>{
            // Helper to filter sales by date filter object
            const applyDateFilter=(sales,f)=>{
              if(f.type==="all") return sales;
              return sales.filter(s=>{
                const d=new Date(s.created_at||s.date);
                if(f.type==="day")   return s.date===f.date||s.created_at?.startsWith(f.date);
                if(f.type==="month") return d.getMonth()===parseInt(f.month)-1&&d.getFullYear()===parseInt(f.year||new Date().getFullYear());
                if(f.type==="year")  return d.getFullYear()===parseInt(f.year);
                return true;
              });
            };

            const stateFiltered = selState==="ALL" ? visSales : visSales.filter(s=>getSaleState(s)===selState);
            const sumSales = applyDateFilter(stateFiltered, sumFilter);
            const invSales = applyDateFilter(stateFiltered, invFilter);

            const totalSub = sumSales.reduce((a,s)=>a+s.total,0);
            const totalTaxAmt = sumSales.reduce((a,s)=>a+calcSaleTax(s),0);
            const totalGT = sumSales.reduce((a,s)=>a+calcSaleGrandTotal(s),0);
            const curStateTax = selState!=="ALL" ? getStateTaxRate(selState) : null;
            const curStateExempt = selState!=="ALL" ? stateTaxes.find(s=>s.id===selState)?.exempt : false;

            // Date filter UI component
            const DateFilter=({f,setF,label})=>(
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:12,padding:"10px 14px",background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:9}}>
                <span style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:".06em"}}>{label}:</span>
                {["all","day","month","year"].map(t=>(
                  <button key={t} onClick={()=>setF(x=>({...x,type:t}))}
                    style={{padding:"4px 12px",borderRadius:6,border:`1px solid ${f.type===t?"#7c3aed":"#e5e7eb"}`,background:f.type===t?"#f5f3ff":"#fff",color:f.type===t?"#7c3aed":"#6b7280",fontSize:11,fontWeight:f.type===t?700:400,cursor:"pointer",fontFamily:"'Barlow',sans-serif",textTransform:"capitalize"}}>
                    {t==="all"?"All Time":t==="day"?"By Date":t==="month"?"By Month":"By Year"}
                  </button>
                ))}
                {f.type==="day"&&<input type="date" value={f.date} onChange={e=>setF(x=>({...x,date:e.target.value}))} style={{border:"1px solid #e5e7eb",borderRadius:6,padding:"4px 8px",fontSize:11,fontFamily:"'Barlow',sans-serif"}}/>}
                {f.type==="month"&&<>
                  <select value={f.month} onChange={e=>setF(x=>({...x,month:e.target.value}))} style={{border:"1px solid #e5e7eb",borderRadius:6,padding:"4px 8px",fontSize:11,fontFamily:"'Barlow',sans-serif"}}>
                    <option value="">Month</option>
                    {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=><option key={i} value={i+1}>{m}</option>)}
                  </select>
                  <select value={f.year} onChange={e=>setF(x=>({...x,year:e.target.value}))} style={{border:"1px solid #e5e7eb",borderRadius:6,padding:"4px 8px",fontSize:11,fontFamily:"'Barlow',sans-serif"}}>
                    <option value="">Year</option>
                    {[2024,2025,2026,2027].map(y=><option key={y} value={y}>{y}</option>)}
                  </select>
                </>}
                {f.type==="year"&&<select value={f.year} onChange={e=>setF(x=>({...x,year:e.target.value}))} style={{border:"1px solid #e5e7eb",borderRadius:6,padding:"4px 8px",fontSize:11,fontFamily:"'Barlow',sans-serif"}}>
                  <option value="">Year</option>
                  {[2024,2025,2026,2027].map(y=><option key={y} value={y}>{y}</option>)}
                </select>}
                {f.type!=="all"&&<button onClick={()=>setF({type:"all",date:"",month:"",year:""})} style={{padding:"4px 10px",borderRadius:6,border:"1px solid #fecaca",background:"#fef2f2",color:"#dc2626",fontSize:11,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>✕ Clear</button>}
              </div>
            );

            return(
            <div className="fu">
              {/* State tabs */}
              <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
                {["ALL",...new Set(visSales.map(s=>getSaleState(s)).filter(Boolean))].map(st=>{
                  const stData=stateTaxes.find(s=>s.id===st);
                  return(
                    <button key={st} onClick={()=>setSelState(st)}
                      style={{padding:"7px 14px",borderRadius:8,border:`1.5px solid ${selState===st?"#7c3aed":"#e5e7eb"}`,background:selState===st?"#f5f3ff":"#fff",color:selState===st?"#7c3aed":"#6b7280",fontWeight:selState===st?700:400,cursor:"pointer",fontSize:12,fontFamily:"'Barlow',sans-serif",display:"flex",alignItems:"center",gap:6}}>
                      {st==="ALL"?"🌐 All States":`🏛 ${st}`}
                      {stData&&<span style={{fontSize:10,background:stData.exempt?"#dcfce7":"#f5f3ff",color:stData.exempt?"#059669":"#7c3aed",padding:"1px 5px",borderRadius:3,fontWeight:700}}>{stData.exempt?"EXEMPT":`${stData.rate}%`}</span>}
                    </button>
                  );
                })}
              </div>

              {/* State exempt banner */}
              {selState!=="ALL"&&<div style={{background:curStateExempt?"#f0fdf4":"#f5f3ff",border:`1px solid ${curStateExempt?"#a7f3d0":"#ddd6fe"}`,borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:24}}>{curStateExempt?"✅":"🏛"}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:curStateExempt?"#059669":"#7c3aed"}}>{stateTaxes.find(s=>s.id===selState)?.name||selState} — {curStateExempt?"TAX EXEMPT":"TAXABLE"}</div>
                  <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{curStateExempt?"Tobacco/Nicotine sales are NOT taxable in this state":`Tobacco/Nicotine taxed at ${curStateTax}%   -   Other products not taxed`}</div>
                </div>
              </div>}

              {/* KPIs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
                {[
                  {l:"Subtotal Sales",v:fmt(totalSub),c:"#212121"},
                  {l:"Tax (Tobacco Only)",v:fmt(totalTaxAmt),c:"#059669"},
                  {l:"Grand Total",v:fmt(totalGT),c:"#7c3aed"},
                  {l:"Invoices",v:sumSales.length,c:"#0ea5e9"},
                ].map(k=><div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>)}
              </div>

              {/* SUMMARY TABLE with its own date filter */}
              <div className="card" style={{marginBottom:16}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:"#212121"}}>
                    📊 SALES SUMMARY {selState!=="ALL"?` -  ${selState}`:"— ALL STATES"}
                    <span style={{fontWeight:400,fontSize:11,color:"#9ca3af",marginLeft:8}}>{sumSales.length} invoices</span>
                  </div>
                </div>
                <div style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6"}}>
                  <DateFilter f={sumFilter} setF={setSumFilter} label="Filter Summary"/>
                </div>
                <div className="tw">
                  <table>
                    <thead><tr><th>Customer</th><th>State</th><th>Driver</th><th>Invoices</th><th>Subtotal</th><th>Tax (Tobacco)</th><th>Grand Total</th><th>Paid</th><th>Outstanding</th></tr></thead>
                    <tbody>
                      {customers.map(c=>{
                        const custSales=sumSales.filter(s=>s.cust_id===c.id);
                        if(!custSales.length)return null;
                        const sub=custSales.reduce((a,s)=>a+s.total,0);
                        const tax=custSales.reduce((a,s)=>a+calcSaleTax(s),0);
                        const gt=custSales.reduce((a,s)=>a+calcSaleGrandTotal(s),0);
                        const paid=custSales.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0);
                        const outstanding=gt-paid;
                        const stData=stateTaxes.find(s=>s.id===(c.state||"TX"));
                        return(
                          <tr key={c.id}>
                            <td style={{fontWeight:600,color:"#212121"}}>{c.name}</td>
                            <td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed"}}>{c.state||"TX"}</span></td>
                            <td style={{color:"#6b7280"}}>{getT(c.truck_id)?.driver||"—"}</td>
                            <td style={{fontWeight:600,color:"#7c3aed"}}>{custSales.length}</td>
                            <td>{fmt(sub)}</td>
                            <td style={{color:"#059669",fontWeight:600}}>{fmt(tax)}</td>
                            <td style={{fontWeight:700}}>{fmt(gt)}</td>
                            <td style={{color:"#059669",fontWeight:600}}>{fmt(paid)}</td>
                            <td style={{color:outstanding>0?"#dc2626":"#059669",fontWeight:700}}>{fmt(outstanding)}</td>
                          </tr>
                        );
                      }).filter(Boolean)}
                      <tr style={{background:"#f9fafb"}}>
                        <td colSpan={4} style={{fontWeight:800,color:"#212121"}}>TOTAL</td>
                        <td style={{fontWeight:700,color:"#7c3aed"}}>{sumSales.length}</td>
                        <td style={{fontWeight:700}}>{fmt(totalSub)}</td>
                        <td style={{color:"#059669",fontWeight:700}}>{fmt(totalTaxAmt)}</td>
                        <td style={{fontWeight:800,fontSize:14,color:"#7c3aed"}}>{fmt(totalGT)}</td>
                        <td style={{color:"#059669",fontWeight:700}}>{fmt(sumSales.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0))}</td>
                        <td style={{color:"#dc2626",fontWeight:700}}>{fmt(sumSales.filter(s=>pmtFor(s.id)?.status!=="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* INVOICES TABLE with its own date filter */}
              <div className="card">
                <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:"#212121"}}>
                    🧾 INVOICES — {invSales.length} TOTAL
                  </div>
                  <button className="btn bpr" onClick={()=>{
                    const rows=[["Invoice","Date","Customer","State","Driver","Subtotal","Tax (Tobacco)","Grand Total","Status"]];
                    invSales.forEach(s=>{
                      const cust=getC(s.cust_id);
                      const st=cust?.state||"TX";
                      const stData=stateTaxes.find(x=>x.id===st);
                      rows.push([s.id,s.date,cust?.name,st,getT(s.truck_id)?.driver,s.total.toFixed(2),calcSaleTax(s).toFixed(2),calcSaleGrandTotal(s).toFixed(2),pmtFor(s.id)?.status==="paid"?"Paid":"Unpaid"]);
                    });
                    downloadCSV(rows,`tax-invoices-${selState}.csv`);
                  }}>{ic.dl} Export</button>
                </div>
                <div style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6"}}>
                  <DateFilter f={invFilter} setF={setInvFilter} label="Filter Invoices"/>
                </div>
                <div className="tw">
                  <table>
                    <thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>State</th><th>Driver</th><th>Subtotal</th><th>Tax (Tobacco)</th><th>Grand Total</th><th>Status</th></tr></thead>
                    <tbody>
                      {invSales.map(s=>{
                        const cust=getC(s.cust_id);
                        const st=cust?.state||"TX";
                        const stData=stateTaxes.find(x=>x.id===st);
                        const tax=calcSaleTax(s);
                        const gt=calcSaleGrandTotal(s);
                        const paid=pmtFor(s.id)?.status==="paid";
                        return(
                          <tr key={s.id}>
                            <td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed",cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{s.id}</span></td>
                            <td style={{fontSize:11,color:"#6b7280"}}>{s.date}</td>
                            <td style={{fontWeight:600,color:"#212121"}}>{cust?.name}</td>
                            <td><span className="tag" style={{background:"#ede9fe",color:"#7c3aed"}}>{st}</span></td>
                            <td style={{color:"#6b7280"}}>{getT(s.truck_id)?.driver}</td>
                            <td>{fmt(s.total)}</td>
                            <td style={{color:"#059669",fontWeight:600}}>{fmt(tax)}</td>
                            <td style={{fontWeight:700,color:"#7c3aed"}}>{fmt(gt)}</td>
                            <td><span className={`bdg ${paid?"bg2":"br2"}`}>{paid?"PAID":"UNPAID"}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            );
          })()}

          {/* ══ CREDIT MEMOS ══ */}
          {tab==="creditmemos"&&isAdmin&&<CreditMemosTab
            creditMemos={creditMemos}
            setCreditMemos={setCreditMemos}
            customers={customers}
            sales={sales}
            calcSaleGrandTotal={calcSaleGrandTotal}
            supabase={supabase}
            showToast={showToast}
            showConfirm={showConfirm}
            fmt={fmt}
          />}

          {/* ══ AR ══ */}
          {tab==="ar"&&<div className="fu">
            {/* Aging buckets */}
            {(()=>{
              const now=new Date();
              const unpaidSales=visSales.filter(s=>pmtFor(s.id)?.status!=="paid");
              const ageDays=s=>{const d=new Date(s.created_at||s.date);return isNaN(d)?0:Math.floor((now-d)/(1000*60*60*24));};
              const buckets=[
                {label:"Current (0–30d)",min:0,max:30,color:"#059669",bg:"#f0fdf4",border:"#a7f3d0"},
                {label:"31–60 Days",min:31,max:60,color:"#f59e0b",bg:"#fffbeb",border:"#fde68a"},
                {label:"61–90 Days",min:61,max:90,color:"#f97316",bg:"#fff7ed",border:"#fed7aa"},
                {label:"90+ Days",min:91,max:9999,color:"#dc2626",bg:"#fef2f2",border:"#fecaca"},
              ];
              const bucketed=buckets.map(b=>({
                ...b,
                sales:unpaidSales.filter(s=>{const d=ageDays(s);return d>=b.min&&d<=b.max;}),
                amount:unpaidSales.filter(s=>{const d=ageDays(s);return d>=b.min&&d<=b.max;}).reduce((a,s)=>a+calcSaleGrandTotal(s),0),
              }));
              return(
                <>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
                    {bucketed.map(b=>(
                      <div key={b.label} className="kpi" style={{background:b.bg,border:`1px solid ${b.border}`}}>
                        <div className="kv" style={{color:b.color}}>{fmt(b.amount)}</div>
                        <div className="kl" style={{color:b.color}}>{b.label}</div>
                        <div style={{fontSize:10,color:b.color,marginTop:4,opacity:.7}}>{b.sales.length} invoice{b.sales.length!==1?"s":""}</div>
                      </div>
                    ))}
                  </div>
                  {bucketed.some(b=>b.sales.length>0&&b.min>60)&&(
                    <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:12,color:"#991b1b"}}>
                      🚨 <strong>{bucketed.filter(b=>b.min>60).reduce((a,b)=>a+b.sales.length,0)} invoice(s) over 60 days past due.</strong> Immediate collection action recommended.
                    </div>
                  )}
                </>
              );
            })()}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
              {[{l:"Total Billed",v:fmt(totalBilled),c:"#7c3aed"},{l:"Collected",v:fmt(paidGrandTotal),c:"#059669"},{l:"Outstanding",v:fmt(totalAR),c:"#dc2626"}].map(k=><div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>)}
            </div>
            <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap"}}>
              {["all","unpaid","paid"].map(f=><button key={f} className={`btn ${arFilter===f?"ba":"bgh"}`} style={{padding:"6px 14px",textTransform:"capitalize"}} onClick={()=>setArFilter(f)}>{f}</button>)}
              <button className="btn bpr" style={{marginLeft:"auto"}} onClick={exportAR}>{ic.dl} Export CSV</button>
              {co?.email_reminders&&co?.gmail_user&&co?.gmail_app_password&&(
                <button className="btn bb" style={{fontSize:11}} onClick={async()=>{
                  const now=new Date();
                  const unpaid=visSales.filter(s=>pmtFor(s.id)?.status!=="paid");
                  let sent=0,skipped=0;
                  for(const s of unpaid){
                    const cust=getC(s.cust_id);
                    if(!cust?.email?.includes("@")){skipped++;continue;}
                    const days=Math.floor((now-new Date(s.created_at||s.date))/(1000*60*60*24));
                    if(days<30){skipped++;continue;}
                    const label=days>=90?"🚨 90+ days":days>=60?"⚠️ 60 days":"📋 30 days";
                    const html=`<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
                      <div style="background:#dc2626;padding:16px 20px;border-radius:8px 8px 0 0;color:#fff">
                        <div style="font-size:18px;font-weight:700">Payment Reminder — ${label} Overdue</div>
                      </div>
                      <div style="border:1px solid #e5e7eb;border-top:none;padding:20px;border-radius:0 0 8px 8px">
                        <p>Hi <strong>${cust.name}</strong>,</p>
                        <p>This is a friendly reminder that invoice <strong>${s.id}</strong> dated <strong>${s.date}</strong> for <strong>$${calcSaleGrandTotal(s).toFixed(2)}</strong> is now <strong>${days} days overdue</strong>.</p>
                        <p>Please arrange payment at your earliest convenience. Contact us at ${co?.phone||""} or ${co?.email||""} if you have any questions.</p>
                        <p style="color:#6b7280;font-size:12px">— ${co?.name||"Your Supplier"}</p>
                      </div></body></html>`;
                    const r=await sendEmail(cust.email,`Payment Reminder — Invoice ${s.id} (${days} days overdue)`,html);
                    if(r.ok)sent++;else skipped++;
                  }
                  showToast(`✅ Sent ${sent} reminder${sent!==1?"s":""}${skipped>0?` · ${skipped} skipped (no email)`:""}`);}}>
                  ✉️ Send Overdue Reminders
                </button>
              )}
            </div>
            <div className="card">
              {visSales.length===0?<Empty icon="📋" msg="NO TRANSACTIONS"/>:(()=>{
                const now=new Date();
                const ageDays=s=>{const d=new Date(s.created_at||s.date);return isNaN(d)?0:Math.floor((now-d)/(1000*60*60*24));};
                const ageBadge=days=>days<=30?<span className="bdg bg2">0–30d</span>:days<=60?<span className="bdg ba2">31–60d</span>:days<=90?<span className="bdg" style={{background:"#fff7ed",color:"#c2410c",border:"1px solid #fed7aa"}}>61–90d</span>:<span className="bdg br2">90+d</span>;
                const filtered=visSales.filter(s=>arFilter==="all"||(arFilter==="unpaid"&&pmtFor(s.id)?.status!=="paid")||(arFilter==="paid"&&pmtFor(s.id)?.status==="paid"));
                return filtered.length===0?<Empty icon="🔍" msg="NO RECORDS MATCH"/>:(
                  <div className="tw"><table><thead><tr><th>Invoice</th><th>Customer</th><th>Date</th><th>Age</th><th>Driver</th><th>Grand Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>{filtered.map(s=>{const gt=calcSaleGrandTotal(s),pmt=pmtFor(s.id),paid=pmt?.status==="paid"?gt:0,due=gt-paid,days=ageDays(s);return(
                    <tr key={s.id}><td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed"}}>{s.id}</span></td><td style={{color:"#212121",fontWeight:600}}>{getC(s.cust_id)?.name}</td><td style={{color:"#6b7280",fontSize:11}}>{s.date}</td><td>{pmt?.status==="paid"?<span className="bdg bg2">Paid</span>:ageBadge(days)}</td><td style={{color:"#6b7280"}}>{getT(s.truck_id)?.driver}</td><td style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{fmt(gt)}</td><td style={{color:"#059669",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{fmt(paid)}</td><td><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:due>0?"#dc2626":"#059669"}}>{fmt(due)}</span></td><td><span className={`bdg ${pmt?.status==="paid"?"bg2":"br2"}`}>{pmt?.status==="paid"?"PAID":"UNPAID"}</span></td>
                    <td><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{pmt?.status!=="paid"?<button className="btn bg" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>markPaid(s.id)}>{ic.chk} Pay</button>:<button className="btn bgh" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>markUnpaid(s.id)}>Undo</button>}{pmt?.status!=="paid"&&isAdmin&&(()=>{const cust=getC(s.cust_id);const alreadyFlagged=hasReturnedCheck(cust);return<button className="btn br" style={{fontSize:10,padding:"4px 8px",whiteSpace:"nowrap"}} title={alreadyFlagged?"Customer already flagged":"Flag as returned check"} onClick={async()=>{if(alreadyFlagged)return showToast("Customer already flagged for returned check","error");showConfirm(`Flag ${cust?.name} for a returned check on invoice ${s.id}?\n\nThis will:\n• Add $${RETURNED_CHECK_FEE} penalty to their last unpaid invoice\n• Add RETURNED CHECK warning to all platforms`,async()=>{
                      // 1. Flag the customer
                      await markCheckReturned(s.cust_id);
                      // 2. Add penalty to last unpaid invoice (excluding the returned one)
                      const penalty=RETURNED_CHECK_FEE;
                      const custSales=sales.filter(x=>x.cust_id===s.cust_id);
                      const otherUnpaid=custSales.filter(x=>{const p=pmtFor(x.id);return x.id!==s.id&&(!p||p.status!=="paid");}).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
                      const targetSale=otherUnpaid[0]||s; // fallback to current if no other unpaid
                      const newPrevBal=parseFloat(targetSale.previous_balance||0)+penalty;
                      await supabase.from("sales").update({
                        previous_balance:newPrevBal,
                        check_penalty_applied:penalty,
                        check_penalty_invoice:s.id,
                      }).eq("id",targetSale.id);
                      setSales(prev=>prev.map(x=>x.id===targetSale.id?{...x,previous_balance:newPrevBal,check_penalty_applied:penalty}:x));
                      showToast(`🔴 ${cust?.name} flagged — $${penalty} penalty added to invoice ${targetSale.id}`);
                    });}}>{alreadyFlagged?"🔴 Flagged":"🔴 Flag Check"}</button>;})()}<button className="btn bb" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{ic.inv}</button>{isAdmin&&<button className="btn bp" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>openAmend(s)}>✏️</button>}{isAdmin&&<button className="btn br" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>deleteInvoice(s.id)}>{ic.X}</button>}</div></td>
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
                {["log","unpaid","reconcile"].map(t=>(
                  <button key={t} className={`btn ${pmTab===t?"ba":"bgh"}`} style={{padding:"6px 14px",textTransform:"capitalize"}} onClick={()=>setPmTab(t)}>{t==="log"?"All Payments":t==="unpaid"?"Unpaid Invoices":"🏦 Bank Reconcile"}</button>
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
                  const gt=calcSaleGrandTotal(s);
                  const cust=getC(s.cust_id);
                  return(
                    <tr key={s.id}>
                      <td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed",cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{s.id}</span></td>
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
                  <thead><tr><th>ID</th><th>Date</th><th>Customer</th><th>Driver</th><th>Method</th><th>Amount</th><th>Ref #</th><th>Invoices</th><th>Note</th><th></th></tr></thead>
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
                      <td>{isAdmin&&p.method==="check"&&(()=>{const cust=getC(p.cust_id);const flagged=hasReturnedCheck(cust);const firstInv=(p.invoice_ids||[])[0];return flagged?(
                        <button onClick={()=>clearReturnedCheck(p.cust_id)} style={{background:"#f0fdf4",border:"1px solid #a7f3d0",color:"#065f46",borderRadius:6,padding:"4px 10px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow',sans-serif",whiteSpace:"nowrap"}}>✅ Clear Flag</button>
                      ):firstInv?(
                        <button onClick={()=>setRcModal({saleId:firstInv,custId:p.cust_id})} style={{background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",borderRadius:6,padding:"4px 10px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow',sans-serif",whiteSpace:"nowrap"}}>🔴 Upload Returned Check</button>
                      ):null;})()}</td>
                    </tr>
                  ))}</tbody>
                </table></div>
              )}
            </div>}

            {/* Bank Reconciliation Tab */}
            {pmTab==="reconcile"&&<BankReconcile paymentsLog={paymentsLog} customers={customers} getC={getC} fmt={fmt}/>}

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
                        const gt=calcSaleGrandTotal(s);
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
                        {pmForm.invoice_ids.length} invoice{pmForm.invoice_ids.length!==1?"s":""} selected — Total due: ${custInvoices.filter(s=>pmForm.invoice_ids.includes(s.id)).reduce((a,s)=>a+calcSaleGrandTotal(s),0).toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Notes */}
              <div><label>Notes (optional)</label>
                <input placeholder="e.g. partial payment, split between cash and check..." value={pmForm.note} onChange={e=>setPmForm(f=>({...f,note:e.target.value}))}/>
              </div>

              {/* Receipt Photo Upload */}
              <div>
                <label>Receipt / Payment Proof (photo or scan)</label>
                <div style={{marginTop:6,border:"2px dashed #e5e7eb",borderRadius:10,padding:"14px",textAlign:"center",background:"#f9fafb",cursor:"pointer",position:"relative"}}
                  onClick={()=>document.getElementById("pmReceiptInput").click()}>
                  {pmForm.receipt_url?(
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                      <img src={pmForm.receipt_url} alt="receipt" style={{maxHeight:120,maxWidth:"100%",borderRadius:8,border:"1px solid #e5e7eb"}}/>
                      <span style={{fontSize:11,color:"#059669",fontWeight:600}}>✅ Receipt attached — click to change</span>
                    </div>
                  ):(
                    <div style={{color:"#9ca3af",fontSize:12}}>
                      <div style={{fontSize:24,marginBottom:4}}>📸</div>
                      <div>Click to take photo or upload receipt</div>
                      <div style={{fontSize:10,marginTop:2}}>JPG, PNG, PDF accepted</div>
                    </div>
                  )}
                  <input id="pmReceiptInput" type="file" accept="image/*,application/pdf" capture="environment"
                    style={{display:"none"}}
                    onChange={e=>{
                      const file=e.target.files[0];
                      if(file){
                        const url=URL.createObjectURL(file);
                        setPmForm(f=>({...f,receipt_url:url,receipt_file:file}));
                      }
                    }}/>
                </div>
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
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#212121"}}>{t.driver}</div><div style={{fontSize:10,color:"#6b7280"}}>{t.route||t.plate}</div></div><span className={`bdg ${t.locked?"br2":load?"ba2":"bgr"}`}>{t.locked?"🔒 LOCKED":load?"ACTIVE":"IDLE"}</span></div>
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
                {[{s:"REVENUE",rows:[{l:"Gross Sales",v:fmt(totalRevenue),c:"#059669"},{l:"Tax (Tobacco only)",v:fmt(totalTax),c:"#7c3aed"},{l:"Total incl. Tax",v:fmt(totalRevenue+totalTax),c:"#7c3aed",b:true}]},{s:"COST & PROFIT",rows:[{l:"COGS",v:fmt(totalRevenue-totalProfit),c:"#dc2626"},{l:"Gross Profit",v:fmt(totalProfit),c:"#059669",b:true},{l:"Gross Margin",v:totalRevenue>0?`${((totalProfit/totalRevenue)*100).toFixed(1)}%`:"0%",c:"#7c3aed",b:true}]},{s:"INVENTORY",rows:[{l:"Shelf Value (cost)",v:fmt(products.reduce((a,p)=>a+p.shelf*p.cost,0)),c:"#6b7280"},{l:"Shelf Value (retail)",v:fmt(products.reduce((a,p)=>a+p.shelf*p.price,0)),c:"#059669"}]},{s:"RECEIVABLES",rows:[{l:"Total Invoiced",v:fmt(totalBilled),c:"#7c3aed"},{l:"Collected",v:fmt(paidGrandTotal),c:"#059669"},{l:"Outstanding",v:fmt(totalAR),c:"#dc2626",b:true}]}].map(sec=>(
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

          {/* ══ STATE ACTIVATION ══ */}
          {tab==="statetax"&&<StateTaxManager
            stateTaxes={stateTaxes}
            setStateTaxes={setStateTaxes}
            supabase={supabase}
            showToast={showToast}
          />}

          {/* ══ PURCHASE ORDERS ══ */}
          {tab==="purchaseorders"&&isAdmin&&<PurchaseOrders
            products={products}
            setProducts={setProducts}
            supabase={supabase}
            showToast={showToast}
            showConfirm={showConfirm}
          />}

          {/* ══ EXPENSES ══ */}
          {tab==="expenses"&&isAdmin&&<ExpensesManager
            expenses={expenses}
            setExpenses={setExpenses}
            trucks={trucks}
            supabase={supabase}
            showToast={showToast}
            showConfirm={showConfirm}
          />}

          {/* ══ IRS REPORTS ══ */}
          {tab==="irs"&&isAdmin&&<IRSReports
            sales={sales} payments={payments} paymentsLog={paymentsLog}
            products={products} customers={customers} trucks={trucks}
            expenses={expenses} stateTaxes={stateTaxes} setStateTaxes={setStateTaxes}
            calcSaleTax={calcSaleTax} calcSaleGrandTotal={calcSaleGrandTotal}
            isTaxableProd={isTaxableProd} pmtFor={pmtFor}
            fmt={fmt} supabase={supabase} showToast={showToast}
          />}

          {/* ══ CUSTOMERS ══ */}
          {tab==="customers"&&<div className="fu">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:12,color:"#6b7280"}}>{visCustomers.length} customer account{visCustomers.length!==1?"s":""}{!isAdmin?" on your route":""}</div>
              <button className="btn ba" onClick={()=>setModal("addCustomer")}>{ic.plus} Open New Account</button>
            </div>
            {editingCid&&<div style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:10,padding:"18px 20px",marginBottom:16}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:"#059669",marginBottom:12}}>✏️ EDITING CUSTOMER</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
                {[{l:"Business Name",k:"name"},{l:"Address",k:"address"},{l:"Phone",k:"phone"},{l:"Email",k:"email"}].map(f=>(
                  <div key={f.k}><label>{f.l}</label><input value={editCust[f.k]||""} onChange={e=>setEditCust(x=>({...x,[f.k]:e.target.value}))}/></div>
                ))}
                <div><label>State</label>
                  <select value={editCust.state||"TX"} onChange={e=>setEditCust(x=>({...x,state:e.target.value}))}>
                    <option value="">— Select State —</option>
                    {stateTaxes.map(st=><option key={st.id} value={st.id}>{st.id} — {st.name} {st.exempt?"(Exempt)":`(${st.rate}%)`}</option>)}
                  </select>
                </div>
                <div><label>Assigned Driver</label><select value={editCust.truck_id||""} onChange={e=>setEditCust(x=>({...x,truck_id:e.target.value}))}><option value="">— Unassigned —</option>{trucks.map(t=><option key={t.id} value={t.id}>{t.driver} ({t.route||t.plate})</option>)}</select></div>
                <div><label>💳 Credit Limit ($) — 0 = unlimited</label><input type="number" min="0" step="0.01" placeholder="0 = unlimited" value={editCust.credit_limit||""} onChange={e=>setEditCust(x=>({...x,credit_limit:e.target.value}))}/></div>
                <div><label>Notes</label><input 
                  value={(editCust.notes||"").replace(/CUSTOM_PRICES:[^}]*}/g,"").replace(/\nRETURNED_CHECK:1/g,"").replace(/RETURNED_CHECK:1\n?/g,"").trim()}
                  onChange={e=>{
                    const cleanNote=e.target.value;
                    const cp=parseCustomPrices(editCust);
                    const hasCP=Object.keys(cp).length>0;
                    const newNotes=hasCP?(cleanNote+(cleanNote?"\n":"")+"CUSTOM_PRICES:"+JSON.stringify(cp)):cleanNote;
                    setEditCust(x=>({...x,notes:newNotes}));
                  }}
                /></div>
              </div>
              {/* Custom pricing section */}
              <div style={{gridColumn:"1/-1",marginTop:8}}>
                <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,color:"#7c3aed"}}>
                      💲 CUSTOM PRODUCT PRICES
                    </div>
                    <span style={{fontSize:11,color:"#9ca3af"}}>Leave blank = use standard price</span>
                  </div>
                  {/* Show only customized items summary at top */}
                  {(()=>{const cp=parseCustomPrices(editCust);const customCount=Object.keys(cp).length;return customCount>0?(
                    <div style={{background:"#ede9fe",borderRadius:7,padding:"8px 12px",marginBottom:12,fontSize:11,color:"#5b21b6"}}>
                      ✅ {customCount} product{customCount!==1?"s":""} with custom pricing active
                    </div>
                  ):null;})()}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:8}}>
                    {products.map(p=>{
                      const cp=parseCustomPrices(editCust);
                      const customVal=cp[p.id]?""+cp[p.id]:"";
                      const hasCustom=!!customVal;
                      return(
                        <div key={p.id} style={{background:hasCustom?"#fff":"#f9fafb",border:`1.5px solid ${hasCustom?"#a78bfa":"#e5e7eb"}`,borderRadius:9,padding:"10px 12px",transition:"border-color .15s"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                            <div style={{fontSize:12,fontWeight:700,color:"#212121",flex:1,paddingRight:6}}>{p.name}</div>
                            {hasCustom&&<span style={{fontSize:9,background:"#7c3aed",color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700,flexShrink:0,whiteSpace:"nowrap"}}>CUSTOM</span>}
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{flex:1}}>
                              <div style={{fontSize:9,color:"#9ca3af",marginBottom:3,textTransform:"uppercase",letterSpacing:".06em"}}>Standard price</div>
                              <div style={{fontSize:12,color:"#9ca3af",fontWeight:hasCustom?400:600,textDecoration:hasCustom?"line-through":"none"}}>{fmt(p.price)}</div>
                            </div>
                            <div style={{color:"#d1d5db",fontSize:14}}>→</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:9,color:hasCustom?"#7c3aed":"#9ca3af",marginBottom:3,textTransform:"uppercase",letterSpacing:".06em",fontWeight:hasCustom?700:400}}>Custom price</div>
                              <input
                                type="number" min="0" step="0.01"
                                placeholder={p.price.toFixed(2)}
                                value={customVal}
                                onChange={e=>{
                                  const val=e.target.value;
                                  const newCp={...parseCustomPrices(editCust)};
                                  if(val&&parseFloat(val)>0)newCp[p.id]=parseFloat(val);
                                  else delete newCp[p.id];
                                  const baseNotes=(editCust.notes||"").replace(/CUSTOM_PRICES:\{[^{}]*\}/g,"").trim();
                                  const hasAny=Object.keys(newCp).length>0;
                                  const newNotes=hasAny?(baseNotes+(baseNotes?"\n":"")+"CUSTOM_PRICES:"+JSON.stringify(newCp)):baseNotes;
                                  setEditCust(x=>({...x,notes:newNotes}));
                                }}
                                style={{width:"100%",border:`1.5px solid ${hasCustom?"#7c3aed":"#d1d5db"}`,borderRadius:6,padding:"5px 8px",fontSize:13,fontWeight:hasCustom?800:400,color:hasCustom?"#7c3aed":"#6b7280",background:hasCustom?"#f5f3ff":"#fff"}}
                              />
                            </div>
                          </div>
                          {hasCustom&&(()=>{const diff=parseFloat(customVal)-p.price;const pct=((diff/p.price)*100).toFixed(1);return(
                            <div style={{marginTop:6,fontSize:10,color:diff<0?"#059669":"#dc2626",fontWeight:600}}>
                              {diff<0?"▼":"▲"} {Math.abs(pct)}% {diff<0?"below":"above"} standard ({diff<0?"-":"+"}${Math.abs(diff).toFixed(2)})
                            </div>
                          );})()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap",alignItems:"center"}}>
                <button className="btn bg" onClick={saveEditCustomer} disabled={saving}>{ic.save} Save Changes</button>
                <button className="btn bgh" onClick={cancelEditCustomer}>{ic.X} Cancel</button>
                {hasReturnedCheck(editCust)&&(
                  <button className="btn bg" style={{marginLeft:"auto"}} onClick={()=>clearReturnedCheck(editCust.id)}>✅ Clear Returned Check Flag</button>
                )}
              </div>
            </div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
              {visCustomers.map(c=>{
                const cs=visSales.filter(s=>s.cust_id===c.id);
                const rev=cs.reduce((a,s)=>a+s.total,0),prof=cs.reduce((a,s)=>a+s.profit,0);
                const unpaid=cs.filter(s=>pmtFor(s.id)?.status!=="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0);
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
                          {(()=>{const visNotes=(c.notes||"").replace(/CUSTOM_PRICES:[^}]*}/g,"").replace(/\nRETURNED_CHECK:1/g,"").replace(/RETURNED_CHECK:1\n?/g,"").trim();return visNotes?<div style={{fontSize:10,color:"#6b7280",fontStyle:"italic",marginTop:2}}>📝 {visNotes}</div>:null;})()}
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end"}}>
                        {truck&&<span className="bdg bb2">{truck.route||truck.plate}</span>}
                        {hasReturnedCheck(c)&&<span className="bdg br2" style={{background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",animation:"pu 2s infinite"}}>🚨 Returned Check</span>}
                        {Object.keys(parseCustomPrices(c)).length>0&&<span className="bdg bb2" style={{background:"#ede9fe",color:"#7c3aed",border:"1px solid #ddd6fe"}}>💲 Custom Prices</span>}
                        <button className="btn bgh" style={{fontSize:10,padding:"4px 9px"}} onClick={()=>isEditingThis?cancelEditCustomer():startEditCustomer(c)}>{isEditingThis?<>{ic.X} Cancel</>:<>{ic.edit} Edit</>}</button>
                        {isAdmin&&!isEditingThis&&<button className="btn br" style={{fontSize:10,padding:"4px 9px"}} onClick={()=>deleteCustomer(c.id,c.name)}>{ic.X}</button>}
                      </div>
                    </div>
                    <Divider/>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                      {[{l:"Revenue",v:fmt(rev),c:"#059669"},{l:"Profit",v:fmt(prof),c:"#7c3aed"},{l:"Orders",v:cs.length,c:"#7c3aed"},{l:"Balance",v:fmt(unpaid),c:unpaid>0?"#dc2626":"#059669"}].map(k=>(
                        <div key={k.l} style={{textAlign:"center"}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:k.c}}>{k.v}</div><div style={{fontSize:9,color:"#9ca3af",letterSpacing:".05em",marginTop:1}}>{k.l}</div></div>
                      ))}
                    </div>
                    {c.credit_limit>0&&unpaid>0&&(()=>{const pct=Math.min(100,(unpaid/c.credit_limit)*100);const over=unpaid>=c.credit_limit;return(
                      <div style={{marginTop:10,background:over?"#fef2f2":"#fff7ed",border:`1px solid ${over?"#fecaca":"#fed7aa"}`,borderRadius:8,padding:"8px 10px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <span style={{fontSize:10,fontWeight:700,color:over?"#dc2626":"#c2410c"}}>{over?"🔴 CREDIT LIMIT EXCEEDED":"🟡 CREDIT LIMIT"}</span>
                          <span style={{fontSize:10,fontWeight:700,color:over?"#dc2626":"#c2410c"}}>{fmt(unpaid)} / {fmt(c.credit_limit)}</span>
                        </div>
                        <div style={{height:5,background:"#e5e7eb",borderRadius:3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:pct+"%",background:over?"#dc2626":"#f59e0b",borderRadius:3,transition:"width .3s"}}/>
                        </div>
                      </div>
                    );})()}
                    {/* Purchase History Analytics */}
                    {cs.length>0&&(()=>{
                      // Top products by qty sold to this customer
                      const prodQtys={};
                      cs.forEach(s=>(s.items||[]).forEach(it=>{prodQtys[it.pid]=(prodQtys[it.pid]||0)+(it.qty||0);}));
                      const topProds=Object.entries(prodQtys).sort((a,b)=>b[1]-a[1]).slice(0,3);
                      // Order frequency
                      const sortedDates=cs.map(s=>new Date(s.created_at||s.date)).filter(d=>!isNaN(d)).sort((a,b)=>b-a);
                      const lastOrder=sortedDates[0];
                      const daysSinceLast=lastOrder?Math.floor((new Date()-lastOrder)/(1000*60*60*24)):null;
                      const avgDaysBetween=sortedDates.length>1?(sortedDates.slice(0,-1).reduce((a,d,i)=>a+Math.floor((d-sortedDates[i+1])/(1000*60*60*24)),0)/(sortedDates.length-1)).toFixed(0):null;
                      return(
                        <div style={{marginTop:10,background:"#f9fafb",borderRadius:8,padding:"10px 12px"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#6b7280",marginBottom:6,letterSpacing:".06em"}}>📊 BUYING PATTERNS</div>
                          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:6}}>
                            {lastOrder&&<div style={{fontSize:11}}><span style={{color:"#9ca3af"}}>Last order:</span> <span style={{fontWeight:700,color:daysSinceLast>30?"#dc2626":"#059669"}}>{daysSinceLast===0?"Today":`${daysSinceLast}d ago`}</span></div>}
                            {avgDaysBetween&&<div style={{fontSize:11}}><span style={{color:"#9ca3af"}}>Avg frequency:</span> <span style={{fontWeight:700,color:"#7c3aed"}}>every {avgDaysBetween} days</span></div>}
                          </div>
                          {topProds.length>0&&(
                            <div>
                              <div style={{fontSize:10,color:"#9ca3af",marginBottom:4}}>Top products:</div>
                              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                                {topProds.map(([pid,qty])=>{const prod=getP(pid);return prod?(
                                  <span key={pid} style={{background:"#ede9fe",color:"#7c3aed",fontSize:10,padding:"2px 8px",borderRadius:5,fontWeight:600}}>
                                    {prod.name} ×{qty}
                                  </span>
                                ):null;})}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    <div style={{fontSize:10,color:"#9ca3af",marginTop:10}}>Driver: <span style={{color:"#7c3aed"}}>{truck?.driver||"Unassigned"}</span>{c.credit_limit>0&&<span style={{marginLeft:8}}>· Limit: <span style={{color:"#212121",fontWeight:700}}>{fmt(c.credit_limit)}</span></span>}</div>
                  </div>
                );
              })}
            </div>
          </div>}

          {/* ══ TRUCK MANAGEMENT ══ */}
          {tab==="truckmanagement"&&isAdmin&&<div className="fu">{(()=>{

            // -- helpers ------------------------------------------------------
            const navToAddress = addr => {
              if(!addr) return;
              const enc = encodeURIComponent(addr);
              const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
              window.open(isIOS
                ? `maps://maps.apple.com/?q=${enc}`
                : `https://www.google.com/maps/search/?api=1&query=${enc}`,
                "_blank");
            };

            // -- sub-tab -------------------------------------------------------

            const addDriver = async () => {
              if(!driverForm.driver.trim()||!driverForm.plate.trim()) return showToast("Driver name and plate required","error");
              setDriverSaving(true);
              try {
                const rec = {id:"T"+uid(), driver:driverForm.driver.trim(), plate:driverForm.plate.trim(), route:driverForm.route.trim()};
                const {error} = await supabase.from("trucks").insert(rec);
                if(error) throw error;
                setTrucks(prev=>[...prev,rec]);
                setDriverForm({driver:"",plate:"",route:"",email:""});
                showToast(`🚚 ${rec.driver} added`);
              } catch(e){showToast(e.message,"error");}
              setDriverSaving(false);
            };

            const saveTruckEdit = async () => {
              if(!editTruck||!editTruck.id) return;
              if(!editTruck.driver?.trim()||!editTruck.plate?.trim()) return showToast("Driver name and plate required","error");
              const {error} = await supabase.from("trucks").update({driver:editTruck.driver.trim(),plate:editTruck.plate.trim(),route:editTruck.route?.trim()||""}).eq("id",editTruck.id);
              if(error) return showToast(error.message,"error");
              setTrucks(prev=>prev.map(t=>t.id===editTruck.id?{...t,driver:editTruck.driver.trim(),plate:editTruck.plate.trim(),route:editTruck.route?.trim()||""}:t));
              setEditTruck(null);
              showToast(`[OK] ${editTruck.driver} updated`);
              logAudit("EDIT","Truck",`Edited driver ${editTruck.driver}`);
            };

            const assignCustomer = async () => {
              if(!assignCid||!assignTid) return showToast("Select customer and truck","error");
              const {error} = await supabase.from("customers").update({truck_id:assignTid}).eq("id",assignCid);
              if(error) return showToast(error.message,"error");
              setCustomers(prev=>prev.map(c=>c.id===assignCid?{...c,truck_id:assignTid}:c));
              setAssignCid(""); setAssignTid("");
              showToast("Customer assigned");
            };

            const unassignCustomer = async (cid) => {
              await supabase.from("customers").update({truck_id:null}).eq("id",cid);
              setCustomers(prev=>prev.map(c=>c.id===cid?{...c,truck_id:null}:c));
              showToast("Customer unassigned");
            };

            // -- map init (Leaflet via CDN) ------------------------------------
            const subTabs=[
              ["overview","📊 Overview"],
              ["drivers","🚚 Drivers"],
              ["performance","🏆 Performance"],
              ["schedule","📅 Delivery Schedule"],
              ["assign","👤 Assign Customers"],
              ["resets",`🔄 Reset Requests${truckResets.filter(r=>r.status==="pending").length?` (${truckResets.filter(r=>r.status==="pending").length})`:""}` ],
              ["map","🗺 Live Map"],
            ];

            return(<>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#212121"}}>🚚 Truck Management</div>
                  <div style={{fontSize:12,color:"#9ca3af"}}>Drivers, routes, customer assignments, and live map</div>
                </div>
              </div>

              {/* Sub-tabs */}
              <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
                {subTabs.map(([k,l])=>(
                  <button key={k} onClick={()=>setTmTab(k)}
                    style={{padding:"8px 16px",borderRadius:20,border:`1.5px solid ${tmTab===k?"#0a1628":"#e5e7eb"}`,background:tmTab===k?"#0a1628":"#fff",color:tmTab===k?"#fff":"#6b7280",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                    {l}
                  </button>
                ))}
              </div>

                {/* Edit modal - rendered regardless of sub-tab */}
                {editTruck&&editTruck.id&&<div style={{position:"fixed",inset:0,background:"#00000060",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(3px)"}}>
                  <div style={{background:"#fff",borderRadius:14,padding:24,maxWidth:400,width:"90%",boxShadow:"0 8px 40px #00000030"}}>
                    <div style={{fontWeight:700,fontSize:15,color:"#0a1628",marginBottom:14}}>✏️ Edit Truck — {editTruck.driver}</div>
                    {[["Driver Name","driver"],["Plate","plate"],["Route","route"]].map(([l,k])=>(
                      <div key={k} className="field" style={{marginBottom:10}}>
                        <label>{l}</label>
                        <input value={editTruck[k]||""} onChange={e=>setEditTruck(prev=>({...prev,[k]:e.target.value}))}
                          onKeyDown={e=>e.key==="Enter"&&saveTruckEdit()}/>
                      </div>
                    ))}
                    <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}>
                      <button className="btn bgh" onClick={()=>setEditTruck(null)}>Cancel</button>
                      <button className="btn ba" onClick={saveTruckEdit}>💾 Save</button>
                    </div>
                  </div>
                </div>}

              {/* ── OVERVIEW ── */}
              {tmTab==="overview"&&<>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginBottom:20}}>
                  {trucks.map(t=>{
                    const tCusts=customers.filter(c=>c.truck_id===t.id);
                    const al=activeLoad(t.id);
                    const inv=al?truckInv(t.id):[];
                    const todaySales=sales.filter(s=>s.truck_id===t.id&&s.date===new Date().toLocaleDateString());
                    const todayRev=todaySales.reduce((a,s)=>a+s.total,0);
                    const driverProfile=driverProfiles.find(p=>p.truck_id===t.id);
                    const isOnline=driverProfile?.last_seen&&(Date.now()-new Date(driverProfile.last_seen).getTime())<5*60*1000;
                    return(
                      <div key={t.id} className="card" style={{padding:16,borderLeft:`4px solid ${isOnline?"#059669":"#e5e7eb"}`}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                          <div style={{fontWeight:800,fontSize:14,color:"#0a1628"}}>{t.driver}</div>
                          <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10,background:isOnline?"#dcfce7":"#f3f4f6",color:isOnline?"#065f46":"#9ca3af"}}>{isOnline?"🟢 ONLINE":"⚫ OFFLINE"}</span>
                        </div>
                        <div style={{fontSize:11,color:"#6b7280",marginBottom:6}}>{t.plate}{t.route&&`   -   ${t.route}`}</div>
                        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                          {[["Customers",tCusts.length,"#7c3aed"],["On Truck",inv.reduce((a,i)=>a+i.remaining,0),"#0ea5e9"],["Today Rev",`$${todayRev.toFixed(0)}`,todayRev>0?"#059669":"#9ca3af"]].map(([l,v,c])=>(
                            <div key={l}><div style={{fontSize:9,color:"#9ca3af",fontWeight:700}}>{l}</div><div style={{fontWeight:800,fontSize:14,color:c}}>{v}</div></div>
                          ))}
                        </div>
                        <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                          <button className="btn bb" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>setEditTruck({...t})}>✏️ Edit</button>
                          <button className="btn br" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>deleteTruck(t.id,t.driver)}>Delete</button>
                          {t.locked
                            ?<button className="btn bg" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>unlockTruck(t.id)}>🔓 Unlock</button>
                            :<button className="btn ba" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>lockTruck(t.id)}>🔒 Lock</button>}
                          {inv.reduce((a,i)=>a+i.remaining,0)>0&&(()=>{
                            const hasPending=truckResets.some(r=>r.truck_id===t.id&&r.status==="pending");
                            return hasPending
                              ?<span style={{fontSize:9,fontWeight:700,padding:"4px 8px",borderRadius:6,background:"#fef9c3",color:"#854d0e",border:"1px solid #fde68a"}}>Reset Pending</span>
                              :<button style={{fontSize:10,padding:"4px 10px",border:"1.5px solid #f97316",background:"#fff7ed",color:"#c2410c",borderRadius:6,cursor:"pointer",fontWeight:700,fontFamily:"'Inter',sans-serif"}}
                                onClick={()=>showConfirm("Reset ALL inventory on "+t.driver+"'s truck?\n\n- Return "+inv.reduce((a,i)=>a+i.remaining,0)+" units to warehouse shelf\n- Close the active load\n- Requires admin approval",()=>{
                                  supabase.from("truck_resets").insert({
                                    id:"RST-"+uid(),
                                    truck_id:t.id,
                                    driver_name:t.driver,
                                    requested_by:profile?.email||"admin",
                                    remaining_units:inv.reduce((a,i)=>a+i.remaining,0),
                                    load_id:activeLoad(t.id)?.id||null,
                                    status:"pending",
                                    note:"Reset requested for "+t.driver+" ("+t.plate+")",
                                    created_at:new Date().toISOString(),
                                  }).then(({error})=>{
                                    if(error)showToast("Failed to submit reset: "+error.message,"error");
                                    else{
                                      setTruckResets(prev=>[{id:"RST-"+uid(),truck_id:t.id,driver_name:t.driver,status:"pending",remaining_units:inv.reduce((a,i)=>a+i.remaining,0),created_at:new Date().toISOString()},...prev]);
                                      showToast("Reset request submitted - pending approval");
                                      setTmTab("resets");
                                    }
                                  });
                                })}>
                                Reset Inventory
                              </button>;
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>}

              {/* ── DRIVERS ── */}
              {tmTab==="drivers"&&<>
                <div className="card" style={{padding:20,marginBottom:16,borderTop:"3px solid #0a1628"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,marginBottom:12}}>➕ Add New Driver / Truck</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    {[["Driver Name *","driver","e.g. John Smith"],["License Plate *","plate","e.g. TX-1234"],["Route / Area","route","e.g. North Dallas"]].map(([l,k,p])=>(
                      <div key={k} className="field" style={{gridColumn:k==="route"?"1/-1":"auto"}}>
                        <label>{l}</label>
                        <input placeholder={p} value={driverForm[k]||""} onChange={e=>setDriverForm(prev=>({...prev,[k]:e.target.value}))}/>
                      </div>
                    ))}
                  </div>
                  <button className="btn ba" onClick={addDriver} disabled={driverSaving}>
                    {driverSaving?<><span className="sp">⟳</span> Adding…</>:"🚚 Add Truck"}
                  </button>
                </div>

                <div className="card" style={{overflow:"hidden"}}>
                  <table>
                    <thead><tr>{["Driver","Plate","Route","Customers","Status","Auth Profile","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                    <tbody>
                      {trucks.map(t=>{
                        const tCusts=customers.filter(c=>c.truck_id===t.id);
                        const dProfile=driverProfiles.find(p=>p.truck_id===t.id);
                        const isOnline=dProfile?.last_seen&&(Date.now()-new Date(dProfile.last_seen).getTime())<5*60*1000;
                        return(
                          <tr key={t.id}>
                            <td><div style={{fontWeight:700}}>{t.driver}</div><div style={{fontSize:10,color:"#9ca3af"}}>{t.id}</div></td>
                            <td style={{fontFamily:"monospace",fontWeight:600}}>{t.plate}</td>
                            <td style={{color:"#6b7280"}}>{t.route||"—"}</td>
                            <td><span style={{fontWeight:700,color:"#7c3aed"}}>{tCusts.length}</span></td>
                            <td>
                              <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,background:t.locked?"#fef2f2":isOnline?"#dcfce7":"#f3f4f6",color:t.locked?"#dc2626":isOnline?"#065f46":"#9ca3af"}}>
                                {t.locked?"🔒 LOCKED":isOnline?"🟢 ONLINE":"⚫ OFFLINE"}
                              </span>
                            </td>
                            <td style={{fontSize:11,color:"#6b7280"}}>{dProfile?.email||<span style={{color:"#f59e0b",fontSize:10}}>No profile linked</span>}</td>
                            <td>
                              <div style={{display:"flex",gap:4}}>
                                <button className="btn bb" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>setEditTruck({...t})}>✏️</button>
                                {t.locked
                                  ?<button className="btn bg" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>unlockTruck(t.id)}>🔓</button>
                                  :<button className="btn ba" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>lockTruck(t.id)}>🔒</button>}
                                <button className="btn br" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>deleteTruck(t.id,t.driver)}>{ic.X}</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Auth assignment */}
                <div className="card" style={{padding:20,marginTop:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,marginBottom:10}}>🔑 LINK DRIVER ACCOUNT TO TRUCK</div>
                  <DriverTruckAssignment supabase={supabase} trucks={trucks} showToast={showToast}/>
                </div>
              </>}

              {/* ── DELIVERY SCHEDULE ── */}
              {tmTab==="schedule"&&<DeliverySchedule trucks={trucks} setTrucks={setTrucks} customers={customers} supabase={supabase} showToast={showToast}/>}

              {/* ── DRIVER PERFORMANCE ── */}
              {tmTab==="performance"&&<DriverPerformance trucks={trucks} sales={sales} payments={payments} customers={customers} returns={returns} expenses={expenses} loads={loads} fmt={fmt} calcSaleGrandTotal={calcSaleGrandTotal} pmtFor={pmtFor}/>}

              {/* ── ASSIGN CUSTOMERS ── */}
              {tmTab==="assign"&&<>
                <div className="card" style={{padding:20,marginBottom:16,borderTop:"3px solid #7c3aed"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,marginBottom:12}}>➕ Assign Customer to Truck</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    <div className="field">
                      <label>Customer</label>
                      <select value={assignCid} onChange={e=>setAssignCid(e.target.value)}>
                        <option value="">— Select customer —</option>
                        {[...customers].sort((a,b)=>a.name.localeCompare(b.name)).map(c=>(
                          <option key={c.id} value={c.id}>{c.name}{c.truck_id?" ✓":""}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Assign to Truck</label>
                      <select value={assignTid} onChange={e=>setAssignTid(e.target.value)}>
                        <option value="">— Select truck —</option>
                        {trucks.map(t=><option key={t.id} value={t.id}>{t.driver} · {t.plate}</option>)}
                      </select>
                    </div>
                  </div>
                  <button className="btn ba" onClick={assignCustomer}>Assign Customer</button>
                </div>

                {trucks.map(t=>{
                  const tCusts=customers.filter(c=>c.truck_id===t.id);
                  return(
                    <div key={t.id} className="card" style={{marginBottom:12,overflow:"hidden",borderTop:`3px solid #0ea5e9`}}>
                      <div style={{padding:"12px 16px",background:"#f0f9ff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{fontWeight:800,fontSize:13,color:"#0a1628"}}>🚚 {t.driver} <span style={{color:"#6b7280",fontWeight:400}}>· {t.plate}{t.route&&`   -   ${t.route}`}</span></div>
                        <span style={{fontWeight:700,fontSize:12,color:"#0ea5e9"}}>{tCusts.length} customers</span>
                      </div>
                      {tCusts.length===0
                        ?<div style={{padding:"14px 16px",fontSize:12,color:"#9ca3af"}}>No customers assigned</div>
                        :<table>
                          <thead><tr>{["Customer","Phone","Address","Navigate","Remove"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                          <tbody>
                            {tCusts.map(c=>(
                              <tr key={c.id}>
                                <td><div style={{fontWeight:700}}>{c.name}</div><div style={{fontSize:10,color:"#9ca3af"}}>{c.id}</div></td>
                                <td style={{color:"#6b7280"}}>{c.phone||"—"}</td>
                                <td style={{fontSize:11,color:"#6b7280",maxWidth:200}}>{c.address||"—"}</td>
                                <td>
                                  {c.address&&<button onClick={()=>navToAddress(c.address)}
                                    style={{background:"#0ea5e9",color:"#fff",border:"none",borderRadius:7,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                                    🗺 Navigate
                                  </button>}
                                </td>
                                <td>
                                  <button className="btn bgh" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>unassignCustomer(c.id)}>Remove</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>}
                    </div>
                  );
                })}

                {/* Unassigned customers */}
                {(()=>{
                  const unassigned=customers.filter(c=>!c.truck_id);
                  if(!unassigned.length) return null;
                  return(
                    <div className="card" style={{overflow:"hidden",borderTop:"3px solid #e5e7eb"}}>
                      <div style={{padding:"12px 16px",background:"#f9fafb",fontWeight:800,fontSize:13,color:"#9ca3af"}}>⚠️ UNASSIGNED ({unassigned.length})</div>
                      <table>
                        <thead><tr>{["Customer","Phone","Address","Assign"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                        <tbody>
                          {unassigned.map(c=>(
                            <tr key={c.id}>
                              <td style={{fontWeight:700}}>{c.name}</td>
                              <td style={{color:"#6b7280"}}>{c.phone||"—"}</td>
                              <td style={{fontSize:11,color:"#6b7280"}}>{c.address||"—"}</td>
                              <td>
                                <select defaultValue="" onChange={e=>{if(e.target.value){setAssignCid(c.id);setAssignTid(e.target.value);}}}
                                  style={{fontSize:11,border:"1.5px solid #e5e7eb",borderRadius:7,padding:"4px 8px",background:"#fff"}}>
                                  <option value="">Assign to…</option>
                                  {trucks.map(t=><option key={t.id} value={t.id}>{t.driver}</option>)}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </>}

              {/* -- RESET REQUESTS -- */}
              {tmTab==="resets"&&<>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#c2410c",marginBottom:4}}>🔄 Inventory Reset Requests</div>
                <div style={{fontSize:12,color:"#9ca3af",marginBottom:16}}>Review and approve driver requests to zero out truck inventory and return stock to warehouse.</div>

                {/* Pending requests */}
                {(()=>{
                  const pending=truckResets.filter(r=>r.status==="pending");
                  const reviewed=truckResets.filter(r=>r.status!=="pending");
                  return(<>
                    {pending.length===0&&<div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:"32px",textAlign:"center",marginBottom:16}}>
                      <div style={{fontSize:28,marginBottom:8}}>✅</div>
                      <div style={{fontWeight:700,color:"#374151",marginBottom:4}}>No pending reset requests</div>
                      <div style={{fontSize:12,color:"#9ca3af"}}>When a driver requests an inventory reset, it will appear here for your approval.</div>
                    </div>}

                    {pending.length>0&&<>
                      <div style={{fontSize:10,fontWeight:800,letterSpacing:".08em",color:"#c2410c",marginBottom:10}}>⏳ PENDING APPROVAL ({pending.length})</div>
                      {pending.map(req=>{
                        const truck=getT(req.truck_id);
                        const inv=truckInv(req.truck_id);
                        const actualRemaining=inv.reduce((a,i)=>a+i.remaining,0);
                        return(
                          <div key={req.id} className="card" style={{padding:20,marginBottom:12,borderLeft:"4px solid #f97316",background:"#fffbf5"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                              <div>
                                <div style={{fontWeight:800,fontSize:15,color:"#0a1628",marginBottom:4}}>
                                  🚚 {truck?.driver||req.driver_name} — {truck?.plate||""}
                                </div>
                                <div style={{fontSize:12,color:"#6b7280",marginBottom:2}}>Requested by: <strong>{req.requested_by||"Driver"}</strong></div>
                                <div style={{fontSize:12,color:"#6b7280",marginBottom:2}}>Requested at: {new Date(req.created_at).toLocaleString()}</div>
                                <div style={{fontSize:12,color:"#6b7280",marginBottom:8}}>{req.note||""}</div>
                                {/* Live inventory at time of review */}
                                {inv.length>0&&<div style={{background:"#fff",border:"1px solid #fed7aa",borderRadius:8,padding:"10px 14px",marginBottom:8}}>
                                  <div style={{fontSize:10,fontWeight:800,color:"#c2410c",letterSpacing:".06em",marginBottom:6}}>CURRENT TRUCK INVENTORY</div>
                                  {inv.map(i=>{const p=getP(i.pid);return(
                                    <div key={i.pid} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                                      <span style={{color:"#374151"}}>{p?.name||i.pid}</span>
                                      <span style={{fontWeight:700,color:i.remaining>0?"#c2410c":"#9ca3af"}}>{i.remaining} remaining (of {i.loaded} loaded)</span>
                                    </div>
                                  );})}
                                  <div style={{borderTop:"1px solid #fed7aa",marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:13}}>
                                    <span>Total to return to shelf</span>
                                    <span style={{color:"#c2410c"}}>{actualRemaining} units</span>
                                  </div>
                                </div>}
                              </div>
                              <div style={{display:"flex",flexDirection:"column",gap:8,minWidth:140}}>
                                <button onClick={()=>showConfirm(`Approve reset for ${truck?.driver||req.driver_name}?\n\n${actualRemaining} units will be returned to the warehouse shelf and the active load will be closed.`,()=>approveReset(req))}
                                  style={{background:"#059669",color:"#fff",border:"none",borderRadius:8,padding:"10px 18px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                                  ✅ Approve Reset
                                </button>
                                <button onClick={()=>showConfirm(`Reject reset request for ${truck?.driver||req.driver_name}? The truck inventory will remain unchanged.`,()=>rejectReset(req))}
                                  style={{background:"#fff",color:"#dc2626",border:"1.5px solid #fecaca",borderRadius:8,padding:"10px 18px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                                  ❌ Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>}

                    {/* History */}
                    {reviewed.length>0&&<>
                      <div style={{fontSize:10,fontWeight:800,letterSpacing:".08em",color:"#9ca3af",marginBottom:10,marginTop:20}}>HISTORY</div>
                      <div className="card" style={{overflow:"hidden"}}>
                        <table>
                          <thead><tr>{["Driver","Requested","Units","Status","Reviewed"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                          <tbody>
                            {reviewed.map(req=>(
                              <tr key={req.id}>
                                <td style={{fontWeight:600}}>{req.driver_name||getT(req.truck_id)?.driver||"—"}</td>
                                <td style={{fontSize:11,color:"#6b7280"}}>{new Date(req.created_at).toLocaleDateString()}</td>
                                <td style={{fontWeight:700}}>{req.remaining_units||"—"}</td>
                                <td><span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,
                                  background:req.status==="approved"?"#dcfce7":"#fef2f2",
                                  color:req.status==="approved"?"#065f46":"#dc2626"}}>
                                  {req.status==="approved"?"✅ Approved":"❌ Rejected"}
                                </span></td>
                                <td style={{fontSize:11,color:"#6b7280"}}>{req.reviewed_at?new Date(req.reviewed_at).toLocaleDateString():"—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>}
                  </>);
                })()}
              </>}

              {/* ── LIVE MAP ── */}
              {tmTab==="map"&&<>
                <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:10,padding:"12px 16px",marginBottom:12,fontSize:12,color:"#0369a1",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <span>🗺 <strong>OpenStreetMap + Leaflet</strong> — free, no API key.
                  {customers.filter(c=>c.address).length>0
                    ?<> Pins load ~1/sec. <strong>Click any pin</strong> for details.</>
                    :<span style={{color:"#dc2626"}}> ⚠️ No customers have addresses yet.</span>}
                  </span>
                  <button onClick={()=>{if(mapInst.current){mapInst.current.remove();mapInst.current=null;}setTmTab("overview");setTimeout(()=>setTmTab("map"),50);}}
                    style={{background:"#0ea5e9",color:"#fff",border:"none",borderRadius:7,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",whiteSpace:"nowrap"}}>
                    ↺ Refresh Map
                  </button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {[["🚚 Drivers Online",driverProfiles.filter(p=>p.last_seen&&(Date.now()-new Date(p.last_seen).getTime())<5*60*1000).length,"#059669","#f0fdf4"],
                    ["📍 Customers Mapped",customers.filter(c=>c.address).length,"#7c3aed","#f5f3ff"],
                    ["🚚 Total Trucks",trucks.length,"#0ea5e9","#f0f9ff"],
                    ["⚫ Offline",trucks.length-driverProfiles.filter(p=>p.last_seen&&(Date.now()-new Date(p.last_seen).getTime())<5*60*1000).length,"#9ca3af","#f9fafb"]
                  ].map(([l,v,c,bg])=>(
                    <div key={l} className="kpi" style={{background:bg,padding:"10px 14px"}}>
                      <div className="kv" style={{color:c,fontSize:20}}>{v}</div>
                      <div className="kl">{l}</div>
                    </div>
                  ))}
                </div>
                <div ref={mapRef} style={{width:"100%",height:480,borderRadius:12,border:"1px solid #e5e7eb",overflow:"hidden"}}/>
                <div style={{marginTop:8,fontSize:11,color:"#9ca3af",display:"flex",gap:16,flexWrap:"wrap"}}>
                  <span>🔵 Numbered pins = Customers</span>
                  <span>🚚 Blue truck = Driver location</span>
                  <span>Click any pin for details</span>
                </div>
              </>}
            </>);
          })()}</div>}

          {/* ══ RETURNED CHECKS ══ */}
          {tab==="returnedchecks"&&isAdmin&&<div className="fu">{(()=>{
            const rcPayments=payments.filter(p=>p.status==="returned_check");
            const flaggedCustomers=customers.filter(c=>hasReturnedCheck(c));
            return(<>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#212121"}}>🔴 Returned Checks</div>
                  <div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>Track returned checks, flagged customers, and penalty fees</div>
                </div>
              </div>

              {/* ── PENALTY SETTING ── */}
              <div className="card" style={{padding:20,marginBottom:16,borderLeft:"4px solid #dc2626"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#212121",marginBottom:4}}>💰 Returned Check Penalty Fee</div>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>This amount is automatically added to the customer's latest unpaid invoice when a check is returned.</div>
                <div style={{display:"flex",gap:10,alignItems:"center",maxWidth:340}}>
                  <div style={{position:"relative",flex:1}}>
                    <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,fontWeight:700,color:"#374151"}}>$</span>
                    <input type="number" min="0" step="1" value={penaltyEdit}
                      onChange={e=>setPenaltyEdit(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&savePenalty()}
                      style={{paddingLeft:28,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:20,width:"100%",border:"2px solid #fecaca",borderRadius:8,padding:"10px 12px 10px 28px",color:"#dc2626"}}/>
                  </div>
                  <button className="btn ba" onClick={savePenalty} disabled={penaltySaving} style={{background:"#dc2626",whiteSpace:"nowrap"}}>
                    {penaltySaving?"Saving…":"Save Penalty"}
                  </button>
                </div>
                <div style={{marginTop:8,fontSize:11,color:"#9ca3af"}}>Current: <strong style={{color:"#dc2626"}}>${co?.check_penalty||50}</strong></div>
              </div>

              {/* ── KPIs ── */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
                {[
                  {l:"Returned Checks",v:rcPayments.length,c:"#dc2626",bg:"#fef2f2"},
                  {l:"Flagged Customers",v:flaggedCustomers.length,c:"#f59e0b",bg:"#fffbeb"},
                  {l:"Total Penalties",v:fmt(sales.reduce((a,s)=>a+parseFloat(s.check_penalty_applied||0),0)),c:"#7c3aed",bg:"#f5f3ff"},
                ].map(k=>(
                  <div key={k.l} className="kpi" style={{background:k.bg,border:`1px solid ${k.c}30`}}>
                    <div className="kv" style={{color:k.c}}>{k.v}</div>
                    <div className="kl">{k.l}</div>
                  </div>
                ))}
              </div>

              {/* ── FLAGGED CUSTOMERS ── */}
              {flaggedCustomers.length>0&&<>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,color:"#92400e",letterSpacing:".06em",marginBottom:8}}>⚠️ FLAGGED CUSTOMERS</div>
                <div className="card" style={{marginBottom:16,overflow:"hidden"}}>
                  <table>
                    <thead><tr>
                      {["Customer","Phone","Returned Invoice","Penalty Applied To","Penalty Amt","Action"].map(h=><th key={h}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {flaggedCustomers.map(c=>{
                        const penaltySales=sales.filter(s=>s.cust_id===c.id&&s.check_penalty_applied>0);
                        const rcPmt=rcPayments.find(p=>sales.find(s=>s.id===p.sale_id&&s.cust_id===c.id));
                        const rcSaleId=rcPmt?.sale_id;
                        return(
                          <tr key={c.id}>
                            <td><div style={{fontWeight:700}}>{c.name}</div>{c.address&&<div style={{fontSize:10,color:"#9ca3af"}}>{c.address}</div>}</td>
                            <td style={{color:"#6b7280"}}>{c.phone||"—"}</td>
                            <td>
                              {rcSaleId?<span style={{background:"#fef2f2",color:"#dc2626",padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:700}}>{rcSaleId}</span>:<span style={{color:"#9ca3af",fontSize:11}}>—</span>}
                              {rcPmt?.returned_check_url&&<button onClick={()=>window.open(rcPmt.returned_check_url,"_blank")} style={{marginLeft:6,background:"none",border:"1px solid #fecaca",color:"#dc2626",borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700,cursor:"pointer"}}>📄 View</button>}
                            </td>
                            <td>
                              {penaltySales.length>0
                                ?penaltySales.map(s=><div key={s.id}><span style={{fontWeight:700,color:"#7c3aed",fontSize:11,cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{s.id}</span><span style={{fontSize:10,color:"#9ca3af",marginLeft:4}}>(+${s.check_penalty_applied} added)</span></div>)
                                :<span style={{color:"#9ca3af",fontSize:11}}>—</span>}
                            </td>
                            <td><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#dc2626"}}>${co?.check_penalty||50}</span></td>
                            <td><button className="btn bg" style={{fontSize:10,padding:"5px 10px"}} onClick={()=>clearReturnedCheck(c.id)}>✅ Clear Flag</button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>}

              {/* ── RETURNED CHECK HISTORY ── */}
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,color:"#991b1b",letterSpacing:".06em",marginBottom:8}}>📋 RETURNED CHECK HISTORY</div>
              {rcPayments.length===0
                ?<div className="card" style={{padding:32,textAlign:"center",color:"#9ca3af"}}>
                  <div style={{fontSize:28,marginBottom:6}}>✅</div>
                  <div style={{fontSize:13}}>No returned checks on record</div>
                </div>
                :<div className="card" style={{overflow:"hidden"}}>
                  <table>
                    <thead><tr>
                      {["Invoice","Customer","Driver","Date","Check Image","Penalty Applied"].map(h=><th key={h}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {rcPayments.map(p=>{
                        const sale=sales.find(s=>s.id===p.sale_id);
                        const cust=sale?getC(sale.cust_id):null;
                        const truck=sale?getT(sale.truck_id):null;
                        const penaltySale=sales.find(s=>s.check_penalty_invoice===p.sale_id);
                        return(
                          <tr key={p.sale_id}>
                            <td><span style={{fontWeight:700,color:"#7c3aed"}}>{p.sale_id}</span></td>
                            <td>{cust?.name||"—"}</td>
                            <td style={{color:"#6b7280"}}>{truck?.driver||"Walk-in"}</td>
                            <td style={{color:"#6b7280",fontSize:11}}>{sale?.date||"—"}</td>
                            <td>
                              {p.returned_check_url
                                ?<button onClick={()=>window.open(p.returned_check_url,"_blank")} style={{background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>📄 View Check</button>
                                :<span style={{color:"#9ca3af",fontSize:11}}>No image</span>}
                            </td>
                            <td>
                              {penaltySale
                                ?<div><span style={{fontWeight:700,color:"#dc2626"}}>${sale?.check_penalty_applied||co?.check_penalty||50}</span><span style={{fontSize:10,color:"#9ca3af",marginLeft:4}}>→ {penaltySale.id}</span></div>
                                :<span style={{fontSize:11,color:"#9ca3af"}}>Added to same invoice</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>}
            </>);
          })()}</div>}

          {/* ══ NEW USERS APPROVAL ══ */}
          {tab==="userapprovals"&&isAdmin&&<div className="fu">{(()=>{
            const pending=walkinRegs.filter(r=>r.status==="pending");
            const approved=walkinRegs.filter(r=>r.status==="approved");
            const rejected=walkinRegs.filter(r=>r.status==="rejected");

            const updateReg=async(id,status)=>{
              await supabase.from("walkin_registrations").update({status,reviewed_at:new Date().toISOString()}).eq("id",id);
              setWalkinRegs(prev=>prev.map(r=>r.id===id?{...r,status,reviewed_at:new Date().toISOString()}:r));
              showToast(status==="approved"?"✅ User approved":"❌ Request rejected");
            };

            const renderRegCard=(r)=>(
              <div key={r.id} className="card" style={{padding:"16px 18px",marginBottom:10,borderLeft:`4px solid ${r.status==="approved"?"#059669":r.status==="rejected"?"#dc2626":"#7c3aed"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:"#0a1628",marginBottom:3}}>{r.name}</div>
                    <div style={{fontSize:12,color:"#6b7280",marginBottom:2}}>📧 {r.email} · 📞 {r.phone}</div>
                    <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginTop:4}}>
                      <span className="bdg" style={{background:"#f5f3ff",color:"#5b21b6",border:"1px solid #ddd6fe",textTransform:"capitalize"}}>{r.role}</span>
                      <span className="bdg" style={{background:r.status==="approved"?"#ecfdf5":r.status==="rejected"?"#fef2f2":"#fef9c3",color:r.status==="approved"?"#065f46":r.status==="rejected"?"#991b1b":"#92400e",border:`1px solid ${r.status==="approved"?"#a7f3d0":r.status==="rejected"?"#fecaca":"#fde68a"}`}}>{r.status}</span>
                      {r.note&&<span style={{fontSize:11,color:"#9ca3af",fontStyle:"italic"}}>"{r.note}"</span>}
                    </div>
                    <div style={{fontSize:11,color:"#9ca3af",marginTop:4}}>{new Date(r.created_at).toLocaleString()}</div>
                  </div>
                  <div style={{display:"flex",gap:8,flexShrink:0}}>
                    {r.status==="pending"&&<><button className="btn bg" onClick={()=>updateReg(r.id,"approved")}>✅ Approve</button><button className="btn br" onClick={()=>updateReg(r.id,"rejected")}>❌ Reject</button></>}
                    {r.status==="approved"&&<button className="btn br" onClick={()=>updateReg(r.id,"rejected")}>Revoke</button>}
                    {r.status==="rejected"&&<button className="btn bg" onClick={()=>updateReg(r.id,"approved")}>Approve</button>}
                  </div>
                </div>
              </div>
            );

            return(<>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#212121"}}>👥 New Users Approval</div>
                  <div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>Walk-in access requests from staff, receptionists, and managers</div>
                </div>
                <button className="btn bb" onClick={()=>loadAll()}>↻ Refresh</button>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                {[{l:"Pending",v:pending.length,c:"#f59e0b",bg:"#fffbeb"},{l:"Approved",v:approved.length,c:"#059669",bg:"#ecfdf5"},{l:"Rejected",v:rejected.length,c:"#dc2626",bg:"#fef2f2"}].map(k=>(
                  <div key={k.l} className="kpi" style={{background:k.bg,borderColor:k.c+"40"}}>
                    <div className="kv" style={{color:k.c}}>{k.v}</div>
                    <div className="kl">{k.l}</div>
                  </div>
                ))}
              </div>

              {pending.length>0&&<>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,color:"#92400e",letterSpacing:".06em",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                  ⏳ PENDING REVIEW <span style={{background:"#f59e0b",color:"#fff",borderRadius:10,fontSize:10,padding:"1px 7px",fontWeight:700}}>{pending.length}</span>
                </div>
                {pending.map(r=>renderRegCard(r))}
              </>}

              {pending.length===0&&<div className="card" style={{padding:28,textAlign:"center",color:"#9ca3af",marginBottom:16}}>
                <div style={{fontSize:28,marginBottom:6}}>✅</div>
                <div style={{fontSize:13}}>No pending requests</div>
              </div>}

              {approved.length>0&&<>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,color:"#065f46",letterSpacing:".06em",marginBottom:8,marginTop:16}}>✅ APPROVED</div>
                {approved.map(r=>renderRegCard(r))}
              </>}

              {rejected.length>0&&<>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,color:"#991b1b",letterSpacing:".06em",marginBottom:8,marginTop:16}}>❌ REJECTED</div>
                {rejected.map(r=>renderRegCard(r))}
              </>}

              {walkinRegs.length===0&&<div className="card" style={{padding:40,textAlign:"center",color:"#9ca3af"}}>
                <div style={{fontSize:32,marginBottom:8}}>📋</div>
                <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>No access requests yet</div>
                <div style={{fontSize:12}}>Walk-in registrations from the portal will appear here</div>
              </div>}
            </>);
          })()}</div>}

          {/* ══ SETTINGS ══ */}
          {/* ══ AUDIT LOG ══ */}
          {tab==="auditlog"&&isAdmin&&<div className="fu">
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,marginBottom:4}}>🔍 Audit Log</div>
            <div style={{fontSize:12,color:"#9ca3af",marginBottom:16}}>Every significant action taken in the system — who did it, what changed, and when.</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
              {[{l:"Total Events",v:auditLog.length,c:"#7c3aed"},{l:"Today",v:auditLog.filter(e=>new Date(e.created_at).toDateString()===new Date().toDateString()).length,c:"#0ea5e9"},{l:"This Week",v:auditLog.filter(e=>{const d=new Date(e.created_at);const w=new Date();w.setDate(w.getDate()-7);return d>=w;}).length,c:"#059669"},{l:"Users Active",v:[...new Set(auditLog.map(e=>e.user_email))].length,c:"#f59e0b"}].map(k=>(
                <div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>
              ))}
            </div>
            {auditLog.length===0
              ?<div className="card" style={{padding:40,textAlign:"center",color:"#9ca3af"}}>
                  <div style={{fontSize:32,marginBottom:8}}>🔍</div>
                  <div style={{fontWeight:600}}>No audit events yet</div>
                  <div style={{fontSize:12,marginTop:4}}>Events are recorded automatically as you use the system</div>
                </div>
              :<div className="card" style={{overflow:"hidden"}}>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr style={{background:"#0a1628",color:"#fff"}}>
                      {["Time","User","Action","Entity","Detail"].map(h=>(
                        <th key={h} style={{padding:"9px 13px",textAlign:"left",fontSize:10,fontWeight:700}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {auditLog.map((e,i)=>{
                        const actionColor={ADD:"#059669",EDIT:"#7c3aed",DELETE:"#dc2626",PAY:"#0ea5e9",UNPAY:"#f59e0b"}[e.action]||"#6b7280";
                        return(
                          <tr key={e.id||i} style={{borderBottom:"1px solid #f3f4f6",background:i%2===0?"#fff":"#fafafa"}}>
                            <td style={{padding:"8px 13px",fontSize:11,color:"#6b7280",whiteSpace:"nowrap"}}>{new Date(e.created_at).toLocaleString()}</td>
                            <td style={{padding:"8px 13px",fontSize:11,fontWeight:600,color:"#0a1628"}}>{e.user_email}</td>
                            <td style={{padding:"8px 13px"}}><span style={{background:`${actionColor}18`,color:actionColor,padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:700}}>{e.action}</span></td>
                            <td style={{padding:"8px 13px",fontSize:11,color:"#6b7280"}}>{e.entity}</td>
                            <td style={{padding:"8px 13px",fontSize:11,color:"#6b7280",maxWidth:300,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.detail}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            }
          </div>}

          {tab==="settings"&&isAdmin&&<div className="fu">
            <div style={{maxWidth:540}}>
              <div className="card" style={{padding:22,marginBottom:14}}>
                <div className="sh">Company Information</div>
                {coEdit&&<div style={{display:"flex",flexDirection:"column",gap:11}}>
                  {[{l:"Company Name",k:"name"},{l:"Address",k:"address"},{l:"Phone",k:"phone"},{l:"Email",k:"email"},{l:`Default Tax Rate (%)`,k:"tax_rate"},{l:"Stripe Payment Link (for driver card QR)",k:"stripe_payment_link"}].map(f=>(
                    <div key={f.k}><label>{f.l}</label><input value={coEdit[f.k]||""} onChange={e=>setCoEdit(prev=>({...prev,[f.k]:e.target.value}))}/></div>
                  ))}
                  <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:10,padding:"14px 16px"}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#0369a1",marginBottom:10}}>✉️ Email Notifications (Gmail SMTP)</div>
                    <div style={{fontSize:11,color:"#6b7280",marginBottom:10,lineHeight:1.6}}>
                      Uses your Gmail account to send invoices and reminders. Requires a Gmail <strong>App Password</strong> — not your regular Gmail password.<br/>
                      <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" style={{color:"#0369a1"}}>Get App Password →</a> (requires 2FA to be enabled on your Google account)
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      <div><label>Gmail Address</label><input type="email" placeholder="yourname@gmail.com or you@yourdomain.com" value={coEdit.gmail_user||""} onChange={e=>setCoEdit(prev=>({...prev,gmail_user:e.target.value,from_email:e.target.value}))}/></div>
                      <div><label>Gmail App Password (16 characters, no spaces)</label><input type="password" placeholder="xxxx xxxx xxxx xxxx" value={coEdit.gmail_app_password||""} onChange={e=>setCoEdit(prev=>({...prev,gmail_app_password:e.target.value.replace(/\s/g,"")}))}/>
                        <div style={{fontSize:10,color:"#9ca3af",marginTop:3}}>Google Account → Security → 2-Step Verification → App passwords → Create</div>
                      </div>
                      <div><label>Display Name (shown in From field)</label><input placeholder={coEdit.name||"VitalWaveOne LLC"} value={coEdit.from_email||""} onChange={e=>setCoEdit(prev=>({...prev,from_email:e.target.value}))}/>
                        <div style={{fontSize:10,color:"#9ca3af",marginTop:3}}>Usually same as your Gmail address</div>
                      </div>
                      <div style={{display:"flex",gap:8,flexDirection:"column"}}>
                        <label style={{margin:0,fontWeight:500,fontSize:12,display:"flex",alignItems:"center",gap:6}}>
                          <input type="checkbox" checked={!!coEdit.email_invoices} onChange={e=>setCoEdit(prev=>({...prev,email_invoices:e.target.checked}))} style={{marginRight:2}}/>
                          Auto-email invoice to customer after every sale
                        </label>
                        <label style={{margin:0,fontWeight:500,fontSize:12,display:"flex",alignItems:"center",gap:6}}>
                          <input type="checkbox" checked={!!coEdit.email_reminders} onChange={e=>setCoEdit(prev=>({...prev,email_reminders:e.target.checked}))} style={{marginRight:2}}/>
                          Send overdue payment reminders (30 / 60 / 90 days)
                        </label>
                      </div>
                      {coEdit.gmail_user&&coEdit.gmail_app_password&&(
                        <div style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:7,padding:"8px 12px",fontSize:11,color:"#065f46"}}>
                          ✅ Configured — emails will send from <strong>{coEdit.gmail_user}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tax Enable/Disable Toggle */}
                  <div style={{background:co?.tax_enabled?"#f0fdf4":"#fef2f2",border:`1px solid ${co?.tax_enabled?"#a7f3d0":"#fecaca"}`,borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:"#212121"}}>🏛 Tax Collection</div>
                      <div style={{fontSize:11,color:"#6b7280",marginTop:3}}>
                        {co?.tax_enabled?"Tax is ON — Tobacco/Nicotine only, per state rate":"Tax is OFF — All invoices show $0 tax"}
                      </div>
                    </div>
                    <button
                      onClick={async()=>{
                        const newVal=!co?.tax_enabled;
                        await supabase.from("company").update({tax_enabled:newVal}).eq("id",co.id);
                        setCo(prev=>({...prev,tax_enabled:newVal}));
                        setCoEdit(prev=>({...prev,tax_enabled:newVal}));
                        showToast(newVal?"✅ Tax collection ENABLED":"🚫 Tax collection DISABLED");
                      }}
                      style={{padding:"10px 20px",borderRadius:8,border:"none",background:co?.tax_enabled?"#059669":"#dc2626",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Barlow',sans-serif",minWidth:100}}>
                      {co?.tax_enabled?"Disable Tax":"Enable Tax"}
                    </button>
                  </div>

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
                  <button className="btn bgh" style={{fontSize:11}} onClick={()=>{
                    const rows=[["customer_id","customer_name",...products.map(p=>p.name)],
                      ...customers.map(c=>[c.id,c.name,...products.map(p=>{
                        try{const n=c.notes||"";const m=n.match(/CUSTOM_PRICES:({.*?})/);const cp=m?JSON.parse(m[1]):{};return cp[p.id]||"";}catch{return "";}
                      })])];
                    const csv=rows.map(r=>r.join(",")).join("\n");
                    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);
                    a.download="custom_prices_template.csv";a.click();showToast("Template downloaded");
                  }}>📥 Price Template</button>
                  <label className="btn bgh" style={{fontSize:11,cursor:"pointer"}}>
                    📤 Import Prices
                    <input type="file" accept=".csv" style={{display:"none"}} onChange={async e=>{
                      const file=e.target.files[0];if(!file)return;
                      const text=await file.text();
                      const rows=text.split("\n").map(r=>r.split(","));
                      const headers=rows[0];
                      const prodHeaders=headers.slice(2);
                      let updated=0;
                      for(const row of rows.slice(1)){
                        if(!row[0]||!row[0].trim())continue;
                        const cid=row[0].trim();
                        const cp={};
                        prodHeaders.forEach((ph,i)=>{
                          const v=parseFloat(row[i+2]);
                          if(!isNaN(v)&&v>0){const p=products.find(x=>x.name===ph.trim());if(p)cp[p.id]=v;}
                        });
                        if(Object.keys(cp).length>0){
                          const cust=customers.find(c=>c.id===cid);
                          if(cust){
                            const baseNotes=(cust.notes||"").replace(/CUSTOM_PRICES:\{[^{}]*\}/g,"").trim();
                            const newNotes=baseNotes+(baseNotes?"\n":"")+"CUSTOM_PRICES:"+JSON.stringify(cp);
                            await supabase.from("customers").update({notes:newNotes}).eq("id",cid);
                            setCustomers(prev=>prev.map(c=>c.id===cid?{...c,notes:newNotes}:c));
                            updated++;
                          }
                        }
                      }
                      showToast("✅ Custom prices updated for "+updated+" customers");
                      e.target.value="";
                    }}/>
                  </label>
                </div>
              </div>
              {/* Warehouse / Storage Locations */}
              <div className="card" style={{padding:22,marginBottom:14}}>
                <div className="sh">🏢 Warehouse / Storage Locations</div>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>Define storage locations for multi-warehouse tracking. Selected during restock to track where inventory comes from.</div>
                {warehouses.map((w,i)=>(
                  <div key={w.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,marginBottom:8,alignItems:"center"}}>
                    <input placeholder="Location name" value={w.name} onChange={e=>setWarehouses(prev=>prev.map((x,xi)=>xi===i?{...x,name:e.target.value}:x))}/>
                    <input placeholder="Address (optional)" value={w.location} onChange={e=>setWarehouses(prev=>prev.map((x,xi)=>xi===i?{...x,location:e.target.value}:x))}/>
                    {i>0?<button onClick={()=>setWarehouses(prev=>prev.filter((_,xi)=>xi!==i))} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:"6px 10px",color:"#dc2626",cursor:"pointer",fontSize:12,fontWeight:700}}>✕</button>:<div/>}
                  </div>
                ))}
                <button className="btn bb" onClick={()=>setWarehouses(prev=>[...prev,{id:`wh-${Date.now()}`,name:"",location:""}])}>+ Add Location</button>
              </div>

              {/* Order Portal Link */}
              <div className="card" style={{padding:22,marginBottom:14}}>
                <div className="sh">Order Portal Link</div>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>Share this link with your gas station customers so they can place orders:</div>
                <div style={{background:"#f9fafb",border:"1px solid #1a2e40",borderRadius:8,padding:"11px 14px",fontSize:13,color:"#059669",fontFamily:"monospace",wordBreak:"break-all"}}>
                  {window.location.origin+"/order"}
                </div>
                <button className="btn bb" style={{marginTop:10}} onClick={()=>{navigator.clipboard.writeText(window.location.origin+"/order");showToast("Link copied!");}}>Copy Link</button>
              </div>

              {/* Driver Truck Assignment */}
              <div className="card" style={{padding:22,marginBottom:14}}>
                <div className="sh">🚚 Driver Truck Assignment</div>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:14}}>Assign each driver to their truck using the dropdown — no manual typing, no typos.</div>
                <DriverTruckAssignment supabase={supabase} trucks={trucks} showToast={showToast}/>
              </div>

              {/* System Reset */}
              <div className="card" style={{padding:22,marginBottom:14,borderTop:"3px solid #dc2626"}}>
                <div className="sh" style={{color:"#dc2626"}}>⚠️ System Reset</div>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:16,lineHeight:1.6}}>
                  Reset invoice numbering or wipe all transaction data to start fresh. Company info, products, trucks, and customers are preserved.
                </div>

                {sysResetStep===0&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {/* Option 1: Reset invoice counter only */}
                  <div style={{background:"#fff7ed",border:"1.5px solid #fed7aa",borderRadius:10,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:"#c2410c"}}>Reset Invoice Number to #1</div>
                      <div style={{fontSize:11,color:"#9a3412",marginTop:3}}>Next invoice will be INV-0001. All existing invoices are kept. Use this when starting a new billing period.</div>
                    </div>
                    <button onClick={()=>showConfirm("Reset invoice counter to #1? All existing invoices are kept — only the numbering sequence resets. Next invoice created will be INV-0001.",async()=>{
                      try{
                        await supabase.rpc("reset_invoice_sequence");
                        showToast("Invoice counter reset to #1 — next invoice will be INV-0001");
                      }catch(e){
                        // Fallback: try direct SQL via RPC doesn't exist yet — show SQL
                        showToast("Run this SQL in Supabase: SELECT setval('invoice_number_seq', 1, false);","error");
                      }
                    })}
                      style={{background:"#c2410c",color:"#fff",border:"none",borderRadius:8,padding:"10px 18px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",whiteSpace:"nowrap"}}>
                      Reset Counter
                    </button>
                  </div>

                  {/* Option 2: Full data wipe */}
                  <div style={{background:"#fef2f2",border:"1.5px solid #fecaca",borderRadius:10,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:"#dc2626"}}>Full Transaction Reset</div>
                      <div style={{fontSize:11,color:"#b91c1c",marginTop:3}}>Deletes ALL sales, invoices, payments, loads, returns, orders. Restores all inventory back to shelf. Keeps products, customers, trucks.</div>
                    </div>
                    <button onClick={()=>setSysResetStep(1)}
                      style={{background:"#dc2626",color:"#fff",border:"none",borderRadius:8,padding:"10px 18px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",whiteSpace:"nowrap"}}>
                      Full Reset...
                    </button>
                  </div>
                </div>}

                {sysResetStep===1&&<div style={{background:"#fef2f2",border:"2px solid #dc2626",borderRadius:10,padding:20}}>
                  <div style={{fontWeight:800,fontSize:15,color:"#dc2626",marginBottom:8}}>⚠️ THIS CANNOT BE UNDONE</div>
                  <div style={{fontSize:12,color:"#374151",marginBottom:16,lineHeight:1.7}}>
                    This will permanently delete:<br/>
                    - All sales and invoices<br/>
                    - All payments and payment logs<br/>
                    - All truck loads and returns<br/>
                    - All customer orders<br/>
                    - All truck reset requests<br/>
                    - All returned check records<br/><br/>
                    <strong>Shelf stock will be restored</strong> from all open loads.<br/>
                    <strong>Products, customers, and trucks are NOT deleted.</strong>
                  </div>
                  <div style={{marginBottom:14}}>
                    <label style={{fontSize:12,fontWeight:700,color:"#dc2626",display:"block",marginBottom:6}}>Type RESET to confirm:</label>
                    <input id="resetConfirmInput" autoFocus
                      style={{border:"2px solid #dc2626",borderRadius:8,padding:"10px 14px",fontSize:14,fontWeight:700,width:"100%",fontFamily:"'Barlow',sans-serif"}}
                      placeholder="Type RESET here..."/>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={()=>setSysResetStep(0)}
                      style={{flex:1,padding:"11px",border:"1.5px solid #e5e7eb",borderRadius:8,background:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                      Cancel
                    </button>
                    <button onClick={async()=>{
                      const val=document.getElementById("resetConfirmInput")?.value||"";
                      if(val.trim()!=="RESET") return showToast("Type RESET to confirm","error");
                      setSysResetStep(2);
                      try{
                        // Step 1: Return all open load inventory to shelf
                        const openLoads=loads.filter(l=>l.status==="out");
                        const allLoadIds=new Set(openLoads.map(l=>l.id));
                        const loadedMap={};
                        openLoads.forEach(load=>(load.items||[]).forEach(i=>{loadedMap[i.pid]=(loadedMap[i.pid]||0)+i.qty;}));
                        const soldMap={};
                        sales.filter(s=>allLoadIds.has(s.load_id)).forEach(s=>(s.items||[]).forEach(i=>{soldMap[i.pid]=(soldMap[i.pid]||0)+i.qty;}));
                        const retMap={};
                        returns.filter(r=>allLoadIds.has(r.load_id)).forEach(r=>(r.items||[]).forEach(i=>{retMap[i.pid]=(retMap[i.pid]||0)+i.qty;}));
                        const shelfRestores=Object.entries(loadedMap)
                          .map(([pid,loaded])=>({pid,remaining:Math.max(0,loaded-(soldMap[pid]||0)-(retMap[pid]||0))}))
                          .filter(i=>i.remaining>0&&getP(i.pid));
                        if(shelfRestores.length>0){
                          await Promise.all(shelfRestores.map(i=>supabase.from("products")
                            .update({shelf:Math.max(0,(getP(i.pid)?.shelf||0)+i.remaining)}).eq("id",i.pid)));
                        }
                        // Step 2: Delete all transaction tables
                        await supabase.from("truck_resets").delete().neq("id","__none__");
                        await supabase.from("payments_log").delete().neq("id","__none__");
                        await supabase.from("payments").delete().neq("id","__none__");
                        await supabase.from("orders").delete().neq("id","__none__");
                        await supabase.from("returns").delete().neq("id","__none__");
                        await supabase.from("sales").delete().neq("id","__none__");
                        await supabase.from("loads").delete().neq("id","__none__");
                        await supabase.from("expenses").delete().neq("id","__none__");
                        // Step 3: Reset invoice sequence
                        try{ await supabase.rpc("reset_invoice_sequence"); }catch{}
                        // Step 4: Update local state
                        setProducts(prev=>prev.map(p=>{const r=shelfRestores.find(i=>i.pid===p.id);return r?{...p,shelf:p.shelf+r.remaining}:p;}));
                        setSales([]);setPayments([]);setPaymentsLog([]);setOrders([]);setLoads([]);setReturns([]);setExpenses([]);setTruckResets([]);
                        setSysResetStep(3);
                      }catch(e){showToast("Reset error: "+e.message,"error");setSysResetStep(1);}
                    }}
                      style={{flex:1,padding:"11px",border:"none",borderRadius:8,background:"#dc2626",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                      Delete Everything & Reset
                    </button>
                  </div>
                </div>}

                {sysResetStep===2&&<div style={{textAlign:"center",padding:"30px 20px"}}>
                  <div style={{fontSize:32,marginBottom:12}}>⏳</div>
                  <div style={{fontWeight:700,fontSize:14,color:"#374151"}}>Resetting system...</div>
                  <div style={{fontSize:12,color:"#9ca3af",marginTop:6}}>Returning inventory to shelf and clearing all transaction data.</div>
                </div>}

                {sysResetStep===3&&<div style={{textAlign:"center",padding:"30px 20px"}}>
                  <div style={{fontSize:40,marginBottom:12}}>✅</div>
                  <div style={{fontWeight:800,fontSize:16,color:"#059669",marginBottom:8}}>System Reset Complete</div>
                  <div style={{fontSize:12,color:"#6b7280",marginBottom:20}}>All transactions cleared. Invoice counter reset to #1. Shelf inventory restored.</div>
                  <button onClick={()=>setSysResetStep(0)}
                    style={{background:"#0a1628",color:"#fff",border:"none",borderRadius:8,padding:"11px 28px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                    Done
                  </button>
                </div>}
              </div>
            </div>
          </div>}

          </div>
        </div>
      </div>

      {/* ════ MODALS ════ */}

      {/* ── CSV IMPORT MODAL ── */}
      {modal==="csvImport"&&<Modal title="📥 Import Products from CSV" onClose={()=>{setModal(null);setCsvPreview([]);setCsvErrors([]);}} wide>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* Template download */}
          <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontWeight:700,fontSize:13,color:"#7c3aed",marginBottom:6}}>📋 Step 1 — Download Template</div>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:10,lineHeight:1.6}}>
              Use this template to fill in your products. Required columns: <strong>name, sku, price, cost</strong><br/>
              Optional: cat (category), unit, shelf (initial quantity)
            </div>
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:7,padding:"10px 14px",fontFamily:"monospace",fontSize:11,color:"#374151",marginBottom:10}}>
              name, sku, cat, unit, cost, price, shelf<br/>
              Royal Honey 24pk, 122151456+6, tobacco, Case/24, 8.00, 15.00, 100<br/>
              Pop Cake Box, 654789963, nicotine, Box/10, 4.00, 8.00, 50<br/>
              Energy Drink 12pk, 049000050103, beverage, Case/12, 12.00, 20.00, 30
            </div>
            <button className="btn ba" onClick={downloadTemplate}>⬇️ Download Template CSV</button>
          </div>

          {/* File upload */}
          <div style={{background:"#f9fafb",border:"2px dashed #d1d5db",borderRadius:10,padding:"20px",textAlign:"center"}}>
            <div style={{fontWeight:700,fontSize:13,color:"#212121",marginBottom:6}}>📂 Step 2 — Upload Your CSV File</div>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>Fill the template with your products and upload it here</div>
            <input type="file" accept=".csv,text/csv" onChange={handleCSVFile}
              style={{display:"block",margin:"0 auto",fontSize:12,fontFamily:"'Barlow',sans-serif"}}/>
          </div>

          {/* Errors */}
          {csvErrors.length>0&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontWeight:700,fontSize:12,color:"#dc2626",marginBottom:6}}>⚠️ {csvErrors.length} Error{csvErrors.length!==1?"s":""} Found</div>
            {csvErrors.map((e,i)=><div key={i} style={{fontSize:11,color:"#dc2626",marginBottom:2}}>• {e}</div>)}
          </div>}

          {/* Preview */}
          {csvPreview.length>0&&<div>
            <div style={{fontWeight:700,fontSize:13,color:"#212121",marginBottom:8}}>
              ✅ Step 3 — Preview & Import
              <span style={{fontWeight:400,fontSize:11,color:"#6b7280",marginLeft:8}}>{csvPreview.length} products ready to import</span>
            </div>
            {/* Duplicate warning */}
            {csvPreview.some(r=>products.find(p=>p.sku===r.sku))&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:7,padding:"8px 12px",fontSize:12,color:"#92400e",marginBottom:10}}>
              ⚠️ {csvPreview.filter(r=>products.find(p=>p.sku===r.sku)).length} product(s) with matching SKU will be <strong>updated</strong>, not duplicated
            </div>}
            <div style={{maxHeight:280,overflowY:"auto",border:"1px solid #e5e7eb",borderRadius:8}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr>{["Name","SKU","Category","Unit","Cost","Price","Shelf","Status"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",fontSize:10,color:"#6b7280",fontWeight:700,letterSpacing:".08em",borderBottom:"1px solid #e5e7eb",background:"#f9fafb"}}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {csvPreview.map((r,i)=>{
                    const isDupe=products.find(p=>p.sku===r.sku);
                    return(
                      <tr key={i} style={{background:isDupe?"#fffbeb":"#fff"}}>
                        <td style={{padding:"7px 12px",fontSize:12,fontWeight:600,color:"#212121",borderBottom:"1px solid #f3f4f6"}}>{r.name}</td>
                        <td style={{padding:"7px 12px",fontSize:11,fontFamily:"monospace",color:"#6b7280",borderBottom:"1px solid #f3f4f6"}}>{r.sku}</td>
                        <td style={{padding:"7px 12px",fontSize:11,color:"#6b7280",borderBottom:"1px solid #f3f4f6"}}>{r.cat}</td>
                        <td style={{padding:"7px 12px",fontSize:11,color:"#6b7280",borderBottom:"1px solid #f3f4f6"}}>{r.unit}</td>
                        <td style={{padding:"7px 12px",fontSize:12,borderBottom:"1px solid #f3f4f6"}}>${r.cost.toFixed(2)}</td>
                        <td style={{padding:"7px 12px",fontSize:12,fontWeight:700,color:"#059669",borderBottom:"1px solid #f3f4f6"}}>${r.price.toFixed(2)}</td>
                        <td style={{padding:"7px 12px",fontSize:12,color:"#7c3aed",fontWeight:600,borderBottom:"1px solid #f3f4f6"}}>{r.shelf}</td>
                        <td style={{padding:"7px 12px",borderBottom:"1px solid #f3f4f6"}}>
                          {isDupe?<span className="bdg ba2">UPDATE</span>:<span className="bdg bg2">NEW</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{display:"flex",gap:8,marginTop:12,justifyContent:"flex-end"}}>
              <button className="btn bgh" onClick={()=>{setCsvPreview([]);setCsvErrors([]);}}>Clear</button>
              <button className="btn ba" onClick={importCSV} disabled={csvImporting}>
                {csvImporting?<><svg className="spin" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Importing…</>:`📥 Import ${csvPreview.length} Products`}
              </button>
            </div>
          </div>}
        </div>
      </Modal>}

      {modal==="addProduct"&&<Modal title="📦 Add New Product" onClose={()=>setModal(null)}>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label>Product Name *</label><input placeholder="e.g. Red Bull 250ml" value={np.name} onChange={e=>setNp(p=>({...p,name:e.target.value}))}/></div>
            <div><label>SKU *</label><input placeholder="e.g. RB-250" value={np.sku} onChange={e=>setNp(p=>({...p,sku:e.target.value}))}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <div><label>Category</label><select value={np.cat} onChange={e=>setNp(p=>({...p,cat:e.target.value}))}>{["Beverage","Tobacco","Snack","Health","Misc","Other"].map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label>Sell By</label><select value={np.unit} onChange={e=>setNp(p=>({...p,unit:e.target.value}))}>
              {["Case","Pack","Carton","Box","Each","Bag","Bottle","Can"].map(u=><option key={u}>{u}</option>)}
            </select></div>
            <div><label>Units per Case</label><input type="number" min="1" placeholder="24" value={np.case_qty} onChange={e=>setNp(p=>({...p,case_qty:e.target.value}))}/></div>
          </div>
          {np.case_qty>1&&np.price&&<div style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:7,padding:"8px 12px",fontSize:11,color:"#065f46"}}>
            📦 {np.unit} price: <strong>${parseFloat(np.price).toFixed(2)}</strong> · Per unit: <strong>${(parseFloat(np.price)/(parseInt(np.case_qty)||1)).toFixed(2)}</strong>
          </div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <div><label>Cost ($) *</label><input type="number" min="0" step="0.01" placeholder="0.00" value={np.cost} onChange={e=>setNp(p=>({...p,cost:e.target.value}))}/></div>
            <div><label>Price ($) *</label><input type="number" min="0" step="0.01" placeholder="0.00" value={np.price} onChange={e=>setNp(p=>({...p,price:e.target.value}))}/></div>
            <div><label>Starting Stock</label><input type="number" min="0" placeholder="0" value={np.shelf} onChange={e=>setNp(p=>({...p,shelf:e.target.value}))}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label>Reorder Alert At (units)</label><input type="number" min="0" placeholder="5" value={np.reorder_point} onChange={e=>setNp(p=>({...p,reorder_point:e.target.value}))}/></div>
            <div style={{display:"flex",alignItems:"flex-end"}}><div style={{fontSize:11,color:"#6b7280",padding:"8px 0"}}>⚠️ Alert fires when shelf stock hits this number</div></div>
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
        <div style={{background:"#f9fafb",border:"1.5px solid #7c3aed",borderRadius:12,padding:"16px"}}>
          <div style={{fontWeight:700,fontSize:13,color:"#7c3aed",marginBottom:12}}>🏪 New Customer Registration</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[
              {label:"Shop / Business Name *",key:"name",placeholder:"e.g. Corner Gas Station",type:"text"},
              {label:"Phone Number *",key:"phone",placeholder:"e.g. 3175096262",type:"tel"},
              {label:"Email *",key:"email",placeholder:"e.g. shop@email.com",type:"email"},
              {label:"Street Address *",key:"address",placeholder:"e.g. 123 Main Street",type:"text"},
              {label:"City *",key:"city",placeholder:"e.g. Indianapolis",type:"text"},
            ].map(f=>(
              <div key={f.key}>
                <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>{f.label}</label>
                <input type={f.type} value={nc[f.key]||""} onChange={e=>setNc(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder}
                  style={{width:"100%",border:`1.5px solid ${nc[f.key]?"#7c3aed":"#e5e7eb"}`,borderRadius:8,padding:"10px 12px",fontSize:13,boxSizing:"border-box"}}/>
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>ZIP Code *</label>
                <input type="text" maxLength={10} value={nc.zip||""} onChange={e=>setNc(p=>({...p,zip:e.target.value.replace(/[^0-9-]/g,"")}))} placeholder="e.g. 46201"
                  style={{width:"100%",border:`1.5px solid ${nc.zip?"#7c3aed":"#e5e7eb"}`,borderRadius:8,padding:"10px 12px",fontSize:13,boxSizing:"border-box"}}/>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>State *</label>
                <select value={nc.state||""} onChange={e=>setNc(p=>({...p,state:e.target.value}))}
                  style={{width:"100%",border:`1.5px solid ${nc.state?"#7c3aed":"#e5e7eb"}`,borderRadius:8,padding:"10px 12px",fontSize:13}}>
                  <option value="">— State —</option>
                  {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {nc.state&&(()=>{const st=stateTaxes.find(x=>x.id===nc.state);return st?(
              <div style={{fontSize:11,color:st.exempt?"#059669":"#854d0e",background:st.exempt?"#f0fdf4":"#fef9c3",padding:"6px 10px",borderRadius:6}}>
                {st.exempt?`[OK] ${nc.state}  -  Tax Exempt`:`🏛 ${nc.state}  -  ${st.rate}% tobacco/vape tax`}
              </div>
            ):(
              <div style={{fontSize:11,color:"#9ca3af"}}>ℹ️ {nc.state} — No tax rate configured yet</div>
            );})()}
            <div>
              <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>Assign to Truck</label>
              <select value={nc.truck_id||""} onChange={e=>setNc(p=>({...p,truck_id:e.target.value}))} style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px",fontSize:13}}>
                <option value="">— No truck assigned —</option>
                {trucks.map(t=><option key={t.id} value={t.id}>{t.driver} · {t.plate}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>Notes (optional)</label>
              <input value={nc.notes||""} onChange={e=>setNc(p=>({...p,notes:e.target.value}))} placeholder="Optional notes..."
                style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px",fontSize:13,boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>💳 Credit Limit ($) — 0 = unlimited</label>
              <input type="number" min="0" step="0.01" value={nc.credit_limit||""} onChange={e=>setNc(p=>({...p,credit_limit:e.target.value}))} placeholder="e.g. 500.00 — leave blank for unlimited"
                style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px",fontSize:13,boxSizing:"border-box"}}/>
              {nc.credit_limit>0&&<div style={{fontSize:11,color:"#854d0e",marginTop:4}}>⚠️ Driver will be warned when this customer's unpaid balance exceeds {fmt(parseFloat(nc.credit_limit)||0)}</div>}
            </div>
            {/* Custom Pricing */}
            <div style={{background:"#f5f3ff",border:"1.5px solid #ddd6fe",borderRadius:10,padding:"12px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <label style={{fontSize:11,fontWeight:700,color:"#7c3aed",display:"block"}}>💰 Custom Pricing (optional)</label>
                <label style={{display:"flex",alignItems:"center",gap:6,fontSize:11,cursor:"pointer"}}>
                  <input type="checkbox" checked={nc.custom_pricing||false} onChange={e=>setNc(p=>({...p,custom_pricing:e.target.checked,custom_prices:e.target.checked?p.custom_prices||{}:{}}))}/>
                  <span style={{color:"#7c3aed",fontWeight:600}}>Enable custom prices for this customer</span>
                </label>
              </div>
              {nc.custom_pricing&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{fontSize:10,color:"#9ca3af",marginBottom:4}}>Leave blank to use standard price. Enter custom price per product:</div>
                {products.filter(p=>p.shelf>0||true).slice(0,products.length).map(p=>(
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{flex:1,fontSize:12,color:"#212121"}}>{p.name}</span>
                    <span style={{fontSize:11,color:"#9ca3af"}}>std: {fmt(p.price)}</span>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{fontSize:12,color:"#6b7280"}}>$</span>
                      <input type="number" min="0" step="0.01" placeholder={p.price.toFixed(2)}
                        value={nc.custom_prices?.[p.id]||""}
                        onChange={e=>setNc(prev=>({...prev,custom_prices:{...prev.custom_prices,[p.id]:e.target.value?parseFloat(e.target.value):undefined}}))}
                        style={{width:70,border:"1.5px solid #ddd6fe",borderRadius:6,padding:"4px 8px",fontSize:12}}/>
                    </div>
                  </div>
                ))}
              </div>}
            </div>
          </div>
        </div>
        <Divider/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button className="btn bgh" onClick={()=>setModal(null)}>Cancel</button>
          <button className="btn ba" onClick={addCustomer} disabled={saving}>{ic.chk} Open Account</button>
        </div>
      </Modal>}

      {modal==="restock"&&<Modal title="📦 Restock Shelf" onClose={()=>setModal(null)}>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div><label>Product</label><select value={rsPid} onChange={e=>setRsPid(e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.name} — Stock: {p.shelf}</option>)}</select></div>
          <div><label>Quantity to Add</label><input type="number" min="1" placeholder="0" value={rsQty} onChange={e=>setRsQty(e.target.value)}/></div>
          <div><label>Source Location</label>
            <select>
              {warehouses.map(w=><option key={w.id} value={w.id}>{w.name}{w.location?` — ${w.location}`:""}</option>)}
            </select>
          </div>
          {rsPid&&rsQty>0&&<div style={{background:"#f9fafb",borderRadius:7,padding:"8px 12px",fontSize:12,color:"#6b7280"}}>New stock: <span style={{color:"#059669",fontWeight:700}}>{(products.find(p=>p.id===rsPid)?.shelf||0)+parseInt(rsQty)}</span></div>}
          <Divider/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn bgh" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn ba" onClick={confirmRestock} disabled={saving}>{ic.chk} Add to Shelf</button>
          </div>
        </div>
      </Modal>}

      {modal==="load"&&<Modal title={`🚚 Load Truck  -  ${getT(selTruck)?.driver}`} onClose={()=>setModal(null)}>
        <div>
          {isAdmin&&<div style={{marginBottom:12}}><label>Select Truck</label><select value={selTruck} onChange={e=>{setSelTruck(e.target.value);setFormItems(products.map(p=>({pid:p.id,qty:0})));}}>{trucks.map(t=><option key={t.id} value={t.id}>{t.driver} — {t.plate}</option>)}</select></div>}
          <div style={{fontSize:10,color:"#6b7280",letterSpacing:".07em",fontWeight:700,marginBottom:8}}>QUANTITIES TO LOAD</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:340,overflowY:"auto",paddingRight:3}}>
            {products.map((p,idx)=>{
              const inStock=p.shelf>0;
              return(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:9,background:inStock?"#f9fafb":"#fff5f5",borderRadius:7,padding:"8px 11px",border:inStock?"none":"1px solid #fecaca",opacity:inStock?1:0.7}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:inStock?"#212121":"#9ca3af",fontWeight:600}}>{p.name}</div>
                    <div style={{fontSize:10,color:"#9ca3af"}}>
                      Available: <span style={{color:inStock?"#7c3aed":"#dc2626",fontWeight:700}}>{p.shelf}</span> · {p.unit}
                      {!inStock&&<span style={{marginLeft:6,color:"#dc2626",fontWeight:700}}>— OUT OF STOCK</span>}
                    </div>
                  </div>
                  <input type="number" min="0" max={p.shelf} value={formItems[idx]?.qty||0}
                    disabled={!inStock}
                    onChange={e=>{const v=Math.min(p.shelf,Math.max(0,parseInt(e.target.value)||0));setFormItems(prev=>prev.map((fi,i)=>i===idx?{...fi,qty:v}:fi));}}
                    style={{width:70,textAlign:"center",opacity:inStock?1:0.4,cursor:inStock?"text":"not-allowed"}}/>
                </div>
              );
            })}
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

      {modal==="sale"&&<Modal title={`💳 Record Sale  -  ${getT(selTruck)?.driver}`} onClose={()=>{setModal(null);setScanning(false);setScanInput("");setScanMsg(null);}}>
        <div>
          <div style={{marginBottom:12}}><label>Customer</label><select value={selCust} onChange={e=>setSelCust(e.target.value)}>{customers.filter(c=>c.truck_id===selTruck).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          {selCust&&(()=>{const c=getC(selCust);return(<>
            {c&&(c.phone||c.address)&&<div style={{background:"#f9fafb",borderRadius:7,padding:"8px 12px",marginBottom:12,fontSize:11,color:"#6b7280"}}>{c.address&&<div>📍 {c.address}</div>}{c.phone&&<div>📞 {c.phone}</div>}</div>}
            {c&&hasReturnedCheck(c)&&<div style={{background:"#1a0505",border:"2px solid #dc2626",borderRadius:10,padding:"12px 16px",marginBottom:14,animation:"pu 1.5s infinite"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>🚨</span>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#dc2626",letterSpacing:".04em"}}>RETURNED CHECK — DO NOT ACCEPT CHECKS</div>
                  <div style={{fontSize:12,color:"#f87171",marginTop:3}}>This customer has a returned check on file. A <strong style={{color:"#fbbf24"}}>${RETURNED_CHECK_FEE} penalty fee</strong> will be applied if a check is accepted again.</div>
                  <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>Accepted payment: 💵 Cash · 📱 Zelle · 💳 Card only</div>
                </div>
              </div>
            </div>}
          </>);})()}

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
                      SKU: <span style={{fontFamily:"monospace"}}>{p.sku}</span> · On truck: <span style={{color:"#7c3aed"}}>{fi.max}</span>
                      {(()=>{const ep=getEffectivePrice(selCust,p.id);const isCustom=ep!==p.price;return <span> · <span style={{color:isCustom?"#7c3aed":"#059669",fontWeight:isCustom?700:400}}>{fmt(ep)}{isCustom&&<span style={{fontSize:9,marginLeft:3,background:"#ede9fe",color:"#7c3aed",borderRadius:3,padding:"1px 4px"}}>CUSTOM</span>}</span></span>;})()}
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <button onClick={()=>setFormItems(prev=>prev.map((x,i)=>i===idx?{...x,qty:Math.max(0,x.qty-1)}:x))} style={{width:26,height:26,borderRadius:"50%",border:"1.5px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <input type="number" min="0" max={fi.max} value={fi.qty} onChange={e=>{const v=Math.min(fi.max,Math.max(0,parseInt(e.target.value)||0));setFormItems(prev=>prev.map((x,i)=>i===idx?{...x,qty:v}:x));}} style={{width:54,textAlign:"center"}}/>
                    <button onClick={()=>setFormItems(prev=>prev.map((x,i)=>i===idx?{...x,qty:Math.min(x.max,x.qty+1)}:x))} style={{width:26,height:26,borderRadius:"50%",border:"1.5px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                </div>
                {fi.qty>0&&<div style={{fontSize:10,color:"#059669",marginTop:3,textAlign:"right"}}>{fmt(fi.qty*getEffectivePrice(selCust,p.id))}{isTaxableProd(p)?" + tax":""}</div>}
              </div>
            );})}
          </div>
          <Divider/>
          {(()=>{const sub=formItems.reduce((a,fi)=>{return a+getEffectivePrice(selCust,fi.pid)*fi.qty;},0);const tax=calcSaleTax({items:formItems.map(fi=>({pid:fi.pid,qty:fi.qty})),cust_id:selCust,state:customers.find(c=>c.id===selCust)?.state||""}),gt=sub+tax,prof=formItems.reduce((a,fi)=>{const p=getP(fi.pid);return a+(getEffectivePrice(selCust,fi.pid)-(p?.cost||0))*fi.qty;},0);return<div style={{background:"#f9fafb",borderRadius:7,padding:"11px 13px",marginBottom:12}}>{[{l:"Subtotal",v:fmt(sub),c:"#6b7280"},{l:"Tax (Tobacco only)",v:fmt(tax),c:"#7c3aed"},{l:"Grand Total",v:fmt(gt),c:"#7c3aed"},{l:"Your Profit",v:fmt(prof),c:"#059669"}].map(k=><div key={k.l} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:"#6b7280"}}>{k.l}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:k.l==="Grand Total"?16:13,color:k.c}}>{k.v}</span></div>)}</div>;})()}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn bgh" onClick={()=>{setModal(null);setScanning(false);setScanInput("");}}>Cancel</button>
            <button className="btn bg" onClick={confirmSale} disabled={saving}>{ic.inv} Confirm & Invoice</button>
          </div>
        </div>
      </Modal>}

      {/* ── RETURNED CHECK UPLOAD MODAL ── */}
      {rcModal&&<Modal title="🔴 Upload Returned Check" onClose={()=>setRcModal(null)}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {(()=>{const cust=getC(rcModal.custId);const sale=sales.find(s=>s.id===rcModal.saleId);const pmt=pmtFor(rcModal.saleId);return(<>
            {/* Invoice summary */}
            <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#212121",marginBottom:8}}>Invoice Details</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12}}>
                <div><span style={{color:"#9ca3af"}}>Invoice: </span><strong style={{color:"#7c3aed"}}>{rcModal.saleId}</strong></div>
                <div><span style={{color:"#9ca3af"}}>Customer: </span><strong>{cust?.name}</strong></div>
                <div><span style={{color:"#9ca3af"}}>Amount: </span><strong>{sale?fmt(calcSaleGrandTotal(sale)):"—"}</strong></div>
                <div><span style={{color:"#9ca3af"}}>Check #: </span><strong>{pmt?.check_number||"—"}</strong></div>
                {pmt?.bank_name&&<div style={{gridColumn:"1/-1"}}><span style={{color:"#9ca3af"}}>Bank: </span><strong>{pmt.bank_name}</strong></div>}
              </div>
            </div>

            {/* Warning */}
            <div style={{background:"#1a0505",border:"2px solid #dc2626",borderRadius:10,padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start"}}>
              <span style={{fontSize:28,flexShrink:0}}>🚨</span>
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#dc2626",marginBottom:4}}>This will flag the customer immediately</div>
                <div style={{fontSize:12,color:"#f87171",lineHeight:1.6}}>
                  Once uploaded, <strong style={{color:"#fbbf24"}}>{cust?.name}</strong> will be flagged system-wide.<br/>
                  All drivers will see a <strong style={{color:"#fbbf24"}}>🚨 warning</strong> when creating any new sale for this customer.<br/>
                  A <strong style={{color:"#fbbf24"}}>${RETURNED_CHECK_FEE} penalty fee</strong> will be required on their next check.
                </div>
              </div>
            </div>

            {/* File upload */}
            <div>
              <label style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:".08em",display:"block",marginBottom:8}}>UPLOAD RETURNED CHECK IMAGE / SCAN</label>
              <input type="file" accept="image/*,.pdf"
                id="rc-file-input"
                style={{display:"none"}}
                onChange={async e=>{
                  const file=e.target.files[0];
                  if(file) await uploadReturnedCheck(file,rcModal.saleId,rcModal.custId);
                }}
              />
              <label htmlFor="rc-file-input" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:rcUploading?"#f3f4f6":"#fef2f2",border:"2px dashed #fecaca",borderRadius:10,padding:"24px",cursor:rcUploading?"not-allowed":"pointer",transition:"all .15s"}}>
                {rcUploading?(
                  <><span className="spin" style={{display:"inline-block"}}>↻</span><span style={{fontSize:13,color:"#6b7280",fontWeight:600}}>Uploading & flagging customer…</span></>
                ):(
                  <><span style={{fontSize:24}}>📄</span><div><div style={{fontSize:13,fontWeight:700,color:"#dc2626"}}>Click to upload returned check</div><div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>JPG, PNG, or PDF · Max 10MB</div></div></>
                )}
              </label>
            </div>

            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button className="btn bgh" onClick={()=>setRcModal(null)} disabled={rcUploading}>Cancel</button>
            </div>
          </>);})()}
        </div>
      </Modal>}

      {modal==="return"&&<Modal title={`Return Stock  -  ${getT(selTruck)?.driver}`} onClose={()=>setModal(null)}>
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

      {/* ── AMEND INVOICE MODAL ── */}
      {modal==="amend"&&amendSale&&(()=>{
        const cust=getC(amendSale.cust_id);
        const custSt=(cust?.state||"").trim();
        const st=stateTaxes.find(x=>x.id?.toUpperCase()===custSt.toUpperCase()||x.name?.toLowerCase()===custSt.toLowerCase());
        const tRate=(!co?.tax_enabled||st?.exempt)?0:parseFloat(st?.rate||co?.tax_rate||0);

        const newItems=Object.entries(amendItems).filter(([,q])=>parseInt(q)>0).map(([pid,qty])=>({pid,qty:parseInt(qty)}));
        const newSub=newItems.reduce((a,i)=>a+(getEffectivePrice(amendSale.cust_id,i.pid)||0)*i.qty,0);
        const newTaxable=newItems.reduce((a,i)=>{const p=getP(i.pid);return isTaxableProd(p)?a+(getEffectivePrice(amendSale.cust_id,i.pid)||0)*i.qty:a;},0);
        const newTax=parseFloat((newTaxable*tRate/100).toFixed(2));
        const newTotal=newSub+newTax+parseFloat(amendSale.previous_balance||0);
        const origTotal=calcSaleGrandTotal(amendSale);

        return(
          <Modal title={`✏️ Amend Invoice ${amendSale.id}`} onClose={()=>{setModal(null);setAmendSale(null);setAmendItems({});}}>
            <div style={{marginBottom:10,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <span className="bdg bb2">{amendSale.id}</span>
              <span style={{fontSize:12,color:"#6b7280"}}>{cust?.name} · {amendSale.date}</span>
              {amendSale.amended_at&&<span className="bdg bp2">PREVIOUSLY AMENDED</span>}
            </div>
            <div style={{fontSize:11,color:"#9ca3af",marginBottom:16}}>Adjust quantities only — prices remain fixed at invoice rates</div>

            {/* Product rows */}
            <div style={{marginBottom:16}}>
              {(amendSale.items||[]).map(item=>{
                const p=getP(item.pid);
                const qty=parseInt(amendItems[item.pid]||0);
                const origQty=item.qty;
                const ep=getEffectivePrice(amendSale.cust_id,item.pid);
                const diff=qty-origQty;
                const changed=qty!==origQty;
                // How many more can be added: original qty returns to shelf, so available = shelf + origQty
                const maxQty = origQty + (p?.shelf||0);
                const atLimit = qty >= maxQty;
                const overShelf = diff > (p?.shelf||0); // trying to add more than what's on shelf
                return(
                  <div key={item.pid} style={{border:`1.5px solid ${overShelf?"#dc2626":changed?"#7c3aed":"#e5e7eb"}`,borderRadius:10,padding:"12px 14px",marginBottom:8,background:overShelf?"#fff5f5":changed?"#faf5ff":"#fff",transition:"all .15s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div>
                        <div style={{fontWeight:700,fontSize:13,color:"#212121"}}>{p?.name||item.pid}</div>
                        <div style={{fontSize:10,color:"#9ca3af",marginTop:2}}>
                          {p?.sku&&`${p.sku}   -   `}{fmt(ep)} each{isTaxableProd(p)&&<span style={{marginLeft:4,color:"#7c3aed",fontWeight:700,fontSize:9}}>TOBACCO TAX</span>}
                          {" · "}<span style={{color:(p?.shelf||0)===0?"#dc2626":(p?.shelf||0)<5?"#f59e0b":"#059669",fontWeight:700}}>{p?.shelf||0} on shelf</span>
                          {" · "}<span style={{color:"#6b7280"}}>max {maxQty} with original</span>
                        </div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:overShelf?"#dc2626":changed?"#7c3aed":"#212121"}}>{fmt(qty*ep)}</div>
                        {changed&&<div style={{fontSize:10,fontWeight:700,color:diff>0?"#dc2626":"#059669",marginTop:1}}>
                          {diff>0?`^ +${diff}`:`v ${diff}`} from original ({origQty})
                        </div>}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <button className="btn br" style={{width:30,height:30,padding:0,justifyContent:"center",borderRadius:"50%",fontSize:16}}
                        onClick={()=>setAmendItems(prev=>({...prev,[item.pid]:Math.max(0,(parseInt(prev[item.pid]||0))-1)}))}>−</button>
                      <input type="number" min="0" max={maxQty} value={qty||""} placeholder="0"
                        onChange={e=>setAmendItems(prev=>({...prev,[item.pid]:Math.min(maxQty,Math.max(0,parseInt(e.target.value)||0))}))}
                        style={{flex:1,textAlign:"center",border:`2px solid ${overShelf?"#dc2626":changed?"#7c3aed":"#e5e7eb"}`,borderRadius:8,padding:"8px 6px",fontSize:18,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:overShelf?"#dc2626":changed?"#7c3aed":"#212121"}}/>
                      <button className="btn ba" style={{width:30,height:30,padding:0,justifyContent:"center",borderRadius:"50%",fontSize:16,opacity:atLimit?0.4:1,cursor:atLimit?"not-allowed":"pointer"}}
                        disabled={atLimit}
                        onClick={()=>!atLimit&&setAmendItems(prev=>({...prev,[item.pid]:Math.min(maxQty,(parseInt(prev[item.pid]||0))+1)}))}>+</button>
                      <span style={{minWidth:64,fontSize:11,color:"#9ca3af",textAlign:"center",flexShrink:0}}>was {origQty}</span>
                    </div>
                    {overShelf&&<div style={{marginTop:6,fontSize:10,color:"#dc2626",fontWeight:700}}>⚠️ Only {p?.shelf||0} units on shelf — can't increase by {diff}</div>}
                    {atLimit&&!overShelf&&<div style={{marginTop:6,fontSize:10,color:"#f59e0b",fontWeight:700}}>⚠️ Maximum reached ({maxQty} = {origQty} original + {p?.shelf||0} on shelf)</div>}
                  </div>
                );
              })}
            </div>

            {/* Updated totals */}
            <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,padding:"14px 16px",marginBottom:16}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,color:"#5b21b6",marginBottom:10,letterSpacing:".06em"}}>UPDATED TOTALS</div>
              {[
                ["Subtotal",fmt(newSub),"#212121"],
                tRate>0?["Tobacco Tax ("+tRate+"%)",fmt(newTax),"#7c3aed"]:null,
                parseFloat(amendSale.previous_balance||0)>0?[amendSale.check_penalty_applied>0?"🚨 Returned Check Penalty":"⚠️ Prev. Balance",fmt(parseFloat(amendSale.previous_balance||0)),"#dc2626"]:null,
                ["New Grand Total",fmt(newTotal),"#059669"],
                ["Original Total",fmt(origTotal),"#9ca3af"],
                newTotal!==origTotal?["Difference",`${newTotal>origTotal?"+":""}${fmt(newTotal-origTotal)}`,newTotal>origTotal?"#dc2626":"#059669"]:null,
              ].filter(Boolean).map(([l,v,c])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:6,paddingBottom:l==="New Grand Total"?6:0,borderBottom:l==="New Grand Total"?"1px solid #ddd6fe":"none"}}>
                  <span style={{fontSize:12,color:l==="New Grand Total"?"#212121":"#6b7280",fontWeight:l==="New Grand Total"?700:400}}>{l}</span>
                  <span style={{fontSize:l==="New Grand Total"?15:12,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:l==="New Grand Total"?800:600,color:c}}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{display:"flex",gap:8}}>
              <button className="btn ba" style={{flex:1,justifyContent:"center",padding:"11px"}} onClick={saveAmend} disabled={amendSaving}>
                {amendSaving?<><span className="spin" style={{display:"inline-block",width:12,height:12,border:"2px solid #fff",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite",marginRight:6}}/>Saving…</>:"💾 Save Amendment"}
              </button>
              <button className="btn bgh" style={{padding:"11px 18px"}} onClick={()=>{setModal(null);setAmendSale(null);setAmendItems({});}}>Cancel</button>
            </div>
          </Modal>
        );
      })()}

      {modal==="invoice"&&viewSale&&<Modal title="" onClose={()=>setModal(null)} wide>
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          <span className={`bdg ${pmtFor(viewSale.id)?.status==="paid"?"bg2":"br2"}`}>{pmtFor(viewSale.id)?.status==="paid"?"✓ PAID":"⏳ UNPAID"}</span>
          {pmtFor(viewSale.id)?.status!=="paid"?<button className="btn bg" onClick={()=>markPaid(viewSale.id)}>{ic.chk} Mark Paid</button>:<button className="btn bgh" style={{fontSize:11}} onClick={()=>markUnpaid(viewSale.id)}>Mark Unpaid</button>}
          {pmtFor(viewSale.id)?.status!=="paid"&&<button className="btn bp" style={{fontSize:11,padding:"7px 12px"}} onClick={()=>{setModal(null);setTimeout(()=>setStripeModal({sale:viewSale,customer:getC(viewSale.cust_id),driver:getT(viewSale.truck_id)?.driver}),100);}}>💳 Charge Card</button>}
          {(()=>{
            const cust=getC(viewSale.cust_id);
            const hasEmail=cust?.email&&cust.email.includes("@");
            const hasConfig=co?.gmail_user&&co?.gmail_app_password;
            return(
              <button className="btn bb" style={{fontSize:11,padding:"7px 12px"}}
                title={!hasConfig?"Configure email in Settings first":!hasEmail?"Customer has no email address":"Send invoice by email"}
                onClick={async()=>{
                  if(!hasConfig)return showToast("Configure Gmail in Settings first","error");
                  if(!hasEmail)return showToast("Customer has no email address","error");
                  const result=await sendEmail(cust.email,`Invoice ${viewSale.id} from ${co?.name||"Your Supplier"}`,buildInvoiceEmail(viewSale,cust));
                  if(result.ok)showToast(`✅ Invoice emailed to ${cust.email}`);
                  else showToast(`Email failed: ${result.err}`,"error");
                }}>
                ✉️ Email Invoice
              </button>
            );
          })()}
          <div style={{marginLeft:"auto"}}><button className="btn bpr" onClick={()=>window.print()}>{ic.prt} Print / Save PDF</button></div>
        </div>
        <InvoiceDoc sale={viewSale} products={products} customers={customers} trucks={trucks} co={co} paid={pmtFor(viewSale.id)?.status==="paid"} stateTaxes={stateTaxes}/>
      </Modal>}

      {modal==="settlement"&&viewTruck&&(()=>{const t=getT(viewTruck),d=settlementData(viewTruck);return<Modal title="" onClose={()=>setModal(null)} xwide><div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}><button className="btn bpr" onClick={()=>window.print()}>{ic.prt} Print / Save PDF</button></div><SettleDoc truck={t} d={d} co={co} customers={customers} payments={payments} products={products} stateTaxes={stateTaxes}/></Modal>;})()}

      {/* ── STRIPE PAYMENT MODAL ── */}
      {stripeModal&&<StripePaymentModal
        sale={stripeModal.sale}
        customer={stripeModal.customer}
        driver={stripeModal.driver}
        taxRate={taxRate} stateTaxes={stateTaxes}
        saleTax={calcSaleTax(stripeModal.sale)}
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
