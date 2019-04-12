// TODO consider moving to common

function createAsyncScriptElement(src: string): HTMLScriptElement {
  const script: HTMLScriptElement = document.createElement('script');
  script.src = src;
  script.type = 'text/javascript';
  script.async = true;
  return script;
}

export function appendAsyncScriptToHeadIfAbsent(
  src: string,
  onLoad?: () => void
) {
  const { head } = document;
  if (head.querySelector(`[src="${src}"]`) == null) {
    const script = head.appendChild(createAsyncScriptElement(src));
    script.addEventListener('load', onLoad);
  } else {
    if (onLoad != null) {
      onLoad();
    }
  }
}
