function money(x){return x||''}
function esc(x){return String(x||'')}
function listingsData(){return Array.isArray(window.REALLIST_LISTINGS)?window.REALLIST_LISTINGS:[]}
function priceNumber(p){return Number(String(p.price||'').replace(/[^0-9]/g,''))||0}
function rentMidpoint(p){const nums=String(p.rent||'').match(/\d+/g)||[];if(nums.length>=2)return Math.round((Number(nums[0])+Number(nums[1]))/2);if(nums.length===1)return Number(nums[0]);return 0}
function yieldNumber(p){const nums=String(p.yield||'').match(/\d+(?:\.\d+)?/g)||[];if(nums.length>=2)return (Number(nums[0])+Number(nums[1]))/2;if(nums.length===1)return Number(nums[0]);return 0}
function titleType(p){if(p.titleType)return p.titleType; const text=[p.land,p.type,p.summary].join(' ').toLowerCase(); if(text.includes('cross lease')) return 'Cross lease'; if(text.includes('unit title')) return 'Unit title'; if(text.includes('freehold')) return 'Freehold'; return 'Other'}
function propertyCategory(p){if(p.propertyCategory)return p.propertyCategory; const text=[p.type,p.summary,p.land].join(' ').toLowerCase(); if(text.includes('land')||text.includes('development')||Number(String(p.land||'').replace(/[^0-9]/g,''))>=700) return 'Land / development'; if(text.includes('new build')) return 'New build'; if(text.includes('townhouse')) return 'Townhouse'; if(text.includes('standalone')||text.includes('brick')) return 'Standalone'; return 'Other'}
function buyerFit(p){if(Array.isArray(p.buyerTags))return p.buyerTags; const fits=[]; const cat=propertyCategory(p); const txt=[p.summary,p.suitableFor,p.features,p.land,p.type].flat().join(' ').toLowerCase(); if(txt.includes('first-home')||priceNumber(p)<=900000) fits.push('First-home buyer'); if(txt.includes('investor')||rentMidpoint(p)>0) fits.push('Investor'); if(cat==='Land / development'||txt.includes('development')||txt.includes('subdivision')) fits.push('Developer / land buyer'); if(!fits.length) fits.push('Owner-occupier'); return fits}
function propertySearchText(p){return [p.address,p.suburb,p.region,p.type,p.land,p.floor,p.rent,p.cv,p.nearbySales,titleType(p),propertyCategory(p),buyerFit(p).join(' '),(p.features||[]).join(' '),(p.schoolZones||[]).join(' ')].join(' ').toLowerCase()}
function card(p){
  const cover=(p.images&&p.images[0])||p.image;
  return `<article class="card"><div class="image-wrap"><img class="listing-img" loading="lazy" src="${cover}" alt="${p.address}">${p.imageNote?`<div class="image-note">${p.imageNote}</div>`:''}</div><div class="card-pad"><span class="pill">${p.badge}</span><div class="price">${p.price}</div><div class="meta"><b>${p.address}</b></div><div class="facts"><span class="fact">${p.beds} bed</span><span class="fact">${p.baths} bath</span><span class="fact">${p.parking} car</span></div><div class="compact-meta"><span>${p.region||''}</span><span>${titleType(p)}</span><span>${propertyCategory(p)}</span><span>Rent ${p.rent||'on request'}</span></div>${buyerFit(p).length?`<div class="buyer-tags">${buyerFit(p).map(x=>`<span>${x}</span>`).join('')}</div>`:''}<a class="btn alt" href="./listing.html?id=${encodeURIComponent(p.id)}&v=31">View property</a></div></article>`
}

