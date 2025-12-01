document.addEventListener('DOMContentLoaded', function(){
	const menuToggle = document.getElementById('menuToggle');
	const mainNav = document.getElementById('mainNav');
	const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
	let themeToggle = document.getElementById('themeToggle');

	// If the theme toggle button is missing from the DOM, create it so icon always appears
	if(!themeToggle){
		const headerControls = document.querySelector('.header-controls');
		if(headerControls){
			const btn = document.createElement('button');
			btn.className = 'theme-toggle';
			btn.id = 'themeToggle';
			btn.setAttribute('aria-label','切換主題');
			btn.textContent = '🌙';
			// insert before menu toggle if present, otherwise append
			const menuBtn = document.getElementById('menuToggle');
			if(menuBtn && menuBtn.parentNode === headerControls){
				headerControls.insertBefore(btn, menuBtn);
			} else {
				headerControls.appendChild(btn);
			}
			themeToggle = btn;
		}
	}

	// Theme handling: light <-> dark, persist to localStorage, respect system pref when no stored choice
	function applyTheme(theme){
		if(theme === 'dark'){
			document.documentElement.setAttribute('data-theme','dark');
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.removeAttribute('data-theme');
			document.documentElement.classList.remove('dark');
		}
		if(themeToggle){
			// Show icon representing the CURRENT theme: sun for light, moon for dark
			themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
			themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
			themeToggle.setAttribute('aria-label', theme === 'dark' ? '切換主題（目前：深色）' : '切換主題（目前：亮色）');
		}
	}

	const savedTheme = localStorage.getItem('site-theme');
	const prefersDarkMQ = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
	// Default to light unless user has saved a preference
	const initialTheme = savedTheme ? savedTheme : 'light';
	applyTheme(initialTheme);

	// If user hasn't saved a preference, listen for system theme changes and adapt
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

	// Theme (dark mode) toggle: show moon when dark, sun when light
	const themeToggle = document.getElementById('themeToggle');

	function applyTheme(theme){
		const isDark = theme === 'dark';
		document.documentElement.classList.toggle('dark', isDark);
		if(themeToggle){
			// Show moon icon when dark, sun when light (reflect current state)
			themeToggle.textContent = isDark ? '🌙' : '☀️';
			themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
		}
	}

	const savedTheme = localStorage.getItem('theme');
	// Default to light on first visit (ignore system preference unless user explicitly saved a choice)
	const initialTheme = savedTheme ? savedTheme : 'light';
	applyTheme(initialTheme);

	if(themeToggle){
		themeToggle.addEventListener('click', function(){
	 		const currentlyDark = document.documentElement.classList.contains('dark');
	 		const next = currentlyDark ? 'light' : 'dark';
	 		applyTheme(next);
	 		localStorage.setItem('theme', next);
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
});
