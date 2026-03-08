export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname.slice(1);

        // API Endpoint for dynamic blog listing
        if (path === "api/posts") {
            try {
                const listed = await env.R2_BUCKET.list({ limit: 100 });
                
                // Debug: return all keys to see structure
                if (url.searchParams.has('debug')) {
                    return new Response(JSON.stringify(listed.objects.map(o => o.key)), {
                        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                    });
                }

                const posts = listed.objects
                    .filter(obj => obj.key.startsWith('texts/') && obj.key.endsWith('.md'))
                    .map(obj => {
                        const id = obj.key.replace('texts/', '').replace('.md', '');
                        return {
                            id: id,
                            slug: id,
                            title: `Article #${id}`, // Default title
                            image: `/hero/${id}.jpg`, // Numerical mapping: hero/001.jpg
                            date: obj.uploaded.toISOString(),
                            category: "AI Agent Social Club"
                        };
                    })
                    .sort((a, b) => b.id.localeCompare(a.id)); // Newer posts first

                return new Response(JSON.stringify(posts), {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }
        }

        // Standard R2 Object Fetcher (existing functionality)
        if (!path) {
            return new Response('R2 Gateway Active', { status: 200 });
        }

        try {
            const object = await env.R2_BUCKET.get(path);

            if (!object) {
                return new Response('Object Not Found', { status: 404 });
            }

            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('etag', object.httpEtag);
            headers.set('cache-control', 'public, max-age=31536000, immutable');
            headers.set('access-control-allow-origin', '*');

            // Force Content-Type based on extension to ensure browser rendering
            const lowerPath = path.toLowerCase();
            if (lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg')) headers.set('content-type', 'image/jpeg');
            else if (lowerPath.endsWith('.png')) headers.set('content-type', 'image/png');
            else if (lowerPath.endsWith('.svg')) headers.set('content-type', 'image/svg+xml');
            else if (lowerPath.endsWith('.md')) headers.set('content-type', 'text/markdown; charset=utf-8');

            return new Response(object.body, { headers });
        } catch (error) {
            return new Response(`Error: ${error.message}`, { status: 500 });
        }
    }
};
