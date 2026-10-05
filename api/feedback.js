export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = req.body;
        const response = await fetch('https://feedback.adhavanmasscoc.workers.dev/api/v1/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: typeof body === 'string' ? body : JSON.stringify(body)
        });

        const data = await response.json().catch(() => ({}));
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(200).json({ success: true, fallback: true });
    }
}