const BUYER_TALLY_URL = 'https://tally.so/r/jaEe7E';
function tallyUrl(requestType='Free Consulting', p=null, sourcePage=null){
  const params = new URLSearchParams();
  params.set('source_page', sourcePage || (p ? 'listing' : 'website'));
  params.set('request_type', requestType);
  if(p){
    params.set('property_address', p.address || '');
    params.set('listing_id', p.id || '');
  }
  return `${BUYER_TALLY_URL}?${params.toString()}`;
}
function tallyButton(label='Get free consulting', requestType='Free Consulting', p=null, cls='btn'){
  return `<a class="${cls}" href="${tallyUrl(requestType,p)}" target="_blank" rel="noopener">${label}</a>`;
}

function renderFeatured(limit=3){const el=document.querySelector('[data-featured]');if(!el)return;el.innerHTML=listingsData().slice(0,limit).map(card).join('')}
function getFilters(){return {q:(document.querySelector('[data-filter="q"]')?.value||'').trim().toLowerCase(),region:(document.querySelector('[data-filter="region"]')?.value||'').trim(),zone:(document.querySelector('[data-filter="zone"]')?.value||'').trim().toLowerCase(),min:Number(document.querySelector('[data-filter="min"]')?.value||0),max:Number(document.querySelector('[data-filter="max"]')?.value||0),beds:Number(document.querySelector('[data-filter="beds"]')?.value||0),title:(document.querySelector('[data-filter="title"]')?.value||'').trim(),ptype:(document.querySelector('[data-filter="ptype"]')?.value||'').trim(),buyer:(document.querySelector('[data-filter="buyer"]')?.value||'').trim(),sort:(document.querySelector('[data-filter="sort"]')?.value||'newest').trim()}}
function filteredListings(){const f=getFilters();let source=listingsData(); if(!source.length)return []; let list=source.filter(p=>{const price=priceNumber(p);const hay=propertySearchText(p);const zones=(p.schoolZones||[]).join(' ').toLowerCase();if(f.q && !hay.includes(f.q))return false;if(f.region && p.region!==f.region)return false;if(f.zone && !zones.includes(f.zone))return false;if(f.min && price<f.min)return false;if(f.max && price>f.max)return false;if(f.beds && Number(p.beds)<f.beds)return false;if(f.title && titleType(p)!==f.title)return false;if(f.ptype && propertyCategory(p)!==f.ptype)return false;if(f.buyer && !buyerFit(p).includes(f.buyer))return false;return true});
 if(f.sort==='price-asc')list.sort((a,b)=>priceNumber(a)-priceNumber(b));
 if(f.sort==='price-desc')list.sort((a,b)=>priceNumber(b)-priceNumber(a));
 if(f.sort==='yield-desc')list.sort((a,b)=>yieldNumber(b)-yieldNumber(a));
 return list}
