/* ============================================
   REACH MARK AGENCY - Main JavaScript
   reachmark.in
   "Mark Your Territory Online."
   ============================================ */

/* ── CURSOR ── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => {
    mx=e.clientX; my=e.clientY;
    cursor.style.left=mx-5+'px'; cursor.style.top=my-5+'px';
  });
  (function animRing(){ rx+=(mx-rx)*.12; ry+=(my-ry)*.12; ring.style.left=rx-19+'px'; ring.style.top=ry-19+'px'; requestAnimationFrame(animRing); })();

  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  // Force all visible immediately as fallback (fixes blank page issue)
  reveals.forEach(el => el.classList.add('visible'));
  // Also observe for staggered effect on scroll
  if('IntersectionObserver' in window) {
    reveals.forEach(el => el.classList.remove('visible'));
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revObs.observe(el));
    // Nuclear fallback: force all visible after 2s no matter what
    setTimeout(() => reveals.forEach(el => el.classList.add('visible')), 2000);
  }

  /* ── SCROLL TO SERVICES ── */
  function scrollToServices(e) {
    if(e) e.preventDefault();
    document.getElementById('services').scrollIntoView({ behavior:'smooth' });
  }

  /* ── SERVICE SELECTION ── */
  let selectedService = null;

  function selectService(btn) {
    // Clear previously selected
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.select-service-btn span').forEach(s => s.textContent = 'Select Service →');

    const card = btn.closest('.service-card');
    card.classList.add('selected');
    btn.querySelector('span').textContent = '✓ Selected';

    selectedService = {
      service:  card.dataset.service,
      price:    card.dataset.price,
      tier:     card.dataset.tier,
      delivery: card.dataset.delivery
    };

    // Small delay then open modal
    setTimeout(() => openModal(), 300);
  }

  /* ── MODAL ── */
  const overlay = document.getElementById('checkoutModal');

  function openModal() {
    if (!selectedService) return;

    // Populate summaries
    document.getElementById('summaryService').textContent  = selectedService.service;
    document.getElementById('summaryService2').textContent = selectedService.service;
    document.getElementById('summaryTier').textContent     = selectedService.tier;
    document.getElementById('summaryDelivery').textContent = selectedService.delivery;
    document.getElementById('summaryPrice').textContent    = selectedService.price;
    document.getElementById('summaryPrice2').textContent   = selectedService.price;

    goToStep(1);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('modalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if(e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

  /* ── STEPS ── */
  function goToStep(n) {
    [1,2,3].forEach(i => {
      document.getElementById('panel-'+i).classList.toggle('active', i===n);
      const ind = document.getElementById('step-ind-'+i);
      ind.classList.remove('active','done');
      if(i === n) ind.classList.add('active');
      if(i < n)   ind.classList.add('done');
    });
    document.getElementById('modalBox').scrollTop = 0;
  }

  /* ── PAYMENT METHOD ── */
  function selectPayment(el, type) {
    document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('upiDetails').style.display  = type==='upi'      ? 'block' : 'none';
    document.getElementById('bankDetails').style.display = type==='bank'     ? 'block' : 'none';
    document.getElementById('waDetails').style.display   = type==='whatsapp' ? 'block' : 'none';
    if(type==='wh