export async function verifyEndpoints() {
  const results: Record<string, boolean> = {
    chat: false,
    write: false,
    images: false,
  };

  try {
    // 1. Test Chat API (Groq)
    const chatRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Say "stable"' }],
        model: 'llama-3.3-70b'
      })
    });
    results.chat = chatRes.ok;

    // 2. Test Write (Assignment) API
    const writeRes = await fetch('/api/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'Stability Test',
        type: 'essay',
        model: 'llama-3.3-70b',
        options: { length: 'short' }
      })
    });
    results.write = writeRes.ok;

    // 3. Test Image Search
    const imageRes = await fetch('/api/images/search?q=academic', {
      method: 'GET'
    });
    results.images = imageRes.ok;

    return { success: Object.values(results).every(Boolean), details: results };
  } catch (error) {
    console.error('Verification failed:', error);
    return { success: false, error };
  }
}
