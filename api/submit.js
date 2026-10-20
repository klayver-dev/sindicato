export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Método não permitido.' });
  }

  const accessKey = process.env.apikeyemailform;
  if (!accessKey) {
    return res.status(500).json({ success: false, message: 'A variável apikeyemailform não está configurada na Vercel.' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!payload || typeof payload !== 'object' || !payload.message || !payload.name) {
      return res.status(400).json({ success: false, message: 'Dados do cadastro incompletos.' });
    }

    // A chave secreta é acrescentada no servidor; nunca é enviada ao navegador.
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ ...payload, access_key: accessKey })
    });

    const result = await response.json();
    return res.status(response.ok && result.success ? 200 : 502).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Falha ao processar o envio do cadastro.' });
  }
}