function renderListings(){const el=document.querySelector('[data-listings]');if(!el)return;const list=filteredListings(); if(!listingsData().length){el.innerHTML=`<div class="empty-state"><b>Listings are loading or the data file did not load.</b><br>Please refresh the page. If this message stays, make sure <code>data/listings.js</code> was uploaded to GitHub.</div>`;} else {el.innerHTML=list.length?list.map(card).join(''):`<div class="empty-state"><b>No matching properties yet.</b><br>Try widening the filters or request free consulting so a real person can help.</div>`;} const result=document.querySelector('[data-filter-result]');if(result)result.textContent=`${list.length} matching ${list.length===1?'property':'properties'}.`}
function bindFilters(){if(!document.querySelector('[data-filter-bar]'))return;document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('input',renderListings));document.querySelector('[data-filter-reset]')?.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(el=>el.value='');renderListings()});const params=new URLSearchParams(location.search);['region','ptype'].forEach(k=>{const v=params.get(k);const r=document.querySelector(`[data-filter="${k}"]`);if(v&&r)r.value=v});renderListings()}
function researchLinks(p){
 const addr=esc(p.address);
 const links=[
  ['Auckland Council GeoMaps','https://geomapspublic.aucklandcouncil.govt.nz/viewer/index.html','Zoning, overlays, hazards, contours, boundaries and council layers.'],
  ['Auckland Unitary Plan Viewer','https://unitaryplanmaps.aucklandcouncil.govt.nz/upviewer/','Zoning, overlays, precincts and planning controls.'],
  ['Watercare GIS Viewer','https://www.watercare.co.nz/builders-and-developers/tools-fees-and-resources/gis-maps','Water and wastewater networks, pipe locations and manholes.'],
  ['Watercare Network Capacity','https://www.watercare.co.nz/builders-and-developers/consultation/network-capacity-in-auckland','Water and wastewater capacity constraints for future development.'],
  ['Education Counts School Zones','https://www.educationcounts.govt.nz/find-school','School enrolment zones and nearby schools.'],
  ['Council Rates & Valuation','https://www.aucklandcouncil.govt.nz/property-rates-valuations/Pages/find-property-rates-valuation.aspx','Rates, rating valuation and council property information.']
 ];
 return `<div class="panel dev-toolkit"><div class="eyebrow">Property research links</div><h2>Council, services and school-zone checks</h2><p>Copy the address, open the official tool, and check the property properly. Revolutionary stuff, apparently.</p><div class="copy-row"><input class="input" value="${addr}" readonly><button class="btn alt" type="button" onclick="navigator.clipboard&&navigator.clipboard.writeText('${addr.replace(/'/g,"\\'")}')">Copy address</button></div><div class="tool-grid small-cards">${links.map(l=>`<a class="tool-card link-card" href="${l[1]}" target="_blank" rel="noopener"><h3>${l[0]}</h3><p>${l[2]}</p></a>`).join('')}</div><h3>Quick checks</h3><ul class="list"><li>Zone, overlays, precincts and planning controls</li><li>Water, wastewater and stormwater access</li><li>Flood plains, flood prone areas and overland flow paths</li><li>School zones and council rating information</li><li>Road frontage, access, slope and obvious site constraints</li><li>For development buyers: infrastructure capacity and professional feasibility</li></ul><p class="muted small">These links are for general guidance only. Reallist does not guarantee zoning, service capacity, school-zone eligibility, subdivision, development feasibility, council approval or planning outcomes. Buyers should seek independent advice from relevant professionals.</p></div>`
}
function decisionSupport(p){return `<div class="panel"><div class="eyebrow">Decision support</div><h2>Before you go further</h2><div class="tool-grid small-cards"><div class="tool-card"><h3>Home buyers</h3><p>Check price reality, documents, condition, location fit, insurance and offer readiness.</p></div><div class="tool-card"><h3>Investors</h3><p>Check rent, yield, repayment pressure, holding costs, vacancy risk and property management.</p></div><div class="tool-card"><h3>Development buyers</h3><p>Check zoning, services, flooding, access, site constraints and consultant feasibility.</p></div></div></div>`}

function viewingModel(p){return `<div class="panel viewing-model"><div class="eyebrow">Viewing request model</div><h2>Private viewings by request. Every request is tracked.</h2><p>Reallist does not rely on default open homes. Buyers request a viewing first, then each genuine viewing request is followed up and arranged subject to vendor/property access and reasonable notice.</p><div class="viewing-stats"><div><span>Viewing requests</span><b>Tracked</b></div><div><span>Arranged viewings</span><b>Reported</b></div><div><span>Seller update</span><b>Weekly</b></div></div><p class="muted small">For sellers, this creates a clearer record: how many buyers requested a viewing, how many viewings were arranged, what questions were asked, and what feedback came back. If open homes become useful, they can still be arranged based on real demand instead of habit.</p></div>`}

