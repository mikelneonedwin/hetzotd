const assets = ["/", "/vite.svg"];
const cacheName = "translator-cache";

self.addEventListener("install",
    /** @param {ExtendableEvent} event  */
    (event) => {
        async function loadStaticCache() {
            try {
                const res = await fetch("/assets/chunks.json");
                const chunks = await res.json();
                /** @type {import("vite").ManifestChunk} */
                const chunk = chunks["index.html"];
                assets.push(chunk.file, ...chunk.css);
                const res_1 = await fetch("/manifest.json");
                const manifest = await res_1.json();
                manifest.icons.forEach((icon) => assets.push(icon.src));
            }
            finally {
                const cache = await caches.open(cacheName);
                await cache.addAll(assets);
            }
        }
        event.waitUntil(loadStaticCache())
    })

self.addEventListener("fetch",
    /** @param {FetchEvent} event */
    (event) => {
        const load = async () => await caches.match(event.request) || await caches.match(new URL("/", event.request.url));
        const url = new URL(event.request.url);
        url.origin === self.origin && event.respondWith(load());
    })

self.addEventListener("active", () => { });