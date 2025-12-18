(() => {
  const LS_KEY = "tranqimmo_mvp_var_v1";
  const STAGES = [
    { key: "nouveau", label: "Nouveau", dot: "bdot--new" },
    { key: "contacte", label: "Contacté", dot: "bdot--contacte" },
    { key: "rdv", label: "RDV", dot: "bdot--rdv" },
    { key: "devis", label: "Devis", dot: "bdot--devis" },
    { key: "gagne", label: "Gagné", dot: "bdot--gagne" },
    { key: "perdu", label: "Perdu", dot: "bdot--perdu" },
  ];
  const VAR_CITIES = ["Toulon","La Seyne-sur-Mer","Hyères","Fréjus","Draguignan","Saint-Raphaël","Brignoles","Sanary-sur-Mer","Six-Fours-les-Plages","Sainte-Maxime","Le Lavandou"];
  const qs=(s,e=document)=>e.querySelector(s);
  const qsa=(s,e=document)=>Array.from(e.querySelectorAll(s));
  const uid=()=>Math.random().toString(16).slice(2)+Date.now().toString(16);
  const nowISO=()=>new Date().toISOString();
  const toast=(msg)=>{const t=qs("#toast");t.textContent=msg;t.style.display="block";clearTimeout(toast._t);toast._t=setTimeout(()=>t.style.display="none",2600);};
  const escapeHtml=(str)=>String(str??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const escapeAttr=(str)=>escapeHtml(str).replaceAll("`","&#096;");
  const formatDate=(iso)=>{const d=new Date(iso);return d.toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"});};

  function seedState(){
    const state={region:"Var (83)",leads:[
      {id:uid(),createdAt:nowISO(),stage:"nouveau",workType:"Peinture intérieure",budget:"1 500–3 000 €",timeframe:"Sous 2 semaines",city:"Toulon",postal:"83000",addressHint:"Centre-ville",description:"Salon + couloir, murs blancs, petites réparations.",name:"Client A.",phone:"06 11 22 33 44",email:"clientA@mail.com",photos:"",notes:""},
      {id:uid(),createdAt:nowISO(),stage:"contacte",workType:"Ravalement façade",budget:"8 000–15 000 €",timeframe:"1–2 mois",city:"Hyères",postal:"83400",addressHint:"Maison",description:"Façade 120m², microfissures, couleur clair.",name:"Client B.",phone:"06 55 66 77 88",email:"clientb@mail.com",photos:"",notes:"Appel fait, RDV à planifier."},
      {id:uid(),createdAt:nowISO(),stage:"rdv",workType:"Carrelage salle de bain",budget:"3 000–6 000 €",timeframe:"Sous 1 mois",city:"La Seyne-sur-Mer",postal:"83500",addressHint:"Appartement",description:"SDB 6m², dépose ancien carrelage + pose + joints.",name:"Client C.",phone:"06 99 88 77 66",email:"clientc@mail.com",photos:"",notes:"RDV confirmé vendredi 10h."}
    ]};
    localStorage.setItem(LS_KEY,JSON.stringify(state));
    return state;
  }
  function loadState(){
    const raw=localStorage.getItem(LS_KEY);
    if(raw){try{return JSON.parse(raw);}catch{}}
    return seedState();
  }
  function saveState(s){localStorage.setItem(LS_KEY,JSON.stringify(s));}

  const stageBadge=(k)=>{const st=STAGES.find(s=>s.key===k)||STAGES[0];return `<span class="badge2"><span class="bdot ${st.dot}"></span>${st.label}</span>`;};

  function viewHome(state){
    return `<section class="section"><div class="container"><div class="grid">
      <div class="card">
        <div class="pillset"><span class="pill">MVP terrain</span><span class="pill">Zone : ${state.region}</span><span class="pill">Pros du bâtiment</span></div>
        <h1>Tester Tranqimmo avec des <span class="grad">pros du Var</span>, en conditions réelles.</h1>
        <p>Prototype interactif : <strong>demandes de travaux</strong> + <strong>pipeline</strong> de suivi (mini-CRM).</p>
        <div class="btnrow" style="margin-top:14px">
          <a class="btn btn--primary" href="#/pro">Ouvrir l’Espace Pro</a>
          <a class="btn btn--ghost" href="#/demande">Déposer une demande (test)</a>
          <a class="btn btn--ghost" href="#/aide">Mode test</a>
        </div>
        <div class="hr"></div>
        <p class="small">⚠️ Données stockées sur votre navigateur. Mode test → Réinitialiser pour repartir à zéro.</p>
      </div>
      <div class="card">
        <h2>Démo rapide</h2>
        <p>1) Déposez une demande → 2) Allez dans l’Espace Pro → 3) Changez le statut (Nouveau → RDV → Devis…).</p>
        <div class="btnrow" style="margin-top:12px">
          <button class="btn btn--primary" id="seedLeadBtn">Ajouter une demande démo</button>
          <button class="btn btn--ghost" id="openProBtn">Aller au pipeline</button>
        </div>
      </div>
    </div></div></section>`;
  }

  function viewHelp(){
    return `<section class="section"><div class="container"><div class="grid">
      <div class="card">
        <h1>Mode test (à présenter)</h1>
        <p>Objectif : valider <strong>qualité des demandes</strong> + <strong>gain de temps</strong>. MVP volontairement simple.</p>
        <div class="hr"></div>
        <h2>Script (5 min)</h2>
        <p>1) Ouvrir un lead • 2) Changer statut • 3) Notes internes • 4) Question : “payeriez-vous pour ça ?”</p>
        <div class="hr"></div>
        <div class="btnrow">
          <button class="btn btn--primary" id="resetBtn">Réinitialiser les données</button>
          <a class="btn btn--ghost" href="#/demande">Créer une demande test</a>
        </div>
      </div>
      <div class="card">
        <h2>Inclus</h2>
        <p>✅ Formulaire lead • ✅ Liste • ✅ Détail • ✅ Pipeline • ✅ Statuts • ✅ Notes</p>
        <div class="hr"></div>
        <h2>Next step</h2>
        <p>Brancher une base (Airtable/Supabase) + comptes pros + attribution par métiers/zone.</p>
      </div>
    </div></div></section>`;
  }

  function viewRequestForm(state){
    const cityOptions=VAR_CITIES.map(c=>`<option value="${c}">${c}</option>`).join("");
    return `<section class="section"><div class="container"><div class="grid">
      <div class="card">
        <h1>Déposer une demande (test) — <span class="grad">Var (83)</span></h1>
        <p>Ce formulaire génère un lead dans l’Espace Pro.</p>
        <form id="requestForm">
          <div class="formrow">
            <label>Type de travaux
              <select name="workType" required>
                <option value="" disabled selected>Choisir…</option>
                <option>Peinture intérieure</option><option>Ravalement façade</option><option>Carrelage</option>
                <option>Plomberie</option><option>Électricité</option><option>Climatisation</option>
                <option>Menuiserie</option><option>Rénovation complète</option><option>Autre</option>
              </select>
            </label>
            <label>Budget (fourchette)
              <select name="budget" required>
                <option value="" disabled selected>Choisir…</option>
                <option>Moins de 1 000 €</option><option>1 000–3 000 €</option><option>3 000–6 000 €</option>
                <option>6 000–10 000 €</option><option>10 000–20 000 €</option><option>20 000 € +</option>
              </select>
            </label>
          </div>
          <div class="formrow">
            <label>Délai
              <select name="timeframe" required>
                <option value="" disabled selected>Choisir…</option>
                <option>Dès que possible</option><option>Sous 2 semaines</option><option>Sous 1 mois</option>
                <option>1–2 mois</option><option>2–3 mois</option><option>Pas pressé</option>
              </select>
            </label>
            <label>Ville (Var)
              <select name="city" required>
                <option value="" disabled selected>Choisir…</option>${cityOptions}
              </select>
            </label>
          </div>
          <div class="formrow">
            <label>Code postal <input name="postal" type="text" inputmode="numeric" placeholder="83xxx" required /></label>
            <label>Localisation (optionnel) <input name="addressHint" type="text" placeholder="Quartier / type de logement" /></label>
          </div>
          <label>Description <textarea name="description" rows="5" placeholder="Surfaces, pièces, accès, contraintes…" required></textarea></label>
          <div class="formrow">
            <label>Nom <input name="name" type="text" required /></label>
            <label>Téléphone <input name="phone" type="tel" placeholder="06..." required /></label>
          </div>
          <div class="formrow">
            <label>Email (optionnel) <input name="email" type="email" /></label>
            <label>Lien photos (optionnel) <input name="photos" type="url" placeholder="Lien Drive/Photos…" /></label>
          </div>
          <div class="btnrow">
            <button class="btn btn--primary" type="submit">Envoyer la demande</button>
            <a class="btn btn--ghost" href="#/pro">Voir côté pro</a>
          </div>
        </form>
      </div>
      <div class="card">
        <h2>Lead qualifié =</h2>
        <p>✅ Travaux • ✅ Ville/CP • ✅ Budget • ✅ Délai • ✅ Description • ✅ Contact</p>
      </div>
    </div></div></section>`;
  }

  function viewLeadDetail(state, leadId){
    const lead=state.leads.find(l=>l.id===leadId)||state.leads[0];
    if(!lead) return `<h2>Aucun lead</h2><p class="small">Créez une demande test.</p>`;
    const opts=STAGES.map(s=>`<option value="${s.key}" ${lead.stage===s.key?"selected":""}>${s.label}</option>`).join("");
    return `<h2>Détail de la demande</h2>
      <p class="small">ID: ${lead.id.slice(-6)} • Reçu: ${formatDate(lead.createdAt)}</p>
      <div class="hr"></div>
      <div class="pillset">${stageBadge(lead.stage)}<span class="pill">${escapeHtml(lead.city)} (${escapeHtml(lead.postal)})</span><span class="pill">${escapeHtml(lead.budget)}</span></div>
      <div class="hr"></div>
      <div class="small">Type</div><div style="font-weight:950;margin-top:4px">${escapeHtml(lead.workType)}</div>
      <div style="margin-top:10px" class="small">Délai</div><div style="font-weight:900;margin-top:4px">${escapeHtml(lead.timeframe)}</div>
      <div style="margin-top:10px" class="small">Description</div><div style="margin-top:4px;line-height:1.6;color:rgba(182,194,227,.95)">${escapeHtml(lead.description)}</div>
      ${lead.photos?`<div style="margin-top:10px" class="small">Photos</div><div style="margin-top:6px"><a class="badge2" href="${escapeAttr(lead.photos)}" target="_blank" rel="noreferrer">Ouvrir le lien</a></div>`:""}
      <div class="hr"></div>
      <div class="small">Contact</div>
      <div style="margin-top:6px;display:grid;gap:8px">
        <div><strong>${escapeHtml(lead.name)}</strong></div>
        <div class="btnrow">
          <a class="btn btn--primary" href="tel:${escapeAttr(lead.phone)}">Appeler</a>
          <a class="btn btn--ghost" href="mailto:${escapeAttr(lead.email||"")}?subject=${encodeURIComponent("Tranqimmo — à propos de votre demande")}" ${lead.email?"":"aria-disabled=\"true\" style=\"opacity:.6;pointer-events:none\""}>Email</a>
        </div>
        <div class="small">📞 ${escapeHtml(lead.phone)} ${lead.email?`• ✉️ ${escapeHtml(lead.email)}`:""}</div>
      </div>
      <div class="hr"></div>
      <label>Changer le statut
        <select id="stageSelect" data-id="${lead.id}">${opts}</select>
      </label>
      <label>Notes internes
        <textarea id="notesBox" rows="4" data-id="${lead.id}" placeholder="RDV, devis, contraintes…">${escapeHtml(lead.notes||"")}</textarea>
      </label>
      <div class="btnrow">
        <button class="btn btn--primary" id="saveLeadBtn" data-id="${lead.id}">Enregistrer</button>
        <button class="btn btn--ghost" id="markLostBtn" data-id="${lead.id}">Marquer Perdu</button>
      </div>`;
  }

  function viewPro(state){
    const leads=[...state.leads].sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""));
    const rows=leads.map(l=>`<tr><td>${stageBadge(l.stage)}</td><td><strong>${escapeHtml(l.workType)}</strong><div class="small">${escapeHtml(l.city)} (${escapeHtml(l.postal)})</div></td><td>${escapeHtml(l.budget)}<div class="small">${escapeHtml(l.timeframe)}</div></td><td class="small">${formatDate(l.createdAt)}</td><td><button class="btn btn--ghost" data-open="${l.id}">Ouvrir</button></td></tr>`).join("");
    const cols=["nouveau","contacte","rdv","devis","gagne"];
    const kanban=cols.map(k=>{
      const st=STAGES.find(s=>s.key===k);
      const items=state.leads.filter(l=>l.stage===k).sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||"")).map(l=>`<div class="ticket" data-open="${l.id}"><div class="t1">${escapeHtml(l.workType)}</div><div class="t2">${escapeHtml(l.city)} • ${escapeHtml(l.budget)}</div><div class="t3">${escapeHtml(l.timeframe)}</div></div>`).join("")||`<div class="small">Aucune demande.</div>`;
      return `<div class="col"><h3>${st.label}</h3>${items}</div>`;
    }).join("");
    const lostCount=state.leads.filter(l=>l.stage==="perdu").length;

    return `<section class="section"><div class="container"><div class="grid">
      <div class="card">
        <div class="pillset"><span class="pill">Espace Pro</span><span class="pill">Zone : ${state.region}</span><span class="pill">Pipeline</span></div>
        <h1>Demandes entrantes — <span class="grad">Var</span></h1>
        <p>Ouvrez un lead, changez son statut, ajoutez des notes.</p>
        <div class="btnrow" style="margin-top:12px">
          <a class="btn btn--primary" href="#/demande">Créer une demande test</a>
          <button class="btn btn--ghost" id="toggleViewBtn">Basculer : Tableau / Pipeline</button>
          <button class="btn btn--ghost" id="showLostBtn">Perdus (${lostCount})</button>
        </div>
        <div class="hr"></div>
        <div id="proTableWrap">
          <table class="table"><thead><tr><th>Statut</th><th>Travaux</th><th>Budget / Délai</th><th>Reçu</th><th></th></tr></thead><tbody>${rows||`<tr><td colspan="5">Aucune demande.</td></tr>`}</tbody></table>
        </div>
        <div id="proKanbanWrap" style="display:none;margin-top:12px">
          <div class="kanban">${kanban}</div>
          <p class="small" style="margin-top:10px">Cliquez sur une carte pour ouvrir le détail.</p>
        </div>
      </div>
      <div class="card" id="proSide">${viewLeadDetail(state, leads[0]?.id)}</div>
    </div></div></section>`;
  }

  function viewLost(state){
    const lost=state.leads.filter(l=>l.stage==="perdu").sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""));
    const rows=lost.map(l=>`<tr><td>${stageBadge(l.stage)}</td><td><strong>${escapeHtml(l.workType)}</strong><div class="small">${escapeHtml(l.city)} (${escapeHtml(l.postal)})</div></td><td>${escapeHtml(l.budget)}<div class="small">${escapeHtml(l.timeframe)}</div></td><td class="small">${formatDate(l.createdAt)}</td><td><button class="btn btn--ghost" data-open="${l.id}">Ouvrir</button></td></tr>`).join("");
    return `<section class="section"><div class="container"><div class="grid">
      <div class="card">
        <h1>Leads perdus</h1>
        <p>Analysez les raisons : prix, délai, zone, type de travaux…</p>
        <div class="btnrow" style="margin-top:12px"><a class="btn btn--primary" href="#/pro">Retour Espace Pro</a></div>
        <div class="hr"></div>
        <table class="table"><thead><tr><th>Statut</th><th>Travaux</th><th>Budget / Délai</th><th>Reçu</th><th></th></tr></thead><tbody>${rows||`<tr><td colspan="5">Aucun lead perdu.</td></tr>`}</tbody></table>
      </div>
      <div class="card" id="lostSide">${viewLeadDetail(state, lost[0]?.id)}</div>
    </div></div></section>`;
  }

  const routes={"":s=>viewHome(s),"/":s=>viewHome(s),"/aide":s=>viewHelp(),"/demande":s=>viewRequestForm(s),"/pro":s=>viewPro(s),"/perdus":s=>viewLost(s)};

  function bindCommon(){
    const burger=qs(".burger"), nav=qs("#nav");
    if(burger&&nav){
      burger.onclick=()=>{const o=nav.classList.toggle("is-open");burger.setAttribute("aria-expanded",String(o));};
      qsa("#nav a").forEach(a=>a.onclick=()=>{nav.classList.remove("is-open");burger.setAttribute("aria-expanded","false");});
    }
  }

  function openLeadInSide(id){
    const st=loadState();
    const path=(location.hash||"#/").slice(1).split("?")[0]||"/";
    const side=qs(path==="/perdus"?"#lostSide":"#proSide");
    if(!side) return;
    side.innerHTML=viewLeadDetail(st,id);
    bindSide(id);
  }

  function bindSide(id){
    const side=qs("#proSide")||qs("#lostSide");
    if(!side) return;
    const saveBtn=qs("#saveLeadBtn",side);
    if(saveBtn){
      saveBtn.onclick=()=>{
        const leadId=saveBtn.getAttribute("data-id");
        const stageSel=qs("#stageSelect",side);
        const notes=qs("#notesBox",side);
        const st=loadState();
        const lead=st.leads.find(l=>l.id===leadId);
        if(!lead) return;
        lead.stage=stageSel.value;
        lead.notes=notes.value||"";
        saveState(st);
        toast("Lead mis à jour ✅");
        renderPreserve(leadId);
      };
    }
    const lostBtn=qs("#markLostBtn",side);
    if(lostBtn){
      lostBtn.onclick=()=>{
        const leadId=lostBtn.getAttribute("data-id");
        const st=loadState();
        const lead=st.leads.find(l=>l.id===leadId);
        if(!lead) return;
        lead.stage="perdu";
        saveState(st);
        toast("Marqué Perdu ✅");
        render();
      };
    }
  }

  function renderPreserve(leadId){
    const st=loadState();
    const hash=(location.hash||"#/").slice(1);
    const path=hash.split("?")[0]||"/";
    const viewFn=routes[path]||routes["/"];
    qs("#app").innerHTML=viewFn(st);
    bind(st);
    openLeadInSide(leadId);
  }

  function addDemoLead(){
    const st=loadState();
    const city=VAR_CITIES[Math.floor(Math.random()*VAR_CITIES.length)];
    const cp="83"+String(Math.floor(100+Math.random()*900)).padStart(3,"0");
    const types=["Peinture intérieure","Plomberie","Électricité","Carrelage","Climatisation","Rénovation complète","Ravalement façade"];
    const budgets=["Moins de 1 000 €","1 000–3 000 €","3 000–6 000 €","6 000–10 000 €","10 000–20 000 €"];
    const delays=["Dès que possible","Sous 2 semaines","Sous 1 mois","1–2 mois","Pas pressé"];
    st.leads.unshift({id:uid(),createdAt:nowISO(),stage:"nouveau",workType:types[Math.floor(Math.random()*types.length)],budget:budgets[Math.floor(Math.random()*budgets.length)],timeframe:delays[Math.floor(Math.random()*delays.length)],city,postal:cp,addressHint:"Var",description:"Demande démo générée pour tester le flux et le pipeline.",name:"Client Démo",phone:"06 10 20 30 40",email:"demo@mail.com",photos:"",notes:""});
    saveState(st);
  }

  function bind(state){
    bindCommon();
    const seedBtn=qs("#seedLeadBtn");
    if(seedBtn) seedBtn.onclick=()=>{addDemoLead();toast("Demande démo ajoutée ✅");render();};
    const openProBtn=qs("#openProBtn");
    if(openProBtn) openProBtn.onclick=()=>location.hash="#/pro";
    const resetBtn=qs("#resetBtn");
    if(resetBtn) resetBtn.onclick=()=>{localStorage.removeItem(LS_KEY);toast("Données réinitialisées ✅");render();};

    const rf=qs("#requestForm");
    if(rf){
      rf.onsubmit=(e)=>{
        e.preventDefault();
        const data=Object.fromEntries(new FormData(rf).entries());
        const st=loadState();
        st.leads.unshift({id:uid(),createdAt:nowISO(),stage:"nouveau",workType:data.workType,budget:data.budget,timeframe:data.timeframe,city:data.city,postal:data.postal,addressHint:data.addressHint||"",description:data.description,name:data.name,phone:data.phone,email:data.email||"",photos:data.photos||"",notes:""});
        saveState(st);
        toast("Demande envoyée ✅");
        location.hash="#/pro";
      };
    }

    const toggleBtn=qs("#toggleViewBtn");
    if(toggleBtn){
      toggleBtn.onclick=()=>{
        const t=qs("#proTableWrap"), k=qs("#proKanbanWrap");
        const isTable=t.style.display!=="none";
        t.style.display=isTable?"none":"block";
        k.style.display=isTable?"block":"none";
      };
    }
    const showLostBtn=qs("#showLostBtn");
    if(showLostBtn) showLostBtn.onclick=()=>location.hash="#/perdus";

    qsa("[data-open]").forEach(el=>el.onclick=()=>openLeadInSide(el.getAttribute("data-open")));
    bindSide();
  }

  function render(){
    const state=loadState();
    const hash=(location.hash||"#/").slice(1);
    const path=hash.split("?")[0]||"/";
    const viewFn=routes[path]||routes["/"];
    qs("#app").innerHTML=viewFn(state);
    bind(state);
  }

  window.addEventListener("hashchange",render);
  render();
})();