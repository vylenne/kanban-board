export const getTimeAgo = (isoString: string): string => {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `Last edit ${minutes} min ago`

  return `Last edit ${hours} hour${hours > 1 ? 's' : ''} ago`
}
