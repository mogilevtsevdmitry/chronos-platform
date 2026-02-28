/**
 * Julian Day Number (JDN) algorithms
 * Based on Jean Meeus "Astronomical Algorithms" 2nd edition, Chapter 7
 *
 * JDN 0 = 1 January 4713 BCE (Julian calendar), noon UTC
 * No year 0: year -1 = 1 BCE, year -2 = 2 BCE, etc.
 */

export interface GregorianDate {
  year: number   // negative = BCE (no year 0: -1 = 1 BCE)
  month: number  // 1-12
  day: number    // 1-31
}

export interface JulianDate {
  year: number
  month: number
  day: number
}

export interface CalendarResult {
  jdn: bigint
  gregorian: GregorianDate
  julian: JulianDate
  iso: string
  dayOfWeek: number  // 0=Monday, 6=Sunday
}

/**
 * Convert Gregorian date to Julian Day Number
 * Valid for dates after -4712 January 1 (JDN 0)
 * Handles Julian/Gregorian calendar reform: Gregorian calendar starts 1582-10-15
 */
export function gregorianToJdn(year: number, month: number, day: number): bigint {
  // Meeus Algorithm (Chapter 7, p.61)
  let y = year
  let m = month
  if (m <= 2) {
    y -= 1
    m += 12
  }

  let a = Math.floor(y / 100)
  let b = 0

  // Gregorian calendar reform: after 4 Oct 1582 Julian / 15 Oct 1582 Gregorian
  const isGregorian = year > 1582 ||
    (year === 1582 && month > 10) ||
    (year === 1582 && month === 10 && day >= 15)

  if (isGregorian) {
    b = 2 - a + Math.floor(a / 4)
  }

  const jdn = Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day + b - 1524.5

  return BigInt(Math.round(jdn))
}

/**
 * Convert Julian Day Number to Gregorian date
 * Meeus Algorithm (Chapter 7, p.63)
 */
export function jdnToGregorian(jdn: bigint): GregorianDate {
  const jdnNum = Number(jdn) + 0.5
  const z = Math.floor(jdnNum)
  const f = jdnNum - z

  let a: number
  if (z < 2299161) {
    a = z
  } else {
    const alpha = Math.floor((z - 1867216.25) / 36524.25)
    a = z + 1 + alpha - Math.floor(alpha / 4)
  }

  const b = a + 1524
  const c = Math.floor((b - 122.1) / 365.25)
  const d = Math.floor(365.25 * c)
  const e = Math.floor((b - d) / 30.6001)

  const day = b - d - Math.floor(30.6001 * e)
  const month = e < 14 ? e - 1 : e - 13
  let year = month > 2 ? c - 4716 : c - 4715

  // No year 0: astronomical year 0 = 1 BCE → convert to historical
  if (year <= 0) year -= 1

  return { year, month, day }
}

/**
 * Convert Julian calendar date to JDN
 */
export function julianToJdn(year: number, month: number, day: number): bigint {
  let y = year
  let m = month
  if (m <= 2) {
    y -= 1
    m += 12
  }
  const jdn = Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day - 1524.5
  return BigInt(Math.round(jdn))
}

/**
 * Convert JDN to Julian calendar date
 */
export function jdnToJulian(jdn: bigint): JulianDate {
  const jdnNum = Number(jdn) + 0.5
  const z = Math.floor(jdnNum)
  const b = z + 1524
  const c = Math.floor((b - 122.1) / 365.25)
  const d = Math.floor(365.25 * c)
  const e = Math.floor((b - d) / 30.6001)

  const day = b - d - Math.floor(30.6001 * e)
  const month = e < 14 ? e - 1 : e - 13
  let year = month > 2 ? c - 4716 : c - 4715

  if (year <= 0) year -= 1

  return { year, month, day }
}

/**
 * Format date as ISO 8601 extended (supports negative years)
 * e.g. -0044-03-15 for 44 BCE March 15
 */
export function formatIso(date: GregorianDate): string {
  const yearStr = date.year < 0
    ? `-${String(Math.abs(date.year)).padStart(4, '0')}`
    : String(date.year).padStart(4, '0')
  const monthStr = String(date.month).padStart(2, '0')
  const dayStr = String(date.day).padStart(2, '0')
  return `${yearStr}-${monthStr}-${dayStr}`
}

/**
 * Day of week from JDN
 * Returns 0=Monday ... 6=Sunday
 */
export function jdnToDayOfWeek(jdn: bigint): number {
  return Number((jdn + 1n) % 7n)
}

/**
 * Full calendar conversion: any JDN → all formats
 */
export function convertJdn(jdn: bigint): CalendarResult {
  const gregorian = jdnToGregorian(jdn)
  const julian = jdnToJulian(jdn)
  return {
    jdn,
    gregorian,
    julian,
    iso: formatIso(gregorian),
    dayOfWeek: jdnToDayOfWeek(jdn),
  }
}
