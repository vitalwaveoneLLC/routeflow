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
// ── MFA GATE — verify 2FA even for cached sessions ────────────────────────────
const MFAGate=({onVerified})=>{
  const[otp,setOtp]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const[stage,setStage]=useState("checking"); // checking | enroll | verify

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

// ── LOGIN ─────────────────────────────────────────────────────────────────────
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

// ── INVOICE DOC ───────────────────────────────────────────────────────────────
// ── GLOBAL TAX HELPERS (module level - available to all components) ──────────
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
  const gt=sub+tax;
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
              <span style={{fontSize:13,color:"#6b7280"}}>{`Tobacco/Vape Tax · ${stateId} (${stateRate}%)`}</span>
              <span style={{fontSize:13,color:"#059669"}}>{fmt(tax)}</span>
            </div>}
            {parseFloat(sale.previous_balance||0)>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f3f4f6",background:"#fef2f2",margin:"0 -4px",padding:"6px 4px"}}>
              <span style={{fontSize:13,color:"#dc2626",fontWeight:600}}>⚠️ Previous Balance ({sale.previous_invoice_ids})</span>
              <span style={{fontSize:13,color:"#dc2626",fontWeight:700}}>{fmt(parseFloat(sale.previous_balance||0))}</span>
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

// ── SETTLEMENT DOC ────────────────────────────────────────────────────────────
const calcSettleTax=(sale,products,stateTaxes)=>{
  const st=stateTaxes?.find(s=>s.id===(sale.state||""));
  const rate=st?.exempt?0:parseFloat(st?.rate||0);
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
      <tbody>{d.truckSales.map(s=>{const cust=customers.find(c=>c.id===s.cust_id);const pmt=payments.find(p=>p.sale_id===s.id);return(<tr key={s.id}><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12,fontWeight:700,color:"#2563eb"}}>{s.id}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12}}>{cust?.name}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12}}>{(s.items||[]).reduce((a,i)=>a+i.qty,0)}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12}}>{fmt(s.total)}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:12,color:"#7c3aed"}}>{fmt(calcSettleTax(s,products,stateTaxes))}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb",fontSize:13,fontWeight:700}}>{fmt(s.total+calcSettleTax(s,products,stateTaxes)+parseFloat(s.previous_balance||0))}</td><td style={{padding:"8px",borderBottom:"1px solid #f9fafb"}}><span style={{background:pmt?.status==="paid"?"#dcfce7":"#fef9c3",color:pmt?.status==="paid"?"#166534":"#854d0e",padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:700}}>{pmt?.status==="paid"?"PAID":"UNPAID"}</span></td></tr>);})}</tbody></table></>}
      <div style={{marginTop:20,paddingTop:10,borderTop:"1px solid #e5e7eb",fontSize:10,color:"#9ca3af",textAlign:"center"}}>{co?.name} · {co?.phone} · {dateLabel()}</div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
