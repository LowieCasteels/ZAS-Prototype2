export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;
    
    // TODO: Paste your chatbot/backend logic here
    
    res.status(200).json({ reply: `Bot says: I heard you say "${message}"` });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}