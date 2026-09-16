export function parseImagesSafely(imagesInput: any): string[] {
  if (!imagesInput) return [];
  if (Array.isArray(imagesInput)) {
    return imagesInput.filter((img) => typeof img === 'string' && img.trim() !== '');
  }
  if (typeof imagesInput === 'string') {
    const trimmed = imagesInput.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter((img) => typeof img === 'string' && img.trim() !== '');
        }
      } catch (e) {
        console.error('Error parsing images JSON string:', e);
      }
    }
    return [trimmed];
  }
  return [];
}
