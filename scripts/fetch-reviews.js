(async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/reviews?productSlug=banner');
    console.log('Status', res.status);
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error('Fetch failed', e);
  }
})();