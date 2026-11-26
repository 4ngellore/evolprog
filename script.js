document.addEventListener('DOMContentLoaded', () => {
    const floatingEl = document.querySelector('.floating-search-wrapper') || document.querySelector('.floating-bar');
    if (floatingEl) document.body.appendChild(floatingEl);
    // 1. Плавне зникнення шторки при завантаженні сторінки
    const transitionEl = document.querySelector('.page-transition');
    if (transitionEl) {
        requestAnimationFrame(() => {
            transitionEl.classList.add('loaded');
        });
    }

    // Плавний перехід між сторінками
    document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#')) return;
            e.preventDefault();
            if (transitionEl) {
                transitionEl.classList.remove('loaded');
                setTimeout(() => { window.location.href = href; }, 320);
            } else {
                window.location.href = href;
            }
        });
    });

    // 2. Поява блоків при скролі
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealElements.forEach(el => observer.observe(el));

 // 3. Карусель міні-сторінок + плавне перетікання синьої вкладки
    const tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const tabGlider = document.getElementById('tabGlider');
    const scrollTrack = document.getElementById('scrollTabsTrack');
    let currentTabIndex = 0;
    let panelsTrack = null;
    let isClickScrolling = false;
    let clickScrollTimer = null;

    if (tabPanels.length > 0) {
        const viewport = document.createElement('div');
        viewport.className = 'panels-viewport';

        panelsTrack = document.createElement('div');
        panelsTrack.className = 'panels-track';

        tabPanels[0].parentNode.insertBefore(viewport, tabPanels[0]);
        viewport.appendChild(panelsTrack);
        tabPanels.forEach(panel => panelsTrack.appendChild(panel));
    }

    function activateTab(index, shouldScrollToTrack = false) {
        if (index < 0 || index >= tabButtons.length) return;

        if (shouldScrollToTrack) {
            isClickScrolling = true;
            clearTimeout(clickScrollTimer);
            clickScrollTimer = setTimeout(() => {
                isClickScrolling = false;
            }, 650);
        }

        if (tabGlider) {
            tabGlider.style.transform = `translateX(calc(${index * 100}% + ${index * 4}px))`;
        }
        if (panelsTrack && window.innerWidth > 960) {
            panelsTrack.style.transform = `translateX(-${index * 25}%)`;
        }

        if (index === currentTabIndex && tabButtons[index].classList.contains('active')) {
            return;
        }
        currentTabIndex = index;

        tabButtons.forEach((btn, i) => btn.classList.toggle('active', i === index));
        tabPanels.forEach((panel, i) => panel.classList.toggle('active', i === index));

        if (shouldScrollToTrack && scrollTrack) {
            const trackTop = scrollTrack.offsetTop;
            const scrollableDistance = scrollTrack.offsetHeight - window.innerHeight;
            const targetScroll = trackTop + (index / tabButtons.length) * scrollableDistance + 12;
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
    }

    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => activateTab(index, true));
    });

    if (scrollTrack && tabButtons.length > 0) {
        window.addEventListener('scroll', () => {
            if (isClickScrolling || window.innerWidth <= 960) return;
            const rect = scrollTrack.getBoundingClientRect();
            const scrollableDistance = scrollTrack.offsetHeight - window.innerHeight;
            if (scrollableDistance <= 0) return;

            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(0.999, scrolled / scrollableDistance));
            const targetIndex = Math.floor(progress * tabButtons.length);

            if (targetIndex !== currentTabIndex) {
                activateTab(targetIndex, false);
            }
        }, { passive: true });
    }
    // 5. Робочий розумний пошук у плаваючій панелі знизу
    function handleSiteSearch(rawQuery) {
        const query = rawQuery.trim().toLowerCase();
        if (!query) return;

        // 1. Хронологія та епохи (epochs.html)
        if (
            query.includes('машин') || query.includes('бінар') || query.includes('асем') ||
            query.includes('asm') || query.includes('eniac') || query.includes('перфокарт') ||
            query.includes('1940') || query.includes('епох') || query.includes('хронолог') ||
            query.includes('істор')
        ) {
            window.location.href = 'epochs.html#epoch-1';
            return;
        }

        if (
            query.includes('fortran') || query.includes('фортран') || query.includes('cobol') ||
            query.includes('кобол') || query.includes('algol') || query.includes('1950') ||
            query.includes('1960')
        ) {
            window.location.href = 'epochs.html#epoch-2';
            return;
        }

        if (
            query === 'c' || query === 'с' || query.includes('мова c') || query.includes('мова с') ||
            query.includes('unix') || query.includes('pascal') || query.includes('паскаль') ||
            query.includes('ada') || query.includes('рітчі') || query.includes('1970')
        ) {
            window.location.href = 'epochs.html#epoch-3';
            return;
        }

        // 2. Дерево мов, парадигми та конкретні мови (tree.html)
        if (
            query.includes('ооп') || query.includes('oop') || query.includes('об\'єкт') ||
            query.includes('c++') || query.includes('с++') || query.includes('c#') ||
            query.includes('с#') || query.includes('csharp') || query.includes('java') ||
            query.includes('джава') || query.includes('smalltalk') || query.includes('objective') ||
            query.includes('swift') || query.includes('клас')
        ) {
            window.location.href = 'tree.html#oop-tree';
            return;
        }

        if (
            query.includes('javascript') || query.includes('js') || query.includes('веб') ||
            query.includes('web') || query.includes('браузер') || query.includes('php') ||
            query.includes('скрипт') || query.includes('1990')
        ) {
            window.location.href = 'tree.html?filter=web#oop-tree';
            return;
        }

        if (
            query.includes('функціон') || query.includes('haskell') || query.includes('хаскель') ||
            query.includes('f#') || query.includes('чист') || query.includes('незмін')
        ) {
            window.location.href = 'tree.html?filter=functional#oop-tree';
            return;
        }

        if (
            query.includes('систем') || query.includes('дерев') || query.includes('каталог') ||
            query.includes('парадигм') || query.includes('синтаксис')
        ) {
            window.location.href = 'tree.html';
            return;
        }

        // 3. AI, сучасні мови та майбутнє (future.html)
        if (
            query.includes('python') || query.includes('пайтон') || query.includes('пітон') ||
            query.includes('rust') || query.includes('раст') || query.includes('go') ||
            query.includes('golang') || query.includes('mojo') || query.includes('ai') ||
            query.includes('ші') || query.includes('штучн') || query.includes('нейро') ||
            query.includes('квантов') || query.includes('q#') || query.includes('wasm') ||
            query.includes('webassembly') || query.includes('майбут') || query.includes('безпек') ||
            query.includes('2026') || query.includes('2030')
        ) {
            window.location.href = 'future.html#ai-vectors';
            return;
        }

        // 4. Джерела та література (sources.html)
        if (
            query.includes('джерел') || query.includes('літератур') || query.includes('книг') ||
            query.includes('бібліограф') || query.includes('індекс') || query.includes('tiobe')
        ) {
            window.location.href = 'sources.html';
            return;
        }

        // Якщо введено іншу мову або термін — відкриваємо інтерактивне дерево мов
        window.location.href = 'tree.html';
    }

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSiteSearch(searchInput.value);
            }
        });
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!searchInput.value.trim()) {
                searchInput.focus();
                return;
            }
            handleSiteSearch(searchInput.value);
        });
    }

    // Автоматичне ввімкнення потрібного фільтра на tree.html при переході з пошуку
    const urlParams = new URLSearchParams(window.location.search);
    const autoFilter = urlParams.get('filter');
    if (autoFilter) {
        const targetFilterBtn = document.querySelector(`.filter-pill[data-filter="${autoFilter}"]`);
        if (targetFilterBtn) {
            targetFilterBtn.click();
        }
    }

    // 6. 3D POINT CLOUD ВІЗУАЛІЗАЦІЯ (фіксовані розміри 540x450, щоб ніколи не зникала)
    document.querySelectorAll('.point-cloud-canvas').forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const shape = canvas.getAttribute('data-shape') || 'chess';
        const width = canvas.width = 540;
        const height = canvas.height = 450;
        let angle = 0;

        const points = [];
        if (shape === 'chess') {
            const figures = [
                { ox: -115, scale: 0.95, h: 240 },
                { ox: 0,    scale: 0.78, h: 195 },
                { ox: 115,  scale: 0.95, h: 240 }
            ];
            figures.forEach(fig => {
                for (let y = 0; y <= fig.h; y += 5) {
                    const t = y / fig.h;
                    let r = (36 * (1 - t * 0.65) + Math.sin(t * 22) * 5 + (t > 0.85 ? 12 : 0)) * fig.scale;
                    const steps = Math.max(14, Math.floor(r * 1.1));
                    for (let s = 0; s < steps; s++) {
                        const theta = (s / steps) * Math.PI * 2;
                        points.push({
                            x: fig.ox + Math.cos(theta) * r,
                            y: y - fig.h / 2 + 20,
                            z: Math.sin(theta) * r,
                            ox: fig.ox
                        });
                    }
                }
            });
        } else if (shape === 'tower') {
            for (let i = 0; i < 42; i++) {
                const theta = (i / 42) * Math.PI * 2;
                for (let y = -160; y <= 160; y += 7) {
                    const norm = (y + 160) / 320;
                    const r = 18 + Math.pow(norm, 2.2) * 165;
                    points.push({ x: Math.cos(theta) * r, y: y, z: Math.sin(theta) * r, ox: 0 });
                }
            }
        } else if (shape === 'crystal') {
            for (let y = -140; y <= 140; y += 6) {
                const r = 140 - Math.abs(y);
                const steps = Math.max(12, Math.floor(r * 0.6));
                for (let s = 0; s < steps; s++) {
                    const theta = (s / steps) * Math.PI * 2;
                    points.push({ x: Math.cos(theta) * r, y: y, z: Math.sin(theta) * r, ox: 0 });
                }
            }
        } else {
            for (let i = 0; i < 180; i++) {
                const t = i * 0.12;
                const y = (i - 90) * 1.8;
                for (let strand = 0; strand < 2; strand++) {
                    const shift = strand * Math.PI;
                    for (let rOff = -10; rOff <= 10; rOff += 5) {
                        points.push({
                            x: Math.cos(t + shift) * (95 + rOff),
                            y: y,
                            z: Math.sin(t + shift) * (95 + rOff),
                            ox: 0
                        });
                    }
                }
            }
        }

        function render() {
            ctx.clearRect(0, 0, width, height);
            const cx = width / 2;
            const cy = height / 2 + 10;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                const lx = p.x - p.ox;
                const rx = lx * cosA - p.z * sinA + p.ox;
                const rz = lx * sinA + p.z * cosA;

                const fov = 420 / (420 + rz);
                const sx = cx + rx * fov;
                const sy = cy + p.y * fov;

                const alpha = Math.max(0.15, Math.min(0.95, (140 - rz) / 220));
                ctx.fillStyle = rz < 0
                    ? `rgba(125, 211, 252, ${alpha})`
                    : `rgba(0, 85, 255, ${alpha * 0.75})`;
                ctx.fillRect(sx, sy, 2, 2);
            }

            angle += 0.008;
            requestAnimationFrame(render);
        }
        render();
    });
    // 7. Ефект прожектора (Spotlight) — слід курсора на картках
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    // Інтерактивність генеалогічного дерева та фільтрів (tree.html)
    const treeNodes = document.querySelectorAll('.tree-node');
    const treeEdges = document.querySelectorAll('.tree-edge');
    const treeInfoBox = document.getElementById('treeInfoBox');

