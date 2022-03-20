export const shorten = (str) => {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`
}

export const numberFormateWithDigits = (number, digits) => {
  return Number(number)?.toLocaleString(navigator.language, {
    minimumFractionDigits: digits,
  })
}
