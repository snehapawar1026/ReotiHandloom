/**
 * Universal safe clipboard copy utility.
 * Works seamlessly in both HTTPS (modern navigator.clipboard)
 * and HTTP / older browsers / mobile WebViews (execCommand fallback).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined' || !text) return false;

  // 1. Try modern navigator.clipboard (available in secure HTTPS contexts)
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // If permission denied or failed, fall through to fallback
    }
  }

  // 2. Robust fallback for HTTP / older browsers / mobile WebViews
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Position out of sight
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // For iOS compatibility
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    textArea.setSelectionRange(0, 999999);

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.warn('Clipboard copy failed:', err);
    return false;
  }
}
