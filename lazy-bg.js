(function(){
	function setupLazyBackgrounds(options){
		var opts = options || {};
		var rootMargin = typeof opts.rootMargin === 'string' ? opts.rootMargin : '200px 0px';
		var dwellMs = typeof opts.dwellMs === 'number' ? opts.dwellMs : 250;
		var nodes = document.querySelectorAll('.c-cardbox__thumb[data-bg]');
		for (var k=0;k<nodes.length;k++){ nodes[k].classList.add('is-loading'); }
		function applyBg(el, url){
			var img = new Image();
			img.onload = function(){
				el.style.backgroundImage = "url('" + url.replace(/'/g, "\\'") + "')";
				el.classList.remove('is-loading');
				el.removeAttribute('data-bg');
			};
			img.src = url;
		}
		if (!('IntersectionObserver' in window)) {
			for (var i=0;i<nodes.length;i++) {
				var el = nodes[i];
				var url = el.getAttribute('data-bg');
				if (url){
					applyBg(el, url);
				}
			}
			return;
		}
		var timers = new WeakMap();
		var observer = new IntersectionObserver(function(entries){
			entries.forEach(function(entry){
				var el = entry.target;
				if (entry.isIntersecting){
					if (!timers.has(el)){
						var id = setTimeout(function(){
							if (el.hasAttribute('data-bg')){
								var url = el.getAttribute('data-bg');
								if (url){
									applyBg(el, url);
								}
							}
							observer.unobserve(el);
							timers.delete(el);
						}, dwellMs);
						timers.set(el, id);
					}
				} else {
					var exist = timers.get(el);
					if (exist){
						clearTimeout(exist);
						timers.delete(el);
					}
				}
			});
		}, { rootMargin: rootMargin });
		for (var j=0;j<nodes.length;j++) observer.observe(nodes[j]);
	}
	window.setupLazyBackgrounds = setupLazyBackgrounds;
})(); 