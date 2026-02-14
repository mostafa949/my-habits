const CACHE='habits-v1';
const URLS=['./','./index.html','./manifest.json'];

self.addEventListener('install',e=>{
    e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)));
    self.skipWaiting();
});

self.addEventListener('activate',e=>{
    e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
    self.clients.claim();
});

self.addEventListener('fetch',e=>{
    e.respondWith(
        caches.match(e.request).then(r=>{
            if(r)return r;
            return fetch(e.request).then(res=>{
                if(res&&res.status===200){
                    const c=res.clone();
                    caches.open(CACHE).then(ca=>ca.put(e.request,c));
                }
                return res;
            }).catch(()=>{
                if(e.request.mode==='navigate')return caches.match('./index.html');
            });
        })
    );
});