function calculatorBlock(p){const price=priceNumber(p)||800000, rent=rentMidpoint(p)||750, dep=Math.round(price*0.2);return `<div class="panel" id="calculator"><div class="eyebrow">Mortgage & cashflow calculator</div><h2>Test the numbers</h2><div class="calc" data-calculator><div class="calc-grid"><label>Purchase price<input class="input" data-calc="price" type="number" value="${price}"></label><label>Deposit<input class="input" data-calc="deposit" type="number" value="${dep}"></label><label>Interest rate %<input class="input" data-calc="rate" type="number" step="0.01" value="6.85"></label><label>Loan term years<input class="input" data-calc="term" type="number" value="30"></label><label>Weekly rent<input class="input" data-calc="rent" type="number" value="${rent}"></label><label>Weekly expenses estimate<input class="input" data-calc="expenses" type="number" value="180"></label></div><div class="calc-results"><div><span>Loan amount</span><b data-result="loan">-</b></div><div><span>Weekly repayment</span><b data-result="weekly">-</b></div><div><span>Monthly repayment</span><b data-result="monthly">-</b></div><div><span>Rough weekly cashflow before tax</span><b data-result="cashflow">-</b></div></div><p class="muted small">This tool is for general information only and is not financial, legal, tax, lending or investment advice.</p></div></div>`}

