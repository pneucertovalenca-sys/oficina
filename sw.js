// PneuCerto SW v44: HTML sempre da rede (versão nova chega logo), cache só como reserva offline
const CACHE='pneucerto-v44';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||!r.url.startsWith('http'))return;
  const u=new URL(r.url);
  if(u.hostname.includes('googleapis.com')||u.hostname.includes('firestore'))return;
  e.respondWith(fetch(r).then(res=>{if(res&&res.ok&&u.origin===location.origin){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c)).catch(()=>{});}return res;}).catch(()=>caches.match(r)));
});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>l.length?l[0].focus():clients.openWindow('./')));});
