/* =============================================
   CHESS PORTFOLIO SCRIPT
   Kristian Ronan A. Santiago
   ============================================= */

/* ── Navbar scroll effect ── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Build mini chess board ── */
(function buildBoard() {
    const board = document.getElementById('miniBoard');
    if (!board) return;

    const pieces = {
        '0,0': '♜', '0,1': '♞', '0,2': '♝', '0,3': '♛',
        '0,4': '♚', '0,5': '♝', '0,6': '♞', '0,7': '♜',
        '1,0': '♟', '1,1': '♟', '1,2': '♟', '1,3': '♟',
        '1,4': '♟', '1,5': '♟', '1,6': '♟', '1,7': '♟',
        '6,0': '♙', '6,1': '♙', '6,2': '♙', '6,3': '♙',
        '6,4': '♙', '6,5': '♙', '6,6': '♙', '6,7': '♙',
        '7,0': '♖', '7,1': '♘', '7,2': '♗', '7,3': '♕',
        '7,4': '♔', '7,5': '♗', '7,6': '♘', '7,7': '♖',
    };

    const activeCells = [
        [4,4], [4,3], [3,4], [2,5]
    ];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            const isLight = (r + c) % 2 === 0;
            const isActive = activeCells.some(([ar, ac]) => ar === r && ac === c);
            cell.className = `board-cell ${isLight ? 'light' : 'dark'}${isActive ? ' active' : ''}`;

            const piece = pieces[`${r},${c}`];
            if (piece) {
                cell.textContent = piece;
                cell.style.color = r < 2 ? '#1a1a1a' : '#f0ece4';
                cell.style.textShadow = r < 2
                    ? '0 1px 1px rgba(255,255,255,0.4)'
                    : '0 1px 2px rgba(0,0,0,0.7)';
            }
            board.appendChild(cell);
        }
    }
})();

/* ── Animated chess game on the board ── */
(function animateBoard() {
    const moves = [
        { from: [6,4], to: [4,4] },
        { from: [1,4], to: [3,4] },
        { from: [7,6], to: [5,5] },
        { from: [0,1], to: [2,2] },
        { from: [6,3], to: [4,3] },
        { from: [1,3], to: [3,3] },
    ];

    let moveIndex = 0;
    const board = document.getElementById('miniBoard');
    if (!board) return;

    function getCell(r, c) {
        return board.children[r * 8 + c];
    }

    function applyMove() {
        const { from, to } = moves[moveIndex % moves.length];
        const fromCell = getCell(from[0], from[1]);
        const toCell   = getCell(to[0],   to[1]);

        if (!fromCell || !toCell) return;

        const piece     = fromCell.textContent;
        const pieceColor = fromCell.style.color;
        const pieceShadow = fromCell.style.textShadow;

        fromCell.textContent = '';
        fromCell.style.color = '';

        toCell.textContent = piece;
        toCell.style.color = pieceColor;
        toCell.style.textShadow = pieceShadow;

        /* brief highlight on destination */
        toCell.classList.add('active');
        setTimeout(() => toCell.classList.remove('active'), 800);

        moveIndex++;
    }

    /* start after 3s, then every 3s */
    setTimeout(() => {
        applyMove();
        setInterval(applyMove, 3000);
    }, 3000);
})();

/* ── Typing effect ── */
(function typeEffect() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const phrases = [
        'Building elegant solutions.',
        'Thinking several moves ahead.',
        'Turning ideas into reality.',
        'Crafting digital experiences.',
        'Engineered for impact.',
    ];

    let pIdx = 0, cIdx = 0, deleting = false;

    function tick() {
        const phrase = phrases[pIdx];
        el.textContent = deleting
            ? phrase.slice(0, cIdx - 1)
            : phrase.slice(0, cIdx + 1);

        deleting ? cIdx-- : cIdx++;

        let delay = deleting ? 45 : 75;
        if (!deleting && cIdx === phrase.length) { delay = 2200; deleting = true; }
        else if (deleting && cIdx === 0)          { deleting = false; pIdx = (pIdx + 1) % phrases.length; delay = 350; }

        setTimeout(tick, delay);
    }
    tick();
})();

/* ── Add reveal classes BEFORE setting up the observer ── */
(function applyRevealClasses() {
    document.querySelectorAll('.skill-tier').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.07}s`;
    });
    document.querySelectorAll('.project-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.12}s`;
    });
    document.querySelectorAll('.stat-item').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.08}s`;
    });
    document.querySelectorAll('.contact-link').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.1}s`;
    });
    document.querySelectorAll('.about-visual').forEach(el => el.classList.add('reveal-left'));
    document.querySelectorAll('.section-header').forEach(el => el.classList.add('reveal'));
    /* hero-content intentionally excluded — it uses a CSS load animation instead */
})();

/* ── Scroll reveal (IntersectionObserver) ── */
(function scrollReveal() {
    const selector = '.reveal, .reveal-left, .reveal-right';
    const els = document.querySelectorAll(selector);

    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    els.forEach(el => obs.observe(el));
})();

/* ── Smooth active nav link highlight ── */
(function activeNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (link) link.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => obs.observe(s));
})();

/* ── Parallax tilt on mini board (mouse move) ── */
(function boardTilt() {
    const wrapper = document.getElementById('boardWrapper');
    const board   = document.getElementById('miniBoard');
    if (!wrapper || !board) return;

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        const y = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
        board.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg)`;
    });

    wrapper.addEventListener('mouseleave', () => {
        board.style.transform = 'perspective(900px) rotateY(-10deg) rotateX(4deg)';
    });
})();
