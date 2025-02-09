(function() {
    const GA_ID = 'G-LDX9RHEN77'; // 替换为你的 GA ID
    const script = document.createElement('script');
    script.async = true;  // 保留 async 属性
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag; // 方便在其他地方调用 gtag
    gtag('js', new Date());
    gtag('config', GA_ID);
})();