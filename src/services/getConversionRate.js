export async function getConversionRate(from, to) {
  // https://dev-api.finteria.com/api/calculator/exchange/calculate
  const endpoint = import.meta.env.VITE_BASE_URL
  const body = new FormData()
  body.set('currency_from', from)
  body.set('currency_to', to)
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body,
    })
    return await res.json()
  } catch (error) {
    console.log(error)
  }
}