// ── DRIVER TRUCK ASSIGNMENT ───────────────────────────────────────────────────
function DriverTruckAssignment({supabase, trucks, showToast}){
  const[profiles,setProfiles]=useState([]);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState({});

  useEffect(()=>{
    // Load driver profiles with email from driver_profiles view
    supabase
      .from("driver_profiles")
      .select("id, email, truck_id")
      .then(({data,error})=>{
        if(error||!data){
          // Fallback: load from profiles table
          supabase.from("profiles").select("id,truck_id").eq("role","driver")
            .then(({data:pd})=>{
              setProfiles((pd||[]).map(p=>({...p,email:p.id})));
              setLoading(false);
            });
          return;
        }
        setProfiles(data);
        setLoading(false);
      });
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
              <div style={{fontSize:11,color:"#9ca3af",fontFamily:"monospace"}}>{p.id.slice(0,8)}...</div>
            </div>
            <div style={{flex:2,minWidth:200}}>
              <label style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".08em",display:"block",marginBottom:4}}>ASSIGNED TRUCK</label>
              <select
                value={p.truck_id||""}
                onChange={e=>assignTruck(p.id,e.target.value)}
                style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:7,padding:"8px 10px",fontSize:12,fontFamily:"'Barlow',sans-serif",background:"#fff"}}>
                <option value="">— Select Truck —</option>
                {trucks.map(t=>(
                  <option key={t.id} value={t.id}>{t.driver} · {t.plate} {t.route?`· ${t.route}`:""}</option>
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

// ── WALK-IN SALE COMPONENT ────────────────────────────────────────────────────
function WalkInSale({products,customers,sales,payments,stateTaxes,supabase,isTaxableProd,calcSaleTax,calcSaleGrandTotal,fmt,uid,getP,pmtFor,onSaleCreated}){
  const [wiCust,setWiCust]=useState("");
  const [wiSearch,setWiSearch]=useState("");
  const [wiItems,setWiItems]=useState({});
  const [wiSaving,setWiSaving]=useState(false);
  const [wiMsg,setWiMsg]=useState(null);
  const [wiPayMethod,setWiPayMethod]=useState("cash");
  const [wiCheckNum,setWiCheckNum]=useState("");
  const [wiZelle,setWiZelle]=useState("");
  const [wiPrevBal,setWiPrevBal]=useState(0);
  const [wiPrevInvs,setWiPrevInvs]=useState([]);
  const [wiCatFilter,setWiCatFilter]=useState("All");
  const [wiReceiptFile,setWiReceiptFile]=useState(null);
  const [wiReceiptUrl,setWiReceiptUrl]=useState("");

  const wiCustObj=customers.find(c=>c.id===wiCust);
  const cats=["All",...new Set(products.map(p=>p.cat).filter(Boolean))];
  const filtered=products.filter(p=>{
    if(p.shelf<=0) return false;
    if(wiCatFilter!=="All"&&p.cat!==wiCatFilter) return false;
    if(wiSearch&&!p.name.toLowerCase().includes(wiSearch.toLowerCase())&&!p.sku?.toLowerCase().includes(wiSearch.toLowerCase())) return false;
    return true;
  });
  const grouped=cats.filter(c=>c!=="All").reduce((acc,cat)=>{
    const items=wiCatFilter==="All"?products.filter(p=>p.shelf>0&&p.cat===cat&&(!wiSearch||(p.name.toLowerCase().includes(wiSearch.toLowerCase())||p.sku?.toLowerCase().includes(wiSearch.toLowerCase())))):filtered;
    if(wiCatFilter==="All"){if(items.length)acc[cat]=items;}
    else acc[wiCatFilter]=filtered;
    return acc;
  },{});

  const sub=products.reduce((a,p)=>a+(p.price||0)*(wiItems[p.id]||0),0);
  const taxRate2=wiCustObj?(()=>{
    const custState=(wiCustObj.state||"").trim();
    // Match by code (IN) or name (Indiana) - case insensitive
    const st=stateTaxes.find(s=>
      s.id?.toUpperCase()===custState.toUpperCase()||
      s.name?.toLowerCase()===custState.toLowerCase()
    );
    return st?.exempt?0:parseFloat(st?.rate||0);
  })():0;
  const taxable=products.reduce((a,p)=>isTaxableProd(p)?(a+(p.price||0)*(wiItems[p.id]||0)):a,0);
  const tax=parseFloat((taxable*taxRate2/100).toFixed(2));
  const gt=sub+tax;
  const cardFee=3;
  const cardTotal=parseFloat((gt*(1+cardFee/100)).toFixed(2));
  const totalDue=(wiPayMethod==="card"?cardTotal:gt)+wiPrevBal;

  const handleWiCust=async(cid)=>{
    setWiCust(cid);setWiPrevBal(0);setWiPrevInvs([]);
    if(!cid)return;
    const [{data:cs},{data:pm}]=await Promise.all([
      supabase.from("sales").select("id,total,date,state,items,previous_balance").eq("cust_id",cid),
      supabase.from("payments").select("sale_id,status"),
    ]);
    const paidIds=new Set((pm||[]).filter(p=>p.status==="paid").map(p=>p.sale_id));
    const allUnpaid=(cs||[]).filter(s=>!paidIds.has(s.id));
    const bal=parseFloat(allUnpaid.reduce((a,s)=>{
      const custSt=(s.state||"").trim();const st=stateTaxes.find(x=>x.id?.toUpperCase()===custSt.toUpperCase()||x.name?.toLowerCase()===custSt.toLowerCase());
      const rate=st?.exempt?0:parseFloat(st?.rate||0);
      const taxableAmt=(s.items||[]).reduce((b,i)=>{const p=products.find(x=>x.id===i.pid);return isTaxableProd(p)?b+(p?.price||0)*i.qty:b;},0);
      const stax=parseFloat((taxableAmt*rate/100).toFixed(2));
      return a+s.total+stax+parseFloat(s.previous_balance||0);
    },0).toFixed(2));
    setWiPrevBal(bal);setWiPrevInvs(allUnpaid);
  };

  const createWiSale=async()=>{
    if(!wiCust)return setWiMsg({t:"error",m:"Select a customer"});
    const saleItems=products.filter(p=>wiItems[p.id]>0).map(p=>({pid:p.id,qty:wiItems[p.id]}));
    if(!saleItems.length)return setWiMsg({t:"error",m:"Add at least one product"});
    setWiSaving(true);
    try{
      const {data:seq}=await supabase.rpc("next_invoice_number");
      const invId="INV-"+String(seq||1).padStart(4,"0");
      const profit=saleItems.reduce((a,i)=>{const p=products.find(x=>x.id===i.pid);return a+((p?.price||0)-(p?.cost||0))*i.qty;},0);
      const ns={id:invId,truck_id:null,cust_id:wiCust,state:wiCustObj?.state||"",date:new Date().toLocaleDateString(),items:saleItems,total:sub,profit,previous_balance:wiPrevBal||0,previous_invoice_ids:wiPrevInvs.map(s=>s.id).join(","),created_at:new Date().toISOString()};
      await supabase.from("sales").insert(ns);
      for(const i of saleItems){const p=products.find(x=>x.id===i.pid);if(p)await supabase.from("products").update({shelf:Math.max(0,p.shelf-i.qty)}).eq("id",p.id);}
      // Upload receipt if provided
      let wiRecUrl = "";
      if(wiReceiptFile){
        const ext = wiReceiptFile.name.split(".").pop();
        const path = `receipts/WI-${uid()}.${ext}`;
        const {data:upD,error:upE} = await supabase.storage.from("receipts").upload(path, wiReceiptFile, {upsert:true});
        if(!upE) wiRecUrl = supabase.storage.from("receipts").getPublicUrl(path).data.publicUrl;
      }
      await supabase.from("payments").insert({id:"PMT-"+uid(),sale_id:invId,status:"paid",method:wiPayMethod,amount:totalDue,check_number:wiCheckNum||"",zelle_ref:wiZelle||"",note:"Walk-in sale",receipt_url:wiRecUrl,collected_at:new Date().toISOString()});
      onSaleCreated(ns);
      setWiItems({});setWiCust("");setWiPrevBal(0);setWiPrevInvs([]);setWiCheckNum("");setWiZelle("");setWiReceiptFile(null);setWiReceiptUrl("");
      setWiMsg({t:"success",m:`✅ Invoice ${invId} created & payment recorded!`});
    }catch(e){setWiMsg({t:"error",m:e.message});}
    setWiSaving(false);
  };

  return(
    <div style={{display:"flex",gap:0,height:"calc(100vh - 120px)",overflow:"hidden"}}>
      {/* ── LEFT SIDEBAR ── */}
      <div style={{width:300,flexShrink:0,borderRight:"1px solid #e5e7eb",display:"flex",flexDirection:"column",background:"#f9fafb",overflowY:"auto"}}>
        <div style={{padding:"14px 16px",borderBottom:"1px solid #e5e7eb",background:"#fff"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:"#212121"}}>🏪 Walk-in Sale</div>
          <div style={{fontSize:11,color:"#9ca3af"}}>Warehouse direct — deducts from shelf</div>
        </div>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb"}}>
          <label style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".08em",display:"block",marginBottom:6}}>CUSTOMER</label>
          <select value={wiCust} onChange={e=>handleWiCust(e.target.value)} style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,background:"#fff",color:"#212121"}}>
            <option value="">— Select customer —</option>
            {[...customers].sort((a,b)=>a.name.localeCompare(b.name)).map(c=><option key={c.id} value={c.id}>{c.name}{c.state?` · ${c.state}`:""}</option>)}
          </select>
          {wiCustObj&&<div style={{marginTop:6,fontSize:11,color:"#6b7280"}}>
            State: <strong>{wiCustObj.state||"Not set"}</strong> · 
            Tax: <strong style={{color:taxRate2>0?"#7c3aed":"#9ca3af"}}>{taxRate2>0?`${taxRate2}% tobacco`:"exempt/none"}</strong>
          </div>}
          {wiPrevBal>0&&<div style={{marginTop:8,background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"8px 12px"}}>
            <div style={{fontWeight:700,fontSize:11,color:"#dc2626",marginBottom:4}}>⚠️ Outstanding Balance</div>
            {wiPrevInvs.slice(0,3).map(s=><div key={s.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#dc2626",marginBottom:2}}><span>{s.id} · {s.date}</span><span>${calcSaleGrandTotal(s).toFixed(2)}</span></div>)}
            {wiPrevInvs.length>3&&<div style={{fontSize:10,color:"#dc2626"}}>+{wiPrevInvs.length-3} more</div>}
            <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:12,color:"#dc2626",borderTop:"1px solid #fecaca",marginTop:4,paddingTop:4}}><span>Total (incl. tax)</span><span>{fmt(wiPrevBal)}</span></div>
          </div>}
        </div>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb"}}>
          <label style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".08em",display:"block",marginBottom:8}}>ORDER SUMMARY</label>
          {[["Subtotal",fmt(sub),"#212121"],tax>0?["Tobacco Tax ("+taxRate2+"%)",fmt(tax),"#7c3aed"]:null,wiPrevBal>0?["Prev. Balance (incl. tax)",fmt(wiPrevBal),"#dc2626"]:null,wiPayMethod==="card"?["Card Fee ("+cardFee+"%)",fmt(parseFloat((gt*cardFee/100).toFixed(2))),"#f59e0b"]:null,["Total Due",fmt(totalDue),"#059669"]].filter(Boolean).map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:6,paddingBottom:l==="Total Due"?0:6,borderBottom:l==="Total Due"?"none":"1px solid #f3f4f6"}}>
              <span style={{fontSize:11,color:l==="Total Due"?"#212121":"#6b7280",fontWeight:l==="Total Due"?700:400}}>{l}</span>
              <span style={{fontSize:l==="Total Due"?15:12,fontWeight:l==="Total Due"?800:600,color:c}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb"}}>
          <label style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".08em",display:"block",marginBottom:8}}>PAYMENT</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {[["cash","💵 Cash"],["check","🧾 Check"],["zelle","⚡ Zelle"],["money_order","📮 M.O."],["card","💳 Card"]].map(([id,label])=>(
              <button key={id} onClick={()=>setWiPayMethod(id)} style={{padding:"7px 6px",borderRadius:7,border:`1.5px solid ${wiPayMethod===id?"#7c3aed":"#e5e7eb"}`,background:wiPayMethod===id?"#f5f3ff":"#fff",color:wiPayMethod===id?"#7c3aed":"#6b7280",fontSize:11,fontWeight:wiPayMethod===id?700:400,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>{label}</button>
            ))}
          </div>
          {wiPayMethod==="check"&&<input value={wiCheckNum} onChange={e=>setWiCheckNum(e.target.value)} placeholder="Check number" style={{width:"100%",marginTop:8,border:"1.5px solid #e5e7eb",borderRadius:7,padding:"8px 10px",fontSize:12,boxSizing:"border-box"}}/>}
          {wiPayMethod==="zelle"&&<input value={wiZelle} onChange={e=>setWiZelle(e.target.value)} placeholder="Zelle reference" style={{width:"100%",marginTop:8,border:"1.5px solid #e5e7eb",borderRadius:7,padding:"8px 10px",fontSize:12,boxSizing:"border-box"}}/>}
        </div>

        {/* Receipt Upload */}
        <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb"}}>
          <label style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".08em",display:"block",marginBottom:8}}>RECEIPT / PAYMENT PROOF</label>
          <div style={{border:"2px dashed #e5e7eb",borderRadius:9,padding:"12px",textAlign:"center",background:"#fff",cursor:"pointer"}}
            onClick={()=>document.getElementById("wiReceiptInput").click()}>
            {wiReceiptUrl?(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <img src={wiReceiptUrl} alt="receipt" style={{maxHeight:80,maxWidth:"100%",borderRadius:6}}/>
                <span style={{fontSize:10,color:"#059669",fontWeight:600}}>✅ Attached — click to change</span>
              </div>
            ):(
              <div style={{color:"#9ca3af",fontSize:11}}>
                <div style={{fontSize:20,marginBottom:2}}>📸</div>
                <div>Tap to snap or upload receipt</div>
              </div>
            )}
            <input id="wiReceiptInput" type="file" accept="image/*,application/pdf" capture="environment" style={{display:"none"}}
              onChange={e=>{const f=e.target.files[0];if(f){setWiReceiptFile(f);setWiReceiptUrl(URL.createObjectURL(f));}}}/>
          </div>
        </div>

        <div style={{padding:"12px 16px"}}>
          {wiMsg&&<div style={{background:wiMsg.t==="success"?"#f0fdf4":"#fef2f2",border:`1px solid ${wiMsg.t==="success"?"#a7f3d0":"#fecaca"}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:wiMsg.t==="success"?"#065f46":"#dc2626",marginBottom:10}}>{wiMsg.m}</div>}
          <button onClick={createWiSale} disabled={wiSaving||!wiCust||sub===0}
            style={{width:"100%",padding:"11px",background:!wiCust||sub===0?"#9ca3af":"#7c3aed",color:"#fff",border:"none",borderRadius:9,fontWeight:700,fontSize:14,cursor:!wiCust||sub===0?"not-allowed":"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
            {wiSaving?"Creating...":"🧾 Create Invoice & Record Payment"}
          </button>
        </div>
      </div>

      {/* ── MAIN PRODUCT AREA ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb",background:"#fff",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <input value={wiSearch} onChange={e=>setWiSearch(e.target.value)} placeholder="🔍 Search products by name or SKU..."
            style={{flex:1,minWidth:200,border:"1.5px solid #e5e7eb",borderRadius:8,padding:"9px 14px",fontSize:13}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setWiCatFilter(c)}
                style={{padding:"6px 12px",borderRadius:20,border:`1.5px solid ${wiCatFilter===c?"#7c3aed":"#e5e7eb"}`,background:wiCatFilter===c?"#7c3aed":"#fff",color:wiCatFilter===c?"#fff":"#6b7280",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>
                {c}
              </button>
            ))}
          </div>
          <button onClick={()=>setWiItems({})} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #e5e7eb",background:"#fff",color:"#6b7280",fontSize:11,cursor:"pointer"}}>Clear</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
          {Object.entries(wiCatFilter==="All"?grouped:{[wiCatFilter]:filtered}).map(([cat,items])=>(
            <div key={cat} style={{marginBottom:20}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,color:"#9ca3af",letterSpacing:".1em",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                {cat.toUpperCase()}<div style={{flex:1,height:1,background:"#e5e7eb"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
                {items.map(p=>{
                  const qty=wiItems[p.id]||0;
                  const isSelected=qty>0;
                  return(
                    <div key={p.id} style={{background:"#fff",border:`1.5px solid ${isSelected?"#7c3aed":"#e5e7eb"}`,borderRadius:10,padding:"10px 12px",position:"relative"}}>
                      {isSelected&&<div style={{position:"absolute",top:6,right:8,background:"#7c3aed",color:"#fff",borderRadius:10,fontSize:10,fontWeight:700,padding:"2px 7px"}}>{qty}</div>}
                      <div style={{fontWeight:600,fontSize:13,color:"#212121",marginBottom:2,paddingRight:24}}>{p.name}</div>
                      <div style={{fontSize:10,color:"#9ca3af",marginBottom:6}}>{p.sku&&`SKU: ${p.sku} · `}{p.unit}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:"#059669"}}>{fmt(p.price)}</span>
                        <span style={{fontSize:11,color:p.shelf<5?"#dc2626":"#9ca3af",fontWeight:p.shelf<5?700:400}}>{p.shelf} left{p.shelf<5?" ⚠️":""}</span>
                      </div>
                      {isTaxableProd(p)&&<div style={{fontSize:9,background:"#fef3c7",color:"#92400e",padding:"2px 6px",borderRadius:4,display:"inline-block",marginBottom:6,fontWeight:700}}>TOBACCO TAX</div>}
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <button onClick={()=>setWiItems(prev=>({...prev,[p.id]:Math.max(0,(prev[p.id]||0)-1)}))} style={{width:26,height:26,borderRadius:"50%",border:"1.5px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",color:"#212121"}}>−</button>
                        <input type="number" min="0" max={p.shelf} value={qty||""} placeholder="0"
                          onChange={e=>setWiItems(prev=>({...prev,[p.id]:Math.min(p.shelf,Math.max(0,parseInt(e.target.value)||0))}))}
                          style={{flex:1,textAlign:"center",border:`1.5px solid ${isSelected?"#7c3aed":"#e5e7eb"}`,borderRadius:7,padding:"5px 4px",fontSize:13,fontWeight:700}}/>
                        <button onClick={()=>setWiItems(prev=>({...prev,[p.id]:Math.min(p.shelf,(prev[p.id]||0)+1)}))} disabled={qty>=p.shelf}
                          style={{width:26,height:26,borderRadius:"50%",border:"1.5px solid #e5e7eb",background:"#f9fafb",cursor:qty>=p.shelf?"not-allowed":"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",color:"#212121"}}>+</button>
                      </div>
                      {isSelected&&<div style={{fontSize:11,color:"#7c3aed",marginTop:5,textAlign:"right",fontWeight:600}}>{fmt(qty*p.price)}{isTaxableProd(p)?" +tax":""}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length===0&&<div style={{textAlign:"center",padding:"40px",color:"#9ca3af",fontSize:13}}>No products match your search</div>}
        </div>
      </div>
    </div>
  );
}

// ── IRS ALL STATES COMPONENT ─────────────────────────────────────────────────
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

// ── IRS REPORTS COMPONENT ─────────────────────────────────────────────────────
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
    if(!window.confirm("Delete this expense?"))return;
    const{error}=await supabase.from("expenses").delete().eq("id",id);
    if(error){showToast(error.message,"error");return;}
    setLocalExpenses(prev=>prev.filter(e=>e.id!==id));
    showToast("Expense deleted");
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

// ── STATE ACTIVATION COMPONENT ───────────────────────────────────────────────
// Simple: activate/deactivate states only. Rate config is in IRS Reports > All States
function StateTaxManager({stateTaxes,setStateTaxes,supabase,showToast}){
  const [search,setSearch]=useState("");
  const [adding,setAdding]=useState(false);

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
    showToast(`✅ ${stData.id} — ${stData.name} ${exempt?"added as exempt":"activated"}`);
    setAdding(false);
  };

  const remove=async(id)=>{
    if(!window.confirm(`Remove ${id} from active states?`))return;
    await supabase.from("state_taxes").delete().eq("id",id);
    setStateTaxes(prev=>prev.filter(s=>s.id!==id));
    showToast(`${id} removed`);
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
          <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>
            Activate states where you operate. To edit OTP &amp; cigarette tax rates, go to <strong>IRS Reports → 🗺 All States</strong>.
          </div>
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
        {stateTaxes.map(st=>(
          <div key={st.id} style={{background:"#fff",border:"1.5px solid #e5e7eb",borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
            {/* State badge */}
            <div style={{background:"#0a1628",color:"#fff",borderRadius:8,padding:"6px 12px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,flexShrink:0,minWidth:44,textAlign:"center"}}>
              {st.id}
            </div>
            {/* Name + status */}
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14,color:"#212121"}}>{st.name}</div>
              <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>
                {ref(st.id).due} of month · {ref(st.id).form}
              </div>
            </div>
            {/* Status badge */}
            {st.exempt
              ?<span style={{background:"#dcfce7",color:"#166534",padding:"4px 12px",borderRadius:6,fontSize:12,fontWeight:700}}>✅ Exempt</span>
              :<span style={{background:"#fef9c3",color:"#854d0e",padding:"4px 12px",borderRadius:6,fontSize:12,fontWeight:700}}>🏛 Active</span>
            }
            {/* Remove */}
            <button onClick={()=>remove(st.id)}
              style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:7,padding:"6px 10px",fontSize:12,color:"#dc2626",cursor:"pointer",fontWeight:700}}>
              🗑
            </button>
          </div>
        ))}
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

      <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 16px",fontSize:11,color:"#6b7280",marginTop:16}}>
        <strong>📌 Note:</strong> To edit OTP rates and cigarette tax rates, go to <strong>IRS Reports → 🗺 All States</strong> and click ✏️ on any state.
      </div>
    </div>
  );
}


// ── IRS ALL STATES COMPONENT ─────────────────────────────────────────────────


// ── IRS REPORTS COMPONENT ─────────────────────────────────────────────────────
// All 50 states + DC OTP (Other Tobacco Products) tax rates
// Source: State revenue departments, Tax Foundation 2025
// OTP rates = % of wholesale price (how wholesalers are taxed)


// ── STATE CONFIG COMPONENT ────────────────────────────────────────────────────
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
  const[loading,setLoading]=useState(true);

  // UI
  const[tab,setTab]=useState("dashboard");
  const[modal,setModal]=useState(null);
  const[saving,setSaving]=useState(false);
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
  const[nc,setNc]=useState({name:"",address:"",city:"",zip:"",state:"",phone:"",email:"",notes:"",truck_id:"",custom_pricing:false,custom_prices:{}});
  const[rsPid,setRsPid]=useState("");
  const[rsQty,setRsQty]=useState("");
  const[coEdit,setCoEdit]=useState(null);

  const isAdmin=profile?.role==="admin";
  const taxRate=0;// tax handled per-product via calcSaleTax

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
      const[coR,prR,trR,cuR,ldR,saR,rtR,pmR,orR,stR,exR]=await Promise.all([
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
    }catch(e){showToast("Error loading data","error");}
    setLoading(false);
  },[profile]);

  // Lookups
  const getP=id=>products.find(p=>p.id===id);
  const getT=id=>trucks.find(t=>t.id===id);
  const getC=id=>customers.find(c=>c.id===id);
  const activeLoad=tid=>loads.find(l=>l.truck_id===tid&&l.status==="out");
  const pmtFor=sid=>payments.find(p=>p.sale_id===sid);

  // ── STATE TAX HELPERS ──────────────────────────────────────────────────────
  // Tax applies to tobacco/nicotine category ONLY
  const isTaxableProd = p => TAXABLE_CATS.some(t=>p?.cat?.toLowerCase().includes(t)||p?.name?.toLowerCase().includes(t));

  const getStateTaxRate = stateId => {
    if(!stateId) return parseFloat(co?.tax_rate||0);
    const st = stateTaxes.find(s=>s.id===stateId);
    if(!st) return parseFloat(co?.tax_rate||0);
    return st.exempt ? 0 : parseFloat(st.rate||0);
  };

  // Calculate tax for a sale — only on taxable products
  const calcSaleTax = (sale) => {
    // Global tax toggle — if disabled return 0
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
  const totalTax=useMemo(()=>visSales.reduce((a,s)=>a+calcSaleTax(s),0),[visSales,stateTaxes,products]);
  const totalAR=useMemo(()=>visSales.filter(s=>pmtFor(s.id)?.status!=="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0),[visSales,payments,stateTaxes,products]);
  // Collected (paid only)
  const paidSales=useMemo(()=>visSales.filter(s=>pmtFor(s.id)?.status==="paid"),[visSales,payments]);
  const collectedRevenue=useMemo(()=>paidSales.reduce((a,s)=>a+s.total,0),[paidSales]);
  const collectedProfit=useMemo(()=>paidSales.reduce((a,s)=>a+s.profit,0),[paidSales]);

  const settlementData=tid=>{
    const ts=sales.filter(s=>s.truck_id===tid),tr=returns.filter(r=>r.truck_id===tid),al=loads.filter(l=>l.truck_id===tid);
    const rev=ts.reduce((a,s)=>a+s.total,0),prof=ts.reduce((a,s)=>a+s.profit,0);
    return{truckSales:ts,loadedUnits:al.reduce((a,l)=>a+(l.items||[]).reduce((b,i)=>b+i.qty,0),0),soldUnits:ts.reduce((a,s)=>a+(s.items||[]).reduce((b,i)=>b+i.qty,0),0),retUnits:tr.reduce((a,r)=>a+(r.items||[]).reduce((b,i)=>b+i.qty,0),0),rev,prof,cogs:rev-prof,tax:ts.reduce((a,s)=>a+calcSaleTax(s),0),collected:ts.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0),outstanding:ts.filter(s=>pmtFor(s.id)?.status!=="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0)};
  };

  // ── CSV IMPORT ─────────────────────────────────────────────────────────────
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
      for(const p of toUpdate){
        const existing=products.find(x=>x.sku===p.sku);
        if(!existing)continue;
        await supabase.from("products").update({name:p.name,cat:p.cat,unit:p.unit,cost:p.cost,price:p.price,shelf:p.shelf}).eq("id",existing.id);
        setProducts(prev=>prev.map(x=>x.sku===p.sku?{...x,...p,id:x.id}:x));
        updated++;
      }
      showToast(`✓ Imported: ${inserted} added, ${updated} updated`);
      setCsvPreview([]);setCsvErrors([]);setModal(null);
    }catch(e){showToast(e.message,"error");}
    setCsvImporting(false);
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
    if(nc.custom_pricing&&nc.custom_prices&&Object.keys(nc.custom_prices).length>0){
      rec.notes=(rec.notes?rec.notes+"\n":"")+"CUSTOM_PRICES:"+JSON.stringify(nc.custom_prices);
    }
    const{error}=await supabase.from("customers").insert(rec);
    if(error)showToast(error.message,"error");
    else{setCustomers(prev=>[...prev,rec]);showToast(`${nc.name} account opened`);setModal(null);setNc({name:"",address:"",city:"",zip:"",state:"",phone:"",email:"",notes:"",truck_id:"",custom_pricing:false,custom_prices:{}});}
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

  const deleteCustomer=async(id,name)=>{
    if(!window.confirm(`Delete customer "${name}"? This cannot be undone.`))return;
    try{
      await supabase.from("customers").delete().eq("id",id);
      setCustomers(prev=>prev.filter(c=>c.id!==id));
      showToast(`"${name}" deleted`);
    }catch(e){showToast(e.message,"error");}
  };

  // State tax is now managed in StateTaxManager component (State Activation tab)

  // ── LOAD / SALE / RETURN ───────────────────────────────────────────────────
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

  const openLoad=tid=>{
    const truck=trucks.find(t=>t.id===tid);
    if(truck?.locked)return showToast("Truck is locked — admin must unlock it first","error");
    setSelTruck(tid);
    setFormItems(products.map(p=>({pid:p.id,qty:0})));
    setModal("load");
  };
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
  const[pmForm,setPmForm]=useState({method:"cash",amount:"",check_number:"",bank_name:"",note:"",cust_id:"",truck_id:"",invoice_ids:[],receipt_url:""});
  const[pmTab,setPmTab]=useState("log"); // "log" | "collect"

  // Load payments log
  useEffect(()=>{
    if(authReady&&session&&profile){
      supabase.from("payments_log").select("*").order("created_at",{ascending:false}).then(({data})=>{if(data)setPaymentsLog(data);});
    }
  },[authReady,session,profile]);

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
  const exportInvoices=()=>{const rows=[["Invoice","Date","Customer","Driver","Subtotal","Tax (Tobacco)","Total","Profit","Status"]];visSales.forEach(s=>{const tax=calcSaleTax(s);const gt=calcSaleGrandTotal(s);rows.push([s.id,s.date,getC(s.cust_id)?.name,getT(s.truck_id)?.driver,s.total.toFixed(2),tax.toFixed(2),gt.toFixed(2),s.profit.toFixed(2),pmtFor(s.id)?.status==="paid"?"Paid":"Unpaid"]);});downloadCSV(rows,"invoices.csv");};
  const exportAR=()=>{const rows=[["Invoice","Customer","Driver","Subtotal","Tax (Tobacco)","Total","Balance","Status"]];visSales.forEach(s=>{const gt=calcSaleGrandTotal(s);rows.push([s.id,getC(s.cust_id)?.name,getT(s.truck_id)?.driver,s.total.toFixed(2),calcSaleTax(s).toFixed(2),gt.toFixed(2),pmtFor(s.id)?.status==="paid"?"0.00":gt.toFixed(2),pmtFor(s.id)?.status==="paid"?"Paid":"Unpaid"]);});downloadCSV(rows,"ar.csv");};
  const exportPL=()=>{const rows=[["Metric","Value"],["Revenue",totalRevenue.toFixed(2)],["Tax",totalTax.toFixed(2)],["COGS",(totalRevenue-totalProfit).toFixed(2)],["Gross Profit",totalProfit.toFixed(2)],["Margin %",totalRevenue>0?((totalProfit/totalRevenue)*100).toFixed(1)+"%":"0%"],["AR Outstanding",totalAR.toFixed(2)]];downloadCSV(rows,"pl.csv");};

  // NAV
  const navItems=[
    {id:"dashboard",label:"Dashboard",icon:ic.dash},
    {id:"inventory",label:"Inventory",icon:ic.box},
    {id:"walkin",label:"Walk-in Sale",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:13,marginRight:0}}>🏪</span>},
    {id:"orders",label:"Orders",icon:ic.orders,badge:orders.filter(o=>o.payment_method!=="card"&&o.status==="approved").length||0},
    {id:"sales",label:"Sales & Invoices",icon:ic.inv},
    {id:"taxinvoices",label:"Tax Invoices",icon:ic.inv},
    {id:"statetax",label:"State Activation",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:13}}>⚙️</span>},
    {id:"ar",label:"Accounts Receivable",icon:ic.ar},
    {id:"payments",label:"Payments",icon:ic.settle,badge:visSales.filter(s=>pmtFor(s.id)?.status!=="paid").length||0},
    {id:"settlement",label:"Daily Settlement",icon:ic.settle},
    ...(isAdmin?[{id:"pl",label:"P&L Report",icon:ic.pl}]:[]),
    ...(isAdmin?[{id:"irs",label:"IRS Reports",icon:<span style={{display:"inline-flex",width:16,height:16,alignItems:"center",justifyContent:"center",fontSize:13,marginRight:0}}>🏛</span>}]:[]),
    {id:"customers",label:"Customers",icon:ic.users},
    ...(isAdmin?[{id:"settings",label:"Settings",icon:ic.gear}]:[]),
  ];

  // Guards
  if(!authReady)return<div className="app"><GS/><Spinner msg="STARTING UP…"/></div>;
  if(!session)return<div className="app"><GS/><Login/></div>;
  if(loading)return<div className="app"><GS/><Spinner msg="LOADING YOUR DATA…"/></div>;

  // ── 2FA GATE ───────────────────────────────────────────────────────────────
  // Force 2FA verification even for cached sessions
  if(!mfaVerified&&profile?.role==="admin"){
    return<div className="app"><GS/><MFAGate onVerified={()=>setMfaVerified(true)}/></div>;
  }

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
            <div style={{height:1,background:"#d1d5db",marginBottom:8}}/>

            <div style={{height:1,background:"#d1d5db",marginBottom:8}}/>
            <div style={{fontSize:9,color:"#9ca3af",letterSpacing:".1em",marginBottom:5,paddingLeft:3}}>{isAdmin?"COMPANY":"MY"} TOTALS</div>
            {[{l:"Collected",v:fmt(collectedRevenue),c:"#059669"},{l:"Profit",v:fmt(collectedProfit),c:"#7c3aed"},{l:"AR Due",v:fmt(totalAR),c:"#dc2626"}].map(k=>(
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
              {[{l:"Collected",v:fmt(collectedRevenue),c:"#059669",s:`${paidSales.length} paid / ${visSales.length} total`},{l:"Gross Profit",v:fmt(collectedProfit),c:"#7c3aed",s:collectedRevenue>0?`${((collectedProfit/collectedRevenue)*100).toFixed(1)}% margin`:"—"},{l:"Tax Collected",v:fmt(paidSales.reduce((a,s)=>a+calcSaleTax(s),0)),c:"#7c3aed",s:"tobacco only"},{l:"AR Outstanding",v:fmt(totalAR),c:"#dc2626",s:"unpaid"}].map(k=>(
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
                        <div style={{fontSize:10,color:"#9ca3af"}}>{t.plate}{t.route&&` · ${t.route}`}</div>
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
                  <tr key={s.id}><td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed"}}>{s.id}</span></td><td style={{color:"#212121"}}>{getC(s.cust_id)?.name}</td><td style={{color:"#6b7280",fontSize:11}}>{s.date}</td><td>{fmt(s.total)}</td><td style={{color:"#7c3aed"}}>{fmt(calcSaleTax(s))}</td><td><span className="bdg bg2">{fmt(calcSaleGrandTotal(s))}</span></td><td><span className={`bdg ${pmtFor(s.id)?.status==="paid"?"bg2":"br2"}`}>{pmtFor(s.id)?.status==="paid"?"PAID":"UNPAID"}</span></td><td><button className="btn bb" style={{fontSize:10,padding:"4px 9px"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{ic.prt}</button></td>
                </tr>))}</tbody></table></div>
              )}
            </div>
          </div>}

          {/* ══ WALK-IN SALE ══ */}
          {tab==="walkin"&&<WalkInSale
            products={products} customers={customers} sales={sales}
            payments={payments} stateTaxes={stateTaxes} supabase={supabase}
            isTaxableProd={isTaxableProd} calcSaleTax={calcSaleTax}
            calcSaleGrandTotal={calcSaleGrandTotal} fmt={fmt} uid={uid}
            getP={getP} pmtFor={pmtFor}
            onSaleCreated={(ns)=>{setSales(prev=>[ns,...prev]);setProducts(prev=>prev.map(p=>{const fi=ns.items.find(i=>i.pid===p.id);return fi?{...p,shelf:Math.max(0,p.shelf-fi.qty)}:p;}));}}
          />}

          {/* ══ WALK-IN SALE PLACEHOLDER (REMOVED IIFE) ══ */}

          {/* Walk-in Sale IIFE removed - now a proper component */}

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
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
              {[
                {l:"Total Products",v:products.length,c:"#7c3aed"},
                {l:"Total Shelf Units",v:products.reduce((a,p)=>a+p.shelf,0),c:"#059669"},
                {l:"Total On Trucks",v:trucks.reduce((a,t)=>a+truckInv(t.id).reduce((b,i)=>b+i.remaining,0),0),c:"#0ea5e9"},
                {l:"Low Stock",v:products.filter(p=>p.shelf<5).length,c:"#dc2626"},
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
                  <th>Product</th><th>SKU</th><th>Category</th><th>Unit</th>
                  <th>Cost</th><th>Price</th><th>Margin</th><th>Shelf</th><th>Status</th>
                  {isAdmin&&<th>Actions</th>}
                </tr></thead>
                <tbody>{products.map(p=>{
                  const isE=editingPid===p.id;
                  const margin=p.price>0?((p.price-p.cost)/p.price*100).toFixed(0):0;
                  const low=p.shelf<5;
                  return(
                    <tr key={p.id} style={{background:isE?"#f5f3ff":low&&p.shelf>0?"#fff7ed":p.shelf===0?"#fef2f2":"#fff"}}>
                      {isE?(
                        <>
                          <td><input className="ei" value={editProd.name} onChange={e=>setEditProd(x=>({...x,name:e.target.value}))}/></td>
                          <td><input className="ei" value={editProd.sku} onChange={e=>setEditProd(x=>({...x,sku:e.target.value}))}/></td>
                          <td><input className="ei" value={editProd.cat} onChange={e=>setEditProd(x=>({...x,cat:e.target.value}))}/></td>
                          <td><input className="ei" value={editProd.unit} onChange={e=>setEditProd(x=>({...x,unit:e.target.value}))}/></td>
                          <td><input className="ei" type="number" value={editProd.cost} onChange={e=>setEditProd(x=>({...x,cost:e.target.value}))}/></td>
                          <td><input className="ei" type="number" value={editProd.price} onChange={e=>setEditProd(x=>({...x,price:e.target.value}))}/></td>
                          <td>—</td>
                          <td><input className="ei" type="number" value={editProd.shelf} onChange={e=>setEditProd(x=>({...x,shelf:e.target.value}))}/></td>
                          <td>—</td>
                          <td><div style={{display:"flex",gap:4}}><button className="btn bg" onClick={saveEditProduct} disabled={saving}>{ic.save}</button><button className="btn bgh" onClick={()=>setEditingPid(null)}>{ic.X}</button></div></td>
                        </>
                      ):(
                        <>
                          <td style={{fontWeight:600,color:"#212121"}}>{p.name}</td>
                          <td style={{fontFamily:"monospace",fontSize:11,color:"#6b7280"}}>{p.sku}</td>
                          <td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed"}}>{p.cat}</span></td>
                          <td style={{color:"#6b7280",fontSize:11}}>{p.unit}</td>
                          <td style={{color:"#6b7280"}}>{fmt(p.cost)}</td>
                          <td style={{fontWeight:600,color:"#059669"}}>{fmt(p.price)}</td>
                          <td><span style={{fontSize:11,color:margin>30?"#059669":margin>15?"#f59e0b":"#dc2626",fontWeight:600}}>{margin}%</span></td>
                          <td>
                            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:p.shelf===0?"#dc2626":low?"#f59e0b":"#059669"}}>{p.shelf}</span>
                          </td>
                          <td>
                            {p.shelf===0?<span className="bdg br2">OUT</span>:low?<span className="bdg ba2">LOW</span>:<span className="bdg bg2">OK</span>}
                          </td>
                          {isAdmin&&<td><div style={{display:"flex",gap:4}}>
                            <button className="btn bgh" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>startEditProduct(p)}>{ic.edit}</button>
                            <button className="btn bb" style={{fontSize:10,padding:"3px 8px"}} onClick={()=>{setRsPid(p.id);setRsQty("");setModal("restock");}}>{ic.plus}</button>
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
                <tbody>{visSales.map(s=>{const gt=calcSaleGrandTotal(s),pmt=pmtFor(s.id);return(
                  <tr key={s.id}><td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed"}}>{s.id}</span></td><td style={{color:"#6b7280",fontSize:11}}>{s.date}</td><td style={{color:"#212121"}}>{getC(s.cust_id)?.name}</td><td style={{color:"#6b7280"}}>{getT(s.truck_id)?.driver||"Walk-in"}</td><td>{fmt(s.total)}{s.previous_balance>0&&<span style={{fontSize:9,color:"#dc2626",marginLeft:4}}>+{fmt(s.previous_balance)} prev</span>}</td><td style={{color:"#7c3aed"}}>{fmt(calcSaleTax(s))}</td><td><span className="bdg bb2">{fmt(gt)}</span></td><td style={{color:"#059669",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{fmt(s.profit)}</td><td><span className={`bdg ${pmt?.status==="paid"?"bg2":"br2"}`}>{pmt?.status==="paid"?"PAID":"UNPAID"}</span></td>
                  <td><div style={{display:"flex",gap:5}}><button className="btn bb" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>{setViewSale(s);setModal("invoice");}}>{ic.prt} Invoice</button>{pmt?.status!=="paid"?<button className="btn bg" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>markPaid(s.id)}>{ic.chk} Pay</button>:<button className="btn bgh" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>markUnpaid(s.id)}>Undo</button>}{isAdmin&&<button className="btn br" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>deleteInvoice(s.id)}>{ic.X}</button>}</div></td>
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
                  <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{curStateExempt?"Tobacco/Nicotine sales are NOT taxable in this state":`Tobacco/Nicotine taxed at ${curStateTax}% · Other products not taxed`}</div>
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
                    📊 SALES SUMMARY {selState!=="ALL"?`— ${selState}`:"— ALL STATES"}
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
                            <td><span className="tag" style={{background:"#f5f3ff",color:"#7c3aed"}}>{s.id}</span></td>
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

          {/* ══ AR ══ */}
          {tab==="ar"&&<div className="fu">
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
              {[{l:"Total Billed",v:fmt(visSales.reduce((a,s)=>a+calcSaleGrandTotal(s),0)),c:"#7c3aed"},{l:"Collected",v:fmt(visSales.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0)),c:"#059669"},{l:"Outstanding",v:fmt(totalAR),c:"#dc2626"}].map(k=><div key={k.l} className="kpi"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>)}
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
                  <tbody>{filtered.map(s=>{const gt=calcSaleGrandTotal(s),pmt=pmtFor(s.id),paid=pmt?.status==="paid"?gt:0,due=gt-paid;return(
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
                  const gt=calcSaleGrandTotal(s);
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
                {[{s:"REVENUE",rows:[{l:"Gross Sales",v:fmt(totalRevenue),c:"#059669"},{l:"Tax (Tobacco only)",v:fmt(totalTax),c:"#7c3aed"},{l:"Total incl. Tax",v:fmt(totalRevenue+totalTax),c:"#7c3aed",b:true}]},{s:"COST & PROFIT",rows:[{l:"COGS",v:fmt(totalRevenue-totalProfit),c:"#dc2626"},{l:"Gross Profit",v:fmt(totalProfit),c:"#059669",b:true},{l:"Gross Margin",v:totalRevenue>0?`${((totalProfit/totalRevenue)*100).toFixed(1)}%`:"0%",c:"#7c3aed",b:true}]},{s:"INVENTORY",rows:[{l:"Shelf Value (cost)",v:fmt(products.reduce((a,p)=>a+p.shelf*p.cost,0)),c:"#6b7280"},{l:"Shelf Value (retail)",v:fmt(products.reduce((a,p)=>a+p.shelf*p.price,0)),c:"#059669"}]},{s:"RECEIVABLES",rows:[{l:"Total Invoiced",v:fmt(sales.reduce((a,s)=>a+calcSaleGrandTotal(s),0)),c:"#7c3aed"},{l:"Collected",v:fmt(sales.filter(s=>pmtFor(s.id)?.status==="paid").reduce((a,s)=>a+calcSaleGrandTotal(s),0)),c:"#059669"},{l:"Outstanding",v:fmt(totalAR),c:"#dc2626",b:true}]}].map(sec=>(
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
                          {c.notes&&<div style={{fontSize:10,color:"#6b7280",fontStyle:"italic",marginTop:2}}>📝 {c.notes}</div>}
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end"}}>
                        {truck&&<span className="bdg bb2">{truck.route||truck.plate}</span>}
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
                  {[{l:"Company Name",k:"name"},{l:"Address",k:"address"},{l:"Phone",k:"phone"},{l:"Email",k:"email"},{l:`Default Tax Rate (%)`,k:"tax_rate"},{l:"Stripe Payment Link (for driver card QR)",k:"stripe_payment_link"}].map(f=>(
                    <div key={f.k}><label>{f.l}</label><input value={coEdit[f.k]||""} onChange={e=>setCoEdit(prev=>({...prev,[f.k]:e.target.value}))}/></div>
                  ))}

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
                            const baseNotes=(cust.notes||"").replace(/CUSTOM_PRICES:{.*?}/g,"").trim();
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
                {st.exempt?`✅ ${nc.state} — Tax Exempt`:`🏛 ${nc.state} — ${st.rate}% tobacco/vape tax`}
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
                {fi.qty>0&&<div style={{fontSize:10,color:"#059669",marginTop:3,textAlign:"right"}}>{fmt(fi.qty*p.price)}{isTaxableProd(p)?" + tax":""}</div>}
              </div>
            );})}
          </div>
          <Divider/>
          {(()=>{const sub=formItems.reduce((a,fi)=>{const p=getP(fi.pid);return a+(p?.price||0)*fi.qty;},0);const tax=calcSaleTax({items:formItems.map(fi=>({pid:fi.pid,qty:fi.qty})),cust_id:selCust,state:customers.find(c=>c.id===selCust)?.state||""}),gt=sub+tax,prof=formItems.reduce((a,fi)=>{const p=getP(fi.pid);return a+((p?.price||0)-(p?.cost||0))*fi.qty;},0);return<div style={{background:"#f9fafb",borderRadius:7,padding:"11px 13px",marginBottom:12}}>{[{l:"Subtotal",v:fmt(sub),c:"#6b7280"},{l:"Tax (Tobacco only)",v:fmt(tax),c:"#7c3aed"},{l:"Grand Total",v:fmt(gt),c:"#7c3aed"},{l:"Your Profit",v:fmt(prof),c:"#059669"}].map(k=><div key={k.l} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:"#6b7280"}}>{k.l}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:k.l==="Grand Total"?16:13,color:k.c}}>{k.v}</span></div>)}</div>;})()}
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
