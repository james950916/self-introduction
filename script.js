document.addEventListener('DOMContentLoaded', function(){
	const menuToggle = document.getElementById('menuToggle');
	const mainNav = document.getElementById('mainNav');
	const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
	const themeToggle = document.getElementById('theme-toggle');

	// Theme handling: light <-> dark, persist to localStorage, respect system pref when no stored choice
	function applyTheme(theme){
		const isDark = theme === 'dark';
		if(isDark){
			document.documentElement.setAttribute('data-theme','dark');
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.setAttribute('data-theme','light');
			document.documentElement.classList.remove('dark');
		}
		if(themeToggle){
			// Icon reflects current theme: moon for dark, sun for light
			themeToggle.textContent = isDark ? '🌙' : '☀️';
			themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
			themeToggle.setAttribute('aria-label', isDark ? '切換主題（目前：深色）' : '切換主題（目前：亮色）');
		}
	}

	const savedTheme = localStorage.getItem('site-theme');
	const prefersDarkMQ = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
	const initialTheme = savedTheme ? savedTheme : 'light';
	applyTheme(initialTheme);

	if(!savedTheme && prefersDarkMQ && typeof prefersDarkMQ.addEventListener === 'function'){
		prefersDarkMQ.addEventListener('change', e => {
			applyTheme(e.matches ? 'dark' : 'light');
		});
	}

	if(themeToggle){
		themeToggle.addEventListener('click', ()=>{
			const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
			const next = current === 'dark' ? 'light' : 'dark';
			applyTheme(next);
			localStorage.setItem('site-theme', next);
		});
	}

	// Mobile menu toggle
	menuToggle && menuToggle.addEventListener('click', function(){
		mainNav.classList.toggle('open');
	});

	// Close mobile menu when link clicked
	navLinks.forEach(link=>link.addEventListener('click', (e)=>{
		// smooth scroll behavior and close mobile nav
		const href = link.getAttribute('href');
		if(href && href.startsWith('#')){
			e.preventDefault();
			const target = document.querySelector(href);
			if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
		}
		mainNav.classList.remove('open');
	}));

	// Active nav on scroll
	const sections = Array.from(document.querySelectorAll('main section'));
	function onScroll(){
		const pos = window.scrollY + 120;
		let current = sections[0];
		for(const sec of sections){
			if(sec.offsetTop <= pos) current = sec;
		}
		navLinks.forEach(a=> a.classList.toggle('active', a.getAttribute('href') === '#'+current.id));
	}
	window.addEventListener('scroll', onScroll);
	onScroll();


	// Animate skill progress bars when skills section enters viewport
	const skillSection = document.getElementById('skills');
	if(skillSection){
		const bars = Array.from(document.querySelectorAll('.skill-bar'));
		let animated = false;
		const io = new IntersectionObserver((entries)=>{
			entries.forEach(entry=>{
				if(entry.isIntersecting && !animated){
					animated = true;
					bars.forEach(bar=>{
						const percent = bar.dataset.percent || 0;
						const fill = bar.querySelector('.skill-fill');
						if(fill){
							setTimeout(()=>{ fill.style.width = percent + '%'; }, 120);
						}
					});
					io.disconnect();
				}
			});
		},{threshold:0.25});
		io.observe(skillSection);
	}

	// Contact form handling (simple client-side simulate)
	const form = document.getElementById('contactForm');
	const formMessage = document.getElementById('formMessage');
	if(form){
		form.addEventListener('submit', function(e){
			e.preventDefault();
			const data = new FormData(form);
			const name = data.get('name');
			const email = data.get('email');
			const message = data.get('message');
			if(!name || !email || !message){
				formMessage.textContent = '請填寫所有欄位。';
				return;
			}
			formMessage.textContent = '送出中…';
			// Simulate send
			setTimeout(()=>{
				formMessage.textContent = '已收到，感謝您的聯絡！';
				form.reset();
			},800);
		});
	}

	// Background music control (toggle + persist)
	(function(){
		const musicToggle = document.getElementById('music-toggle');
		const audio = document.getElementById('bgMusic');
		if(!musicToggle || !audio) return;

		function setMusicUI(on){
			musicToggle.textContent = on ? '🔊' : '♪';
			musicToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
		}

		let enabled = localStorage.getItem('bg-music') === 'on';

		// initialize UI
		setMusicUI(enabled);

		if(enabled){
			audio.play().catch(()=>{
				// autoplay blocked — update UI/state
				enabled = false;
				setMusicUI(false);
				localStorage.setItem('bg-music','off');
			});
		}

		musicToggle.addEventListener('click', ()=>{
			enabled = !enabled;
			if(enabled){
				audio.play().catch(()=>{
					enabled = false;
					setMusicUI(false);
					localStorage.setItem('bg-music','off');
				});
				localStorage.setItem('bg-music','on');
			} else {
				audio.pause();
				localStorage.setItem('bg-music','off');
			}
			setMusicUI(enabled);
		});

		// Pause when tab hidden
		document.addEventListener('visibilitychange', ()=>{
			if(document.hidden){
				audio.pause();
			} else if(localStorage.getItem('bg-music') === 'on'){
				audio.play().catch(()=>{});
			}
		});
	})();
});
