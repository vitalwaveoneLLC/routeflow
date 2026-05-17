// ─────────────────────────────────────────────────────────────────────────────
// VitalWaveOne LLC — Customer Order Portal
// • New customers: register (business name, owner, email, phone, address)
// • Existing customers: find store → order instantly
// • Live inventory from Supabase
// • Proforma invoice PDF on submission
// • Admin sees & approves in RouteFlow
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabase";

// ── STYLES ────────────────────────────────────────────────────────────────────
const GS = () => (
  <>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <style>{`
      *{box-sizing:border-box;margin:0;padding:0;}
      body{background:#f8f5f0;font-family:'Inter',sans-serif;}
      .portal{min-height:100vh;background:#f8f5f0;}
      input,select,textarea{font-family:'Inter',sans-serif;transition:all .15s;}
      input:focus,select:focus,textarea:focus{outline:none;}
      @keyframes fu{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
      @keyframes pu{0%,100%{opacity:1;}50%{opacity:.4;}}
      .pu{animation:pu 1.5s infinite;}
      .fu{animation:fu .28s ease forwards;}
      @keyframes spin{to{transform:rotate(360deg);}}
      .sp{animation:spin .7s linear infinite;display:inline-block;}
      .btn-primary{background:#0a1628;color:#fff;border:none;border-radius:10px;padding:13px 28px;font-family:'Inter',sans-serif;font-weight:600;font-size:14px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
      .btn-primary:hover{background:#162540;transform:translateY(-1px);box-shadow:0 6px 20px #0a162830;}
      .btn-primary:disabled{background:#8a9ab0;cursor:not-allowed;transform:none;}
      .btn-amber{background:#f59e0b;color:#0a0e18;border:none;border-radius:10px;padding:13px 28px;font-family:'Inter',sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
      .btn-amber:hover{background:#fbbf24;transform:translateY(-1px);box-shadow:0 6px 20px #f59e0b40;}
      .btn-amber:disabled{background:#c4a050;cursor:not-allowed;transform:none;}
      .btn-ghost{background:transparent;color:#6b7280;border:1.5px solid #d1d5db;border-radius:10px;padding:11px 20px;font-family:'Inter',sans-serif;font-weight:500;font-size:13px;cursor:pointer;transition:all .2s;}
      .btn-ghost:hover{border-color:#0a1628;color:#0a1628;}
      .field{display:flex;flex-direction:column;gap:5px;}
      .field label{font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;}
      .field input,.field select,.field textarea{background:#fff;border:1.5px solid #e5e7eb;border-radius:9px;padding:11px 14px;font-size:14px;color:#111;width:100%;}
      .field input:focus,.field select:focus,.field textarea:focus{border-color:#0a1628;box-shadow:0 0 0 3px #0a162814;}
      .field input.error,.field select.error{border-color:#ef4444;}
      .card{background:#fff;border-radius:16px;border:1px solid #e5e7eb;box-shadow:0 2px 16px #00000008;}
      .step-dot{width:10px;height:10px;border-radius:50%;transition:all .3s;}
      .cat-tag{padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.05em;display:inline-block;}
      .qty-btn{width:32px;height:32px;border-radius:50%;border:1.5px solid #e5e7eb;background:#fff;color:#374151;font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;transition:all .15s;}
      .qty-btn:hover{background:#0a1628;color:#fff;border-color:#0a1628;}
      .prod-row{border-bottom:1px solid #f3f4f6;transition:background .1s;}
      .prod-row:hover{background:#fafafa;}
      .prod-row:last-child{border-bottom:none;}
      @media(max-width:640px){
        .grid2{grid-template-columns:1fr!important;}
        .hide-sm{display:none!important;}
        .prod-grid{grid-template-columns:50px 1fr 80px 110px!important;}
      }
      @media print{
        .no-print{display:none!important;}
        body{background:#fff!important;}
        .inv{box-shadow:none!important;}
      }
    `}</style>
  </>
);

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = n => `$${Number(n||0).toFixed(2)}`;
const uid = () => Math.random().toString(36).slice(2,9).toUpperCase();
const nowStr = () => new Date().toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"});
const CAT_COLORS = {Beverage:"#0ea5e9",Tobacco:"#8b5cf6",Snack:"#f59e0b",Health:"#10b981",Misc:"#6b7280",Other:"#64748b"};
const catC = c => CAT_COLORS[c]||"#64748b";

// ── TAX HELPER (tobacco/nicotine/vape only) ──────────────────────────────────
const CARD_FEE = 3; // Card surcharge percentage
const TAXABLE_CATS_GLOBAL = ["tobacco","nicotine","cigarette","cigar","vape","hookah","chew","dip","snuff"];
const isTaxableProd=p=>{const c=(p?.cat||"").toLowerCase().trim(),n=(p?.name||"").toLowerCase().trim();return["tobacco","nicotine","cigarette","cigar","vape","hookah","chew","dip","snuff","smoke","eliquid","e-liquid","pod","disposable"].some(t=>c.includes(t)||n.includes(t));};
const calcItemTax = (p, qty, rate) => isTaxableProd(p) ? parseFloat(((p?.price||0)*qty*rate/100).toFixed(2)) : 0;
const calcOrderTax = (items, products, rate) => items.reduce((a,i)=>{
  const p = products.find(x=>x.id===i.pid);
  return a + calcItemTax(p, i.qty, rate);
}, 0);
// Parse custom prices stored in customer notes
const parseCustomPrices=cust=>{try{const m=(cust?.notes||"").match(/CUSTOM_PRICES:({.*?})/);return m?JSON.parse(m[1]):{};}catch{return{};}};
const getEffectivePrice=(cust,p)=>{if(!cust||!p)return p?.price||0;const cp=parseCustomPrices(cust);const custom=cp[p.id];return(custom&&parseFloat(custom)>0)?parseFloat(custom):(p?.price||0);};