function listingGallery(p, imgs){
  const safeImgs=(imgs&&imgs.length?imgs:[p.image]).filter(Boolean);
  const thumbs=safeImgs.map((img,i)=>`<button type="button" class="gallery-thumb ${i===0?'active':''}" data-gallery-thumb data-index="${i}" data-src="${img}" aria-label="View photo ${i+1}"><img loading="lazy" src="${img}" alt="${p.address} photo ${i+1}"></button>`).join('');
  return `<div class="gallery v29-gallery" data-gallery><div class="gallery-stage image-wrap"><button type="button" class="gallery-main" data-gallery-open aria-label="Open property photos"><img data-gallery-image loading="eager" src="${safeImgs[0]||''}" alt="${p.address}"><span class="gallery-counter" data-gallery-count>1 / ${safeImgs.length}</span><span class="gallery-expand">Click to enlarge</span></button><button type="button" class="gallery-nav prev" data-gallery-prev aria-label="Previous photo">‹</button><button type="button" class="gallery-nav next" data-gallery-next aria-label="Next photo">›</button>${p.imageNote?`<div class="image-note">${p.imageNote}</div>`:''}</div>${safeImgs.length>1?`<div class="thumb-strip">${thumbs}</div>`:`<p class="muted" style="margin:12px 0 0">More photos can be added once the full approved image set is provided.</p>`}</div>`;
}
function initListingGallery(){
  document.querySelectorAll('[data-gallery]').forEach(gallery=>{
    if(gallery.dataset.ready==='1') return; gallery.dataset.ready='1';
    const mainImg=gallery.querySelector('[data-gallery-image]');
    const count=gallery.querySelector('[data-gallery-count]');
    const thumbs=[...gallery.querySelectorAll('[data-gallery-thumb]')];
    const imgs=thumbs.length?thumbs.map(t=>t.dataset.src):[mainImg?.src].filter(Boolean);
    if(!mainImg||!imgs.length) return;
    let index=0;
    function setIndex(next){
      index=(next+imgs.length)%imgs.length;
      mainImg.src=imgs[index];
      if(count) count.textContent=`${index+1} / ${imgs.length}`;
      thumbs.forEach((t,i)=>t.classList.toggle('active',i===index));
    }
    gallery.querySelector('[data-gallery-prev]')?.addEventListener('click',e=>{e.stopPropagation();setIndex(index-1)});
    gallery.querySelector('[data-gallery-next]')?.addEventListener('click',e=>{e.stopPropagation();setIndex(index+1)});
    thumbs.forEach((t,i)=>t.addEventListener('click',()=>setIndex(i)));
    gallery.querySelector('[data-gallery-open]')?.addEventListener('click',()=>openLightbox(imgs,index));
    let startX=0;
    gallery.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX},{passive:true});
    gallery.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)setIndex(index+(dx<0?1:-1))},{passive:true});
    setIndex(0);
  });
}
function openLightbox(imgs,start=0){
  let index=start;
  const lb=document.createElement('div');
  lb.className='lightbox';
  lb.innerHTML=`<button class="lightbox-close" type="button" aria-label="Close gallery">×</button><button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous photo">‹</button><img class="lightbox-img" alt="Property photo"><button class="lightbox-nav lightbox-next" type="button" aria-label="Next photo">›</button><div class="lightbox-count"></div>`;
  document.body.appendChild(lb); document.body.classList.add('no-scroll');
  const img=lb.querySelector('.lightbox-img'), c=lb.querySelector('.lightbox-count');
  function show(i){index=(i+imgs.length)%imgs.length; img.src=imgs[index]; c.textContent=`${index+1} / ${imgs.length}`;}
  function close(){document.body.classList.remove('no-scroll'); lb.remove(); document.removeEventListener('keydown',keyHandler);}
  function keyHandler(e){if(e.key==='Escape')close(); if(e.key==='ArrowLeft')show(index-1); if(e.key==='ArrowRight')show(index+1);}
  lb.querySelector('.lightbox-close').addEventListener('click',close);
  lb.querySelector('.lightbox-prev').addEventListener('click',()=>show(index-1));
  lb.querySelector('.lightbox-next').addEventListener('click',()=>show(index+1));
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  let startX=0; lb.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX},{passive:true}); lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)show(index+(dx<0?1:-1))},{passive:true});
  document.addEventListener('keydown',keyHandler); show(index);
}
function renderListing(){const holder=document.querySelector('[data-listing-detail]');if(!holder)return;const id=new URLSearchParams(location.search).get('id')||'rl-001';const p=listingsData().find(x=>x.id===id)||listingsData()[0]; if(!p)return;document.title=`${p.address} | Reallist`;const imgs=(p.images&&p.images.length?p.images:[p.image]);const gallery=listingGallery(p, imgs);const floorPlan=p.floorPlan?`<div class="panel"><h2>Floor plan</h2><img class="floor-plan" loading="lazy" src="${p.floorPlan}" alt="${p.address} floor plan"><p class="muted">Floor plan supplied from approved listing material. Buyers should confirm dimensions before making an offer.</p></div>`:'';document.querySelector('[data-listing-hero]').innerHTML=`${gallery}<div class="panel listing-lead"><span class="pill">${p.status}</span><h1 class="h1" style="font-size:52px">${p.price}</h1><h2>${p.address}</h2><p class="lead">${p.summary}</p><div class="facts"><span class="fact">${p.beds} bed</span><span class="fact">${p.baths} bath</span><span class="fact">${p.parking} car</span><span class="fact">${titleType(p)}</span></div><div class="sticky-mobile-cta">${tallyButton('Get free consulting','Free Consulting',p,'btn')}<a class="btn alt" href="#research">Research links</a></div></div>`;holder.innerHTML=`<div class="panel"><h2>Property snapshot</h2><table class="table"><tr><td>Property type</td><td><b>${p.type}</b></td></tr><tr><td>Buyer fit</td><td><b>${buyerFit(p).join(' / ')}</b></td></tr><tr><td>Auckland area</td><td><b>${p.region||''}</b></td></tr><tr><td>Land/title</td><td><b>${p.land}</b></td></tr><tr><td>Floor area</td><td><b>${p.floor}</b></td></tr><tr><td>Estimated rent</td><td><b>${p.rent}</b></td></tr><tr><td>Gross yield</td><td><b>${p.yield}</b></td></tr><tr><td>Viewing</td><td><b>${p.viewing||'Private viewing by request'}</b></td></tr></table></div>${viewingModel(p)}<div class="panel"><h2>Description</h2><p>${p.summary}</p><h3>Key features</h3><ul class="list">${(p.features||[]).map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="panel"><h2>Price transparency</h2><p><b>Current asking price:</b> ${p.price}</p><p><b>Original price:</b> ${p.originalPrice}</p><p><b>Council CV:</b> ${p.cv}</p><p class="muted">Council CV is rating valuation information and should not be treated as current market valuation.</p><p><b>Nearby sales:</b> ${p.nearbySales}</p><ul class="list">${p.priceHistory.map(x=>`<li>${x}</li>`).join('')}</ul></div>${decisionSupport(p)}${calculatorBlock(p)}<div id="research">${researchLinks(p)}</div><div class="panel"><h2>School zones</h2><ul class="list">${(p.schoolZones||[]).map(x=>`<li>${x}</li>`).join('')}</ul><p class="muted">School zone information should be independently checked with the school or official zoning sources before purchase.</p></div>${floorPlan}<div class="panel"><h2>Who this may suit</h2><ul class="list">${p.suitableFor.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="panel"><h2>Watch before you offer</h2><ul class="list">${p.watchouts.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="panel"><h2>Document centre</h2><ul class="list">${p.documents.map(x=>`<li>${x}</li>`).join('')}</ul><p class="muted">Documents are supplied by the vendor/agency where available. Buyers should obtain independent legal and technical advice.</p></div>`;const enquiry=document.querySelector('[data-buyer-enquiry]');if(enquiry){const reqs=[['Get free consulting','Free Consulting','btn'],['Request documents','Request Documents','btn alt'],['Request nearby sales','Request Nearby Sales','btn alt'],['Request rental appraisal','Request Rental Appraisal','btn alt'],['Book private viewing','Private Viewing','btn alt'],['Development check','Development Check','btn alt'],['Offer guidance','Offer Guidance','btn alt']];enquiry.innerHTML=reqs.map(([label,type,cls])=>tallyButton(label,type,p,cls)).join('')}const prop=document.querySelector('[name="property"]');if(prop)prop.value=p.address;const listingId=document.querySelector('[name="listing_id"]');if(listingId)listingId.value=p.id;initCalculators();initListingGallery()}
function initCalculators(){document.querySelectorAll('[data-calculator]').forEach(calc=>{function val(k){return Number(calc.querySelector(`[data-calc="${k}"]`)?.value||0)}function set(k,v){const el=calc.querySelector(`[data-result="${k}"]`);if(el)el.textContent=v}function fmt(n){return '$'+Math.round(n).toLocaleString()}function run(){const price=val('price'),deposit=val('deposit'),loan=Math.max(price-deposit,0),rate=val('rate')/100/12,term=val('term')*12,rent=val('rent'),expenses=val('expenses');let monthly=0;if(loan&&rate&&term){monthly=loan*rate*Math.pow(1+rate,term)/(Math.pow(1+rate,term)-1)}const weekly=monthly*12/52;const cash=rent-weekly-expenses;set('loan',fmt(loan));set('weekly',fmt(weekly));set('monthly',fmt(monthly));set('cashflow',(cash<0?'-':'')+fmt(Math.abs(cash)))}calc.querySelectorAll('input').forEach(i=>i.addEventListener('input',run));run()})}

function highlightCurrentNav(){
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('.links a').forEach(a=>{
    const href=(a.getAttribute('href')||'').split('?')[0].toLowerCase();
    const active=(path==='' && href==='index.html')||href===path;
    a.classList.toggle('active',active);
  });
}
function bindMailtoForms(){document.querySelectorAll('form[data-mailto]').forEach(form=>{form.addEventListener('submit',e=>{e.preventDefault();const to=form.dataset.mailto||'lawson@climberproperty.com';const data=[...new FormData(form).entries()].filter(([k,v])=>String(v||'').trim());const subject=encodeURIComponent(form.dataset.subject||'Reallist enquiry');const body=encodeURIComponent(data.map(([k,v])=>`${k}: ${v}`).join('\n'));location.href=`mailto:${to}?subject=${subject}&body=${body}`})})}
highlightCurrentNav();renderFeatured();bindFilters();renderListings();renderListing();initCalculators();bindMailtoForms();
