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

// ── PROFORMA INVOICE ──────────────────────────────────────────────────────────
const Invoice = ({order, products, co}) => {
  const tax = parseFloat(co?.tax_rate||8.25);
  const sub = order.items.reduce((a,i)=>a+(products.find(p=>p.id===i.pid)?.price||0)*i.qty, 0);
  const taxAmt = sub*(tax/100);
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
                  <td style={{padding:"10px 10px",textAlign:"right",fontSize:12,color:"#6b7280"}}>{fmt(p?.price||0)}</td>
                  <td style={{padding:"10px 10px",textAlign:"right",fontWeight:700,fontSize:14}}>{fmt(item.qty*(p?.price||0))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}>
          <div style={{width:280}}>
            {[["Subtotal",fmt(sub)],[`Tax (${tax}%)`,fmt(taxAmt)]].map(([l,v])=>(
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
export default function OrderPortal() {
  const [products,  setProducts]  = useState([]);
  const [customers, setCustomers] = useState([]);
  const [co,        setCo]        = useState(null);
  const [loading,   setLoading]   = useState(true);

  // Flow: "home" | "register" | "order" | "review" | "confirm"
  const [step,      setStep]      = useState("home");
  const [isNew,     setIsNew]     = useState(false);
  const [payMethod, setPayMethod] = useState("delivery"); // "delivery" | "card"
  const [stripeReady, setStripeReady] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [stripeError, setStripeError] = useState(null);
  const [stripeInst, setStripeInst] = useState(null);

  // Customer state
  const [selCust,   setSelCust]   = useState(null);
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
  const [order,      setOrder]      = useState(null);

  // Load data
  useEffect(()=>{
    (async()=>{
      const [pr, cu, co, ld, sa, rt] = await Promise.all([
        supabase.from("products").select("*").order("cat").order("name"),
        supabase.from("customers").select("*").order("name"),
        supabase.from("company").select("*").single(),
        supabase.from("loads").select("*").eq("status","out"),
        supabase.from("sales").select("*"),
        supabase.from("returns").select("*"),
      ]);
      if(cu.data) setCustomers(cu.data);
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
    })();
  },[]);

  const cats = useMemo(()=>["All",...new Set(products.map(p=>p.cat))],[products]);
  const taxRate = parseFloat(co?.tax_rate||8.25);
  const CARD_FEE = 3;

  const filtered = useMemo(()=>products.filter(p=>{
    if(catFilter!=="All"&&p.cat!==catFilter) return false;
    if(search&&!p.name.toLowerCase().includes(search.toLowerCase())&&!p.sku?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }),[products,catFilter,search]);

  const orderItems = useMemo(()=>
    Object.entries(quantities).filter(([,q])=>q>0).map(([pid,qty])=>({pid,qty:parseInt(qty),name:products.find(p=>p.id===pid)?.name||""}))
  ,[quantities,products]);

  const subtotal = useMemo(()=>orderItems.reduce((a,i)=>a+(products.find(p=>p.id===i.pid)?.price||0)*i.qty,0),[orderItems,products]);
  const tax = subtotal*(taxRate/100);
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
      alert("Registration error: "+e.message);
    }
    setSubmitting(false);
  };

  // ── SUBMIT ORDER ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if(!orderItems.length) return;
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
        date: nowStr(),
        items: orderItems,
        subtotal,
        tax,
        total: grandTotal,
        notes: notes+(payMethod==="card"?` | Paid by card online (incl. ${CARD_FEE}% surcharge $${cardSurcharge.toFixed(2)})`:" | Payment on delivery"),
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
      alert("Order error: "+e.message);
    }
    setSubmitting(false);
  };

  const resetAll = () => {
    setStep("home"); setIsNew(false); setSelCust(null); setCustSearch(""); setCustPhone(""); setVerifyError(""); setQuantities({}); setNotes(""); setOrder(null);
    setPayMethod("delivery"); setClientSecret(null); setStripeError(null); setStripeReady(false);
    setReg({businessName:"",ownerName:"",email:"",phone:"",address:"",city:"",state:"TX",zip:""});
  };

  // Verify customer by shop name + phone
  const verifyCustomer = () => {
    setVerifyError("");
    if(!custSearch.trim()) return setVerifyError("Please enter your business name");
    if(!custPhone.trim()) return setVerifyError("Please enter your phone number");

    // Normalize phone — strip spaces, dashes, brackets for comparison
    const normalize = p => p.replace(/[\s\-\(\)\+\.]/g,"");
    const inputPhone = normalize(custPhone);
    const inputName = custSearch.trim().toLowerCase();

    // Find matching customer
    const match = customers.find(c => {
      const nameMatch = c.name.toLowerCase().includes(inputName) || inputName.includes(c.name.toLowerCase());
      const phoneMatch = normalize(c.phone||"") === inputPhone || normalize(c.phone||"").endsWith(inputPhone) || inputPhone.endsWith(normalize(c.phone||"").slice(-7));
      return nameMatch && phoneMatch;
    });

    if(!match){
      setVerifyError("No account found with that name and phone number. Please check your details or register below.");
      return;
    }

    setSelCust(match);
    setStep("order");
  };

  // Load Stripe when card selected
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

        {/* Step indicators */}
        <div style={{display:"flex",alignItems:"center",gap:6}}>
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
        </div>

        {selCust&&step!=="home"&&<div style={{fontSize:11,color:"#4b6080"}}>⛽ <span style={{color:"#fff",fontWeight:600}}>{selCust.name}</span></div>}
        {step!=="home"&&step!=="confirm"&&(
          <button onClick={()=>{
            if(step==="order") {setStep("home");setQuantities({});}
            else if(step==="review") setStep("order");
          }} style={{background:"#1e3050",border:"1px solid #2e4060",borderRadius:8,padding:"7px 14px",color:"#b0c8e0",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'Inter',sans-serif"}}>
            ← Back
          </button>
        )}
      </div>

      <div style={{maxWidth:1060,margin:"0 auto",padding:"28px 16px"}}>

      {/* ══ HOME — New or Existing ══ */}
      {step==="home"&&<div className="fu">
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:42,color:"#0a1628",lineHeight:1.15,marginBottom:10}}>
            Welcome to VitalWaveOne
          </div>
          <div style={{fontSize:15,color:"#6b7280",maxWidth:480,margin:"0 auto"}}>
            Place your wholesale order securely and privately
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:680,margin:"0 auto 40px"}} className="grid2">
          {/* Existing Customer */}
          <div className="card" style={{padding:28,cursor:"pointer",transition:"all .2s",border:"2px solid #e5e7eb"}}
            onClick={()=>setIsNew(false)}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#0a1628";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 30px #0a162820";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
            <div style={{fontSize:36,marginBottom:12}}>⛽</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#0a1628",marginBottom:8}}>Existing Customer</div>
            <div style={{fontSize:13,color:"#6b7280",lineHeight:1.6}}>I already have an account. Find my store and place an order.</div>
            <div style={{marginTop:16,color:"#0a1628",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>Select my store →</div>
          </div>

          {/* New Customer */}
          <div className="card" style={{padding:28,cursor:"pointer",transition:"all .2s",border:"2px solid #e5e7eb",background:"linear-gradient(135deg,#fff,#fffbf0)"}}
            onClick={()=>setIsNew(true)}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#f59e0b";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 30px #f59e0b20";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
            <div style={{fontSize:36,marginBottom:12}}>🆕</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#0a1628",marginBottom:8}}>New Customer</div>
            <div style={{fontSize:13,color:"#6b7280",lineHeight:1.6}}>First time ordering with VitalWaveOne. Register your business.</div>
            <div style={{marginTop:16,color:"#f59e0b",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>Register & Order →</div>
          </div>
        </div>

        {/* ── EXISTING: private verification ── */}
        {!isNew&&<div className="fu">
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
                  Not registered yet? <span style={{color:"#0a1628",fontWeight:600,cursor:"pointer"}} onClick={()=>setIsNew(true)}>Register here →</span>
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
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn-ghost" style={{padding:"10px 20px",fontSize:13}} onClick={()=>setIsNew(false)}>← Back</button>
                <button className="btn-amber" onClick={handleRegister} disabled={submitting}>
                  {submitting?<><span className="sp">⟳</span> Registering…</>:<>Register & Continue →</>}
                </button>
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
              <div style={{fontSize:11,color:"#4b6080",marginBottom:12}}>{orderItems.length} item{orderItems.length!==1?"s":""} · incl. {taxRate}% tax</div>
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
              return (
                <div key={p.id} className="prod-row" style={{display:"grid",gridTemplateColumns:"70px 90px 1fr 90px 110px 80px 90px 130px",padding:"13px 18px",gap:8,background:sel?"#fffbeb":"transparent",alignItems:"center"}}>
                  <div style={{fontSize:10,color:"#9ca3af",fontFamily:"monospace"}} className="hide-sm">{p.id}</div>
                  <div style={{fontSize:10,fontFamily:"monospace",fontWeight:600,color:"#374151"}} className="hide-sm">{p.sku}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,color:"#111"}}>{p.name}</div>
                    {sel&&<div style={{fontSize:11,color:"#f59e0b",marginTop:2}}>✓ {qty} × {fmt(p.price)} = <strong>{fmt(qty*p.price)}</strong></div>}
                  </div>
                  <div className="hide-sm"><span className="cat-tag" style={{background:catC(p.cat)+"18",color:catC(p.cat)}}>{p.cat}</span></div>
                  <div style={{fontSize:11,color:"#6b7280"}} className="hide-sm">{p.unit}</div>
                  <div style={{textAlign:"center",fontWeight:700,fontSize:14,color:"#0a1628"}}>{fmt(p.price)}</div>
                  <div style={{textAlign:"center"}}>
                    <span style={{fontWeight:700,fontSize:13,color:p.totalStock<10?"#ef4444":p.totalStock<20?"#f59e0b":"#10b981"}}>{p.totalStock}</span>
                    {p.onTruck>0&&<div style={{fontSize:9,color:"#6b7280"}}>🏭{p.shelf}+🚚{p.onTruck}</div>}
                    {p.totalStock<10&&<div style={{fontSize:9,color:"#ef4444",fontWeight:700}}>LOW</div>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}>
                    <button className="qty-btn" onClick={()=>setQty(p.id,qty-1,p.totalStock)}>−</button>
                    <input type="number" min="0" max={p.totalStock} value={quantities[p.id]||""} placeholder="0"
                      onChange={e=>setQty(p.id,e.target.value,p.totalStock)}
                      style={{width:44,textAlign:"center",border:"1.5px solid",borderColor:sel?"#f59e0b":"#e5e7eb",borderRadius:7,padding:"5px 4px",fontSize:14,fontWeight:700,color:"#111",background:sel?"#fffbeb":"#fff"}}/>
                    <button className="qty-btn" style={{background:qty>0?"#0a1628":"#fff",color:qty>0?"#fff":"#374151",borderColor:qty>0?"#0a1628":"#e5e7eb"}} onClick={()=>setQty(p.id,qty+1,p.totalStock)}>+</button>
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
              {[{l:"Products",v:orderItems.length},{l:"Subtotal",v:fmt(subtotal)},{l:`Tax ${taxRate}%`,v:fmt(tax)},{l:"TOTAL",v:fmt(total),big:true}].map(k=>(
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
              {selCust?.notes&&<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{selCust.notes}</div>}
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
              {[{l:"Subtotal",v:fmt(subtotal)},{l:`Tax (${taxRate}%)`,v:fmt(tax)},{l:"Order Total",v:fmt(total)}].map(k=>(
                <div key={k.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #ffffff10"}}>
                  <span style={{fontSize:12,color:"#4b6080"}}>{k.l}</span>
                  <span style={{fontSize:12,color:"#9ca3af"}}>{k.v}</span>
                </div>
              ))}
              {payMethod==="card"&&<div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #ffffff10"}}>
                <span style={{fontSize:12,color:"#a78bfa"}}>Card surcharge ({CARD_FEE}%)</span>
                <span style={{fontSize:12,color:"#a78bfa"}}>+{fmt(cardSurcharge)}</span>
              </div>}
              <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0",borderTop:"1px solid #ffffff20",marginTop:3}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:17}}>Total Due</span>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"#f59e0b"}}>{fmt(grandTotal)}</span>
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

              <button className="btn-amber" style={{width:"100%",justifyContent:"center",padding:"13px",opacity:(payMethod==="card"&&!stripeReady)?0.5:1}} onClick={handleSubmit} disabled={submitting||(payMethod==="card"&&!stripeReady)}>
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
