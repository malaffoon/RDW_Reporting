// TODO consider moving to common

import { fromEvent, Observable } from 'rxjs';
import { delay, map, mergeMap, share } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';
import { of } from 'rxjs/internal/observable/of';

function createAsyncScriptElement(src: string): HTMLScriptElement {
  const script: HTMLScriptElement = document.createElement('script');
  script.src = src;
  script.type = 'text/javascript';
  script.async = true;
  return script;
}

const pendingScripts: Map<string, Observable<HTMLScriptElement>> = new Map();

export function getOrAppendAsyncScript(
  src: string
): Observable<HTMLScriptElement> {
  const { head } = document;

  // if the script is still loading return the pending observable
  const pendingScript = pendingScripts.get(src);
  if (pendingScript != null) {
    return pendingScript;
  }

  // if the script is loaded and present in the dom return it
  const existingScript: HTMLScriptElement = head.querySelector(
    `[src="${src}"]`
  );
  if (existingScript != null) {
    return of(existingScript);
  }

  // if the script is not loaded create and append it and return an observable of it
  const script = head.appendChild(createAsyncScriptElement(src));
  const observable = fromEvent(script, 'load').pipe(
    tap(() => pendingScripts.delete(src)),
    map(() => script),
    share()
  );
  pendingScripts.set(src, observable);
  return observable;
}