if (treeNodes.length > 0) {
        const defaultHintText = treeInfoBox ? treeInfoBox.textContent.trim() : '';

        treeNodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                const id = node.dataset.id;
                if (treeInfoBox && node.dataset.desc) {
                    treeInfoBox.textContent = node.dataset.desc;
                }
                treeEdges.forEach(edge => {
                    const isConnected = edge.dataset.from === id || edge.dataset.to === id;
                    edge.classList.toggle('active-edge', isConnected);
                });
            });

            node.addEventListener('mouseleave', () => {
                treeEdges.forEach(edge => edge.classList.remove('active-edge'));
                if (treeInfoBox && defaultHintText) {
                    treeInfoBox.textContent = defaultHintText;
                }
            });

            node.addEventListener('click', () => {
                const id = node.dataset.id;
                const targetCard = document.querySelector(`.lang-card[data-lang="${id}"]`);
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetCard.classList.add('highlight-card');
                    setTimeout(() => targetCard.classList.remove('highlight-card'), 1400);
                }
            });
        });
    }

    const filterButtons = document.querySelectorAll('.filter-pill');
    const langCards = document.querySelectorAll('.lang-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.filter;
            langCards.forEach(card => {
                const categories = card.dataset.category || '';
                const show = category === 'all' || categories.includes(category);
                card.style.display = show ? 'block' : 'none';
            });
        });
    });
    // Інтерактивний перемикач парадигм на сторінці future.html
    const shiftButtons = document.querySelectorAll('.shift-btn');
    const shiftClassic = document.getElementById('shiftContentClassic');
    const shiftAi = document.getElementById('shiftContentAi');

    if (shiftButtons.length > 0 && shiftClassic && shiftAi) {
        shiftButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                shiftButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const isAi = btn.dataset.mode === 'ai';
                shiftClassic.classList.toggle('hidden', isAi);
                shiftAi.classList.toggle('hidden', !isAi);
            });
        });
    }
    // Точний перехід та підсвічування секції за якорем (#) при натисканні «Дізнатися більше»
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            setTimeout(() => {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: elementPosition - headerOffset,
                    behavior: 'smooth'
                });

                targetElement.classList.add('anchor-highlight');
                setTimeout(() => {
                    targetElement.classList.remove('anchor-highlight');
                }, 1800);
            }, 360);
        }
    }
});
