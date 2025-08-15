import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const symbol = (req.query.symbol || 'BTCUSDT').toUpperCase();
    const base = symbol.slice(0, -3).toLowerCase();
    let quote = symbol.slice(-3).toLowerCase();

    if (quote === 'IRT') quote = 'rls';

    // Nobitex
    const nobiResp = await fetch('https://api.nobitex.ir/market/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ srcCurrency: base, dstCurrency: quote }),
    });
    const nobiJson = await nobiResp.json();
    const key = `${base}-${quote}`;
    const nobitexPrice = parseFloat(nobiJson.stats[key].latest);

    // Wallex
    const walResp = await fetch('https://api.wallex.ir/v1/markets');
    const walJson = await walResp.json();
    const wallexPrice = parseFloat(walJson.result.symbols[symbol].stats.lastPrice);

    res.status(200).json({ nobitex: nobitexPrice, wallex: wallexPrice });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
}