// ── PROFORMA INVOICE ──────────────────────────────────────────────────────────
const Invoice = ({order, products, co, stateTaxes, custState}) => {

  const stData = stateTaxes?.find(s=>s.id===(custState||"TX"));
  const stateRate = stData?.exempt ? 0 : parseFloat(stData?.rate||co?.tax_rate||0);
  const custObj = {notes: order.custNotes||""};
  const sub = order.items.reduce((a,i)=>{const p=products.find(x=>x.id===i.pid);return a+getEffectivePrice(custObj,p)*i.qty;}, 0);
  const taxAmt = parseFloat((order.items.reduce((a,i)=>{
    const p=products.find(x=>x.id===i.pid);
    return isTaxableProd(p)?a+getEffectivePrice(custObj,p)*i.qty:a;
  },0)*stateRate/100).toFixed(2));
  const total = sub+taxAmt;
  return (
    <div className="inv" style={{background:"#fff",fontFamily:"'Inter',sans-serif",borderRadius:14,overflow:"hidden",boxShadow:"0 4px 32px #00000012",maxWidth:760,margin:"0 auto"}}>
      {/* Header */}
      <div style={{background:"#0a1628",padding:"24px 32px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14}}>
        <div>
          <div style={{fontSize:11,fontWeight:600,color:"#f59e0b",letterSpacing:".12em",marginBottom:4}}>PROFORMA INVOICE</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:"#fff",lineHeight:1}}>Order #{order.id}</div>
          <div style={{fontSize:11,color:"#4b6080",marginTop:8}}>{order.date}</div>
          <div style={{marginTop:10}}><span style={{background:"#f59e0b22",color:"#f59e0b",padding:"4px 12px",borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:".08em"}}>PENDING ADMIN APPROVAL</span></div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"#fff"}}>{co?.name||"VitalWaveOne LLC"}</div>
          <div style={{fontSize:11,color:"#4b6080",lineHeight:1.9,marginTop:6}}>{co?.address}<br/>{co?.phone}<br/>{co?.email}</div>
        </div>
      </div>

      {/* Bill To */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",background:"#f9f8f5",borderBottom:"1px solid #e5e7eb"}}>
        <div style={{padding:"18px 32px",borderRight:"1px solid #e5e7eb"}}>
          <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",letterSpacing:".14em",marginBottom:8,textTransform:"uppercase"}}>Bill To</div>
          <div style={{fontWeight:700,fontSize:15,color:"#111"}}>{order.businessName}</div>
          <div style={{fontSize:12,color:"#6b7280",marginTop:3}}>{order.ownerName}</div>
          {order.address&&<div style={{fontSize:12,color:"#6b7280",marginTop:2,lineHeight:1.6}}>{order.address}</div>}
          {order.phone&&<div style={{fontSize:12,color:"#6b7280"}}>📞 {order.phone}</div>}
          {order.email&&<div style={{fontSize:12,color:"#6b7280"}}>✉️ {order.email}</div>}
        </div>
        <div style={{padding:"18px 32px"}}>
          <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",letterSpacing:".14em",marginBottom:8,textTransform:"uppercase"}}>Order Details</div>
          {[["Order #",order.id],["Date",order.date],["Status","Pending Approval"],["Payment","Due on Delivery"]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:12,color:"#9ca3af"}}>{l}</span>
              <span style={{fontSize:12,fontWeight:600,color:"#111"}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div style={{padding:"20px 32px"}}>
        {order.notes&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#92400e"}}><strong>Note:</strong> {order.notes}</div>}
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:"#0a1628"}}>
              {["Stock #","SKU","Description","Category","Unit","Qty","Unit Price","Amount"].map(h=>(
                <th key={h} style={{padding:"9px 10px",fontSize:9,fontWeight:700,color:"#6b7280",letterSpacing:".08em",textTransform:"uppercase",textAlign:["Qty","Unit Price","Amount"].includes(h)?"right":"left"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((item,i)=>{
              const p=products.find(x=>x.id===item.pid);
              return (
                <tr key={i} style={{borderBottom:"1px solid #f3f4f6",background:i%2?"#fafafa":"#fff"}}>
                  <td style={{padding:"10px 10px",fontSize:11,color:"#9ca3af",fontFamily:"monospace"}}>{p?.id||"—"}</td>
                  <td style={{padding:"10px 10px",fontSize:11,fontFamily:"monospace",fontWeight:600,color:"#374151"}}>{p?.sku||"—"}</td>
                  <td style={{padding:"10px 10px",fontSize:13,fontWeight:600,color:"#111"}}>{p?.name||item.name}</td>
                  <td style={{padding:"10px 10px"}}><span className="cat-tag" style={{background:catC(p?.cat)+"18",color:catC(p?.cat)}}>{p?.cat||"—"}</span></td>
                  <td style={{padding:"10px 10px",fontSize:11,color:"#6b7280"}}>{p?.unit||"—"}</td>
                  <td style={{padding:"10px 10px",textAlign:"right",fontWeight:700,fontSize:14}}>{item.qty}</td>
                  <td style={{padding:"10px 10px",textAlign:"right",fontSize:12,color:"#6b7280"}}>{fmt(getEffectivePrice(custObj,p))}</td>
                  <td style={{padding:"10px 10px",textAlign:"right",fontWeight:700,fontSize:14}}>{fmt(item.qty*getEffectivePrice(custObj,p))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}>
          <div style={{width:280}}>
            {[["Subtotal",fmt(sub)],...(taxAmt>0?[["Tobacco/Vape Tax",fmt(taxAmt)]]:[])].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f3f4f6"}}>
                <span style={{fontSize:13,color:"#6b7280"}}>{l}</span><span style={{fontSize:13}}>{v}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"13px 0",borderTop:"2px solid #0a1628",marginTop:4}}>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"#0a1628"}}>Total Due</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"#f59e0b"}}>{fmt(total)}</span>
            </div>
          </div>
        </div>

        <div style={{marginTop:24,paddingTop:14,borderTop:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{fontSize:11,color:"#9ca3af",lineHeight:1.7}}>This is a proforma invoice pending admin approval.<br/>A confirmed invoice will be issued upon delivery. Payment due on delivery.</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,color:"#0a1628",opacity:.3}}>VitalWaveOne LLC</div>
        </div>
      </div>
    </div>
  );
};

// ── MAIN PORTAL ───────────────────────────────────────────────────────────────
// ── DRIVER INVOICE VIEW ───────────────────────────────────────────────────────
function DriverInvoiceView({sale, customers, products, co, driver, stateTaxes}){
  const cust = customers.find(c=>c.id===sale.cust_id);

  const stateId = sale.state||cust?.state||"";
  const stData = stateTaxes?.find(s=>s.id===stateId);
  const stateRate = stData?.exempt ? 0 : parseFloat(stData?.rate||co?.tax_rate||0);
  const sub = sale.total;
  const tax = parseFloat(((sale.items||[]).reduce((a,i)=>{
    const p=products.find(x=>x.id===i.pid);
    return isTaxableProd(p)?a+getEffectivePrice(cust,p)*i.qty:a;
  },0)*stateRate/100).toFixed(2));
  const gt = sub+tax;
  return(
    <div style={{fontFamily:"'Inter',sans-serif"}}>
      <div style={{background:"#7c3aed",padding:"16px 20px",borderRadius:"8px 8px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{color:"#fff",fontWeight:800,fontSize:18}}>INVOICE <span style={{fontSize:13,fontWeight:400,color:"#ddd6fe"}}>#{sale.id}</span></div>
        <div style={{textAlign:"right",color:"#fff",fontSize:11}}>{co?.name}<br/>{co?.phone}</div>
      </div>
      <div style={{background:"#f9fafb",padding:"12px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,borderBottom:"1px solid #e5e7eb"}}>
        <div><div style={{fontSize:9,color:"#9ca3af",fontWeight:700,letterSpacing:".1em",marginBottom:3}}>BILL TO</div><div style={{fontWeight:700}}>{cust?.name}</div>{cust?.address&&<div style={{fontSize:11,color:"#6b7280"}}>{cust.address}</div>}{cust?.phone&&<div style={{fontSize:11,color:"#6b7280"}}>{cust.phone}</div>}</div>
        <div><div style={{fontSize:9,color:"#9ca3af",fontWeight:700,letterSpacing:".1em",marginBottom:3}}>DETAILS</div><div style={{fontWeight:700}}>{sale.date}</div><div style={{fontSize:11,color:"#6b7280"}}>Driver: {driver}</div></div>
      </div>
      <div style={{padding:"12px 20px"}}>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:12}}>
          <thead><tr>{["Product","Qty","Price","Total"].map(h=><th key={h} style={{textAlign:h==="Product"?"left":"right",padding:"6px 8px",fontSize:10,color:"#6b7280",fontWeight:700,borderBottom:"2px solid #111"}}>{h}</th>)}</tr></thead>
          <tbody>{(sale.items||[]).map((item,i)=>{const p=products.find(x=>x.id===item.pid);const ep=getEffectivePrice(cust,p);return(<tr key={i}>{[p?.name||item.name,item.qty,`$${ep.toFixed(2)}`,`$${(item.qty*ep).toFixed(2)}`].map((v,j)=><td key={j} style={{textAlign:j===0?"left":"right",padding:"8px",borderBottom:"1px solid #f3f4f6",fontSize:13,fontWeight:j===3?700:400}}>{v}</td>)}</tr>);})}</tbody>
        </table>
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <div style={{width:220}}>
            {[["Subtotal",`$${sub.toFixed(2)}`],tax>0?["Tobacco/Vape Tax",`$${tax.toFixed(2)}`]:null,parseFloat(sale.previous_balance||0)>0?[`⚠️ Prev. Balance (${sale.previous_invoice_ids||""})`,`$${parseFloat(sale.previous_balance||0).toFixed(2)}`]:null].filter(Boolean).map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f3f4f6",background:l.includes("Prev")?"#fef2f2":"transparent",margin:l.includes("Prev")?"0 -4px":0,padding:l.includes("Prev")?"5px 4px":"5px 0"}}><span style={{fontSize:12,color:l.includes("Prev")?"#dc2626":"#6b7280",fontWeight:l.includes("Prev")?700:400}}>{l}</span><span style={{fontSize:12,color:l.includes("Tax")?"#059669":l.includes("Prev")?"#dc2626":"#212121",fontWeight:l.includes("Prev")?700:400}}>{v}</span></div>)}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"2px solid #111"}}><span style={{fontWeight:800,fontSize:14}}>TOTAL DUE</span><span style={{fontWeight:900,fontSize:20,color:"#7c3aed"}}>${(gt+parseFloat(sale.previous_balance||0)).toFixed(2)}</span></div>
          </div>
        </div>
        <div style={{marginTop:12,background:"#f9fafb",borderRadius:7,padding:"10px 12px",fontSize:11,color:"#6b7280"}}>
          Payment: Cash · Check · Money Order · Zelle (free) | Credit/Debit Card (+3%)
        </div>
      </div>
    </div>
  );
}

// ── DRIVER LOAD TAB ───────────────────────────────────────────────────────────
function DriverLoadTab({driverData, setDriverData, products, supabase, co}){
  const [items, setItems] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const uid = ()=>Math.random().toString(36).slice(2,8).toUpperCase();
  const isLocked = driverData.truck?.locked;

  const confirmLoad = async () => {
    if(isLocked) return setMsg({t:"error",m:"Your truck is locked by admin. Contact your manager."});
    const loadItems = products.filter(p=>items[p.id]>0).map(p=>({pid:p.id,qty:parseInt(items[p.id])}));
    if(!loadItems.length) return setMsg({t:"error",m:"Add at least one product"});

    // Hard validation — ensure no item exceeds shelf stock
    const overLimit = loadItems.find(i=>{
      const p=products.find(x=>x.id===i.pid);
      return !p || i.qty > p.shelf;
    });
    if(overLimit){
      const p=products.find(x=>x.id===overLimit.pid);
      return setMsg({t:"error",m:`⚠️ Only ${p?.shelf} of "${p?.name}" available on shelf — can't load ${overLimit.qty}`});
    }

    setSaving(true);
    try{
      const nl = {id:"LD-"+uid(),truck_id:driverData.truck?.id,date:new Date().toLocaleDateString(),items:loadItems,status:"out",created_at:new Date().toISOString()};
      const {error} = await supabase.from("loads").insert(nl);
      if(error) throw error;
      await Promise.all(loadItems.map(item=>{
        const p=products.find(x=>x.id===item.pid);
        return p?supabase.from("products").update({shelf:Math.max(0,p.shelf-item.qty)}).eq("id",p.id):Promise.resolve();
      }));
      setDriverData(prev=>({...prev,activeLoad:nl}));
      setMsg({t:"success",m:`✅ Loaded ${loadItems.reduce((a,i)=>a+i.qty,0)} units! Ready to sell.`});
      setItems({});
    }catch(e){setMsg({t:"error",m:e.message});}
    setSaving(false);
  };

  if(isLocked) return(
    <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"24px",textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:10}}>🔒</div>
      <div style={{fontWeight:700,fontSize:16,color:"#dc2626",marginBottom:8}}>Truck Locked</div>
      <div style={{fontSize:13,color:"#6b7280"}}>Your truck has been locked by admin. Contact your manager to unlock.</div>
    </div>
  );

  return(
    <div>
      <div style={{fontWeight:700,fontSize:14,color:"#0a1628",marginBottom:4}}>📦 Load Your Truck</div>
      <div style={{fontSize:12,color:"#6b7280",marginBottom:14}}>Enter quantities you are loading onto the truck</div>
      {driverData.activeLoad&&<div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#0369a1"}}>
        ✅ Active load exists. You can reload additional products below.
      </div>}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
        {products.filter(p=>p.shelf>0).map(p=>(
          <div key={p.id} className="card" style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13}}>{p.name}</div>
              <div style={{fontSize:11,color:"#9ca3af"}}>In warehouse: <span style={{color:"#059669",fontWeight:700}}>{p.shelf}</span> · ${p.price.toFixed(2)} std</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <button onClick={()=>setItems(prev=>({...prev,[p.id]:Math.max(0,(prev[p.id]||0)-1)}))} style={{width:28,height:28,borderRadius:"50%",border:"1.5px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
              <input type="number" min="0" max={p.shelf} value={items[p.id]||""} placeholder="0"
                onChange={e=>setItems(prev=>({...prev,[p.id]:Math.min(p.shelf,Math.max(0,parseInt(e.target.value)||0))}))}
                style={{width:54,textAlign:"center",border:`1.5px solid ${items[p.id]>0?"#0ea5e9":"#e5e7eb"}`,borderRadius:7,padding:"5px",fontSize:13,fontWeight:700}}/>
              <button onClick={()=>setItems(prev=>({...prev,[p.id]:Math.min(p.shelf,(prev[p.id]||0)+1)}))} style={{width:28,height:28,borderRadius:"50%",border:"1.5px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
          </div>
        ))}
        {products.filter(p=>p.shelf>0).length===0&&<div style={{textAlign:"center",padding:"20px",color:"#9ca3af",fontSize:13}}>No products in warehouse</div>}
      </div>
      {msg&&<div style={{background:msg.t==="success"?"#f0fdf4":"#fef2f2",border:`1px solid ${msg.t==="success"?"#a7f3d0":"#fecaca"}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:msg.t==="success"?"#065f46":"#dc2626",marginBottom:12}}>{msg.m}</div>}
      <button onClick={confirmLoad} disabled={saving} style={{width:"100%",background:"#0ea5e9",color:"#fff",border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
        {saving?"Loading...":"📦 Confirm Load"}
      </button>
    </div>
  );
}


// ── DRIVER SELL TAB ───────────────────────────────────────────────────────────
function DriverSellTab({driverData, setDriverData, products, supabase, co, initCust, setDriverSaleCust, payForm, setPayForm, paymentSaving, setPaymentSaving, collectPayment, createdSale, setCreatedSale, showPayment, setShowPayment}){
  const [selCust, setSelCust] = useState(initCust||"");
  const [items, setItems] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanInput, setScanInput] = useState("");
  const [editInv, setEditInv] = useState(null);
  const [freshCustState, setFreshCustState] = useState("");
  const uid = ()=>Math.random().toString(36).slice(2,8).toUpperCase();
  const fmt = v=>`$${parseFloat(v||0).toFixed(2)}`;

  const [custUnpaidBalance, setCustUnpaidBalance] = useState(0);
  const [custUnpaidInvs, setCustUnpaidInvs] = useState([]);
  const [showNewCust, setShowNewCust] = useState(false);
  const [newCust, setNewCust] = useState({name:"",address:"",city:"",zip:"",state:"",phone:"",email:""});
  const [newCustSaving, setNewCustSaving] = useState(false);
  const [newCustMsg, setNewCustMsg] = useState(null);
  const [stripeLink, setStripeLink] = useState("");

  useEffect(()=>{
    // Always fetch fresh to ensure we have the latest link
    supabase.from("company").select("stripe_payment_link").single()
      .then(({data})=>{
        const link = data?.stripe_payment_link || co?.stripe_payment_link || driverData.co?.stripe_payment_link || "";
        setStripeLink(link);
      });
  },[co?.stripe_payment_link, driverData.co?.stripe_payment_link]);

  // Fetch stripe payment link directly
  useEffect(()=>{
    supabase.from("company").select("stripe_payment_link").single()
      .then(({data})=>{ if(data?.stripe_payment_link) setStripeLink(data.stripe_payment_link); });
  },[co?.stripe_payment_link, driverData.co?.stripe_payment_link]);
  const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

  const handleCustSelect = async (custId) => {
    setSelCust(custId);
    setCustUnpaidBalance(0);
    setCustUnpaidInvs([]);
    if(!custId){setFreshCustState("");return;}
    // Fetch fresh state and unpaid balances in parallel
    const [{data:custData}, {data:unpaidPmts}, {data:custSales}] = await Promise.all([
      supabase.from("customers").select("state").eq("id",custId).single(),
      supabase.from("payments").select("sale_id,status").eq("status","unpaid"),
      supabase.from("sales").select("id,total,state,items,date").eq("cust_id",custId),
    ]);
    setFreshCustState(custData?.state||"");
    if(custSales && unpaidPmts){
      const unpaidIds = new Set(unpaidPmts.map(p=>p.sale_id));
      const unpaidSales = custSales.filter(s=>unpaidIds.has(s.id));
      // Also include sales with no payment record at all
      const {data:allPmts} = await supabase.from("payments").select("sale_id").in("sale_id", custSales.map(s=>s.id));
      const paidSaleIds = new Set((allPmts||[]).filter(p=>p.status!=="unpaid").map(p=>p.sale_id));
      const noPmtSales = custSales.filter(s=>!(allPmts||[]).find(p=>p.sale_id===s.id));
      const allUnpaid = [...unpaidSales, ...noPmtSales].filter((s,i,arr)=>arr.findIndex(x=>x.id===s.id)===i);
      // Include tax and any nested previous balance in outstanding amount
      const totalUnpaid = allUnpaid.reduce((a,s)=>{
        const st = driverData?.stateTaxes?.find(x=>x.id===(s.state||""));
        const rate = st?.exempt ? 0 : parseFloat(st?.rate||0);
        const taxable = (s.items||[]).reduce((b,i)=>{
          const p = products.find(x=>x.id===i.pid);
          return isTaxableProd(p) ? b+(p?.price||0)*i.qty : b;
        }, 0);
        const tax = parseFloat((taxable*rate/100).toFixed(2));
        return a + s.total + tax + parseFloat(s.previous_balance||0);
      }, 0);
      setCustUnpaidBalance(parseFloat(totalUnpaid.toFixed(2)));
      setCustUnpaidInvs(allUnpaid);
    }
  };

  const loadedItems = driverData.activeLoad?.items||[];
  const availableProducts = products.filter(p=>loadedItems.find(i=>i.pid===p.id));

  // Get all load IDs for this truck's active loads
  const allLoadIds = driverData.activeLoad?._allLoadIds || (driverData.activeLoad ? [driverData.activeLoad.id] : []);

  // Calculate sold from ALL active loads
  const soldMap = driverData.sales
    .filter(s=>allLoadIds.includes(s.load_id))
    .reduce((acc,s)=>{
      (s.items||[]).forEach(i=>{ acc[i.pid]=(acc[i.pid]||0)+i.qty; });
      return acc;
    },{});

  // Remaining on truck — never negative
  const getRemainingQty = (pid) => {
    const loaded = loadedItems.find(i=>i.pid===pid)?.qty||0;
    const sold   = soldMap[pid]||0;
    return Math.max(0, loaded - sold);
  };

  // Split into available (remaining > 0) and out-of-stock on truck
  const inStockProducts  = availableProducts.filter(p=>getRemainingQty(p.id)>0);
  const outStockProducts = availableProducts.filter(p=>getRemainingQty(p.id)===0);
  // Use freshly fetched customer state for accurate tax
  const selCustObj = driverData.customers.find(c=>c.id===selCust);
  const custStateId = freshCustState || selCustObj?.state || driverData.truck?.state || "";
  const custStateTax = driverData.stateTaxes?.find(s=>s.id===custStateId);
  const driverTaxRate = custStateTax?.exempt ? 0 : parseFloat(custStateTax?.rate||0);
  const sub = inStockProducts.reduce((a,p)=>a+getEffectivePrice(selCustObj,p)*(items[p.id]||0),0);
  const hasTaxableItems = inStockProducts.some(p=>isTaxableProd(p)&&(items[p.id]||0)>0);
  const tax = parseFloat((inStockProducts.reduce((a,p)=>isTaxableProd(p)?(a+getEffectivePrice(selCustObj,p)*(items[p.id]||0)):a,0)*driverTaxRate/100).toFixed(2));
  const gt = sub+tax;
  const profit = inStockProducts.reduce((a,p)=>a+(getEffectivePrice(selCustObj,p)-(p.cost||0))*(items[p.id]||0),0);

  const handleScan = (code) => {
    // Check in-stock truck products first
    const match = inStockProducts.find(p=>p.sku?.toLowerCase()===code.toLowerCase()||p.id?.toLowerCase()===code.toLowerCase());
    if(match){
      const remaining = getRemainingQty(match.id);
      const current = items[match.id]||0;
      if(current >= remaining) return setMsg({t:"error",m:`⚠️ Only ${remaining} of "${match.name}" left on truck`});
      setItems(prev=>({...prev,[match.id]:current+1}));
      setMsg({t:"success",m:`✓ ${match.name} added`});
    } else {
      // Check if it's out-of-stock on truck but available on shelf
      const outMatch = outStockProducts.find(p=>p.sku?.toLowerCase()===code.toLowerCase()||p.id?.toLowerCase()===code.toLowerCase());
      if(outMatch) setMsg({t:"error",m:`🚫 "${outMatch.name}" is sold out on your truck. ${outMatch.shelf>0?`${outMatch.shelf} units available on warehouse shelf.`:"None on shelf either."}`});
      else setMsg({t:"error",m:`No product found: ${code}`});
    }
    setScanInput("");
    setTimeout(()=>setMsg(null),4000);
  };

  const confirmSale = async () => {
    if(!selCust) return setMsg({t:"error",m:"Select a customer"});
    const saleItems = inStockProducts.filter(p=>(items[p.id]||0)>0).map(p=>({pid:p.id,qty:items[p.id]}));
    if(!saleItems.length) return setMsg({t:"error",m:"Add at least one product"});

    // Hard server-side guard — ensure no qty exceeds what's actually on the truck
    const overLimit = saleItems.find(i=>i.qty > getRemainingQty(i.pid));
    if(overLimit){
      const p = products.find(x=>x.id===overLimit.pid);
      return setMsg({t:"error",m:`⚠️ Only ${getRemainingQty(overLimit.pid)} of "${p?.name}" remaining on truck. Adjust quantity.`});
    }

    setSaving(true);
    try{
      const {data:seqData} = await supabase.rpc("next_invoice_number");
      const invId = "INV-" + String(seqData||1).padStart(4,"0");
      const ns = {
        id:invId,
        load_id:driverData.activeLoad?.id,
        truck_id:driverData.truck?.id,
        cust_id:selCust,
        state:freshCustState||selCustObj?.state||driverData.truck?.state||"",
        date:new Date().toLocaleDateString(),
        items:saleItems,
        total:sub,
        profit,
        previous_balance:custUnpaidBalance>0?custUnpaidBalance:0,
        previous_invoice_ids:custUnpaidBalance>0?custUnpaidInvs.map(s=>s.id).join(","):"",
        created_at:new Date().toISOString()
      };
      await supabase.from("sales").insert(ns);
      await supabase.from("payments").insert({sale_id:ns.id,status:"unpaid"});
      setDriverData(prev=>({...prev,sales:[ns,...prev.sales]}));
      setCreatedSale(ns);
      setShowPayment(true);
      setItems({});
      setSelCust("");
      setFreshCustState("");
      if(setDriverSaleCust) setDriverSaleCust(null);
    }catch(e){setMsg({t:"error",m:e.message});}
    setSaving(false);
  };

  // Payment Collection Modal
  if(showPayment && createdSale){
    const saleTax = (() => {
      const st = driverData.stateTaxes?.find(s=>s.id===(createdSale.state||""));
      const rate = st?.exempt ? 0 : parseFloat(st?.rate||0);
      if(!rate) return 0;
      const taxable = (createdSale.items||[]).reduce((a,i)=>{
        const p = products.find(x=>x.id===i.pid);
        return isTaxableProd(p) ? a+(p?.price||0)*i.qty : a;
      }, 0);
      return parseFloat((taxable*rate/100).toFixed(2));
    })();
    const gt = parseFloat((createdSale.total+saleTax).toFixed(2));
    const cardTotal = parseFloat((gt*(1+CARD_FEE/100)).toFixed(2));
    const methods = [
      {id:"cash",label:"💵 Cash",color:"#059669",note:"No surcharge"},
      {id:"check",label:"🧾 Check",color:"#0369a1",note:"No surcharge"},
      {id:"money_order",label:"📮 Money Order",color:"#7c3aed",note:"No surcharge"},
      {id:"zelle",label:"⚡ Zelle",color:"#6366f1",note:"No surcharge"},
      {id:"card",label:"💳 Card",color:"#dc2626",note:`+${CARD_FEE}% surcharge = $${cardTotal.toFixed(2)}`},
    ];
    return(
      <div style={{fontFamily:"'Inter',sans-serif"}}>
        {/* Invoice Summary */}
        <div style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:13,color:"#065f46",marginBottom:6}}>✅ Invoice {createdSale.id} Created!</div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#6b7280"}}>
            <span>Subtotal</span><span>${createdSale.total.toFixed(2)}</span>
          </div>
          {saleTax>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#059669"}}>
            <span>Tobacco/Vape Tax</span><span>${saleTax.toFixed(2)}</span>
          </div>}
          {createdSale.previous_balance>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#dc2626",borderTop:"1px dashed #fecaca",marginTop:4,paddingTop:4}}>
            <span>⚠️ Previous Balance ({createdSale.previous_invoice_ids})</span>
            <span style={{fontWeight:700}}>${parseFloat(createdSale.previous_balance).toFixed(2)}</span>
          </div>}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:800,color:"#0a1628",borderTop:"1px solid #d1fae5",marginTop:6,paddingTop:6}}>
            <span>TOTAL DUE (Cash/Zelle)</span>
            <span>${(gt+(createdSale.previous_balance||0)).toFixed(2)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#dc2626",marginTop:3}}>
            <span>TOTAL DUE (Card +{CARD_FEE}%)</span>
            <span>${(cardTotal+(createdSale.previous_balance||0)*(1+CARD_FEE/100)).toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div style={{fontWeight:700,fontSize:13,color:"#0a1628",marginBottom:10}}>💰 Collect Payment</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {methods.map(m=>(
            <button key={m.id} onClick={()=>setPayForm(p=>({...p,method:m.id}))}
              style={{padding:"12px 14px",borderRadius:10,border:`2px solid ${payForm.method===m.id?m.color:"#e5e7eb"}`,background:payForm.method===m.id?m.color+"15":"#fff",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"'Inter',sans-serif"}}>
              <span style={{fontWeight:600,fontSize:13,color:payForm.method===m.id?m.color:"#212121"}}>{m.label}</span>
              <span style={{fontSize:11,color:payForm.method===m.id?m.color:"#9ca3af"}}>{m.note}</span>
            </button>
          ))}
        </div>

        {/* Method-specific fields */}
        {payForm.method==="check"&&<div style={{marginBottom:12}}>
          <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>CHECK NUMBER</label>
          <input value={payForm.checkNum} onChange={e=>setPayForm(p=>({...p,checkNum:e.target.value}))}
            placeholder="e.g. 1042" style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px",fontSize:13,boxSizing:"border-box"}}/>
        </div>}
        {payForm.method==="zelle"&&<div style={{marginBottom:12}}>
          <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>ZELLE REFERENCE</label>
          <input value={payForm.zelleRef} onChange={e=>setPayForm(p=>({...p,zelleRef:e.target.value}))}
            placeholder="Transaction ref or phone" style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px",fontSize:13,boxSizing:"border-box"}}/>
        </div>}
        {payForm.method==="money_order"&&<div style={{marginBottom:12}}>
          <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>MONEY ORDER #</label>
          <input value={payForm.checkNum} onChange={e=>setPayForm(p=>({...p,checkNum:e.target.value}))}
            placeholder="Money order number" style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px",fontSize:13,boxSizing:"border-box"}}/>
        </div>}
        {payForm.method==="card"&&<div style={{marginBottom:12}}>
          <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:10,padding:"16px",textAlign:"center"}}>
            <div style={{fontWeight:700,fontSize:13,color:"#7c3aed",marginBottom:4}}>💳 Card Payment via QR</div>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:12}}>Customer scans QR → pays on their phone</div>
            {stripeLink?(
              <>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(stripeLink)}`}
                  alt="Stripe Payment QR"
                  style={{width:200,height:200,borderRadius:8,border:"3px solid #7c3aed"}}
                />
                <div style={{marginTop:10,background:"#faf5ff",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#7c3aed",fontWeight:700}}>
                  Amount to collect: ${(()=>{
                    const st=driverData.stateTaxes?.find(x=>x.id===(createdSale.state||""));
                    const rate=st?.exempt?0:parseFloat(st?.rate||0);
                    const taxable=(createdSale.items||[]).reduce((a,i)=>{const p=products.find(x=>x.id===i.pid);return isTaxableProd(p)?a+(p?.price||0)*i.qty:a;},0);
                    const tax=parseFloat((taxable*rate/100).toFixed(2));
                    const gt=createdSale.total+tax;
                    return parseFloat((gt*(1+CARD_FEE/100)).toFixed(2)).toFixed(2);
                  })()} (incl. {CARD_FEE}% card fee)
                </div>
                <div style={{fontSize:10,color:"#9ca3af",marginTop:6}}>Tell customer to enter exact amount when paying</div>
                <button onClick={()=>collectPayment(createdSale,"card")} disabled={paymentSaving}
                  style={{width:"100%",marginTop:12,padding:"11px",background:"#059669",color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                  ✅ Confirm Card Payment Received
                </button>
              </>
            ):(
              <div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:8,padding:"12px",fontSize:12,color:"#854d0e"}}>
                ⏳ Loading payment link...<br/>
                If this persists, ask admin to set <strong>Settings → Stripe Payment Link</strong>
              </div>
            )}
          </div>
        </div>}

        {/* Notes */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>NOTES (optional)</label>
          <input value={payForm.notes} onChange={e=>setPayForm(p=>({...p,notes:e.target.value}))}
            placeholder="Any notes..." style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px",fontSize:13,boxSizing:"border-box"}}/>
        </div>

        {/* Action Buttons */}
        <div style={{display:"flex",gap:8}}>
          {payForm.method!=="card"&&<button onClick={()=>collectPayment(createdSale,payForm.method)} disabled={paymentSaving}
            style={{flex:1,padding:"13px",background:"#059669",color:"#fff",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
            {paymentSaving?"Saving...":"✅ Confirm Payment"}
          </button>}
          <button onClick={()=>{setShowPayment(false);setCreatedSale(null);setMsg({t:"success",m:`Invoice ${createdSale.id} saved — collect payment later`});}}
            style={{flex:payForm.method==="card"?1:0,padding:"13px 16px",background:"#f9fafb",color:"#6b7280",border:"1px solid #e5e7eb",borderRadius:10,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
            💾 Collect Later
          </button>
        </div>
      </div>
    );
  }

  if(!driverData.activeLoad) return(
    <div className="card" style={{padding:24,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:12}}>🟡</div>
      <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>Truck Not Loaded</div>
      <div style={{fontSize:13,color:"#6b7280",marginBottom:16}}>You need to load your truck before making sales</div>
    </div>
  );

  const createNewCustomer = async () => {
    const required = [
      [newCust.name.trim(), "Shop / Business name is required"],
      [newCust.phone.trim(), "Phone number is required"],
      [newCust.email.trim(), "Email is required"],
      [newCust.address.trim(), "Street address is required"],
      [newCust.city.trim(), "City is required"],
      [newCust.zip.trim(), "ZIP code is required"],
      [newCust.state, "State is required"],
    ];
    for(const [val, msg] of required){
      if(!val) return setNewCustMsg({t:"error",m:msg});
    }
    setNewCustSaving(true);
    try{
      const id = "C"+Math.random().toString(36).slice(2,8).toUpperCase();
      const fullAddress = `${newCust.address.trim()}, ${newCust.city.trim()}, ${newCust.state} ${newCust.zip.trim()}`;
      const rec = {
        id,
        name: newCust.name.trim(),
        address: fullAddress,
        phone: newCust.phone.trim(),
        email: newCust.email.trim(),
        state: newCust.state,
        truck_id: driverData.truck?.id,
        notes: `Created by driver ${driverData.truck?.driver} on ${new Date().toLocaleDateString()}`,
      };
      const {error} = await supabase.from("customers").insert(rec);
      if(error) throw error;
      setDriverData(prev=>({...prev, customers:[...prev.customers, rec]}));
      await handleCustSelect(id);
      setShowNewCust(false);
      setNewCust({name:"",address:"",city:"",zip:"",state:"",phone:"",email:""});
      setNewCustMsg(null);
    }catch(e){ setNewCustMsg({t:"error",m:e.message}); }
    setNewCustSaving(false);
  };

  return(
    <div>
      <div style={{fontWeight:700,fontSize:14,color:"#0a1628",marginBottom:14}}>💳 Record Sale</div>
      <div style={{marginBottom:12}}>
        <label style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:".08em",display:"block",marginBottom:4}}>CUSTOMER</label>
        <select value={selCust} onChange={e=>handleCustSelect(e.target.value)} style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px",fontSize:13,fontFamily:"'Inter',sans-serif"}}>
          <option value="">— Select customer —</option>
          {driverData.customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {/* New Customer Button */}
        <button onClick={()=>{setShowNewCust(!showNewCust);setNewCustMsg(null);}}
          style={{marginTop:8,width:"100%",padding:"9px",background:showNewCust?"#f3f4f6":"#0a1628",color:showNewCust?"#6b7280":"#fff",border:"1px solid #e5e7eb",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          {showNewCust?"✕ Cancel":"➕ New Customer — Register New Station"}
        </button>

        {/* New Customer Form */}
        {showNewCust&&<div style={{marginTop:10,background:"#f9fafb",border:"1.5px solid #7c3aed",borderRadius:12,padding:"16px"}}>
          <div style={{fontWeight:700,fontSize:13,color:"#7c3aed",marginBottom:12}}>🏪 New Customer Registration</div>

          {[
            {label:"Shop / Business Name *",key:"name",placeholder:"e.g. Corner Gas Station",type:"text"},
            {label:"Phone Number *",key:"phone",placeholder:"e.g. 3175096262",type:"tel"},
            {label:"Email *",key:"email",placeholder:"e.g. shop@email.com",type:"email"},
            {label:"Street Address *",key:"address",placeholder:"e.g. 123 Main Street",type:"text"},
            {label:"City *",key:"city",placeholder:"e.g. Indianapolis",type:"text"},
          ].map(f=>(
            <div key={f.key} style={{marginBottom:10}}>
              <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>{f.label}</label>
              <input
                type={f.type}
                value={newCust[f.key]}
                onChange={e=>setNewCust(p=>({...p,[f.key]:e.target.value}))}
                placeholder={f.placeholder}
                style={{width:"100%",border:`1.5px solid ${newCust[f.key]?"#7c3aed":"#e5e7eb"}`,borderRadius:8,padding:"10px 12px",fontSize:13,fontFamily:"'Inter',sans-serif",boxSizing:"border-box"}}
              />
            </div>
          ))}

          {/* ZIP + State row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>ZIP Code *</label>
              <input
                type="text" maxLength={10}
                value={newCust.zip}
                onChange={e=>setNewCust(p=>({...p,zip:e.target.value.replace(/[^0-9-]/g,"")}))}
                placeholder="e.g. 46201"
                style={{width:"100%",border:`1.5px solid ${newCust.zip?"#7c3aed":"#e5e7eb"}`,borderRadius:8,padding:"10px 12px",fontSize:13,fontFamily:"'Inter',sans-serif",boxSizing:"border-box"}}
              />
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>State *</label>
              <select value={newCust.state} onChange={e=>setNewCust(p=>({...p,state:e.target.value}))}
                style={{width:"100%",border:`1.5px solid ${newCust.state?"#7c3aed":"#e5e7eb"}`,borderRadius:8,padding:"10px 12px",fontSize:13,fontFamily:"'Inter',sans-serif"}}>
                <option value="">— State —</option>
                {US_STATES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Tax info for selected state */}
          {newCust.state&&(()=>{
            const st = driverData.stateTaxes?.find(x=>x.id===newCust.state);
            return st ? (
              <div style={{background:st.exempt?"#f0fdf4":"#fef9c3",border:`1px solid ${st.exempt?"#a7f3d0":"#fde68a"}`,borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:11}}>
                {st.exempt
                  ?<span style={{color:"#065f46"}}>✅ {newCust.state} — Tax Exempt</span>
                  :<span style={{color:"#854d0e"}}>🏛 {newCust.state} — {st.rate}% tobacco/vape tax applies</span>
                }
              </div>
            ) : (
              <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:11,color:"#9ca3af"}}>
                ℹ️ {newCust.state} — No tax rate configured yet
              </div>
            );
          })()}

          {newCustMsg&&<div style={{background:newCustMsg.t==="success"?"#f0fdf4":"#fef2f2",border:`1px solid ${newCustMsg.t==="success"?"#a7f3d0":"#fecaca"}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:newCustMsg.t==="success"?"#065f46":"#dc2626",marginBottom:10}}>{newCustMsg.m}</div>}

          <button onClick={createNewCustomer} disabled={newCustSaving}
            style={{width:"100%",padding:"12px",background:"#7c3aed",color:"#fff",border:"none",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
            {newCustSaving?"Creating Account...":"✅ Create Account & Select"}
          </button>
        </div>}
        {/* Unpaid balance warning */}
        {/* Returned check warning */}
        {selCustObj&&(selCustObj.notes||"").includes("RETURNED_CHECK:1")&&<div style={{marginTop:8,background:"#1a0505",border:"2px solid #dc2626",borderRadius:10,padding:"12px 14px",animation:"pu 1.5s infinite"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:24,flexShrink:0}}>🚨</span>
            <div>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:14,color:"#dc2626",marginBottom:3}}>RETURNED CHECK ON FILE</div>
              <div style={{fontSize:12,color:"#f87171",lineHeight:1.6}}>This customer has a returned check. <strong style={{color:"#fbbf24"}}>DO NOT accept a check.</strong><br/>A <strong style={{color:"#fbbf24"}}>${co?.check_penalty||50} penalty fee</strong> applies on next check. Accept cash, Zelle, or card only.</div>
            </div>
          </div>
        </div>}
        {custUnpaidBalance>0&&<div style={{marginTop:8,background:"#fef9c3",border:"1px solid #fde68a",borderRadius:8,padding:"10px 14px"}}>
          <div style={{fontWeight:700,fontSize:12,color:"#854d0e",marginBottom:4}}>⚠️ Outstanding Balance</div>
          {custUnpaidInvs.map(s=>(
            <div key={s.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#92400e",marginBottom:2}}>
              <span>{s.id} · {s.date}</span>
              <span style={{fontWeight:700}}>${s.total.toFixed(2)}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:800,color:"#854d0e",borderTop:"1px solid #fde68a",marginTop:4,paddingTop:4}}>
            <span>Total Outstanding</span>
            <span>${custUnpaidBalance.toFixed(2)}</span>
          </div>
          <div style={{fontSize:10,color:"#92400e",marginTop:4}}>This balance will be added to the new invoice</div>
        </div>}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        <button onClick={()=>setScanning(false)} style={{flex:1,padding:"8px",borderRadius:7,border:`1.5px solid ${!scanning?"#0ea5e9":"#e5e7eb"}`,background:!scanning?"#f0f9ff":"#fff",color:!scanning?"#0ea5e9":"#6b7280",fontWeight:600,cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif"}}>📋 Manual</button>
        <button onClick={()=>{setScanning(true);setScanInput("");}} style={{flex:1,padding:"8px",borderRadius:7,border:`1.5px solid ${scanning?"#0ea5e9":"#e5e7eb"}`,background:scanning?"#f0f9ff":"#fff",color:scanning?"#0ea5e9":"#6b7280",fontWeight:600,cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif"}}>📷 Scan</button>
      </div>
      {scanning&&<div style={{background:"#f0f9ff",border:"2px solid #0ea5e9",borderRadius:10,padding:"12px",marginBottom:12}}>
        <div id="driver-qr-reader" style={{width:"100%",borderRadius:7,overflow:"hidden",background:"#000",minHeight:160,marginBottom:10}}></div>
        <div style={{display:"flex",gap:8}}>
          <input value={scanInput} onChange={e=>setScanInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleScan(scanInput)} placeholder="Type SKU or scan..." style={{flex:1,border:"1.5px solid #bae6fd",borderRadius:7,padding:"8px 12px",fontSize:13,fontFamily:"'Inter',sans-serif"}}/>
          <button onClick={()=>handleScan(scanInput)} style={{background:"#0ea5e9",color:"#fff",border:"none",borderRadius:7,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Add</button>
        </div>
      </div>}
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
        {/* ── IN-STOCK PRODUCTS ── */}
        {inStockProducts.map(p=>{
          const remaining = getRemainingQty(p.id);
          const loaded = loadedItems.find(i=>i.pid===p.id)?.qty||0;
          const sold = soldMap[p.id]||0;
          const qty = items[p.id]||0;
          const nearLimit = qty >= remaining && remaining > 0;
          return(
            <div key={p.id} className="card" style={{padding:"10px 14px",border:`1.5px solid ${qty>0?"#0ea5e9":"#e5e7eb"}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13}}>{p.name}</div>
                  <div style={{fontSize:11,color:"#9ca3af"}}>{(()=>{const ep=getEffectivePrice(selCustObj,p);const isC=ep!==p.price;return<>{isC?<span style={{color:"#7c3aed",fontWeight:700}}>{fmt(ep)} <span style={{fontSize:9,background:"#ede9fe",borderRadius:3,padding:"1px 4px"}}>CUSTOM</span> <span style={{textDecoration:"line-through",color:"#9ca3af",fontWeight:400}}>{fmt(p.price)}</span></span>:<span>{fmt(p.price)}</span>} · {isTaxableProd(p)?<span style={{color:"#7c3aed"}}>taxable</span>:"no tax"}</>;})()}</div>
                  <div style={{fontSize:11,marginTop:3,display:"flex",gap:8,flexWrap:"wrap"}}>
                    <span style={{color:remaining<=3?"#f59e0b":"#059669",fontWeight:700}}>🚚 {remaining} on truck{remaining<=3?" ⚠️":""}</span>
                    <span style={{color:"#9ca3af"}}>{loaded} loaded · {sold} sold</span>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <button onClick={()=>setItems(prev=>({...prev,[p.id]:Math.max(0,(prev[p.id]||0)-1)}))}
                    style={{width:28,height:28,borderRadius:"50%",border:"1.5px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:16,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <input type="number" min="0" max={remaining} value={qty||""} placeholder="0"
                    onChange={e=>setItems(prev=>({...prev,[p.id]:Math.min(remaining,Math.max(0,parseInt(e.target.value)||0))}))}
                    style={{width:48,textAlign:"center",border:`1.5px solid ${qty>0?"#0ea5e9":"#e5e7eb"}`,borderRadius:6,padding:"5px",fontSize:13,fontWeight:700}}/>
                  <button onClick={()=>setItems(prev=>({...prev,[p.id]:Math.min(remaining,(prev[p.id]||0)+1)}))}
                    disabled={qty>=remaining}
                    style={{width:28,height:28,borderRadius:"50%",border:"1.5px solid #e5e7eb",background:qty>=remaining?"#f9fafb":"#fff",cursor:qty>=remaining?"not-allowed":"pointer",fontSize:16,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",color:qty>=remaining?"#d1d5db":"#212121"}}>+</button>
                </div>
              </div>
              {qty>0&&<div style={{fontSize:11,color:"#0ea5e9",marginTop:4,textAlign:"right",fontWeight:600}}>{fmt(qty*getEffectivePrice(selCustObj,p))}{isTaxableProd(p)?<span style={{color:"#059669"}}> +tax</span>:""}</div>}
              {nearLimit&&qty>0&&<div style={{fontSize:10,color:"#f59e0b",marginTop:2,textAlign:"right",fontWeight:700}}>⚠️ At truck limit — {remaining} max</div>}
            </div>
          );
        })}

        {/* ── OUT-OF-STOCK ON TRUCK ── */}
        {outStockProducts.length>0&&(
          <div style={{marginTop:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{height:1,flex:1,background:"#fecaca"}}/>
              <span style={{fontSize:10,fontWeight:700,color:"#dc2626",letterSpacing:".08em",whiteSpace:"nowrap"}}>🚫 SOLD OUT ON TRUCK</span>
              <div style={{height:1,flex:1,background:"#fecaca"}}/>
            </div>
            {outStockProducts.map(p=>(
              <div key={p.id} className="card" style={{padding:"10px 14px",border:"1.5px solid #fecaca",background:"#fff5f5",marginBottom:6,opacity:0.85}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,color:"#374151"}}>{p.name}</div>
                    <div style={{fontSize:11,marginTop:3,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                      <span style={{color:"#dc2626",fontWeight:700}}>🚚 0 on truck</span>
                      {p.shelf>0
                        ?<span style={{background:"#f0fdf4",border:"1px solid #a7f3d0",color:"#065f46",borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700}}>📦 {p.shelf} on warehouse shelf</span>
                        :<span style={{background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700}}>📦 None on shelf either</span>
                      }
                    </div>
                  </div>
                  <span style={{fontSize:10,color:"#dc2626",fontWeight:700,background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:"3px 8px",whiteSpace:"nowrap"}}>OUT ON TRUCK</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {gt>0&&<div style={{background:"#f9fafb",borderRadius:8,padding:"12px 14px",marginBottom:12}}>
        {[["Subtotal",fmt(sub),""],hasTaxableItems&&tax>0?[`Tobacco/Vape Tax · ${custStateId} (${driverTaxRate}%)`,fmt(tax),"#059669"]:null,custUnpaidBalance>0?["⚠️ Previous Balance",fmt(custUnpaidBalance),"#dc2626"]:null,["Grand Total",fmt(gt+custUnpaidBalance),"#0ea5e9"],["Your Profit",fmt(profit),"#059669"]].filter(Boolean).map(([l,v,c])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:12,color:"#6b7280"}}>{l}</span>
            <span style={{fontWeight:700,fontSize:l==="Grand Total"?16:13,color:c||"#212121"}}>{v}</span>
          </div>
        ))}
      </div>}
      {msg&&<div style={{background:msg.t==="success"?"#f0fdf4":"#fef2f2",border:`1px solid ${msg.t==="success"?"#a7f3d0":"#fecaca"}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:msg.t==="success"?"#065f46":"#dc2626",marginBottom:12}}>{msg.m}</div>}
      <button onClick={confirmSale} disabled={saving} style={{width:"100%",background:"#0ea5e9",color:"#fff",border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
        {saving?"Creating Invoice…":"✓ Confirm Sale & Create Invoice"}
      </button>
    </div>
  );
}

// ── DRIVER WALK-IN TAB ────────────────────────────────────────────────────────
function DriverWalkInTab({driverData, setDriverData, products, supabase, initCust}){
  const uid2 = ()=>Math.random().toString(36).slice(2,9).toUpperCase();
  const fmt2 = n=>`$${Number(n||0).toFixed(2)}`;
  const stateTaxes = driverData.stateTaxes||[];
  const customers  = driverData.customers||[];

  const [wiView,    setWiView]    = useState("sale"); // "sale" | "history"
  const [wiCust,    setWiCust]    = useState(initCust||"");
  const [wiSearch,  setWiSearch]  = useState("");
  const [wiItems,   setWiItems]   = useState({});
  const [wiSaving,  setWiSaving]  = useState(false);
  const [wiMsg,     setWiMsg]     = useState(null);
  const [wiPay,     setWiPay]     = useState("cash");
  const [wiCheck,   setWiCheck]   = useState("");
  const [wiZelle,   setWiZelle]   = useState("");
  const [wiPrevBal, setWiPrevBal] = useState(0);
  const [wiPrevInvs,setWiPrevInvs]= useState([]);
  const [wiCatFilter,setWiCatFilter]=useState("All");
  const [wiReceiptFile,setWiReceiptFile]=useState(null);
  const [wiReceiptUrl,setWiReceiptUrl]=useState("");

  // History
  const [wiSales,   setWiSales]   = useState([]);
  const [wiPayments,setWiPayments]= useState([]);
  const [wiHistLoading,setWiHistLoading]=useState(false);

  // Amendment
  const [amendSale, setAmendSale] = useState(null);   // sale being amended
  const [amendItems,setAmendItems]= useState({});      // {pid: qty}
  const [amendSaving,setAmendSaving]=useState(false);
  const [amendMsg,  setAmendMsg]  = useState(null);

  const wiCustObj = customers.find(c=>c.id===wiCust);
  const wiHasReturnedCheck = wiCustObj&&(wiCustObj.notes||"").includes("RETURNED_CHECK:1");
  const RETURNED_CHECK_FEE = parseFloat(driverData.co?.check_penalty||50);

  // Auto-load balance + history when customer is pre-set
  useEffect(()=>{ if(initCust){ handleWiCust(initCust); loadHistory(initCust); } },[initCust]);

  const loadHistory = async(cid)=>{
    if(!cid) return;
    setWiHistLoading(true);
    const [{data:s},{data:p}] = await Promise.all([
      supabase.from("sales").select("*").eq("cust_id",cid).order("created_at",{ascending:false}),
      supabase.from("payments").select("*"),
    ]);
    setWiSales(s||[]);
    setWiPayments(p||[]);
    setWiHistLoading(false);
  };

  // Shelf products only
  const shelfProds = products.filter(p=>p.shelf>0);
  const cats = ["All",...new Set(shelfProds.map(p=>p.cat).filter(Boolean))];
  const filtered = shelfProds.filter(p=>{
    if(wiCatFilter!=="All"&&p.cat!==wiCatFilter) return false;
    if(wiSearch&&!p.name.toLowerCase().includes(wiSearch.toLowerCase())&&!p.sku?.toLowerCase().includes(wiSearch.toLowerCase())) return false;
    return true;
  });
  const grouped = cats.filter(c=>c!=="All").reduce((acc,cat)=>{
    const items = wiCatFilter==="All"
      ? shelfProds.filter(p=>p.cat===cat&&(!wiSearch||(p.name.toLowerCase().includes(wiSearch.toLowerCase())||p.sku?.toLowerCase().includes(wiSearch.toLowerCase()))))
      : filtered;
    if(wiCatFilter==="All"){if(items.length)acc[cat]=items;}
    else acc[wiCatFilter]=filtered;
    return acc;
  },{});

  const getEffP = (cid,pid)=>{
    const c=customers.find(x=>x.id===cid);
    const p=products.find(x=>x.id===pid);
    if(!c||!p)return p?.price||0;
    try{const m=(c.notes||"").match(/CUSTOM_PRICES:({.*?})/);const cp=m?JSON.parse(m[1]):{};const cv=cp[pid];return(cv&&parseFloat(cv)>0)?parseFloat(cv):p.price;}catch{return p?.price||0;}
  };

  const getTaxRate = (custObj)=>{
    if(!custObj) return 0;
    const cs=(custObj.state||"").trim();
    const st=stateTaxes.find(s=>s.id?.toUpperCase()===cs.toUpperCase()||s.name?.toLowerCase()===cs.toLowerCase());
    return st?.exempt?0:parseFloat(st?.rate||0);
  };

  const taxRate2 = getTaxRate(wiCustObj);
  const sub = shelfProds.reduce((a,p)=>a+(getEffP(wiCust,p.id)||0)*(wiItems[p.id]||0),0);
  const taxable = shelfProds.reduce((a,p)=>isTaxableProd(p)?(a+(getEffP(wiCust,p.id)||0)*(wiItems[p.id]||0)):a,0);
  const tax = parseFloat((taxable*taxRate2/100).toFixed(2));
  const gt  = sub+tax;
  const cardFee = 3;
  const cardTotal = parseFloat((gt*(1+cardFee/100)).toFixed(2));
  const totalDue  = (wiPay==="card"?cardTotal:gt)+wiPrevBal;

  const handleWiCust = async(cid)=>{
    setWiCust(cid);setWiPrevBal(0);setWiPrevInvs([]);
    if(!cid)return;
    const [{data:cs},{data:pm}]=await Promise.all([
      supabase.from("sales").select("id,total,date,state,items,previous_balance").eq("cust_id",cid),
      supabase.from("payments").select("sale_id,status"),
    ]);
    const paidIds=new Set((pm||[]).filter(p=>p.status==="paid").map(p=>p.sale_id));
    const allUnpaid=(cs||[]).filter(s=>!paidIds.has(s.id));
    const bal=parseFloat(allUnpaid.reduce((a,s)=>{
      const custSt=(s.state||"").trim();
      const st=stateTaxes.find(x=>x.id?.toUpperCase()===custSt.toUpperCase()||x.name?.toLowerCase()===custSt.toLowerCase());
      const rate=st?.exempt?0:parseFloat(st?.rate||0);
      const taxableAmt=(s.items||[]).reduce((b,i)=>{const p=products.find(x=>x.id===i.pid);return isTaxableProd(p)?b+(p?.price||0)*i.qty:b;},0);
      const stax=parseFloat((taxableAmt*rate/100).toFixed(2));
      return a+s.total+stax+parseFloat(s.previous_balance||0);
    },0).toFixed(2));
    setWiPrevBal(bal);setWiPrevInvs(allUnpaid);
  };

  const createWiSale = async()=>{
    if(!wiCust) return setWiMsg({t:"error",m:"Select a customer"});
    const saleItems=shelfProds.filter(p=>wiItems[p.id]>0).map(p=>({pid:p.id,qty:wiItems[p.id]}));
    if(!saleItems.length) return setWiMsg({t:"error",m:"Add at least one product"});

    // Hard validation — ensure qty never exceeds shelf stock
    const overLimit=saleItems.find(i=>{
      const p=products.find(x=>x.id===i.pid);
      return !p||i.qty>p.shelf;
    });
    if(overLimit){
      const p=products.find(x=>x.id===overLimit.pid);
      return setWiMsg({t:"error",m:`⚠️ Only ${p?.shelf} of "${p?.name}" available on shelf — adjust quantity`});
    }

    setWiSaving(true);
    try{
      const {data:seq}=await supabase.rpc("next_invoice_number");
      const invId="INV-"+String(seq||1).padStart(4,"0");
      const profit=saleItems.reduce((a,i)=>{const p=products.find(x=>x.id===i.pid);return a+(getEffP(wiCust,i.pid)-(p?.cost||0))*i.qty;},0);
      const ns={id:invId,truck_id:null,cust_id:wiCust,state:wiCustObj?.state||"",date:new Date().toLocaleDateString(),items:saleItems,total:sub,profit,previous_balance:wiPrevBal||0,previous_invoice_ids:wiPrevInvs.map(s=>s.id).join(","),created_at:new Date().toISOString()};
      await supabase.from("sales").insert(ns);
      await Promise.all(saleItems.map(i=>{const p=products.find(x=>x.id===i.pid);return p?supabase.from("products").update({shelf:Math.max(0,p.shelf-i.qty)}).eq("id",p.id):Promise.resolve();}));
      let wiRecUrl="";
      if(wiReceiptFile){
        const ext=wiReceiptFile.name.split(".").pop();
        const path=`receipts/WI-${uid2()}.${ext}`;
        const {data:upD,error:upE}=await supabase.storage.from("receipts").upload(path,wiReceiptFile,{upsert:true});
        if(!upE) wiRecUrl=supabase.storage.from("receipts").getPublicUrl(path).data.publicUrl;
      }
      await supabase.from("payments").insert({id:"PMT-"+uid2(),sale_id:invId,status:"paid",method:wiPay,amount:totalDue,check_number:wiCheck||"",zelle_ref:wiZelle||"",note:"Walk-in sale",receipt_url:wiRecUrl,collected_at:new Date().toISOString()});
      setDriverData(prev=>({...prev, sales:[{...ns,_paid:true},...prev.sales]}));
      setWiSales(prev=>[{...ns,_paid:true},...prev]);
      setWiItems({});setWiPrevBal(0);setWiPrevInvs([]);setWiCheck("");setWiZelle("");setWiReceiptFile(null);setWiReceiptUrl("");
      setWiMsg({t:"success",m:`✅ Invoice ${invId} created! View it in History.`});
    }catch(e){setWiMsg({t:"error",m:e.message});}
    setWiSaving(false);
  };

  // ── OPEN AMENDMENT ─────────────────────────────────────────────────────────
  const openAmend = (sale)=>{
    const init={};
    (sale.items||[]).forEach(i=>{ init[i.pid]=i.qty; });
    setAmendItems(init);
    setAmendSale(sale);
    setAmendMsg(null);
  };

  // ── SAVE AMENDMENT ─────────────────────────────────────────────────────────
  const saveAmend = async()=>{
    if(!amendSale) return;
    setAmendSaving(true); setAmendMsg(null);
    try{
      const custObj = customers.find(c=>c.id===amendSale.cust_id);
      const tRate = getTaxRate(custObj);

      // Build new items — remove any with qty=0
      const newItems = Object.entries(amendItems)
        .filter(([,q])=>parseInt(q)>0)
        .map(([pid,qty])=>({pid,qty:parseInt(qty)}));
      if(!newItems.length) throw new Error("Must keep at least one product");

      // Validate: increases must not exceed available shelf stock
      const oldMap = {};
      (amendSale.items||[]).forEach(i=>{ oldMap[i.pid]=i.qty; });
      const stockErr = newItems.find(i=>{
        const increase = i.qty - (oldMap[i.pid]||0);
        if(increase<=0) return false;
        const prod = products.find(x=>x.id===i.pid);
        return !prod || increase > prod.shelf;
      });
      if(stockErr){
        const prod = products.find(x=>x.id===stockErr.pid);
        const increase = stockErr.qty - (oldMap[stockErr.pid]||0);
        throw new Error(`⚠️ Only ${prod?.shelf||0} of "${prod?.name}" on shelf — can't add ${increase} more`);
      }

      // Recalculate totals
      const newSub = newItems.reduce((a,i)=>a+(getEffP(amendSale.cust_id,i.pid)||0)*i.qty, 0);
      const newTaxable = newItems.reduce((a,i)=>{const p=products.find(x=>x.id===i.pid);return isTaxableProd(p)?a+(getEffP(amendSale.cust_id,i.pid)||0)*i.qty:a;},0);
      const newTax = parseFloat((newTaxable*tRate/100).toFixed(2));
      const newProfit = newItems.reduce((a,i)=>{const p=products.find(x=>x.id===i.pid);return a+(getEffP(amendSale.cust_id,i.pid)-(p?.cost||0))*i.qty;},0);

      // Adjust shelf stock: batched parallel updates (reuse oldMap from validation above)
      const allPids = [...new Set([...Object.keys(oldMap), ...newItems.map(i=>i.pid)])];
      const shelfUpdates = allPids.map(pid=>{
        const diff = (oldMap[pid]||0) - (amendItems[pid]||0);
        if(diff===0) return null;
        const prod = products.find(p=>p.id===pid); if(!prod) return null;
        return {pid, newShelf:Math.max(0, prod.shelf+diff)};
      }).filter(Boolean);
      await Promise.all(shelfUpdates.map(u=>supabase.from("products").update({shelf:u.newShelf}).eq("id",u.pid)));

      // Save updated sale
      await supabase.from("sales").update({
        items: newItems,
        total: newSub,
        profit: newProfit,
        amended_at: new Date().toISOString(),
      }).eq("id",amendSale.id);

      // Update local history
      const updated = {...amendSale, items:newItems, total:newSub, profit:newProfit, amended_at:new Date().toISOString()};
      setWiSales(prev=>prev.map(s=>s.id===amendSale.id?updated:s));
      setAmendMsg({t:"success",m:"✅ Invoice updated successfully!"});
      setTimeout(()=>setAmendSale(null),1400);
    }catch(e){ setAmendMsg({t:"error",m:e.message}); }
    setAmendSaving(false);
  };

  // ── SALE TAB UI ───────────────────────────────────────────────────────────
  const SaleTab = ()=>(
    <div>
      <div style={{fontSize:11,color:"#9ca3af",marginBottom:14}}>Sell directly from warehouse shelf — deducts shelf stock</div>

      {/* Customer + summary card */}
      <div className="card" style={{padding:"14px 16px",marginBottom:12}}>
        {!initCust&&<>
          <label style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".08em",display:"block",marginBottom:6}}>CUSTOMER</label>
          <select value={wiCust} onChange={e=>handleWiCust(e.target.value)}
            style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:9,padding:"10px 12px",fontSize:13,background:"#fff",color:"#111",marginBottom:8}}>
            <option value="">— Select customer —</option>
            {[...customers].sort((a,b)=>a.name.localeCompare(b.name)).map(c=><option key={c.id} value={c.id}>{c.name}{c.state?` · ${c.state}`:""}</option>)}
          </select>
        </>}
        {wiCustObj&&<div style={{fontSize:11,color:"#6b7280",marginBottom:6}}>
          State: <strong>{wiCustObj.state||"Not set"}</strong> · Tax: <strong style={{color:taxRate2>0?"#7c3aed":"#9ca3af"}}>{taxRate2>0?`${taxRate2}% tobacco`:"exempt/none"}</strong>
        </div>}
        {wiHasReturnedCheck&&<div style={{background:"#1a0505",border:"2px solid #dc2626",borderRadius:10,padding:"12px 16px",animation:"pu 1.5s infinite",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>🚨</span>
            <div>
              <div style={{fontWeight:800,fontSize:13,color:"#dc2626"}}>RETURNED CHECK ON FILE</div>
              <div style={{fontSize:11,color:"#f87171",marginTop:2}}><strong style={{color:"#fbbf24"}}>${RETURNED_CHECK_FEE} penalty</strong> — use cash, Zelle, or card only.</div>
            </div>
          </div>
        </div>}
        {wiPrevBal>0&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"8px 12px",marginBottom:6}}>
          <div style={{fontWeight:700,fontSize:11,color:"#dc2626",marginBottom:4}}>⚠️ Outstanding Balance</div>
          {wiPrevInvs.slice(0,3).map(s=><div key={s.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#dc2626",marginBottom:2}}><span>{s.id} · {s.date}</span></div>)}
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:12,color:"#dc2626",borderTop:"1px solid #fecaca",marginTop:4,paddingTop:4}}><span>Total Owed</span><span>{fmt2(wiPrevBal)}</span></div>
        </div>}
      </div>

      {/* Product search + filter */}
      <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
        <input value={wiSearch} onChange={e=>setWiSearch(e.target.value)} placeholder="🔍 Search products..."
          style={{flex:1,minWidth:160,border:"1.5px solid #e5e7eb",borderRadius:9,padding:"9px 12px",fontSize:13,background:"#fff"}}/>
        <button onClick={()=>setWiItems({})} style={{padding:"8px 12px",borderRadius:9,border:"1px solid #e5e7eb",background:"#fff",color:"#6b7280",fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Clear</button>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setWiCatFilter(c)}
            style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${wiCatFilter===c?"#0a1628":"#e5e7eb"}`,background:wiCatFilter===c?"#0a1628":"#fff",color:wiCatFilter===c?"#fff":"#6b7280",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
            {c}
          </button>
        ))}
      </div>

      {/* Products */}
      {Object.entries(wiCatFilter==="All"?grouped:{[wiCatFilter]:filtered}).map(([cat,items])=>(
        <div key={cat} style={{marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:10,color:"#9ca3af",letterSpacing:".1em",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
            {cat.toUpperCase()}<div style={{flex:1,height:1,background:"#e5e7eb"}}/>
          </div>
          {items.map(p=>{
            const qty=wiItems[p.id]||0;
            const isSelected=qty>0;
            const ep=getEffP(wiCust,p.id);
            return(
              <div key={p.id} className="prod-row" style={{background:"#fff",border:`1.5px solid ${isSelected?"#0a1628":"#e5e7eb"}`,borderRadius:10,padding:"10px 12px",marginBottom:6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,color:"#0a1628"}}>{p.name}</div>
                    <div style={{fontSize:10,color:"#9ca3af"}}>{p.sku&&`${p.sku} · `}{p.unit} · {p.shelf} in stock{isTaxableProd(p)&&<span style={{marginLeft:5,background:"#fef3c7",color:"#92400e",padding:"1px 5px",borderRadius:3,fontSize:9,fontWeight:700}}>TOBACCO TAX</span>}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:800,fontSize:16,color:"#059669"}}>{fmt2(ep)}</div>
                    {isSelected&&<div style={{fontSize:11,color:"#0a1628",fontWeight:600}}>{fmt2(qty*ep)}</div>}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button className="qty-btn" onClick={()=>setWiItems(prev=>({...prev,[p.id]:Math.max(0,(prev[p.id]||0)-1)}))} style={{width:30,height:30}}>−</button>
                  <input type="number" min="0" max={p.shelf} value={qty||""} placeholder="0"
                    onChange={e=>setWiItems(prev=>({...prev,[p.id]:Math.min(p.shelf,Math.max(0,parseInt(e.target.value)||0))}))}
                    style={{flex:1,textAlign:"center",border:`1.5px solid ${isSelected?"#0a1628":"#e5e7eb"}`,borderRadius:8,padding:"6px 4px",fontSize:14,fontWeight:700,background:"#fff"}}/>
                  <button className="qty-btn" onClick={()=>setWiItems(prev=>({...prev,[p.id]:Math.min(p.shelf,(prev[p.id]||0)+1)}))} disabled={qty>=p.shelf} style={{width:30,height:30}}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {filtered.length===0&&<div className="card" style={{padding:24,textAlign:"center",color:"#9ca3af",fontSize:13}}>No products match your search</div>}

      {/* Order summary + payment */}
      {sub>0&&(
        <div className="card" style={{padding:"14px 16px",marginTop:4,marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:12,color:"#0a1628",marginBottom:8}}>ORDER SUMMARY</div>
          {[["Subtotal",fmt2(sub),"#212121"],tax>0?["Tobacco Tax ("+taxRate2+"%)",fmt2(tax),"#7c3aed"]:null,wiPrevBal>0?["Prev. Balance",fmt2(wiPrevBal),"#dc2626"]:null,wiPay==="card"?["Card Fee ("+cardFee+"%)",fmt2(parseFloat((gt*cardFee/100).toFixed(2))),"#f59e0b"]:null,["Total Due",fmt2(totalDue),"#059669"]].filter(Boolean).map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:5,paddingBottom:l==="Total Due"?0:5,borderBottom:l==="Total Due"?"none":"1px solid #f3f4f6"}}>
              <span style={{fontSize:11,color:l==="Total Due"?"#212121":"#6b7280",fontWeight:l==="Total Due"?700:400}}>{l}</span>
              <span style={{fontSize:l==="Total Due"?15:12,fontWeight:l==="Total Due"?800:600,color:c}}>{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* Payment method */}
      <div className="card" style={{padding:"14px 16px",marginBottom:12}}>
        <label style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".08em",display:"block",marginBottom:8}}>PAYMENT METHOD</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {[["cash","💵 Cash"],["check","🧾 Check"],["zelle","⚡ Zelle"],["money_order","📮 M.O."],["card","💳 Card"]].map(([id,label])=>(
            <button key={id} onClick={()=>setWiPay(id)}
              style={{padding:"9px 8px",borderRadius:9,border:`1.5px solid ${wiPay===id?"#0a1628":"#e5e7eb"}`,background:wiPay===id?"#0a1628":"#fff",color:wiPay===id?"#fff":"#6b7280",fontSize:12,fontWeight:wiPay===id?700:400,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
              {label}
            </button>
          ))}
        </div>
        {wiPay==="check"&&<input value={wiCheck} onChange={e=>setWiCheck(e.target.value)} placeholder="Check number"
          style={{width:"100%",marginTop:8,border:"1.5px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",background:"#fff"}}/>}
        {wiPay==="zelle"&&<input value={wiZelle} onChange={e=>setWiZelle(e.target.value)} placeholder="Zelle reference"
          style={{width:"100%",marginTop:8,border:"1.5px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",background:"#fff"}}/>}
      </div>

      {/* Receipt upload */}
      <div className="card" style={{padding:"14px 16px",marginBottom:14}}>
        <label style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:".08em",display:"block",marginBottom:8}}>RECEIPT / PAYMENT PROOF</label>
        <div style={{border:"2px dashed #e5e7eb",borderRadius:9,padding:"14px",textAlign:"center",background:"#fafafa",cursor:"pointer"}}
          onClick={()=>document.getElementById("wiReceiptInputDriver").click()}>
          {wiReceiptUrl
            ?<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <img src={wiReceiptUrl} alt="receipt" style={{maxHeight:80,maxWidth:"100%",borderRadius:6}}/>
              <span style={{fontSize:10,color:"#059669",fontWeight:600}}>✅ Attached — tap to change</span>
            </div>
            :<div style={{color:"#9ca3af",fontSize:12}}>
              <div style={{fontSize:22,marginBottom:4}}>📸</div>
              <div>Tap to snap or upload receipt</div>
            </div>}
          <input id="wiReceiptInputDriver" type="file" accept="image/*,application/pdf" capture="environment" style={{display:"none"}}
            onChange={e=>{const f=e.target.files[0];if(f){setWiReceiptFile(f);setWiReceiptUrl(URL.createObjectURL(f));}}}/>
        </div>
      </div>

      {wiMsg&&<div style={{background:wiMsg.t==="success"?"#f0fdf4":"#fef2f2",border:`1px solid ${wiMsg.t==="success"?"#a7f3d0":"#fecaca"}`,borderRadius:8,padding:"10px 14px",fontSize:13,color:wiMsg.t==="success"?"#065f46":"#dc2626",marginBottom:10}}>{wiMsg.m}</div>}
      <button onClick={createWiSale} disabled={wiSaving||!wiCust||sub===0} className="btn-primary"
        style={{width:"100%",justifyContent:"center",padding:"13px",marginBottom:24,background:(!wiCust||sub===0)?"#9ca3af":"#0a1628"}}>
        {wiSaving?<><span className="sp">⟳</span> Creating…</>:"🧾 Create Invoice & Record Payment"}
      </button>
    </div>
  );

  // ── HISTORY TAB UI ────────────────────────────────────────────────────────
  const HistoryTab = ()=>{
    if(wiHistLoading) return <div style={{textAlign:"center",padding:40,color:"#9ca3af"}}>Loading history…</div>;
    if(!wiCust&&!initCust) return <div className="card" style={{padding:28,textAlign:"center",color:"#9ca3af"}}>Select a customer first to see their invoice history.</div>;
    if(wiSales.length===0) return <div className="card" style={{padding:32,textAlign:"center",color:"#9ca3af"}}><div style={{fontSize:28,marginBottom:6}}>📋</div><div>No invoices yet</div></div>;

    return(
      <div>
        {wiSales.map(s=>{
          const pmt = wiPayments.find(p=>p.sale_id===s.id);
          const isPaid = pmt?.status==="paid";
          const tRate = getTaxRate(customers.find(c=>c.id===s.cust_id));
          const sTax = parseFloat(((s.items||[]).reduce((a,i)=>{const p=products.find(x=>x.id===i.pid);return isTaxableProd(p)?a+(getEffP(s.cust_id,i.pid)||0)*i.qty:a;},0)*tRate/100).toFixed(2));
          const gt = parseFloat((s.total+sTax+parseFloat(s.previous_balance||0)).toFixed(2));
          return(
            <div key={s.id} className="card" style={{marginBottom:10,borderLeft:`4px solid ${isPaid?"#059669":"#f59e0b"}`}}>
              <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:3}}>
                    <span style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:14,color:"#0a1628"}}>{s.id}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,background:isPaid?"#dcfce7":"#fef9c3",color:isPaid?"#166534":"#92400e"}}>{isPaid?"PAID":"UNPAID"}</span>
                    {s.amended_at&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#ede9fe",color:"#5b21b6"}}>AMENDED</span>}
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af"}}>{s.date} · {(s.items||[]).length} product{(s.items||[]).length!==1?"s":""}</div>
                  {/* Items summary */}
                  <div style={{marginTop:6,display:"flex",flexWrap:"wrap",gap:4}}>
                    {(s.items||[]).map(i=>{
                      const p=products.find(x=>x.id===i.pid);
                      return<span key={i.pid} style={{fontSize:10,background:"#f3f4f6",borderRadius:5,padding:"2px 7px",color:"#374151"}}>
                        {p?.name||i.pid} ×{i.qty}
                      </span>;
                    })}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:18,color:"#0a1628"}}>{fmt2(gt)}</div>
                  {sTax>0&&<div style={{fontSize:10,color:"#7c3aed"}}>incl. ${sTax.toFixed(2)} tax</div>}
                  <button onClick={()=>openAmend(s)}
                    style={{marginTop:6,background:"#7c3aed",color:"#fff",border:"none",borderRadius:7,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:4}}>
                    ✏️ Amend
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ── AMENDMENT MODAL ───────────────────────────────────────────────────────
  const AmendModal = ()=>{
    if(!amendSale) return null;
    const allPids = new Set([...(amendSale.items||[]).map(i=>i.pid), ...Object.keys(amendItems).filter(pid=>amendItems[pid]>0)]);
    const amendSub = [...allPids].reduce((a,pid)=>{
      const q=parseInt(amendItems[pid]||0);
      return a+(getEffP(amendSale.cust_id,pid)||0)*q;
    },0);
    const custObj = customers.find(c=>c.id===amendSale.cust_id);
    const tRate = getTaxRate(custObj);
    const amendTaxable = [...allPids].reduce((a,pid)=>{
      const p=products.find(x=>x.id===pid);
      const q=parseInt(amendItems[pid]||0);
      return isTaxableProd(p)?a+(getEffP(amendSale.cust_id,pid)||0)*q:a;
    },0);
    const amendTax = parseFloat((amendTaxable*tRate/100).toFixed(2));
    const amendTotal = amendSub+amendTax+parseFloat(amendSale.previous_balance||0);

    return(
      <div style={{position:"fixed",inset:0,background:"#00000060",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:16,backdropFilter:"blur(4px)"}}>
        <div style={{background:"#fff",borderRadius:16,padding:24,maxWidth:560,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 8px 40px #00000020"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:16,color:"#0a1628"}}>✏️ Amend Invoice {amendSale.id}</div>
              <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>Adjust product quantities only — prices are fixed</div>
            </div>
            <button onClick={()=>setAmendSale(null)} style={{background:"#f3f4f6",border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,color:"#6b7280",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>✕ Close</button>
          </div>

          {/* Product quantity editors */}
          <div style={{marginBottom:16}}>
            {(amendSale.items||[]).map(item=>{
              const p = products.find(x=>x.id===item.pid);
              const qty = parseInt(amendItems[item.pid]||0);
              const ep = getEffP(amendSale.cust_id,item.pid);
              const origQty = item.qty;
              const diff = qty - origQty;
              return(
                <div key={item.pid} style={{border:`1.5px solid ${qty!==origQty?"#7c3aed":"#e5e7eb"}`,borderRadius:10,padding:"12px 14px",marginBottom:8,background:qty!==origQty?"#faf5ff":"#fff"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:"#0a1628"}}>{p?.name||item.pid}</div>
                      <div style={{fontSize:10,color:"#9ca3af"}}>{p?.sku} · {fmt2(ep)} each{isTaxableProd(p)&&<span style={{marginLeft:4,color:"#7c3aed",fontWeight:700}}>+tax</span>}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontWeight:800,fontSize:14,color:"#7c3aed"}}>{fmt2(qty*ep)}</div>
                      {diff!==0&&<div style={{fontSize:10,fontWeight:700,color:diff>0?"#dc2626":"#059669"}}>{diff>0?`+${diff}`:`${diff}`} from original ({origQty})</div>}
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <button className="qty-btn" onClick={()=>setAmendItems(prev=>({...prev,[item.pid]:Math.max(0,(parseInt(prev[item.pid]||0))-1)}))} style={{width:32,height:32,fontSize:18}}>−</button>
                    <input type="number" min="0" value={qty||""}  placeholder="0"
                      onChange={e=>setAmendItems(prev=>({...prev,[item.pid]:Math.max(0,parseInt(e.target.value)||0)}))}
                      style={{flex:1,textAlign:"center",border:`1.5px solid ${qty!==origQty?"#7c3aed":"#e5e7eb"}`,borderRadius:8,padding:"7px 4px",fontSize:16,fontWeight:800,background:"#fff"}}/>
                    <button className="qty-btn" onClick={()=>setAmendItems(prev=>({...prev,[item.pid]:(parseInt(prev[item.pid]||0))+1}))} style={{width:32,height:32,fontSize:18}}>+</button>
                    <div style={{minWidth:60,fontSize:11,color:"#9ca3af",textAlign:"center"}}>was {origQty}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Updated totals */}
          <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:12,color:"#5b21b6",marginBottom:8}}>UPDATED TOTALS</div>
            {[["Subtotal",fmt2(amendSub),"#212121"],amendTax>0?["Tax ("+tRate+"%)",fmt2(amendTax),"#7c3aed"]:null,parseFloat(amendSale.previous_balance||0)>0?["Prev. Balance",fmt2(parseFloat(amendSale.previous_balance||0)),"#dc2626"]:null,["New Total",fmt2(amendTotal),"#059669"]].filter(Boolean).map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,fontWeight:l==="New Total"?800:400}}>
                <span style={{color:"#6b7280"}}>{l}</span><span style={{color:c,fontFamily:"'Inter',sans-serif"}}>{v}</span>
              </div>
            ))}
          </div>

          {amendMsg&&<div style={{background:amendMsg.t==="success"?"#f0fdf4":"#fef2f2",border:`1px solid ${amendMsg.t==="success"?"#a7f3d0":"#fecaca"}`,borderRadius:8,padding:"10px 14px",fontSize:13,color:amendMsg.t==="success"?"#065f46":"#dc2626",marginBottom:10}}>{amendMsg.m}</div>}

          <div style={{display:"flex",gap:10}}>
            <button onClick={saveAmend} disabled={amendSaving} className="btn-primary"
              style={{flex:1,justifyContent:"center",padding:"13px",background:"#7c3aed"}}>
              {amendSaving?<><span className="sp">⟳</span> Saving…</>:"💾 Save Changes"}
            </button>
            <button onClick={()=>setAmendSale(null)} style={{padding:"13px 20px",borderRadius:10,border:"1.5px solid #e5e7eb",background:"#fff",color:"#6b7280",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return(
    <div className="fu">
      {/* Tab switcher */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16}}>
        {[["sale","🛒 New Sale"],["history","📋 Invoice History"]].map(([v,l])=>(
          <button key={v} onClick={()=>{setWiView(v);if(v==="history"&&(wiCust||initCust))loadHistory(wiCust||initCust);}}
            style={{padding:"11px 8px",borderRadius:10,border:`1.5px solid ${wiView===v?"#7c3aed":"#e5e7eb"}`,background:wiView===v?"#7c3aed":"#fff",color:wiView===v?"#fff":"#6b7280",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>
            {l}
          </button>
        ))}
      </div>

      {wiView==="sale"&&SaleTab()}
      {wiView==="history"&&HistoryTab()}
      {AmendModal()}
    </div>
  );
}

// ── DRIVER EXPENSES TAB ───────────────────────────────────────────────────────
function DriverExpensesTab({driverData, supabase}){
  const [form, setForm] = useState({category:"gas",amount:"",description:"",receipt_url:""});
  const [expenses, setExpenses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const uid = ()=>Math.random().toString(36).slice(2,8).toUpperCase();
  const cats = [{k:"gas",e:"⛽",l:"Gas / Fuel"},{k:"maintenance",e:"🔧",l:"Maintenance"},{k:"food",e:"🍔",l:"Food & Meals"},{k:"accommodation",e:"🏨",l:"Accommodation"},{k:"other",e:"📋",l:"Other"}];

  useEffect(()=>{
    supabase.from("expenses").select("*").eq("truck_id",driverData.truck?.id).order("created_at",{ascending:false}).then(({data})=>{if(data)setExpenses(data);});
  },[]);

  const submitExpense = async () => {
    if(!form.amount) return setMsg({t:"error",m:"Amount is required"});
    setSaving(true);
    try{
      const rec = {id:"EXP-"+uid(),truck_id:driverData.truck?.id,driver_name:driverData.truck?.driver,category:form.category,amount:parseFloat(form.amount),description:form.description,receipt_url:form.receipt_url||"",date:new Date().toLocaleDateString(),created_at:new Date().toISOString()};
      await supabase.from("expenses").insert(rec);
      setExpenses(prev=>[rec,...prev]);
      setMsg({t:"success",m:"Expense recorded!"});
      setForm({category:"gas",amount:"",description:"",receipt_url:""});
    }catch(e){setMsg({t:"error",m:e.message});}
    setSaving(false);
  };

  const todayTotal = expenses.filter(e=>new Date(e.created_at).toDateString()===new Date().toDateString()).reduce((a,e)=>a+e.amount,0);

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div className="card" style={{padding:"12px",textAlign:"center"}}><div style={{fontSize:18,marginBottom:3}}>💸</div><div style={{fontWeight:800,fontSize:18,color:"#dc2626"}}>${todayTotal.toFixed(2)}</div><div style={{fontSize:10,color:"#9ca3af"}}>Today's Expenses</div></div>
        <div className="card" style={{padding:"12px",textAlign:"center"}}><div style={{fontSize:18,marginBottom:3}}>📋</div><div style={{fontWeight:800,fontSize:18,color:"#6b7280"}}>{expenses.length}</div><div style={{fontSize:10,color:"#9ca3af"}}>Total Records</div></div>
      </div>

      <div className="card" style={{padding:"16px",marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>+ Add Expense</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
          {cats.map(c=>(
            <button key={c.k} onClick={()=>setForm(f=>({...f,category:c.k}))}
              style={{padding:"8px 4px",borderRadius:8,border:`1.5px solid ${form.category===c.k?"#dc2626":"#e5e7eb"}`,background:form.category===c.k?"#fef2f2":"#fff",cursor:"pointer",textAlign:"center",fontFamily:"'Inter',sans-serif"}}>
              <div style={{fontSize:18}}>{c.e}</div>
              <div style={{fontSize:10,fontWeight:600,color:form.category===c.k?"#dc2626":"#6b7280",marginTop:2}}>{c.l}</div>
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div><label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>AMOUNT ($) *</label><input type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:7,padding:"9px 12px",fontSize:13,fontFamily:"'Inter',sans-serif"}}/></div>
          <div><label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>DESCRIPTION</label><input placeholder="e.g. Shell gas station" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:7,padding:"9px 12px",fontSize:13,fontFamily:"'Inter',sans-serif"}}/></div>
        </div>
        <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>RECEIPT PHOTO (optional)</label><input type="file" accept="image/*" capture="environment" onChange={e=>{const f=e.target.files[0];if(f){const url=URL.createObjectURL(f);setForm(prev=>({...prev,receipt_url:url}));setMsg({t:"success",m:"Photo attached"});}}}/></div>
        {msg&&<div style={{background:msg.t==="success"?"#f0fdf4":"#fef2f2",border:`1px solid ${msg.t==="success"?"#a7f3d0":"#fecaca"}`,borderRadius:7,padding:"8px 12px",fontSize:12,color:msg.t==="success"?"#065f46":"#dc2626",marginBottom:10}}>{msg.m}</div>}
        <button onClick={submitExpense} disabled={saving} style={{width:"100%",background:"#dc2626",color:"#fff",border:"none",borderRadius:9,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
          {saving?"Saving…":"💸 Record Expense"}
        </button>
      </div>

      <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>Recent Expenses</div>
      {expenses.length===0?<div className="card" style={{padding:20,textAlign:"center",color:"#9ca3af",fontSize:12}}>No expenses recorded yet</div>:
        expenses.map(e=>{
          const cat=cats.find(c=>c.k===e.category);
          return(
            <div key={e.id} className="card" style={{padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:24,flexShrink:0}}>{cat?.e||"📋"}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13}}>{cat?.l||e.category}</div>
                <div style={{fontSize:11,color:"#9ca3af"}}>{e.date} {e.description&&`· ${e.description}`}</div>
              </div>
              <div style={{fontWeight:800,fontSize:16,color:"#dc2626"}}>${e.amount.toFixed(2)}</div>
            </div>
          );
        })
      }
    </div>
  );
}

export default function OrderPortal() {
  const [products,  setProducts]  = useState([]);
  const [customers, setCustomers] = useState([]);
  const [co,        setCo]        = useState(null);
  const [loading,   setLoading]   = useState(true);

  // Flow: "home" | "register" | "order" | "review" | "confirm"
  const [step,      setStep]      = useState("home");
  const [isNew,     setIsNew]     = useState(false);
  const [isExisting,setIsExisting]= useState(false);
  const [isDriver,  setIsDriver]  = useState(false);
  const [isWalkIn,       setIsWalkIn]       = useState(false);
  const [walkInVerified, setWalkInVerified] = useState(false);
  const [walkInCust,     setWalkInCust]     = useState(null);
  const [walkInSearch,   setWalkInSearch]   = useState("");
  const [walkInPhone,    setWalkInPhone]    = useState("");
  const [walkInError,    setWalkInError]    = useState("");
  const [walkInLoading,  setWalkInLoading]  = useState(false);
  const [walkInMode,     setWalkInMode]     = useState("customer"); // "customer" | "staff" | "register"
  const [walkInEmail,    setWalkInEmail]    = useState("");
  const [walkInPw,       setWalkInPw]       = useState("");
  const [walkInUser,     setWalkInUser]     = useState(null); // verified driver/admin/staff user
  // Staff registration form
  const [wiReg, setWiReg] = useState({name:"",email:"",phone:"",role:"staff",note:""});
  const [wiRegSaving, setWiRegSaving] = useState(false);
  const [wiRegMsg, setWiRegMsg] = useState(null);
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPw,    setDriverPw]    = useState("");
  const [driverUser,  setDriverUser]  = useState(null);
  const [driverData,  setDriverData]  = useState(null);
  const [showAddCust, setShowAddCust] = useState(false);
  const [newCustForm, setNewCustForm] = useState({name:"",address:"",phone:"",email:"",state:""});
  const [newCustSaving,setNewCustSaving]=useState(false);
  const [driverError, setDriverError] = useState("");
  const [driverLoading, setDriverLoading] = useState(false);
  const [driverTab,   setDriverTab]   = useState("dashboard");
  const [driverSaleCust, setDriverSaleCust] = useState(null);
  const [driverViewInv, setDriverViewInv] = useState(null);
  const [showHistoryPayment, setShowHistoryPayment] = useState(false);
  const [createdSaleForHistory, setCreatedSaleForHistory] = useState(null);
  const [createdSale, setCreatedSale] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [payForm, setPayForm] = useState({method:"cash",checkNum:"",zelleRef:"",bankName:"",notes:""});
  const [paymentSaving, setPaymentSaving] = useState(false);

  const collectPayment = async (sale, method) => {
    setPaymentSaving(true);
    try{
      const st = driverData?.stateTaxes?.find(s=>s.id===(sale.state||""));
      const rate = st?.exempt ? 0 : parseFloat(st?.rate||0);
      const taxable = (sale.items||[]).reduce((a,i)=>{
        const p = products.find(x=>x.id===i.pid);
        return isTaxableProd(p) ? a+(p?.price||0)*i.qty : a;
      }, 0);
      const saleTax = parseFloat((taxable*rate/100).toFixed(2));
      const gt = parseFloat((sale.total+saleTax).toFixed(2));
      const surcharge = method==="card" ? parseFloat((gt*CARD_FEE/100).toFixed(2)) : 0;
      const total = parseFloat((gt+surcharge).toFixed(2));
      // Try update first, then insert if no existing record
      const {data:existing} = await supabase.from("payments").select("id,sale_id").eq("sale_id",sale.id).maybeSingle();
      const payData = {
        status:"paid",
        method,
        amount:total,
        check_number:payForm.checkNum||"",
        bank_name:payForm.bankName||"",
        zelle_ref:payForm.zelleRef||"",
        note:payForm.notes||"",
        collected_at:new Date().toISOString(),
      };
      if(existing){
        // Update existing payment record
        await supabase.from("payments").update(payData).eq("sale_id",sale.id);
      } else {
        // Insert new payment record
        await supabase.from("payments").insert({sale_id:sale.id,...payData});
      }
      setDriverData(prev=>({...prev,sales:prev.sales.map(s=>s.id===sale.id?{...s,_paid:true}:s)}));
      setPayForm({method:"cash",checkNum:"",zelleRef:"",bankName:"",notes:""});
    }catch(e){console.error("Payment error:",e.message);}
    setPaymentSaving(false);
  };
  const [payMethod, setPayMethod] = useState("delivery"); // "delivery" | "card"
  const [stripeReady, setStripeReady] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [stripeError, setStripeError] = useState(null);
  const [stripeInst, setStripeInst] = useState(null);

  // Customer state
  const [selCust,   setSelCust]   = useState(null);
  const [portalStateTaxes, setPortalStateTaxes] = useState([]);
  const [custSearch,setCustSearch]= useState("");
  const [custPhone, setCustPhone] = useState("");
  const [verifyError,setVerifyError] = useState("");

  // Registration form
  const [reg, setReg] = useState({
    businessName:"", ownerName:"", email:"", phone:"", address:"", city:"", state:"TX", zip:""
  });
  const [regErrors, setRegErrors] = useState({});

  // Order state
  const [quantities, setQuantities] = useState({});
  const [notes,      setNotes]      = useState("");
  const [catFilter,  setCatFilter]  = useState("All");
  const [search,     setSearch]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [portalError, setPortalError] = useState("");
  const [order,      setOrder]      = useState(null);

  // Load data
  useEffect(()=>{
    (async()=>{
      try{
        const [pr, cu, co, ld, sa, rt, stx] = await Promise.all([
          supabase.from("products").select("*").order("cat").order("name"),
          supabase.from("customers").select("*").order("name"),
          supabase.from("company").select("*").single(),
          supabase.from("loads").select("*").eq("status","out"),
          supabase.from("sales").select("*"),
          supabase.from("returns").select("*"),
          supabase.from("state_taxes").select("*"),
        ]);
        if(cu.data) setCustomers(cu.data);
        if(stx.data) setPortalStateTaxes(stx.data);
        if(co.data) setCo(co.data);

      if(pr.data){
        const loads = ld.data||[];
        const sales = sa.data||[];
        const returns = rt.data||[];

        // Calculate units on trucks per product
        const onTrucks = {};
        loads.forEach(load=>{
          // Units loaded
          (load.items||[]).forEach(i=>{
            onTrucks[i.pid] = (onTrucks[i.pid]||0) + i.qty;
          });
          // Minus sold from this load
          sales.filter(s=>s.load_id===load.id).forEach(s=>{
            (s.items||[]).forEach(i=>{
              onTrucks[i.pid] = (onTrucks[i.pid]||0) - i.qty;
            });
          });
          // Minus returned from this load
          returns.filter(r=>r.load_id===load.id).forEach(r=>{
            (r.items||[]).forEach(i=>{
              onTrucks[i.pid] = (onTrucks[i.pid]||0) - i.qty;
            });
          });
        });

        // Total available = warehouse shelf + on trucks (remaining)
        const enriched = pr.data.map(p=>({
          ...p,
          onTruck: Math.max(0, onTrucks[p.id]||0),
          totalStock: p.shelf + Math.max(0, onTrucks[p.id]||0),
        }));
        setProducts(enriched.filter(p=>p.totalStock>0));
      }
      setLoading(false);
      }catch(e){ console.error("Portal load error:",e); setLoading(false); }
    })();
  },[]);

  const cats = useMemo(()=>["All",...new Set(products.map(p=>p.cat))],[products]);
  // Tax rate from customer's state — uses the same state_taxes table as all other platforms
  const taxRate = useMemo(()=>{
    if(!selCust?.state) return 0;
    const st = portalStateTaxes.find(s=>s.id===selCust.state);
    return st?.exempt ? 0 : parseFloat(st?.rate||0);
  },[selCust?.state, portalStateTaxes]);

  const filtered = useMemo(()=>products.filter(p=>{
    if(catFilter!=="All"&&p.cat!==catFilter) return false;
    if(search&&!p.name.toLowerCase().includes(search.toLowerCase())&&!p.sku?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }),[products,catFilter,search]);

  const orderItems = useMemo(()=>
    Object.entries(quantities).filter(([,q])=>q>0).map(([pid,qty])=>({pid,qty:parseInt(qty),name:products.find(p=>p.id===pid)?.name||""}))
  ,[quantities,products]);

  const subtotal = useMemo(()=>orderItems.reduce((a,i)=>a+getEffectivePrice(selCust,products.find(p=>p.id===i.pid))*i.qty,0),[orderItems,products,selCust]);
  const tax = parseFloat((orderItems.reduce((a,i)=>{const p=products.find(x=>x.id===i.pid);return isTaxableProd(p)?a+getEffectivePrice(selCust,p)*i.qty:a;},0)*taxRate/100).toFixed(2));
  const total = subtotal+tax;
  const cardSurcharge = payMethod==="card" ? parseFloat((total*CARD_FEE/100).toFixed(2)) : 0;
  const grandTotal = parseFloat((total+cardSurcharge).toFixed(2));

  const setQty=(pid,val,max)=>setQuantities(prev=>({...prev,[pid]:Math.min(max,Math.max(0,parseInt(val)||0))}));

  // ── VALIDATE REGISTRATION ──────────────────────────────────────────────────
  const validateReg = () => {
    const errs = {};
    if(!reg.businessName.trim()) errs.businessName = "Required";
    if(!reg.ownerName.trim())    errs.ownerName    = "Required";
    if(!reg.email.trim()||!/\S+@\S+\.\S+/.test(reg.email)) errs.email = "Valid email required";
    if(!reg.phone.trim())        errs.phone        = "Required";
    if(!reg.address.trim())      errs.address      = "Required";
    if(!reg.city.trim())         errs.city         = "Required";
    setRegErrors(errs);
    return Object.keys(errs).length===0;
  };

  // ── REGISTER NEW CUSTOMER ──────────────────────────────────────────────────
  const handleRegister = async () => {
    if(!validateReg()) return;
    setSubmitting(true);
    try {
      const fullAddress = `${reg.address}, ${reg.city}, ${reg.state} ${reg.zip}`.trim();
      const newCust = {
        id: "C"+uid(),
        name: reg.businessName,
        address: fullAddress,
        phone: reg.phone,
        email: reg.email,
        notes: `Owner: ${reg.ownerName}`,
        truck_id: null,
      };
      const {error} = await supabase.from("customers").insert(newCust);
      if(error) throw error;
      setCustomers(prev=>[...prev, newCust]);
      setSelCust({...newCust, ownerName: reg.ownerName});
      setStep("order");
    } catch(e) {
      setPortalError("Registration error: "+e.message);
    }
    setSubmitting(false);
  };

  // ── SUBMIT ORDER ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if(!orderItems.length) return;

    // Validate every item against current totalStock (shelf + on trucks)
    const outOfStock = orderItems.filter(i=>{
      const p = products.find(x=>x.id===i.pid);
      return !p || i.qty > (p.totalStock||0);
    });
    if(outOfStock.length){
      const msgs = outOfStock.map(i=>{
        const p = products.find(x=>x.id===i.pid);
        const avail = p?.totalStock||0;
        return avail===0
          ? `"${p?.name||i.pid}" is out of stock`
          : `"${p?.name||i.pid}" — only ${avail} available, you ordered ${i.qty}`;
      });
      setPortalError("⚠️ Stock issue: " + msgs.join(" · ") + " — please adjust quantities.");
      return;
    }

    setSubmitting(true);
    try {
      const id = "ORD-"+uid();
      // If paying by card — confirm Stripe payment first
      if(payMethod==="card" && stripeInst && clientSecret){
        const elements = document.querySelector("#stripe-card-element");
        // Confirm card payment via Stripe
        const result = await stripeInst.confirmCardPayment(clientSecret, {
          payment_method: { card: elements }
        });
        if(result.error) {
          setStripeError(result.error.message);
          setSubmitting(false);
          return;
        }
      }
      const rec = {
        id,
        cust_id: selCust.id,
        customer_name: selCust.name,
        customer_address: selCust.address||"",
        customer_phone: selCust.phone||"",
        custNotes: selCust.notes||"",
        date: nowStr(),
        items: orderItems,
        subtotal,
        tax,
        total: grandTotal,
        notes: notes+(payMethod==="card"?` | Paid by card online (incl. ${CARD_FEE}% surcharge $${cardSurcharge.toFixed(2)})`:" | Payment on delivery"),
        previous_balance: custPrevBalance||0,
        previous_invoice_ids: custPrevInvs.map(s=>s.id).join(",")||"",
        status: "approved",
        payment_method: payMethod,
        created_at: new Date().toISOString(),
      };
      const {error} = await supabase.from("orders").insert(rec);
      if(error) throw error;
      setOrder({
        ...rec,
        businessName: selCust.name,
        ownerName: selCust.notes?.replace("Owner: ","")||"",
        address: selCust.address,
        phone: selCust.phone,
        email: selCust.email,
        paidOnline: payMethod==="card",
      });
      setStep("confirm");
    } catch(e) {
      setPortalError("Order error: "+e.message);
    }
    setSubmitting(false);
  };

  const resetAll = () => {
    setStep("home"); setIsNew(false); setIsExisting(false); setIsDriver(false); setIsWalkIn(false); setSelCust(null);
    setCustSearch(""); setCustPhone(""); setVerifyError(""); setQuantities({}); setNotes(""); setOrder(null);
    setPayMethod("delivery"); setClientSecret(null); setStripeError(null); setStripeReady(false);
    setDriverUser(null); setDriverData(null); setDriverEmail(""); setDriverPw(""); setDriverError("");
    setWalkInVerified(false); setWalkInCust(null); setWalkInSearch(""); setWalkInPhone(""); setWalkInError("");
    setWalkInMode("customer"); setWalkInEmail(""); setWalkInPw(""); setWalkInUser(null);
    setWiReg({name:"",email:"",phone:"",role:"staff",note:""}); setWiRegMsg(null);
    setReg({businessName:"",ownerName:"",email:"",phone:"",address:"",city:"",state:"TX",zip:""});
  };

  // Driver login
  const handleDriverLogin = async () => {
    if(!driverEmail||!driverPw) return setDriverError("Email and password required");
    setDriverLoading(true); setDriverError("");
    try {
      const {data,error} = await supabase.auth.signInWithPassword({email:driverEmail,password:driverPw});
      if(error) throw error;
      // Get profile
      const {data:profile} = await supabase.from("profiles").select("*").eq("id",data.user.id).single();
      if(!profile) throw new Error("Profile not found");
      if(profile.role==="admin") throw new Error("Please use the admin dashboard instead");
      if(!profile.truck_id) throw new Error("No truck assigned — contact your admin");

      const truckId = profile.truck_id;

      const [truckR, custsR, loadsR, salesR, taxesR, pmtsR, coR] = await Promise.all([
        supabase.from("trucks").select("*").eq("id",truckId).single(),
        supabase.from("customers").select("id,name,address,phone,email,state,truck_id,notes").eq("truck_id",truckId),
        supabase.from("loads").select("*").eq("truck_id",truckId).eq("status","out").order("created_at",{ascending:false}),
        supabase.from("sales").select("*").eq("truck_id",truckId).order("created_at",{ascending:false}),
        supabase.from("state_taxes").select("*"),
        supabase.from("payments").select("sale_id,status,method,amount").eq("status","paid"),
        supabase.from("company").select("*").single(),
      ]);

      if(!truckR.data) throw new Error("Truck not found. Run this SQL: update profiles set truck_id = 'CORRECT_TRUCK_ID' where id = '"+data.user.id+"'");

      // Mark sales as paid based on payments table
      const paidSaleIds = new Set((pmtsR.data||[]).map(p=>p.sale_id));
      const salesWithPaid = (salesR.data||[]).map(s=>({...s, _paid: paidSaleIds.has(s.id)}));

      // Merge all active loads items into one virtual load
      const allLoads = loadsR.data||[];
      let mergedLoad = null;
      if(allLoads.length>0){
        // Combine all load items, summing quantities for same product
        const itemMap = {};
        allLoads.forEach(load=>{
          (load.items||[]).forEach(item=>{
            itemMap[item.pid] = (itemMap[item.pid]||0) + item.qty;
          });
        });
        const mergedItems = Object.entries(itemMap).map(([pid,qty])=>({pid,qty}));
        mergedLoad = {
          ...allLoads[0],
          id: allLoads[0].id, // use latest load id for new sales
          items: mergedItems,
          _allLoadIds: allLoads.map(l=>l.id)
        };
      }

      setDriverUser(data.user);
      const driverDataObj = {
        profile: {...profile, truck_id:truckId},
        truck: truckR.data,
        customers: custsR.data||[],
        activeLoad: mergedLoad,
        sales: salesWithPaid,
        stateTaxes: taxesR.data||[],
        co: coR.data||null,
        userId: data.user.id,
      };
      setDriverData(driverDataObj);
    } catch(e) {
      setDriverError(e.message);
    }
    setDriverLoading(false);
  };

  // ── DRIVER LOCATION HEARTBEAT ──────────────────────────────────────────────
  // Sends GPS coordinates to Supabase every 60s while driver is logged in
  useEffect(()=>{
    if(!driverData?.userId) return;
    const sendLocation = ()=>{
      if(!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(pos=>{
        supabase.from("profiles").update({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          last_seen: new Date().toISOString(),
        }).eq("id", driverData.userId).then(()=>{});
      }, ()=>{
        // Permission denied or unavailable — just update last_seen
        supabase.from("profiles").update({last_seen:new Date().toISOString()}).eq("id",driverData.userId).then(()=>{});
      });
    };
    sendLocation(); // immediately on login
    const interval = setInterval(sendLocation, 60000); // every 60s
    return ()=>clearInterval(interval);
  },[driverData?.userId]);

  // Verify customer by shop name + phone
  const [custPrevBalance, setCustPrevBalance] = useState(0);
  const [custPrevInvs, setCustPrevInvs] = useState([]);

  const verifyCustomer = async () => {
    setVerifyError("");
    if(!custSearch.trim()) return setVerifyError("Please enter your business name");
    if(!custPhone.trim()) return setVerifyError("Please enter your phone number");

    const normalize = p => p.replace(/[\s\-\(\)\+\.]/g,"");
    const inputPhone = normalize(custPhone);
    const inputName = custSearch.trim().toLowerCase();

    const match = customers.find(c => {
      const nameMatch = c.name.toLowerCase().includes(inputName) || inputName.includes(c.name.toLowerCase());
      const phoneMatch = normalize(c.phone||"") === inputPhone || normalize(c.phone||"").endsWith(inputPhone) || inputPhone.endsWith(normalize(c.phone||"").slice(-7));
      return nameMatch && phoneMatch;
    });

    if(!match){
      setVerifyError("No account found with that name and phone number. Please check your details or register below.");
      return;
    }

    // Check unpaid balance
    const [{data:custSales},{data:pmts}] = await Promise.all([
      supabase.from("sales").select("id,total,date").eq("cust_id",match.id),
      supabase.from("payments").select("sale_id,status").eq("status","unpaid"),
    ]);
    const unpaidIds = new Set((pmts||[]).map(p=>p.sale_id));
    const allUnpaid = (custSales||[]).filter(s=>unpaidIds.has(s.id)||!(pmts||[]).find(p=>p.sale_id===s.id));
    // Fetch state taxes for accurate balance calculation
    const {data:staxes} = await supabase.from("state_taxes").select("*");
    const bal = parseFloat(allUnpaid.reduce((a,s)=>{
      const st = (staxes||[]).find(x=>x.id===(s.state||""));
      const rate = st?.exempt ? 0 : parseFloat(st?.rate||co?.tax_rate||0);
      const taxable = (s.items||[]).reduce((b,i)=>{
        const p = products.find(x=>x.id===i.pid);
        return isTaxableProd(p) ? b+(p?.price||0)*i.qty : b;
      }, 0);
      const tax = parseFloat((taxable*rate/100).toFixed(2));
      return a + s.total + tax + parseFloat(s.previous_balance||0);
    }, 0).toFixed(2));
    setCustPrevBalance(bal);
    setCustPrevInvs(allUnpaid);

    setSelCust(match);
    setStep("order");
  };

  // Walk-in auth — customers by name+phone, drivers/admin/staff by email+password
  const verifyWalkIn = async () => {
    setWalkInError(""); setWalkInLoading(true);
    try {
      if(walkInMode==="customer"){
        if(!walkInSearch.trim()) throw new Error("Please enter your business name");
        if(!walkInPhone.trim())  throw new Error("Please enter your phone number");
        const normalize = p => p.replace(/[\s\-\(\)\+\.]/g,"");
        const inputPhone = normalize(walkInPhone);
        const inputName  = walkInSearch.trim().toLowerCase();
        const match = customers.find(c => {
          const nameMatch  = c.name.toLowerCase().includes(inputName)||inputName.includes(c.name.toLowerCase());
          const phoneMatch = normalize(c.phone||"")===inputPhone||normalize(c.phone||"").endsWith(inputPhone)||inputPhone.endsWith(normalize(c.phone||"").slice(-7));
          return nameMatch && phoneMatch;
        });
        if(!match) throw new Error("No registered customer found. Check your business name and phone number.");
        setWalkInCust(match); setWalkInVerified(true);
      } else {
        // Staff / Driver / Admin — email + password via Supabase auth
        if(!walkInEmail.trim()) throw new Error("Please enter your email");
        if(!walkInPw.trim())    throw new Error("Please enter your password");
        const {data, error} = await supabase.auth.signInWithPassword({email:walkInEmail, password:walkInPw});
        if(error) throw new Error("Invalid email or password");
        // Check profile — must be approved (admin, driver, or approved staff)
        const {data:prof} = await supabase.from("profiles").select("*").eq("id",data.user.id).single();
        if(!prof) throw new Error("No profile found. Contact admin.");
        if(prof.role==="pending") throw new Error("Your account is pending admin approval.");
        // All roles allowed: admin, driver, staff
        setWalkInUser({...data.user, role:prof.role, displayName:prof.name||walkInEmail});
        setWalkInCust(null); setWalkInVerified(true);
        // Sign out of supabase session — we only needed to verify identity
        await supabase.auth.signOut();
      }
    } catch(e){ setWalkInError(e.message); }
    setWalkInLoading(false);
  };

  // Staff self-registration for walk-in access (requires admin approval)
  const submitWiRegistration = async () => {
    setWiRegSaving(true); setWiRegMsg(null);
    try {
      if(!wiReg.name.trim()||!wiReg.email.trim()||!wiReg.phone.trim()) throw new Error("Name, email, and phone are required");
      const {error} = await supabase.from("walkin_registrations").insert({
        name: wiReg.name.trim(), email: wiReg.email.trim(), phone: wiReg.phone.trim(),
        role: wiReg.role, note: wiReg.note.trim(), status:"pending", created_at: new Date().toISOString()
      });
      if(error) throw error;
      setWiRegMsg({t:"success", m:"✅ Request submitted! An admin will review and approve your access."});
      setWiReg({name:"",email:"",phone:"",role:"staff",note:""});
    } catch(e){ setWiRegMsg({t:"error", m:e.message}); }
    setWiRegSaving(false);
  };

  // Send invoice email
  const sendInvoiceEmail = async (sale, cust) => {
    if(!cust?.email) return setMsg({t:"error",m:"Customer has no email address on file"});
    try{
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const stateId = sale.state||cust?.state||"";
      const stData = driverData?.stateTaxes?.find?.(s=>s.id===stateId);
      const stateRate = stData?.exempt ? 0 : parseFloat(stData?.rate||co?.tax_rate||0);
      const items = (sale.items||[]).map(i=>{
        const p = products.find(x=>x.id===i.pid);
        return {name:p?.name||"Product",qty:i.qty,price:p?.price||0,unit:p?.unit||"",cat:p?.cat||""};
      });
      const sub = sale.total;
      const tax = parseFloat((items.reduce((a,i)=>{
        return isTaxableProd({cat:i.cat,name:i.name})?a+i.price*i.qty:a;
      },0)*stateRate/100).toFixed(2));
      const prevBalance = parseFloat(sale.previous_balance||0);
      const prevInvoiceIds = sale.previous_invoice_ids||"";
      const gt = sub+tax+prevBalance;
      await fetch(`${SUPABASE_URL}/functions/v1/send-invoice-email`,{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${SUPABASE_ANON_KEY}`,"apikey":SUPABASE_ANON_KEY},
        body:JSON.stringify({
          to: cust.email,
          invoiceId: sale.id,
          customerName: cust.name,
          driverName: driverData?.truck?.driver||"",
          date: sale.date,
          items, subtotal:sub, tax, taxRate, grandTotal:gt,
          previousBalance: prevBalance,
          previousInvoiceIds: prevInvoiceIds,
          companyName: co?.name, companyEmail: co?.email,
          companyPhone: co?.phone, companyAddress: co?.address,
          paidStatus: "unpaid",
        }),
      });
      await supabase.from("sales").update({email_sent:true,email_sent_at:new Date().toISOString()}).eq("id",sale.id);
      setDriverData(prev=>({...prev,sales:prev.sales.map(s=>s.id===sale.id?{...s,email_sent:true}:s)}));
      setMsg({t:"success",m:`✓ Invoice emailed to ${cust.email}`});
    }catch(e){
      setMsg({t:"error",m:"Email error: "+e.message});
    }
  };
  const loadStripeIntent = async () => {
    setStripeError(null);
    setStripeReady(false);
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-payment-intent`, {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${SUPABASE_ANON_KEY}`,"apikey":SUPABASE_ANON_KEY},
        body:JSON.stringify({amount:grandTotal,currency:"usd",metadata:{customer_name:selCust?.name||"",order_portal:"true"}}),
      });
      const data = await res.json();
      if(data?.error) throw new Error(data.error);
      setClientSecret(data.clientSecret);
      // Dynamically load Stripe
      if(!window.Stripe){
        await new Promise((resolve,reject)=>{
          const s=document.createElement("script");
          s.src="https://js.stripe.com/v3/";
          s.onload=resolve; s.onerror=reject;
          document.head.appendChild(s);
        });
      }
      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      setStripeInst(stripe);
      setStripeReady(true);
    } catch(e) {
      setStripeError(e.message);
    }
  };

  // ── LOADING ────────────────────────────────────────────────────────────────
  if(loading) return (
    <div className="portal" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <GS/>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,color:"#0a1628",marginBottom:8}}>VitalWaveOne</div>
        <div style={{fontSize:13,color:"#9ca3af"}}>Loading catalog…</div>
      </div>
    </div>
  );

  return (
    <div className="portal">
      <GS/>

      {/* ── HEADER ── */}
      <div className="no-print" style={{background:"#0a1628",padding:"0 24px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px #00000040"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <img src="/logo-sidebar.png" style={{height:46,width:46,objectFit:"cover",borderRadius:8,background:"#fff",padding:2}}/>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"#fff",lineHeight:1}}>VitalWaveOne</div>
            <div style={{fontSize:9,color:"#4b6080",letterSpacing:".1em",marginTop:1}}>ORDER PORTAL</div>
          </div>
        </div>

        {/* Step indicators — only for customer ordering flow */}
        {!isDriver&&!driverUser&&<div style={{display:"flex",alignItems:"center",gap:6}}>
          {[{k:"home",l:"Start"},{k:"order",l:"Order"},{k:"review",l:"Review"},{k:"confirm",l:"Done"}].map((s,i,arr)=>{
            const steps=["home","order","review","confirm"];
            const cur=steps.indexOf(step);
            const done=cur>i, active=cur===i;
            return (
              <div key={s.k} style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:done?"#f59e0b":active?"#fff":"#1e3050",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:done?"#0a1628":active?"#0a1628":"#4b6080",transition:"all .3s"}}>{done?"✓":i+1}</div>
                  <span style={{fontSize:10,color:active?"#fff":done?"#f59e0b":"#4b6080",fontWeight:active||done?600:400}}>{s.l}</span>
                </div>
                {i<arr.length-1&&<div style={{width:16,height:1,background:"#1e3050",margin:"0 2px"}}/>}
              </div>
            );
          })}
        </div>}

        {/* Customer name tag */}
        {selCust&&step!=="home"&&!isDriver&&<div style={{fontSize:11,color:"#4b6080"}}>⛽ <span style={{color:"#fff",fontWeight:600}}>{selCust.name}</span></div>}

        {/* Driver name tag when logged in */}
        {driverUser&&driverData&&<div style={{fontSize:11,color:"#4b6080"}}>🚚 <span style={{color:"#fff",fontWeight:600}}>{driverData.truck?.driver}</span></div>}

        {/* Back button — only for customer ordering flow, not driver dashboard */}
        {!isDriver&&!driverUser&&step!=="home"&&step!=="confirm"&&(
          <button onClick={()=>{
            if(step==="order"){setStep("home");setQuantities({});}
            else if(step==="review") setStep("order");
          }} style={{background:"#1e3050",border:"1px solid #2e4060",borderRadius:8,padding:"7px 14px",color:"#b0c8e0",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'Inter',sans-serif"}}>
            ← Back
          </button>
        )}

        {/* Back to home — for non-logged-in selection screens */}
        {!driverUser&&(isNew||isExisting||(isDriver&&!driverUser))&&step==="home"&&(
          <button onClick={()=>{setIsNew(false);setIsExisting(false);setIsDriver(false);setIsWalkIn(false);}} style={{background:"#1e3050",border:"1px solid #2e4060",borderRadius:8,padding:"7px 14px",color:"#b0c8e0",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'Inter',sans-serif"}}>
            ← Back
          </button>
        )}
      </div>

      <div style={{maxWidth:1060,margin:"0 auto",padding:"28px 16px"}}>

      {/* ══ HOME — New or Existing ══ */}
      {step==="home"&&<div className="fu">
        {/* Only show welcome + cards if no role selected yet */}
        {!isNew&&!isDriver&&!isExisting&&!isWalkIn&&<>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:42,color:"#0a1628",lineHeight:1.15,marginBottom:10}}>
            Welcome to VitalWaveOne
          </div>
          <div style={{fontSize:15,color:"#6b7280",maxWidth:480,margin:"0 auto"}}>
            Place your wholesale order securely and privately
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,maxWidth:900,margin:"0 auto 40px"}} className="grid2">
          {/* Existing Customer */}
          <div className="card" style={{padding:28,cursor:"pointer",transition:"all .2s",border:"2px solid #e5e7eb"}}
            onClick={()=>{setIsExisting(true);setIsNew(false);setIsDriver(false);setIsWalkIn(false);}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#0a1628";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 30px #0a162820";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
            <div style={{fontSize:36,marginBottom:12}}>💎</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#0a1628",marginBottom:8}}>Existing Customer</div>
            <div style={{fontSize:13,color:"#6b7280",lineHeight:1.6}}>Welcome back! Access your account and place your order.</div>
            <div style={{marginTop:16,color:"#0a1628",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>Access my account →</div>
            <div style={{marginTop:10,fontSize:12,color:"#9ca3af"}}>
              New customer?{" "}
              <span style={{color:"#f59e0b",fontWeight:600,cursor:"pointer",textDecoration:"underline"}}
                onClick={e=>{e.stopPropagation();setIsNew(true);setIsExisting(false);setIsDriver(false);setIsWalkIn(false);}}>
                Sign up →
              </span>
            </div>
          </div>

          {/* Walk-in */}
          <div className="card" style={{padding:28,cursor:"pointer",transition:"all .2s",border:"2px solid #e5e7eb",background:"linear-gradient(135deg,#fff,#f5f3ff)"}}
            onClick={()=>{setIsWalkIn(true);setIsNew(false);setIsDriver(false);setIsExisting(false);}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#7c3aed";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 30px #7c3aed20";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
            <div style={{fontSize:36,marginBottom:12}}>🏪</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#0a1628",marginBottom:8}}>Walk-in</div>
            <div style={{fontSize:13,color:"#6b7280",lineHeight:1.6}}>Purchase directly from the warehouse. Sell from shelf stock on the spot.</div>
            <div style={{marginTop:16,color:"#7c3aed",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>Walk-in sale →</div>
          </div>

          {/* Driver */}
          <div className="card" style={{padding:28,cursor:"pointer",transition:"all .2s",border:"2px solid #e5e7eb",background:"linear-gradient(135deg,#fff,#f0f9ff)"}}
            onClick={()=>{setIsDriver(true);setIsNew(false);setIsWalkIn(false);setIsExisting(false);}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#0ea5e9";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 30px #0ea5e920";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
            <div style={{fontSize:36,marginBottom:12}}>🚚</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#0a1628",marginBottom:8}}>I'm a Driver</div>
            <div style={{fontSize:13,color:"#6b7280",lineHeight:1.6}}>VitalWaveOne delivery driver. Access your route and record sales.</div>
            <div style={{marginTop:16,color:"#0ea5e9",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>Driver login →</div>
          </div>
        </div>
        </>}

        {/* ── DRIVER: login + dashboard ── */}
        {isDriver&&<div className="fu">
          {!driverUser?(
            <div style={{maxWidth:420,margin:"0 auto"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#0a1628",marginBottom:6,textAlign:"center"}}>Driver Login</div>
              <div style={{fontSize:13,color:"#6b7280",textAlign:"center",marginBottom:24}}>Sign in with your VitalWaveOne driver credentials</div>
              <div className="card" style={{padding:28}}>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div className="field">
                    <label>Email Address</label>
                    <input type="email" placeholder="your@email.com" value={driverEmail} onChange={e=>setDriverEmail(e.target.value)}
                      onFocus={e=>e.target.style.borderColor="#0ea5e9"} onBlur={e=>e.target.style.borderColor="#d1d5db"}/>
                  </div>
                  <div className="field">
                    <label>Password</label>
                    <input type="password" placeholder="••••••••" value={driverPw} onChange={e=>setDriverPw(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&handleDriverLogin()}
                      onFocus={e=>e.target.style.borderColor="#0ea5e9"} onBlur={e=>e.target.style.borderColor="#d1d5db"}/>
                  </div>
                  {driverError&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#dc2626"}}>⚠️ {driverError}</div>}
                  <button onClick={handleDriverLogin} disabled={driverLoading}
                    style={{background:"#0ea5e9",color:"#fff",border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    {driverLoading?<><span className="sp">⟳</span>Signing in…</>:<>🚚 Sign In as Driver</>}
                  </button>
                  <div style={{textAlign:"center",fontSize:12,color:"#9ca3af"}}>
                    Need help? Contact your admin
                  </div>
                </div>
              </div>
            </div>
          ):(
            /* ── DRIVER DASHBOARD ── */
            <div style={{maxWidth:640,margin:"0 auto"}}>
              {/* Driver header */}
              <div style={{background:"#0a1628",borderRadius:14,padding:"18px 22px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontSize:10,color:"#4b6080",letterSpacing:".08em",marginBottom:4}}>WELCOME BACK</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#fff"}}>{driverData.truck?.driver}</div>
                  <div style={{fontSize:12,color:"#4b6080",marginTop:2}}>🚚 {driverData.truck?.plate} · {driverData.truck?.route||"Route"}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10,color:"#4b6080",marginBottom:4}}>TODAY'S REVENUE</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"#0ea5e9"}}>
                    ${driverData.sales.filter(s=>s._paid&&new Date(s.created_at).toDateString()===new Date().toDateString()).reduce((a,s)=>{const st=driverData.stateTaxes?.find(x=>x.id===(s.state||""));const rate=st?.exempt?0:parseFloat(st?.rate||0);const taxable=(s.items||[]).reduce((b,i)=>{const p=products.find(x=>x.id===i.pid);return isTaxableProd(p)?b+(p?.price||0)*i.qty:b;},0);const tax=parseFloat((taxable*rate/100).toFixed(2));return a+s.total+tax+parseFloat(s.previous_balance||0);},0).toFixed(2)} collected
                  </div>
                  <button onClick={async()=>{
                    // Refresh customers and state taxes
                    const [custsR, taxesR] = await Promise.all([
                      supabase.from("customers").select("id,name,address,phone,email,state,truck_id,notes").eq("truck_id",driverData.truck?.id),
                      supabase.from("state_taxes").select("*"),
                    ]);
                    setDriverData(prev=>({...prev, customers:custsR.data||prev.customers, stateTaxes:taxesR.data||prev.stateTaxes}));
                  }} style={{marginTop:4,background:"transparent",border:"1px solid #1e3050",borderRadius:6,padding:"4px 10px",fontSize:11,color:"#4b6080",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                    ↻ Refresh
                  </button>
                  <button onClick={()=>{supabase.auth.signOut();setDriverUser(null);setDriverData(null);setDriverTab("dashboard");}}
                    style={{marginTop:8,background:"transparent",border:"1px solid #1e3050",borderRadius:6,padding:"4px 10px",fontSize:11,color:"#4b6080",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Tab navigation */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:6,marginBottom:16}}>
                {[
                  {k:"dashboard",e:"🏠",l:"Home"},
                  {k:"load",e:"📦",l:"Load"},
                  {k:"sell",e:"💳",l:"Sell"},
                  {k:"expenses",e:"💸",l:"Expenses"},
                  {k:"history",e:"📄",l:"History"},
                ].map(t=>(
                  <button key={t.k} onClick={()=>setDriverTab(t.k)}
                    style={{padding:"10px 6px",borderRadius:9,border:`1.5px solid ${driverTab===t.k?"#0ea5e9":"#e5e7eb"}`,background:driverTab===t.k?"#f0f9ff":"#fff",cursor:"pointer",textAlign:"center",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>
                    <div style={{fontSize:18}}>{t.e}</div>
                    <div style={{fontSize:10,fontWeight:600,color:driverTab===t.k?"#0ea5e9":"#6b7280",marginTop:3}}>{t.l}</div>
                  </button>
                ))}
              </div>

              {/* ── HOME TAB ── */}
              {driverTab==="dashboard"&&<div>
                <div style={{background:driverData.activeLoad?"#f0fdf4":"#fef9c3",border:`1px solid ${driverData.activeLoad?"#a7f3d0":"#fde68a"}`,borderRadius:10,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
                  <div style={{fontSize:24}}>{driverData.activeLoad?"🟢":"🟡"}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:driverData.activeLoad?"#065f46":"#92400e"}}>{driverData.activeLoad?"Truck Loaded & Active":"Truck Not Loaded"}</div>
                    <div style={{fontSize:12,color:driverData.activeLoad?"#047857":"#92400e"}}>{driverData.activeLoad?`Load ${driverData.activeLoad.id} · ${(driverData.activeLoad.items||[]).reduce((a,i)=>a+i.qty,0)} units loaded`:"Tap Load to load your truck"}</div>
                  </div>
                </div>

                {/* ── TRUCK INVENTORY ── */}
                {driverData.activeLoad&&(()=>{
                  const loadedItems=driverData.activeLoad.items||[];
                  const allLdIds=driverData.activeLoad._allLoadIds||[driverData.activeLoad.id];
                  const soldMap=driverData.sales
                    .filter(s=>allLdIds.includes(s.load_id))
                    .reduce((acc,s)=>{(s.items||[]).forEach(i=>{acc[i.pid]=(acc[i.pid]||0)+i.qty;});return acc;},{});
                  const totalLoaded=loadedItems.reduce((a,i)=>a+i.qty,0);
                  const totalSold=loadedItems.reduce((a,i)=>a+(soldMap[i.pid]||0),0);
                  const totalRemaining=totalLoaded-totalSold;
                  return(
                    <div className="card" style={{marginBottom:14}}>
                      <div style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{fontWeight:700,fontSize:13,color:"#0a1628"}}>📦 Truck Inventory</div>
                        <div style={{display:"flex",gap:12,fontSize:11}}>
                          <span style={{color:"#6b7280"}}>Loaded: <strong style={{color:"#0ea5e9"}}>{totalLoaded}</strong></span>
                          <span style={{color:"#6b7280"}}>Sold: <strong style={{color:"#059669"}}>{totalSold}</strong></span>
                          <span style={{color:"#6b7280"}}>Left: <strong style={{color:totalRemaining<5?"#dc2626":"#212121"}}>{totalRemaining}</strong></span>
                        </div>
                      </div>
                      {loadedItems.map(item=>{
                        const p=products.find(x=>x.id===item.pid);
                        const sold=soldMap[item.pid]||0;
                        const remaining=Math.max(0,item.qty-sold);
                        const pct=item.qty>0?(remaining/item.qty)*100:0;
                        return(
                          <div key={item.pid} style={{padding:"10px 16px",borderBottom:"1px solid #f9fafb"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                              <div>
                                <div style={{fontWeight:600,fontSize:13}}>{p?.name||item.pid}</div>
                                <div style={{fontSize:10,color:"#9ca3af"}}>SKU: {p?.sku} · ${p?.price}/unit</div>
                              </div>
                              <div style={{textAlign:"right"}}>
                                <div style={{fontWeight:800,fontSize:18,color:remaining===0?"#dc2626":remaining<=3?"#f59e0b":"#059669"}}>{remaining}</div>
                                <div style={{fontSize:10,color:"#9ca3af"}}>of {item.qty} left</div>
                              </div>
                            </div>
                            <div style={{height:5,background:"#f3f4f6",borderRadius:3,overflow:"hidden",marginBottom:3}}>
                              <div style={{height:"100%",width:`${pct}%`,background:pct>50?"#059669":pct>20?"#f59e0b":"#dc2626",borderRadius:3,transition:"width .3s"}}/>
                            </div>
                            {sold>0&&<div style={{fontSize:10,color:"#6b7280"}}>✓ {sold} sold · <span style={{color:"#059669",fontWeight:600}}>${(sold*(p?.price||0)).toFixed(2)}</span></div>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                  {[
                    {l:"Customers",v:driverData.customers.length,e:"⛽",c:"#0ea5e9"},
                    {l:"Today's Sales",v:driverData.sales.filter(s=>new Date(s.created_at).toDateString()===new Date().toDateString()).length,e:"📄",c:"#7c3aed"},
                    {l:"Collected Today",v:`$${driverData.sales.filter(s=>s._paid&&new Date(s.created_at).toDateString()===new Date().toDateString()).reduce((a,s)=>{const st=driverData.stateTaxes?.find(x=>x.id===(s.state||""));const rate=st?.exempt?0:parseFloat(st?.rate||0);const taxable=(s.items||[]).reduce((b,i)=>{const p=products.find(x=>x.id===i.pid);return isTaxableProd(p)?b+(p?.price||0)*i.qty:b;},0);const tax=parseFloat((taxable*rate/100).toFixed(2));return a+s.total+tax+parseFloat(s.previous_balance||0);},0).toFixed(2)}`,e:"💰",c:"#059669"},{l:"Balance Due",v:(()=>{const lastUnpaid=driverData.sales.filter(s=>!s._paid).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0];if(!lastUnpaid)return "$0.00";const st=driverData.stateTaxes?.find(x=>x.id===(lastUnpaid.state||""));const rate=st?.exempt?0:parseFloat(st?.rate||0);const taxable=(lastUnpaid.items||[]).reduce((b,i)=>{const p=products.find(x=>x.id===i.pid);return isTaxableProd(p)?b+(p?.price||0)*i.qty:b;},0);const tax=parseFloat((taxable*rate/100).toFixed(2));return "$"+(lastUnpaid.total+tax+parseFloat(lastUnpaid.previous_balance||0)).toFixed(2);})(),e:"⏳",c:"#f59e0b"},
                  ].map(k=>(
                    <div key={k.l} className="card" style={{padding:"12px",textAlign:"center"}}>
                      <div style={{fontSize:20,marginBottom:3}}>{k.e}</div>
                      <div style={{fontWeight:800,fontSize:18,color:k.c}}>{k.v}</div>
                      <div style={{fontSize:10,color:"#9ca3af",marginTop:2}}>{k.l}</div>
                    </div>
                  ))}
                </div>
                <div className="card" style={{marginBottom:14}}>
                  <div style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#0a1628"}}>⛽ My Customers</div>
                    <button onClick={()=>setShowAddCust(v=>!v)}
                      style={{background:"#0a1628",color:"#fff",border:"none",borderRadius:7,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                      ＋ Add Customer
                    </button>
                  </div>

                  {/* Add Customer Form */}
                  {showAddCust&&(()=>{
                    const submit=async()=>{
                      if(!newCustForm.name.trim()) return;
                      setNewCustSaving(true);
                      try{
                        const rec={id:"C"+uid(),name:newCustForm.name.trim(),address:newCustForm.address.trim(),phone:newCustForm.phone.trim(),email:newCustForm.email.trim(),state:newCustForm.state.trim(),notes:"",truck_id:driverData.truck?.id};
                        const{error}=await supabase.from("customers").insert(rec);
                        if(error)throw error;
                        setDriverData(prev=>({...prev,customers:[rec,...prev.customers]}));
                        setShowAddCust(false);
                        setNewCustForm({name:"",address:"",phone:"",email:"",state:""});
                        setMsg({t:"success",m:`✅ ${rec.name} added to your route`});
                      }catch(e){setMsg({t:"error",m:e.message});}
                      setNewCustSaving(false);
                    };
                    return(
                      <div style={{padding:"14px 16px",borderBottom:"1px solid #f3f4f6",background:"#f9fafb"}}>
                        <div style={{fontSize:12,fontWeight:700,color:"#0a1628",marginBottom:10}}>New Customer — auto-assigned to your truck</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                          {[["Business Name *","name","e.g. Corner Gas Mart"],["Phone","phone","(555) 000-0000"],["Address","address","123 Main St, Dallas TX"],["State","state","TX"]].map(([l,k,p])=>(
                            <div key={k} className="field" style={{gridColumn:k==="address"?"1/-1":"auto"}}>
                              <label style={{fontSize:10}}>{l}</label>
                              <input placeholder={p} value={newCustForm[k]} onChange={e=>setNewCustForm(prev=>({...prev,[k]:e.target.value}))}
                                style={{fontSize:13,padding:"8px 10px"}}/>
                            </div>
                          ))}
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={submit} disabled={newCustSaving||!newCustForm.name.trim()}
                            style={{background:"#0a1628",color:"#fff",border:"none",borderRadius:8,padding:"9px 16px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",opacity:!newCustForm.name.trim()?0.5:1}}>
                            {newCustSaving?"Adding…":"✅ Add Customer"}
                          </button>
                          <button onClick={()=>{setShowAddCust(false);setNewCustForm({name:"",address:"",phone:"",email:"",state:"",});}}
                            style={{background:"#f3f4f6",color:"#6b7280",border:"none",borderRadius:8,padding:"9px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {driverData.customers.map(c=>{
                    const navToAddr=addr=>{
                      if(!addr) return;
                      const enc=encodeURIComponent(addr);
                      const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent);
                      window.open(isIOS?`maps://maps.apple.com/?q=${enc}`:`https://www.google.com/maps/search/?api=1&query=${enc}`,"_blank");
                    };
                    return(
                    <div key={c.id} style={{padding:"12px 16px",borderBottom:"1px solid #f9fafb",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:13}}>{c.name}</div>
                        {c.address&&<div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>📍 {c.address}</div>}
                        {c.phone&&<div style={{fontSize:11,color:"#9ca3af"}}>📞 {c.phone}</div>}
                      </div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        {c.address&&<button onClick={()=>navToAddr(c.address)}
                          style={{background:"#f0f9ff",color:"#0ea5e9",border:"1.5px solid #bae6fd",borderRadius:7,padding:"6px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",whiteSpace:"nowrap"}}>
                          🗺 Navigate
                        </button>}
                        <button onClick={()=>{setDriverSaleCust(c.id);setDriverTab("sell");}}
                          style={{background:"#0ea5e9",color:"#fff",border:"none",borderRadius:7,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                          Sell →
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>}

              {/* ── LOAD TAB ── */}
              {driverTab==="load"&&<DriverLoadTab driverData={driverData} setDriverData={setDriverData} products={products} supabase={supabase} co={co}/>}

              {/* ── SELL TAB ── */}
              {driverTab==="sell"&&<DriverSellTab driverData={driverData} setDriverData={setDriverData} products={products} supabase={supabase} co={driverData.co||co} initCust={driverSaleCust} setDriverSaleCust={setDriverSaleCust} payForm={payForm} setPayForm={setPayForm} paymentSaving={paymentSaving} setPaymentSaving={setPaymentSaving} collectPayment={collectPayment} createdSale={createdSale} setCreatedSale={setCreatedSale} showPayment={showPayment} setShowPayment={setShowPayment}/>}

              {/* ── EXPENSES TAB ── */}
              {driverTab==="expenses"&&<DriverExpensesTab driverData={driverData} supabase={supabase}/>}

              {/* ── HISTORY TAB ── */}
              {driverTab==="history"&&<div>
                <div style={{fontWeight:700,fontSize:14,color:"#0a1628",marginBottom:12}}>📄 Invoice History</div>
                {driverData.sales.length===0
                  ?<div className="card" style={{padding:24,textAlign:"center",color:"#9ca3af"}}>No invoices yet</div>
                  :driverData.sales.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map(s=>{
                    const cust=driverData.customers.find(c=>c.id===s.cust_id);
                    const isPaid=s._paid||false;
                    const saleTax=(()=>{
                      const st=driverData.stateTaxes?.find(x=>x.id===(s.state||""));
                      const rate=st?.exempt?0:parseFloat(st?.rate||0);
                      if(!rate)return 0;
                      const taxable=(s.items||[]).reduce((a,i)=>{const p=products.find(x=>x.id===i.pid);return isTaxableProd(p)?a+(p?.price||0)*i.qty:a;},0);
                      return parseFloat((taxable*rate/100).toFixed(2));
                    })();
                    const prevBal=parseFloat(s.previous_balance||0);
                    const gt=parseFloat((s.total+saleTax+prevBal).toFixed(2));
                    return(
                      <div key={s.id} className="card" style={{padding:"14px 16px",marginBottom:10,borderLeft:`4px solid ${isPaid?"#059669":s.email_sent?"#0ea5e9":"#e5e7eb"}`}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                          <div>
                            <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                              <span style={{background:"#f5f3ff",color:"#7c3aed",padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700}}>{s.id}</span>
                              {isPaid
                                ?<span style={{background:"#dcfce7",color:"#166534",padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700}}>✓ PAID</span>
                                :<span style={{background:"#fef9c3",color:"#854d0e",padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700}}>⏳ UNPAID</span>
                              }
                            </div>
                            <div style={{fontWeight:600,fontSize:13,marginTop:4}}>{cust?.name||"Unknown"}</div>
                            <div style={{fontSize:11,color:"#9ca3af"}}>{s.date}</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontWeight:800,fontSize:18,color:isPaid?"#059669":"#7c3aed"}}>${gt.toFixed(2)}</div>
                            {saleTax>0&&<div style={{fontSize:10,color:"#9ca3af"}}>incl. ${saleTax.toFixed(2)} tax</div>}
                            {prevBal>0&&<div style={{fontSize:10,color:"#dc2626",fontWeight:600}}>incl. ${prevBal.toFixed(2)} prev. balance</div>}
                            {s.email_sent&&<div style={{fontSize:10,color:"#0ea5e9"}}>✓ Email sent</div>}
                          </div>
                        </div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          <button onClick={()=>setDriverViewInv(s)} style={{flex:1,padding:"8px",background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:7,fontSize:12,fontWeight:600,color:"#7c3aed",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                            👁 View
                          </button>
                          {!isPaid&&<button onClick={()=>{setCreatedSaleForHistory(s);setShowHistoryPayment(true);}}
                            style={{flex:1,padding:"8px",background:"#059669",border:"none",borderRadius:7,fontSize:12,fontWeight:600,color:"#fff",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                            💰 Collect
                          </button>}
                          {cust?.email&&!s.email_sent&&<button onClick={()=>sendInvoiceEmail(s,cust)} style={{flex:1,padding:"8px",background:"#0ea5e9",border:"none",borderRadius:7,fontSize:12,fontWeight:600,color:"#fff",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                            📧 Email
                          </button>}
                          {isPaid&&<div style={{flex:1,padding:"8px",background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:7,fontSize:12,color:"#059669",textAlign:"center",fontWeight:600}}>✓ Paid</div>}
                        </div>
                      </div>
                    );
                  })
                }
              </div>}

              {/* Invoice viewer modal */}
              {driverViewInv&&<div style={{position:"fixed",inset:0,background:"#00000060",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
                <div style={{background:"#fff",borderRadius:16,padding:24,maxWidth:560,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div style={{fontWeight:700,fontSize:16}}>Invoice {driverViewInv.id}</div>
                    <div style={{display:"flex",gap:8}}>
                      {driverData.customers.find(c=>c.id===driverViewInv.cust_id)?.email&&
                        <button onClick={()=>{sendInvoiceEmail(driverViewInv,driverData.customers.find(c=>c.id===driverViewInv.cust_id));setDriverViewInv(null);}}
                          style={{background:"#0ea5e9",color:"#fff",border:"none",borderRadius:7,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                          📧 Email
                        </button>
                      }
                      <button onClick={()=>window.print()} style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:7,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>🖨 Print</button>
                      <button onClick={()=>setDriverViewInv(null)} style={{background:"#f3f4f6",border:"none",borderRadius:7,padding:"8px 14px",fontSize:12,cursor:"pointer"}}>✕ Close</button>
                    </div>
                  </div>
                  <DriverInvoiceView sale={driverViewInv} customers={driverData.customers} products={products} co={co} driver={driverData.truck?.driver} stateTaxes={driverData.stateTaxes}/>
                </div>
              </div>}

              {/* History Payment Modal */}
              {showHistoryPayment&&createdSaleForHistory&&(()=>{
                const s=createdSaleForHistory;
                const saleTax=(()=>{const st=driverData.stateTaxes?.find(x=>x.id===(s.state||""));const rate=st?.exempt?0:parseFloat(st?.rate||0);if(!rate)return 0;const taxable=(s.items||[]).reduce((a,i)=>{const p=products.find(x=>x.id===i.pid);return isTaxableProd(p)?a+(p?.price||0)*i.qty:a;},0);return parseFloat((taxable*rate/100).toFixed(2));})();
                const gt=parseFloat((s.total+saleTax).toFixed(2));
                const cardTotal=parseFloat((gt*(1+CARD_FEE/100)).toFixed(2));
                const methods=[{id:"cash",label:"💵 Cash",color:"#059669"},{id:"check",label:"🧾 Check",color:"#0369a1"},{id:"money_order",label:"📮 Money Order",color:"#7c3aed"},{id:"zelle",label:"⚡ Zelle",color:"#6366f1"},{id:"card",label:`💳 Card (+${CARD_FEE}%)`,color:"#dc2626"}];
                return(
                  <div style={{position:"fixed",inset:0,background:"#00000070",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
                    <div style={{background:"#fff",borderRadius:16,padding:20,maxWidth:420,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                        <div style={{fontWeight:700,fontSize:15}}>💰 Collect Payment — {s.id}</div>
                        <button onClick={()=>{setShowHistoryPayment(false);setCreatedSaleForHistory(null);}} style={{background:"#f3f4f6",border:"none",borderRadius:7,padding:"6px 12px",cursor:"pointer"}}>✕</button>
                      </div>
                      <div style={{background:"#f9fafb",borderRadius:8,padding:"10px 14px",marginBottom:14,display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontSize:13,color:"#6b7280"}}>Total Due</span>
                        <span style={{fontWeight:800,fontSize:18,color:"#0a1628"}}>${gt.toFixed(2)}</span>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
                        {methods.map(m=>(
                          <button key={m.id} onClick={()=>setPayForm(p=>({...p,method:m.id}))}
                            style={{padding:"11px 14px",borderRadius:9,border:`2px solid ${payForm.method===m.id?m.color:"#e5e7eb"}`,background:payForm.method===m.id?m.color+"15":"#fff",cursor:"pointer",display:"flex",justifyContent:"space-between",fontFamily:"'Inter',sans-serif"}}>
                            <span style={{fontWeight:600,fontSize:13,color:payForm.method===m.id?m.color:"#212121"}}>{m.label}</span>
                            {m.id==="card"&&<span style={{fontSize:11,color:"#9ca3af"}}>${cardTotal.toFixed(2)}</span>}
                          </button>
                        ))}
                      </div>
                      {payForm.method==="check"&&<input value={payForm.checkNum} onChange={e=>setPayForm(p=>({...p,checkNum:e.target.value}))} placeholder="Check number" style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px",fontSize:13,marginBottom:10,boxSizing:"border-box"}}/>}
                      {payForm.method==="zelle"&&<input value={payForm.zelleRef} onChange={e=>setPayForm(p=>({...p,zelleRef:e.target.value}))} placeholder="Zelle reference" style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px",fontSize:13,marginBottom:10,boxSizing:"border-box"}}/>}
                      {payForm.method==="money_order"&&<input value={payForm.checkNum} onChange={e=>setPayForm(p=>({...p,checkNum:e.target.value}))} placeholder="Money order number" style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px",fontSize:13,marginBottom:10,boxSizing:"border-box"}}/>}
                      <button onClick={async()=>{
                        await collectPayment(s,payForm.method);
                        setDriverData(prev=>({...prev,sales:prev.sales.map(x=>x.id===s.id?{...x,_paid:true}:x)}));
                        setShowHistoryPayment(false);
                        setCreatedSaleForHistory(null);
                      }} disabled={paymentSaving}
                        style={{width:"100%",padding:"13px",background:"#059669",color:"#fff",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                        {paymentSaving?"Saving...":"✅ Confirm Payment"}
                      </button>
                    </div>
                  </div>
                );
              })()}

            </div>
          )}
        </div>}
        {isWalkIn&&<div className="fu">
          {/* Header */}
          <div style={{marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#0a1628",marginBottom:2}}>🏪 Walk-in Sale</div>
              <div style={{fontSize:12,color:"#9ca3af"}}>Authorized users only</div>
            </div>
            <button onClick={()=>{setIsWalkIn(false);setWalkInVerified(false);setWalkInCust(null);setWalkInUser(null);setWalkInSearch("");setWalkInPhone("");setWalkInEmail("");setWalkInPw("");setWalkInError("");setWalkInMode("customer");setWiRegMsg(null);}}
              style={{background:"#f3f4f6",border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,color:"#6b7280",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>← Back</button>
          </div>

          {/* ── AUTH GATE ── */}
          {!walkInVerified&&walkInMode!=="register"&&(
            <div style={{maxWidth:460,margin:"0 auto"}}>
              <div className="card" style={{padding:28,borderTop:"4px solid #7c3aed"}}>
                {/* Mode toggle */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:22}}>
                  {[["customer","👤 Customer"],["staff","🔑 Staff / Driver"]].map(([m,l])=>(
                    <button key={m} onClick={()=>{setWalkInMode(m);setWalkInError("");}}
                      style={{padding:"9px 8px",borderRadius:8,border:`1.5px solid ${walkInMode===m?"#7c3aed":"#e5e7eb"}`,background:walkInMode===m?"#7c3aed":"#fff",color:walkInMode===m?"#fff":"#6b7280",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                      {l}
                    </button>
                  ))}
                </div>

                {walkInMode==="customer"?(
                  <>
                    <div style={{textAlign:"center",marginBottom:18}}>
                      <div style={{fontSize:36,marginBottom:6}}>💎</div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:"#0a1628",marginBottom:3}}>Customer Access</div>
                      <div style={{fontSize:12,color:"#6b7280"}}>Enter your registered business name and phone</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      <div className="field">
                        <label>Business / Shop Name *</label>
                        <input placeholder="e.g. Speedy Gas & Mart" value={walkInSearch}
                          onChange={e=>setWalkInSearch(e.target.value)}
                          onFocus={e=>e.target.style.borderColor="#7c3aed"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}
                          onKeyDown={e=>e.key==="Enter"&&verifyWalkIn()}/>
                      </div>
                      <div className="field">
                        <label>Phone Number *</label>
                        <input placeholder="e.g. (713) 555-0100" value={walkInPhone}
                          onChange={e=>setWalkInPhone(e.target.value)}
                          onFocus={e=>e.target.style.borderColor="#7c3aed"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}
                          onKeyDown={e=>e.key==="Enter"&&verifyWalkIn()}/>
                      </div>
                    </div>
                  </>
                ):(
                  <>
                    <div style={{textAlign:"center",marginBottom:18}}>
                      <div style={{fontSize:36,marginBottom:6}}>🔑</div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:"#0a1628",marginBottom:3}}>Staff / Driver / Admin</div>
                      <div style={{fontSize:12,color:"#6b7280"}}>Sign in with your VitalWaveOne account</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      <div className="field">
                        <label>Email *</label>
                        <input type="email" placeholder="you@vitalwaveone.com" value={walkInEmail}
                          onChange={e=>setWalkInEmail(e.target.value)}
                          onFocus={e=>e.target.style.borderColor="#7c3aed"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}
                          onKeyDown={e=>e.key==="Enter"&&verifyWalkIn()}/>
                      </div>
                      <div className="field">
                        <label>Password *</label>
                        <input type="password" placeholder="••••••••" value={walkInPw}
                          onChange={e=>setWalkInPw(e.target.value)}
                          onFocus={e=>e.target.style.borderColor="#7c3aed"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}
                          onKeyDown={e=>e.key==="Enter"&&verifyWalkIn()}/>
                      </div>
                    </div>
                  </>
                )}

                {walkInError&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#dc2626",marginTop:12}}>⚠️ {walkInError}</div>}

                <button onClick={verifyWalkIn} disabled={walkInLoading}
                  style={{width:"100%",padding:"13px",background:"#7c3aed",color:"#fff",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:walkInLoading?"not-allowed":"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:16,opacity:walkInLoading?0.7:1}}>
                  {walkInLoading?<><span className="sp">⟳</span> Verifying…</>:"Verify & Continue →"}
                </button>

                {/* Registration link for staff */}
                <div style={{marginTop:16,padding:"12px 14px",background:"#f5f3ff",borderRadius:8,border:"1px solid #ddd6fe"}}>
                  <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>
                    <strong style={{color:"#5b21b6"}}>New staff or receptionist?</strong>
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af",marginBottom:8}}>Request access — an admin will review and approve your account.</div>
                  <button onClick={()=>{setWalkInMode("register");setWalkInError("");}}
                    style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
                    Request Walk-in Access →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── REGISTRATION FORM ── */}
          {!walkInVerified&&walkInMode==="register"&&(
            <div style={{maxWidth:460,margin:"0 auto"}}>
              <div className="card" style={{padding:28,borderTop:"4px solid #7c3aed"}}>
                <div style={{textAlign:"center",marginBottom:20}}>
                  <div style={{fontSize:36,marginBottom:6}}>📝</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"#0a1628",marginBottom:3}}>Request Walk-in Access</div>
                  <div style={{fontSize:12,color:"#6b7280"}}>Requires admin approval before you can log in</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div className="field">
                    <label>Full Name *</label>
                    <input placeholder="e.g. Sarah Johnson" value={wiReg.name}
                      onChange={e=>setWiReg(r=>({...r,name:e.target.value}))}
                      onFocus={e=>e.target.style.borderColor="#7c3aed"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
                  </div>
                  <div className="field">
                    <label>Email Address *</label>
                    <input type="email" placeholder="you@email.com" value={wiReg.email}
                      onChange={e=>setWiReg(r=>({...r,email:e.target.value}))}
                      onFocus={e=>e.target.style.borderColor="#7c3aed"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
                  </div>
                  <div className="field">
                    <label>Phone Number *</label>
                    <input placeholder="(713) 555-0100" value={wiReg.phone}
                      onChange={e=>setWiReg(r=>({...r,phone:e.target.value}))}
                      onFocus={e=>e.target.style.borderColor="#7c3aed"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
                  </div>
                  <div className="field">
                    <label>Role</label>
                    <select value={wiReg.role} onChange={e=>setWiReg(r=>({...r,role:e.target.value}))}
                      style={{background:"#fff",border:"1.5px solid #e5e7eb",borderRadius:9,padding:"11px 14px",fontSize:14,color:"#111",width:"100%"}}>
                      <option value="staff">Receptionist / In-House Staff</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Note (optional)</label>
                    <input placeholder="e.g. Front desk receptionist" value={wiReg.note}
                      onChange={e=>setWiReg(r=>({...r,note:e.target.value}))}
                      onFocus={e=>e.target.style.borderColor="#7c3aed"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
                  </div>
                  {wiRegMsg&&<div style={{background:wiRegMsg.t==="success"?"#f0fdf4":"#fef2f2",border:`1px solid ${wiRegMsg.t==="success"?"#a7f3d0":"#fecaca"}`,borderRadius:8,padding:"10px 14px",fontSize:13,color:wiRegMsg.t==="success"?"#065f46":"#dc2626"}}>{wiRegMsg.m}</div>}
                  <button onClick={submitWiRegistration} disabled={wiRegSaving}
                    style={{width:"100%",padding:"13px",background:"#7c3aed",color:"#fff",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:wiRegSaving?"not-allowed":"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:wiRegSaving?0.7:1}}>
                    {wiRegSaving?<><span className="sp">⟳</span> Submitting…</>:"Submit Access Request"}
                  </button>
                  <button onClick={()=>setWalkInMode("customer")}
                    style={{width:"100%",padding:"10px",background:"none",border:"1.5px solid #e5e7eb",borderRadius:10,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif",color:"#6b7280"}}>
                    ← Back to Login
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── VERIFIED: show walk-in sale ── */}
          {walkInVerified&&(
            <>
              <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,padding:"10px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:18}}>✅</span>
                <div>
                  <div style={{fontSize:13,color:"#5b21b6",fontWeight:700}}>
                    {walkInUser ? walkInUser.displayName : walkInCust?.name} — verified
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af",textTransform:"capitalize"}}>
                    {walkInUser ? `${walkInUser.role} access` : "customer"}
                  </div>
                </div>
                <button onClick={()=>{setWalkInVerified(false);setWalkInCust(null);setWalkInUser(null);setWalkInSearch("");setWalkInPhone("");setWalkInEmail("");setWalkInPw("");}}
                  style={{marginLeft:"auto",fontSize:11,color:"#7c3aed",background:"none",border:"1px solid #ddd6fe",borderRadius:6,padding:"3px 10px",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Switch</button>
              </div>
              <DriverWalkInTab
                driverData={{customers, stateTaxes:portalStateTaxes, sales:[], co}}
                setDriverData={()=>{}}
                products={products.filter(p=>p.shelf>0)}
                supabase={supabase}
                initCust={walkInCust?.id||null}
              />
            </>
          )}
        </div>}

        {isExisting&&<div className="fu">
          <div style={{maxWidth:460,margin:"0 auto"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#0a1628",marginBottom:6,textAlign:"center"}}>Access Your Account</div>
            <div style={{fontSize:13,color:"#6b7280",textAlign:"center",marginBottom:24}}>Enter your shop name and phone number to continue</div>
            <div className="card" style={{padding:28}}>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div className="field">
                  <label>Business / Shop Name *</label>
                  <input
                    placeholder="e.g. Speedy Gas & Mart"
                    value={custSearch}
                    onChange={e=>setCustSearch(e.target.value)}
                    onFocus={e=>e.target.style.borderColor="#0a1628"}
                    onBlur={e=>e.target.style.borderColor="#d1d5db"}
                  />
                </div>
                <div className="field">
                  <label>Phone Number *</label>
                  <input
                    placeholder="e.g. (713) 555-0100"
                    value={custPhone}
                    onChange={e=>setCustPhone(e.target.value)}
                    onFocus={e=>e.target.style.borderColor="#0a1628"}
                    onBlur={e=>e.target.style.borderColor="#d1d5db"}
                    onKeyDown={e=>e.key==="Enter"&&verifyCustomer()}
                  />
                </div>
                {verifyError&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#dc2626"}}>
                  ⚠️ {verifyError}
                </div>}
                <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:"13px",marginTop:4}} onClick={verifyCustomer} disabled={submitting}>
                  {submitting?<><span className="sp">⟳</span> Verifying…</>:<>Access My Account →</>}
                </button>
                <div style={{textAlign:"center",fontSize:12,color:"#9ca3af"}}>
                  Not registered yet? <span style={{color:"#0a1628",fontWeight:600,cursor:"pointer"}} onClick={()=>{setIsExisting(false);setIsNew(true);}}>Register here →</span>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {/* ── NEW: registration form ── */}
        {isNew&&<div className="fu">
          <div style={{maxWidth:640,margin:"0 auto"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#0a1628",marginBottom:20,textAlign:"center"}}>Register Your Business</div>
            <div className="card" style={{padding:28}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}} className="grid2">
                <div className="field">
                  <label>Business Name *</label>
                  <input placeholder="Speedy Gas & Mart" value={reg.businessName} onChange={e=>setReg(r=>({...r,businessName:e.target.value}))} className={regErrors.businessName?"error":""}/>
                  {regErrors.businessName&&<span style={{fontSize:11,color:"#ef4444"}}>{regErrors.businessName}</span>}
                </div>
                <div className="field">
                  <label>Owner Full Name *</label>
                  <input placeholder="John Smith" value={reg.ownerName} onChange={e=>setReg(r=>({...r,ownerName:e.target.value}))} className={regErrors.ownerName?"error":""}/>
                  {regErrors.ownerName&&<span style={{fontSize:11,color:"#ef4444"}}>{regErrors.ownerName}</span>}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}} className="grid2">
                <div className="field">
                  <label>Email Address *</label>
                  <input type="email" placeholder="owner@gasstation.com" value={reg.email} onChange={e=>setReg(r=>({...r,email:e.target.value}))} className={regErrors.email?"error":""}/>
                  {regErrors.email&&<span style={{fontSize:11,color:"#ef4444"}}>{regErrors.email}</span>}
                </div>
                <div className="field">
                  <label>Phone Number *</label>
                  <input placeholder="(713) 555-0100" value={reg.phone} onChange={e=>setReg(r=>({...r,phone:e.target.value}))} className={regErrors.phone?"error":""}/>
                  {regErrors.phone&&<span style={{fontSize:11,color:"#ef4444"}}>{regErrors.phone}</span>}
                </div>
              </div>
              <div style={{height:1,background:"#f3f4f6",margin:"4px 0 14px"}}/>
              <div style={{fontSize:11,fontWeight:600,color:"#9ca3af",letterSpacing:".08em",marginBottom:12}}>BUSINESS ADDRESS</div>
              <div className="field" style={{marginBottom:14}}>
                <label>Street Address *</label>
                <input placeholder="1420 N Main St" value={reg.address} onChange={e=>setReg(r=>({...r,address:e.target.value}))} className={regErrors.address?"error":""}/>
                {regErrors.address&&<span style={{fontSize:11,color:"#ef4444"}}>{regErrors.address}</span>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 80px 100px",gap:14,marginBottom:24}} className="grid2">
                <div className="field">
                  <label>City *</label>
                  <input placeholder="Houston" value={reg.city} onChange={e=>setReg(r=>({...r,city:e.target.value}))} className={regErrors.city?"error":""}/>
                  {regErrors.city&&<span style={{fontSize:11,color:"#ef4444"}}>{regErrors.city}</span>}
                </div>
                <div className="field">
                  <label>State</label>
                  <select value={reg.state} onChange={e=>setReg(r=>({...r,state:e.target.value}))}>
                    {["TX","CA","FL","NY","IL","OH","GA","NC","MI","NJ"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>ZIP Code</label>
                  <input placeholder="77001" value={reg.zip} onChange={e=>setReg(r=>({...r,zip:e.target.value}))}/>
                </div>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end",flexDirection:"column"}}>
                {portalError&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#dc2626"}}>{portalError}</div>}
                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                  <button className="btn-ghost" style={{padding:"10px 20px",fontSize:13}} onClick={()=>{setPortalError("");setIsNew(false);}}>← Back</button>
                  <button className="btn-amber" onClick={()=>{setPortalError("");handleRegister();}} disabled={submitting}>
                    {submitting?<><span className="sp">⟳</span> Registering…</>:<>Register & Continue →</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>}
      </div>}

      {/* ══ ORDER FORM ══ */}
      {step==="order"&&<div className="fu">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <div>
            <button onClick={()=>{setStep("home");setQuantities({});}} style={{background:"#f5f5f5",border:"1px solid #e5e7eb",borderRadius:8,padding:"8px 16px",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,marginBottom:10,fontFamily:"'Inter',sans-serif"}}>← Back to Store Selection</button>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:"#0a1628"}}>Product Catalog</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{products.length} products available · select quantities</div>
          </div>
          {orderItems.length>0&&(
            <div style={{background:"#0a1628",borderRadius:12,padding:"14px 20px",minWidth:210}}>
              <div style={{fontSize:10,color:"#4b6080",letterSpacing:".08em",marginBottom:5}}>ORDER TOTAL</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:"#f59e0b"}}>{fmt(total)}</div>
              <div style={{fontSize:11,color:"#4b6080",marginBottom:12}}>{orderItems.length} item{orderItems.length!==1?"s":""} · incl. tobacco tax</div>
              <button className="btn-amber" style={{width:"100%",justifyContent:"center",padding:"10px"}} onClick={()=>setStep("review")}>Review Order →</button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          <input placeholder="🔍  Search product, SKU..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{padding:"9px 14px",border:"1.5px solid #e5e7eb",borderRadius:9,fontSize:13,background:"#fff",width:220,transition:"border .15s"}}
            onFocus={e=>e.target.style.borderColor="#0a1628"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCatFilter(c)}
                style={{padding:"7px 14px",borderRadius:20,border:"1.5px solid",borderColor:catFilter===c?catC(c):"#e5e7eb",background:catFilter===c?catC(c)+"18":"#fff",color:catFilter===c?catC(c):"#6b7280",fontSize:11,fontWeight:catFilter===c?700:400,cursor:"pointer",transition:"all .15s"}}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <div className="card" style={{overflow:"hidden"}}>
          {/* Header */}
          <div style={{display:"grid",gridTemplateColumns:"70px 90px 1fr 90px 110px 80px 90px 130px",background:"#0a1628",padding:"11px 18px",gap:8}} className="prod-grid">
            {["Stock #","SKU","Description","Type","Unit","Price","Available","Order Qty"].map(h=>(
              <div key={h} style={{fontSize:9,fontWeight:700,color:"#4b6080",letterSpacing:".1em",textTransform:"uppercase",textAlign:["Price","In Stock","Order Qty"].includes(h)?"center":"left"}} className={["Stock #","SKU","Type","Unit"].includes(h)?"hide-sm":""}>{h}</div>
            ))}
          </div>

          {filtered.length===0
            ?<div style={{padding:40,textAlign:"center",color:"#9ca3af"}}><div style={{fontSize:28,marginBottom:8}}>📦</div><div style={{fontSize:13}}>No products match</div></div>
            :filtered.map((p,i)=>{
              const qty=parseInt(quantities[p.id])||0, sel=qty>0;
              const atMax = qty>=p.totalStock;
              const isLow = p.totalStock>0 && p.totalStock<10;
              return (
                <div key={p.id} className="prod-row" style={{display:"grid",gridTemplateColumns:"70px 90px 1fr 90px 110px 80px 90px 130px",padding:"13px 18px",gap:8,background:sel?"#fffbeb":"transparent",alignItems:"center"}}>
                  <div style={{fontSize:10,color:"#9ca3af",fontFamily:"monospace"}} className="hide-sm">{p.id}</div>
                  <div style={{fontSize:10,fontFamily:"monospace",fontWeight:600,color:"#374151"}} className="hide-sm">{p.sku}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,color:"#111"}}>{p.name}</div>
                    {sel&&<div style={{fontSize:11,color:"#f59e0b",marginTop:2}}>✓ {qty} × {fmt(getEffectivePrice(selCust,p))} = <strong>{fmt(qty*getEffectivePrice(selCust,p))}</strong></div>}
                  </div>
                  <div className="hide-sm"><span className="cat-tag" style={{background:catC(p.cat)+"18",color:catC(p.cat)}}>{p.cat}</span></div>
                  <div style={{fontSize:11,color:"#6b7280"}} className="hide-sm">{p.unit}</div>
                  <div style={{textAlign:"center",fontWeight:700,fontSize:14,color:"#0a1628"}}>{(()=>{const ep=getEffectivePrice(selCust,p);return ep!==p.price?<><span style={{color:"#7c3aed"}}>{fmt(ep)}</span><div style={{fontSize:9,textDecoration:"line-through",color:"#9ca3af",fontWeight:400}}>{fmt(p.price)}</div></>:<span>{fmt(p.price)}</span>;})()}</div>
                  <div style={{textAlign:"center"}}>
                    <span style={{fontWeight:700,fontSize:13,color:isLow?"#ef4444":p.totalStock<20?"#f59e0b":"#10b981"}}>{p.totalStock}</span>
                    {p.onTruck>0&&<div style={{fontSize:9,color:"#6b7280"}}>🏭{p.shelf}+🚚{p.onTruck}</div>}
                    {isLow&&<div style={{fontSize:9,color:"#ef4444",fontWeight:700}}>LOW STOCK</div>}
                    {atMax&&qty>0&&<div style={{fontSize:9,color:"#f59e0b",fontWeight:700}}>MAX</div>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}>
                    <button className="qty-btn" onClick={()=>setQty(p.id,qty-1,p.totalStock)}>−</button>
                    <input type="number" min="0" max={p.totalStock} value={quantities[p.id]||""} placeholder="0"
                      onChange={e=>setQty(p.id,e.target.value,p.totalStock)}
                      style={{width:44,textAlign:"center",border:"1.5px solid",borderColor:sel?"#f59e0b":"#e5e7eb",borderRadius:7,padding:"5px 4px",fontSize:14,fontWeight:700,color:"#111",background:sel?"#fffbeb":"#fff"}}/>
                    <button className="qty-btn"
                      disabled={atMax}
                      style={{background:qty>0&&!atMax?"#0a1628":"#fff",color:qty>0&&!atMax?"#fff":"#374151",borderColor:qty>0&&!atMax?"#0a1628":"#e5e7eb",cursor:atMax?"not-allowed":"pointer",opacity:atMax?0.4:1}}
                      onClick={()=>!atMax&&setQty(p.id,qty+1,p.totalStock)}>+</button>
                  </div>
                </div>
              );
            })}
        </div>

        {orderItems.length>0&&<div style={{marginTop:14}}>
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <label style={{fontSize:11,fontWeight:600,color:"#9ca3af",letterSpacing:".08em",display:"block",marginBottom:7}}>SPECIAL INSTRUCTIONS / NOTES (OPTIONAL)</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Delivery time preference, special requests, preferred items..."
              style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 13px",fontSize:13,resize:"vertical",minHeight:64,fontFamily:"'Inter',sans-serif",color:"#111",transition:"border .15s"}}
              onFocus={e=>e.target.style.borderColor="#0a1628"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
          </div>
          <div style={{background:"#0a1628",borderRadius:12,padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",gap:22,flexWrap:"wrap"}}>
              {[{l:"Products",v:orderItems.length},{l:"Subtotal",v:fmt(subtotal)},{l:`Tax · Tobacco only`,v:fmt(tax)},{l:"TOTAL",v:fmt(total),big:true}].map(k=>(
                <div key={k.l}><div style={{fontSize:9,color:"#4b6080",letterSpacing:".08em"}}>{k.l}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:k.big?24:16,color:k.big?"#f59e0b":"#fff"}}>{k.v}</div></div>
              ))}
            </div>
            <button className="btn-amber" onClick={()=>setStep("review")}>Review Order →</button>
          </div>
        </div>}
      </div>}

      {/* ══ REVIEW ══ */}
      {step==="review"&&<div className="fu">
        <button onClick={()=>setStep("order")} style={{background:"#f5f5f5",border:"1px solid #e5e7eb",borderRadius:8,padding:"8px 16px",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,marginBottom:18,fontFamily:"'Inter',sans-serif"}}>← Back to Catalog</button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16,alignItems:"start"}} className="grid2">
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:"#0a1628",marginBottom:16}}>Review Your Order</div>

            {/* Customer Info */}
            <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:".1em",marginBottom:10}}>ORDERING FOR</div>
              <div style={{fontWeight:700,fontSize:15,color:"#111"}}>{selCust?.name}</div>
              {(()=>{const vn=(selCust?.notes||"").replace(/CUSTOM_PRICES:[^}]*}/g,"").trim();return vn?<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{vn}</div>:null;})()}
              {selCust?.address&&<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>📍 {selCust.address}</div>}
              {selCust?.phone&&<div style={{fontSize:12,color:"#6b7280"}}>📞 {selCust.phone}</div>}
              {selCust?.email&&<div style={{fontSize:12,color:"#6b7280"}}>✉️ {selCust.email}</div>}
            </div>

            {/* Items */}
            <div className="card" style={{overflow:"hidden"}}>
              <div style={{padding:"12px 18px",borderBottom:"1px solid #f3f4f6",fontWeight:700,fontSize:13,color:"#111"}}>
                {orderItems.length} Product{orderItems.length!==1?"s":""} Ordered
              </div>
              {orderItems.map((item,i)=>{
                const p=products.find(x=>x.id===item.pid);
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 18px",borderBottom:"1px solid #f9fafb"}}>
                    <div style={{width:36,height:36,borderRadius:8,background:catC(p?.cat)+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>📦</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13,color:"#111"}}>{p?.name}</div>
                      <div style={{fontSize:10,color:"#9ca3af",marginTop:2,display:"flex",gap:10,flexWrap:"wrap"}}>
                        <span>Stock: {p?.id}</span><span>SKU: {p?.sku}</span><span>{p?.unit}</span>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontWeight:700,fontSize:13}}>{item.qty} × {fmt(p?.price||0)}</div>
                      <div style={{color:"#f59e0b",fontWeight:700,fontSize:15}}>{fmt(item.qty*(p?.price||0))}</div>
                    </div>
                  </div>
                );
              })}
              {notes&&<div style={{padding:"11px 18px",background:"#fffbeb",fontSize:12,color:"#92400e"}}><strong>Note:</strong> {notes}</div>}
            </div>
          </div>

          {/* Summary + Payment */}
          <div style={{position:"sticky",top:76}}>
            <div style={{background:"#0a1628",borderRadius:14,padding:"22px",color:"#fff"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:14}}>Order Summary</div>
              {/* Previous balance warning */}
              {custPrevBalance>0&&<div style={{background:"#dc2626",borderRadius:8,padding:"10px 12px",marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:12,color:"#fff",marginBottom:4}}>⚠️ Outstanding Balance</div>
                {custPrevInvs.slice(0,3).map(s=>(
                  <div key={s.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#fecaca",marginBottom:2}}>
                    <span>{s.id} · {s.date}</span><span>${s.total.toFixed(2)}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:800,color:"#fff",borderTop:"1px solid #ef4444",marginTop:4,paddingTop:4}}>
                  <span>Previous Balance</span><span>{fmt(custPrevBalance)}</span>
                </div>
              </div>}
              {[{l:"Subtotal",v:fmt(subtotal)},{l:`Tax · Tobacco only`,v:fmt(tax)},{l:"New Order Total",v:fmt(total)},...(custPrevBalance>0?[{l:"⚠️ Previous Balance",v:fmt(custPrevBalance)}]:[])].map(k=>(
                <div key={k.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #ffffff10"}}>
                  <span style={{fontSize:12,color:k.l.includes("Balance")?"#fca5a5":"#4b6080"}}>{k.l}</span>
                  <span style={{fontSize:12,color:k.l.includes("Balance")?"#fca5a5":"#9ca3af"}}>{k.v}</span>
                </div>
              ))}
              {payMethod==="card"&&<div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #ffffff10"}}>
                <span style={{fontSize:12,color:"#a78bfa"}}>Card surcharge ({CARD_FEE}%)</span>
                <span style={{fontSize:12,color:"#a78bfa"}}>+{fmt(cardSurcharge)}</span>
              </div>}
              <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0",borderTop:"1px solid #ffffff20",marginTop:3}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:17}}>Total Due</span>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"#f59e0b"}}>{fmt(grandTotal+custPrevBalance)}</span>
              </div>

              {/* Payment method selector */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:"#4b6080",letterSpacing:".08em",marginBottom:10}}>HOW WOULD YOU LIKE TO PAY?</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {/* Pay on delivery */}
                  <div onClick={()=>{setPayMethod("delivery");setClientSecret(null);setStripeReady(false);setStripeError(null);}}
                    style={{padding:"12px 14px",borderRadius:9,border:`2px solid ${payMethod==="delivery"?"#f59e0b":"#1e3050"}`,background:payMethod==="delivery"?"#f59e0b14":"transparent",cursor:"pointer",transition:"all .15s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${payMethod==="delivery"?"#f59e0b":"#4b6080"}`,background:payMethod==="delivery"?"#f59e0b":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {payMethod==="delivery"&&<div style={{width:8,height:8,borderRadius:"50%",background:"#0a1628"}}/>}
                      </div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:payMethod==="delivery"?"#f59e0b":"#fff"}}>💵 Pay on Delivery</div>
                        <div style={{fontSize:11,color:"#4b6080",marginTop:1}}>Cash · Check · Money Order · Zelle — No fee</div>
                      </div>
                    </div>
                  </div>
                  {/* Pay by card */}
                  <div onClick={()=>{setPayMethod("card");loadStripeIntent();}}
                    style={{padding:"12px 14px",borderRadius:9,border:`2px solid ${payMethod==="card"?"#a78bfa":"#1e3050"}`,background:payMethod==="card"?"#a78bfa14":"transparent",cursor:"pointer",transition:"all .15s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${payMethod==="card"?"#a78bfa":"#4b6080"}`,background:payMethod==="card"?"#a78bfa":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {payMethod==="card"&&<div style={{width:8,height:8,borderRadius:"50%",background:"#0a1628"}}/>}
                      </div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:payMethod==="card"?"#a78bfa":"#fff"}}>💳 Pay by Card Now</div>
                        <div style={{fontSize:11,color:"#4b6080",marginTop:1}}>Credit or Debit · {CARD_FEE}% surcharge applies</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stripe card form */}
              {payMethod==="card"&&<div style={{marginBottom:14}}>
                {!stripeReady&&!stripeError&&<div style={{textAlign:"center",padding:"16px",color:"#4b6080",fontSize:12}}>
                  <span style={{display:"inline-block",animation:"spin .8s linear infinite"}}>⟳</span> Loading secure payment form…
                </div>}
                {stripeError&&<div style={{background:"#1a0a0a",border:"1px solid #4a1010",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#f87171",marginBottom:10}}>
                  ⚠️ {stripeError}
                </div>}
                {stripeReady&&clientSecret&&<div>
                  <div id="stripe-payment-element" style={{marginBottom:12}}></div>
                  <div style={{fontSize:10,color:"#374151",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    🔒 Secured by Stripe · PCI compliant
                  </div>
                </div>}
              </div>}

              {stripeError&&payMethod==="card"&&<button onClick={loadStripeIntent} style={{width:"100%",background:"transparent",border:"1px solid #4b6080",borderRadius:8,padding:"8px",fontSize:11,color:"#4b6080",cursor:"pointer",marginBottom:10,fontFamily:"'Inter',sans-serif"}}>↻ Retry</button>}

              {portalError&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:9,padding:"12px 16px",fontSize:13,color:"#dc2626",marginBottom:12,fontWeight:500}}>{portalError}</div>}
              <button className="btn-amber" style={{width:"100%",justifyContent:"center",padding:"13px",opacity:(payMethod==="card"&&!stripeReady)?0.5:1}} onClick={()=>{setPortalError("");handleSubmit();}} disabled={submitting||(payMethod==="card"&&!stripeReady)}>
                {submitting?<><span className="sp">⟳</span>Processing…</>:payMethod==="card"?`💳 Pay ${fmt(grandTotal)} Now`:`✓ Submit Order — Pay on Delivery`}
              </button>
              <div style={{fontSize:10,color:"#374151",textAlign:"center",marginTop:8,lineHeight:1.6}}>
                {payMethod==="delivery"?"Driver will collect payment upon delivery":"Your card will be charged immediately"}
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* ══ CONFIRMED ══ */}
      {step==="confirm"&&order&&<div className="fu">
        <div className="no-print" style={{background:order.paidOnline?"#ede9fe":"#d1fae5",border:`1px solid ${order.paidOnline?"#c4b5fd":"#a7f3d0"}`,borderRadius:12,padding:"18px 22px",marginBottom:22,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <div style={{width:46,height:46,background:order.paidOnline?"#7c3aed":"#10b981",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>✓</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:order.paidOnline?"#4c1d95":"#065f46"}}>
              {order.paidOnline?"Order Placed & Payment Confirmed!":"Order Submitted Successfully!"}
            </div>
            <div style={{fontSize:12,color:order.paidOnline?"#6d28d9":"#047857",marginTop:3}}>
              Order <strong>{order.id}</strong> — {order.paidOnline?`💳 $${grandTotal.toFixed(2)} charged to your card`:"💵 Driver will collect payment on delivery"}
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <button onClick={()=>window.print()} style={{background:"#fff",border:`1.5px solid ${order.paidOnline?"#7c3aed":"#10b981"}`,borderRadius:8,padding:"9px 16px",fontSize:12,fontWeight:700,cursor:"pointer",color:order.paidOnline?"#4c1d95":"#065f46",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:6}}>🖨️ Print / Save PDF</button>
            <button onClick={resetAll} style={{background:order.paidOnline?"#7c3aed":"#10b981",border:"none",borderRadius:8,padding:"9px 16px",fontSize:12,fontWeight:700,cursor:"pointer",color:"#fff",fontFamily:"'Inter',sans-serif"}}>New Order</button>
          </div>
        </div>
        <Invoice order={order} products={products} co={co}/>
      </div>}

      </div>
    </div>
  );
}

/*
════════════════════════════════════════════════════════
SETUP
════════════════════════════════════════════════════════

1. Run this SQL in Supabase if orders table doesn't exist:

create table if not exists orders (
  id text primary key,
  cust_id text references customers(id),
  customer_name text,
  customer_address text default '',
  customer_phone text default '',
  date text not null,
  items jsonb default '[]',
  subtotal numeric default 0,
  tax numeric default 0,
  total numeric default 0,
  notes text default '',
  status text default 'pending',
  approved_at timestamptz default null,
  created_at timestamptz default now()
);
alter table orders enable row level security;
create policy "allow all" on orders for all using (true) with check (true);

2. Replace src/main.jsx with:

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import OrderPortal from './OrderPortal.jsx'

const isOrder = window.location.pathname.startsWith('/order')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isOrder ? <OrderPortal /> : <App />}
  </React.StrictMode>
)

3. Share with customers:
   https://your-vercel-url.vercel.app/order

════════════════════════════════════════════════════════
*/
