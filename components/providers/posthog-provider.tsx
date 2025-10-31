import Script from "next/script";

export function PostHogProvider() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  const snippet = `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(e),p=t.createElement("script"),p.type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(o=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,o);var u=s;for(r=["capture","identify","alias","people.set","register","register_once","unregister","on","opt_out_capturing","has_opted_out_capturing","opt_in_capturing","reset","isFeatureEnabled","cookie.set","cookie.get"],n=0;n<r.length;n++)g(e,r[n])},e.__SV=1)}(document,window.posthog||[]);posthog.init('${key}',{api_host:'${host}', autocapture:false});`;

  return (
    <>
      <Script id="posthog-snippet" strategy="lazyOnload">
        {snippet}
      </Script>
    </>
  );
}
