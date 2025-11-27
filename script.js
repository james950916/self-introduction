document.addEventListener('DOMContentLoaded', function(){
	const menuToggle = document.getElementById('menuToggle');
	const mainNav = document.getElementById('mainNav');
	const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
	const themeToggle = document.getElementById('themeToggle');

	// theme: apply saved theme or system preference
	function applyTheme(theme){
		if(theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
		else document.documentElement.removeAttribute('data-theme');
		// update toggle icon
		if(themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
	}
	const saved = localStorage.getItem('site-theme');
	if(saved){ applyTheme(saved); }
	else{
		// use prefers-color-scheme if available
		const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		applyTheme(prefersDark ? 'dark' : 'light');
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
});
