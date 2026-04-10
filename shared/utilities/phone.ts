export function normalizePhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, '')

  if (digits.startsWith('1') && digits.length === 11) {
    return `+${digits}`
  }

  if (digits.length === 10) {
    return `+1${digits}`
  }

  if (phoneNumber.startsWith('+')) {
    return phoneNumber
  }

  return `+${digits}`
}
