(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.global-nav');
  const navLinks = nav ? nav.querySelectorAll('a') : [];
  const copyButton = document.getElementById('copy-message');
  const messageBox = document.getElementById('message-template');
  const copyStatus = document.getElementById('copy-status');

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
    });
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
  }

  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  if (copyButton && messageBox && copyStatus) {
    copyButton.addEventListener('click', async () => {
      const text = messageBox.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        copyStatus.textContent = '相談文をコピーしました。InstagramのDMに貼り付けてください。';
        copyButton.textContent = 'コピーしました';
        setTimeout(() => { copyButton.textContent = '相談文をコピーする'; }, 2200);
      } catch (error) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        textarea.remove();
        copyStatus.textContent = ok ? '相談文をコピーしました。' : 'コピーできませんでした。文章を長押ししてコピーしてください。';
      }
    });
  }

  const instagramCopyButtons = document.querySelectorAll('[data-copy-instagram]');

  instagramCopyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const username = button.dataset.copyInstagram || 'boshu_dousen';
      const value = `@${username}`;
      try {
        await navigator.clipboard.writeText(value);
      } catch (error) {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      button.textContent = `${value} をコピーしました`;
      window.setTimeout(() => {
        button.textContent = '開けない場合は @boshu_dousen をコピー';
      }, 2200);
    });
  });

})();
