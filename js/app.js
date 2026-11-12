(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const STORE = "orderflow_demo_orders_v2";
  const THEME = "orderflow_theme";
  const money = n => "Rs" + Number(n || 0).toLocaleString("en-PK");
  const today = () => new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
  const escapeHTML = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const seed = [
    {id:"OF-2048",name:"Ali Murtaza",phone:"0300 1234567",whatsapp:"",address:"G-11, Islamabad",amount:12500,received:5000,method:"Partial Payment",description:"Office supplies",category:"General merchandise",status:"Pending",dispatch:"Not ready",tracking:"",date:"19 Oct 2026",employee:"Saad Hussain",note:"Awaiting payment review"},
    {id:"OF-2047",name:"Sana Khalid",phone:"0312 7654321",whatsapp:"",address:"G-11, Islamabad",amount:8900,received:8900,method:"Full Payment",description:"Fashion accessories",category:"Fashion & apparel",status:"Approved",dispatch:"Dispatched",tracking:"TRK-PK-728491",date:"18 Oct 2026",employee:"Saad Hussain",note:"Ready for dispatch"},
    {id:"OF-2046",name:"Hamza Raza",phone:"0333 2468101",whatsapp:"",address:"Rawalpindi",amount:5400,received:0,method:"COD",description:"Household items",category:"Home & living",status:"Rejected",dispatch:"Not ready",tracking:"",date:"17 Oct 2026",employee:"Saad Hussain",note:"Incomplete customer details"},
    {id:"OF-2045",name:"Ayesha Noor",phone:"0301 2345678",whatsapp:"",address:"Satellite Town, Rawalpindi",amount:18200,received:18200,method:"Full Payment",description:"Shoes and apparel",category:"Fashion & apparel",status:"Approved",dispatch:"Ready",tracking:"TRK-PK-728488",date:"16 Oct 2026",employee:"Saad Hussain",note:"Dispatch scheduled"},
    {id:"OF-2044",name:"Usman Tariq",phone:"0311 1234567",whatsapp:"",address:"Lahore",amount:3750,received:0,method:"COD",description:"Mobile accessories",category:"Electronics",status:"Pending",dispatch:"Not ready",tracking:"",date:"15 Oct 2026",employee:"Saad Hussain",note:"Awaiting admin review"},
    {id:"OF-2043",name:"Maryam Ali",phone:"0333 9876543",whatsapp:"",address:"Johar Town, Lahore",amount:7600,received:2000,method:"Partial Payment",description:"Beauty products",category:"Beauty & personal care",status:"Approved",dispatch:"Ready",tracking:"TRK-PK-728477",date:"14 Oct 2026",employee:"Saad Hussain",note:"Payment recorded (demo)"}
  ];
  const load = () => { try { const v=JSON.parse(localStorage.getItem(STORE)); return Array.isArray(v)?v:seed.map(x=>({...x})); } catch { return seed.map(x=>({...x})); } };
  let orders = load();
  const save = () => localStorage.setItem(STORE,JSON.stringify(orders));
  if (!localStorage.getItem(STORE)) save();
  const toast = msg => { const host=$("#toastRegion"); if(!host) return; const el=document.createElement("div"); el.className="toast"; el.textContent=msg; host.append(el); setTimeout(()=>el.remove(),3000); };
  const status = s => `<span class="status-pill ${s.toLowerCase()}">${escapeHTML(s)}</span>`;
  const payment = s => `<span class="payment-pill">${escapeHTML(s==="Full Payment"?"Paid in full":s==="Partial Payment"?"Partial":s)}</span>`;
  const row = o => `<tr><td><b>#${escapeHTML(o.id)}</b></td><td><div class="id-cell"><b>${escapeHTML(o.name)}</b><small>${escapeHTML(o.phone)}</small></div></td><td>${escapeHTML(o.date)}</td><td class="money">${money(o.amount)}</td><td>${payment(o.method)}</td><td>${status(o.status)}</td><td>${escapeHTML(o.note||"—")}</td></tr>`;
  const orderRow = o => `<tr><td><b>#${escapeHTML(o.id)}</b></td><td><div class="id-cell"><b>${escapeHTML(o.name)}</b><small>${escapeHTML(o.phone)}</small></div></td><td>${escapeHTML(o.employee)}</td><td class="money">${money(o.amount)}</td><td>${payment(o.method)}<small class="table-subtext">${money(o.received)} received</small></td><td>${escapeHTML(o.date)}</td><td>${status(o.status)}</td><td>${o.status==="Pending"?`<div class="decision-actions"><button class="decision-btn approve" data-decision="Approved" data-id="${o.id}" aria-label="Approve">✓</button><button class="decision-btn reject" data-decision="Rejected" data-id="${o.id}" aria-label="Reject">×</button></div>`:"Reviewed"}</td></tr>`;
  const filtered = () => orders.filter(o=>o.employee==="Saad Hussain");
  const renderEmployee = () => {
    const mine=filtered(), pending=mine.filter(o=>o.status==="Pending").length, approved=mine.filter(o=>o.status==="Approved").length;
    if($("#employeeTotal")) { $("#employeeTotal").textContent=mine.length; $("#employeePending").textContent=pending; $("#employeeApproved").textContent=approved; }
    if($("#recentEmployeeBody")) $("#recentEmployeeBody").innerHTML=mine.slice(0,5).map(o=>`<tr><td><b>#${o.id}</b></td><td>${escapeHTML(o.name)}</td><td>${o.date}</td><td>${money(o.amount)}</td><td>${escapeHTML(o.method)}</td><td>${status(o.status)}</td></tr>`).join("");
    if($("#myOrdersBody")) {
      $("#myOrdersBody").innerHTML=mine.map(o=>`<tr><td><b>#${o.id}</b></td><td>${escapeHTML(o.name)}</td><td>${o.date}</td><td>${money(o.amount)}</td><td>${escapeHTML(o.method)}</td><td>${status(o.status)}</td><td>${escapeHTML(o.note||"—")}</td></tr>`).join("");
      $("#myTotal").textContent=mine.length; $("#myPending").textContent=pending; $("#myApproved").textContent=approved; $("#myRejected").textContent=mine.filter(o=>o.status==="Rejected").length;
    }
  };
  const renderAdmin = () => {
    const pending=orders.filter(o=>o.status==="Pending").length, approved=orders.filter(o=>o.status==="Approved"), rejected=orders.filter(o=>o.status==="Rejected").length;
    if($("#adminTotal")) { $("#adminTotal").textContent=orders.length; $("#adminPending").textContent=pending; $("#adminRevenue").textContent=money(approved.reduce((a,o)=>a+o.amount,0)); $("#adminStatusSummary").innerHTML=`<p>Approved <b>${approved.length}</b></p><p>Pending <b>${pending}</b></p><p>Rejected <b>${rejected}</b></p>`; $("#adminRecentBody").innerHTML=orders.slice(0,5).map(o=>`<tr><td>#${o.id}</td><td>${escapeHTML(o.employee)}</td><td>${escapeHTML(o.name)}</td><td>${money(o.amount)}</td><td>${status(o.status)}</td></tr>`).join(""); }
    if($("#approvalBody")) { $("#approvalBody").innerHTML=orders.map(orderRow).join(""); $("#pendingCount").textContent=pending+" orders"; $("#approvedCount").textContent=approved.length+" orders"; $("#rejectedCount").textContent=rejected+" orders"; }
  };
  const renderCommission = () => {
    const approved=filtered().filter(o=>o.status==="Approved"), total=approved.reduce((a,o)=>a+o.amount,0), commission=Math.round(total*.05);
    if($("#commissionTotal")) { $("#commissionTotal").textContent=money(commission); $("#approvedValue").textContent=money(total); $("#commissionBalance").textContent=money(Math.max(0,commission-18000)); $("#commissionBody").innerHTML=approved.map(o=>`<tr><td>#${o.id}</td><td>${escapeHTML(o.name)}</td><td>${money(o.amount)}</td><td>5%</td><td>${money(o.amount*.05)}</td></tr>`).join(""); }
  };
  const renderReports = () => {
    const total=orders.reduce((a,o)=>a+o.amount,0), received=orders.reduce((a,o)=>a+o.received,0), balance=total-received, ready=orders.filter(o=>o.status==="Approved"&&o.dispatch!=="Dispatched").length, pct=total?Math.round(received/total*100):0;
    if($("#reportTotal")) { $("#reportTotal").textContent=money(total); $("#reportReceived").textContent=money(received); $("#reportBalance").textContent=money(balance); $("#reportReady").textContent=ready; $("#collectionPercent").textContent=pct+"%"; $("#collectionTrack").style.width=pct+"%"; $("#receivedBreakdown").textContent=money(received); $("#balanceBreakdown").textContent=money(balance); $("#dispatchBody").innerHTML=orders.filter(o=>o.status==="Approved").map(o=>`<tr><td>#${o.id}</td><td><div class="id-cell"><b>${escapeHTML(o.name)}</b><small>${escapeHTML(o.address)}</small></div></td><td>${money(o.amount)}</td><td>${money(o.received)}</td><td><code>${escapeHTML(o.tracking||"Not assigned")}</code></td><td>${status(o.dispatch)}</td><td><button class="btn btn-small btn-secondary" data-dispatch="${o.id}">${o.dispatch==="Dispatched"?"Dispatched":o.dispatch==="Ready"?"Dispatch":"Mark ready"}</button></td></tr>`).join(""); }
  };
  const refresh = () => { renderEmployee(); renderAdmin(); renderCommission(); renderReports(); };
  // Theme
  const setTheme = t => { document.documentElement.dataset.theme=t; localStorage.setItem(THEME,t); $$("[data-theme-toggle]").forEach(b=>b.textContent=t==="dark"?"☾":"☼"); };
  setTheme(localStorage.getItem(THEME)||"light");
  $$("[data-theme-toggle]").forEach(b=>b.addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark")));
  // Login
  $("#loginForm")?.addEventListener("submit",e=>{e.preventDefault(); const role=$("#loginRole").value; localStorage.setItem("orderflow_role",role); location.href=role==="admin"?"admin-dashboard.html":"employee-dashboard.html";});
  $$("[data-demo-role]").forEach(b=>b.addEventListener("click",()=>{const r=b.dataset.demoRole; $("#loginRole").value=r; $("#loginEmail").value=r==="admin"?"admin@orderflow.demo":"employee@orderflow.demo"; $("#loginPassword").value="demo1234";}));
  $$("[data-toggle-password]").forEach(b=>b.addEventListener("click",()=>{const i=$("#"+b.dataset.togglePassword); i.type=i.type==="password"?"text":"password"; b.textContent=i.type==="password"?"Show":"Hide";}));
  // New order form
  const updateSummary=()=>{const a=Number($("#orderAmount")?.value||0),r=Number($("#amountReceived")?.value||0),m=$("#paymentMethod")?.value||"COD"; if($("#summaryAmount")){$("#summaryAmount").textContent=money(a);$("#summaryReceived").textContent=money(r);$("#summaryBalance").textContent=money(Math.max(0,a-r));$("#summaryMethod").textContent=m;}};
  ["orderAmount","amountReceived","paymentMethod"].forEach(id=>$("#"+id)?.addEventListener("input",updateSummary));
  $("#newOrderForm")?.addEventListener("reset",()=>setTimeout(updateSummary,0));
  $("#newOrderForm")?.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget), amount=Number(f.get("orderAmount")), received=Number(f.get("amountReceived")||0), method=f.get("paymentMethod"); if(received>amount){toast("Received amount cannot exceed order amount.");return;} if(method==="Full Payment"&&received!==amount){toast("For full payment, received amount must equal total.");return;} if(method==="COD"&&received!==0){toast("For COD, received amount should be zero.");return;}
    const next=Math.max(2049,...orders.map(o=>Number(o.id.split("-")[1])||0))+1;
    orders.unshift({id:"OF-"+next,name:f.get("customerName"),phone:f.get("contactNumber"),whatsapp:f.get("whatsappNumber"),address:f.get("customerAddress"),amount,received,method,description:f.get("orderDescription"),category:f.get("orderCategory"),status:"Pending",dispatch:"Not ready",tracking:"",date:today(),employee:"Saad Hussain",note:"Awaiting admin review"});
    save(); e.currentTarget.reset(); updateSummary(); toast("Order submitted successfully."); setTimeout(()=>location.href="my-orders.html",700);
  });
  // Approval and dispatch actions
  document.addEventListener("click",e=>{const d=e.target.closest("[data-decision]");if(d){const o=orders.find(x=>x.id===d.dataset.id);if(o&&o.status==="Pending"){o.status=d.dataset.decision;o.note=o.status==="Approved"?"Approved by administrator":"Rejected by administrator";save();refresh();applyFilters();toast(`Order ${o.id} ${o.status.toLowerCase()}.`);}}
    const ship=e.target.closest("[data-dispatch]");if(ship){const o=orders.find(x=>x.id===ship.dataset.dispatch);if(o){if(o.dispatch==="Not ready")o.dispatch="Ready";else if(o.dispatch==="Ready"){o.dispatch="Dispatched";o.tracking="TRK-PK-"+Math.floor(100000+Math.random()*899999);}save();refresh();applyFilters();toast("Dispatch status updated.");}}
    const copy=e.target.closest("[data-copy]");if(copy){navigator.clipboard?.writeText(copy.dataset.copy);toast("Tracking code copied.");}
    const t=e.target.closest("[data-toast]");if(t)toast(t.dataset.toast);
  });
  // Search and filters
  const applyFilters=()=>{ $$("[data-table-search]").forEach(input=>{const table=$(input.dataset.tableSearch);if(!table)return;const q=input.value.toLowerCase();table.querySelectorAll("tbody tr").forEach(tr=>tr.hidden=!tr.textContent.toLowerCase().includes(q));}); $$("[data-table-filter]").forEach(sel=>{const table=$(sel.dataset.tableFilter);if(!table)return;const val=sel.value;table.querySelectorAll("tbody tr").forEach(tr=>{const match=val==="all"||tr.textContent.toLowerCase().includes(val.toLowerCase());tr.hidden=tr.hidden||!match;});}); };
  $$("[data-table-search]").forEach(i=>i.addEventListener("input",()=>{ $$("[data-table-filter]").forEach(s=>{if(s.dataset.tableFilter===i.dataset.tableSearch)s.value="all";});applyFilters();}));
  $$("[data-table-filter]").forEach(s=>s.addEventListener("change",()=>{const inp=$$("[data-table-search]").find(i=>i.dataset.tableSearch===s.dataset.tableFilter);if(inp)inp.value="";applyFilters();}));
  $$("[data-global-search]").forEach(i=>i.addEventListener("input",()=>{const q=i.value.toLowerCase();const table=$("table");if(table)table.querySelectorAll("tbody tr").forEach(tr=>tr.hidden=!tr.textContent.toLowerCase().includes(q));}));
  // Export, print, mobile
  $$("[data-export]").forEach(b=>b.addEventListener("click",()=>{const rows=[["Order ID","Customer","Phone","Address","Amount","Received","Status","Dispatch"],...orders.map(o=>[o.id,o.name,o.phone,o.address,o.amount,o.received,o.status,o.dispatch])];const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="orderflow-report.csv";a.click();URL.revokeObjectURL(a.href);toast("CSV report exported.");}));
  $$("[data-print]").forEach(b=>b.addEventListener("click",()=>window.print()));
  $("#menuToggle")?.addEventListener("click",()=>$("#sidebar")?.classList.toggle("open"));
  refresh(); updateSummary();
})();