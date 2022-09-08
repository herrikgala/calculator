export function numberWithSpaces(x) {
  var parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}

export function defineDecimals(slug) {
  let output = null
  switch (slug) {
    case 'btc':
      output = 6
      break
    case 'eth':
      output = 6
      break
    case 'eur':
      output = 2
      break
    case 'usd':
      output = 2
      break

    default:
      break
  }

  return output
}
