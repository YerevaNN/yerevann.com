(function () {
  window.__yvnPartnerCarouselInit = true;

  var styles = `
    #partner {
      scroll-margin-top: 88px;
      padding: 72px 24px;
      background: #fff !important;
    }
    #partner .yvn-partners-shell {
      --yvn-partners-ink: #121326;
      --yvn-partners-muted: #6d6b88;
      --yvn-partners-purple: #6458c3;
      --yvn-partners-coral: #d95767;
      --yvn-partners-line: #dedcf1;
      max-width: 1152px;
      margin: 0 auto;
      padding: 64px 60px 58px;
      color: var(--yvn-partners-ink);
      background: linear-gradient(135deg, #faf9ff 0%, #f4f2ff 100%);
      border-radius: 24px;
      font-family: Inter, Arial, sans-serif;
    }
    #partner .yvn-partners-title {
      margin: 0 0 16px;
      color: var(--yvn-partners-ink);
      font-size: 48px;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -1.5px;
      text-align: center;
    }
    #partner .yvn-partners-intro {
      max-width: 740px;
      margin: 0 auto 42px;
      color: var(--yvn-partners-muted);
      font-size: 18px;
      line-height: 1.5;
      text-align: center;
    }
    #partner .yvn-partners-lead,
    #partner .yvn-partners-grid,
    #partner .yvn-partners-institution-grid {
      display: grid;
    }
    #partner .yvn-partners-lead {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
      margin-bottom: 20px;
    }
    #partner .yvn-partners-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }
    #partner .yvn-partner-link {
      display: flex;
      width: 100%;
      min-width: 0;
      color: inherit;
      text-decoration: none;
    }
    #partner .yvn-partner-card {
      display: flex;
      width: 100%;
      min-height: 154px;
      padding: 28px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 16px;
      overflow: hidden;
      background: #fff;
      border: 1px solid var(--yvn-partners-line);
      border-radius: 14px;
      box-shadow: 0 10px 22px rgba(70, 62, 135, .06);
      transition: transform .18s ease, box-shadow .18s ease;
    }
    #partner .yvn-partner-link:hover .yvn-partner-card {
      transform: translateY(-3px);
      box-shadow: 0 14px 28px rgba(70, 62, 135, .14);
    }
    #partner .yvn-partner-link:focus-visible,
    #partner .yvn-institution-card:focus-visible,
    #partner .yvn-partners-cta:focus-visible {
      outline: 3px solid #221c62;
      outline-offset: 4px;
      border-radius: 14px;
    }
    #partner .yvn-partner-card img {
      max-width: 90%;
      max-height: 76px;
      object-fit: contain;
    }
    #partner .yvn-partner-card .yvn-jhm-logo {
      filter: grayscale(1) contrast(8);
      mix-blend-mode: multiply;
    }
    #partner .yvn-partner-label {
      color: var(--yvn-partners-ink);
      font-size: 15px;
      font-weight: 700;
      text-align: center;
    }
    #partner .yvn-partners-grid .yvn-partner-card {
      min-height: 108px;
      padding: 16px 18px;
    }
    #partner .yvn-partners-grid img {
      max-width: 90%;
      max-height: 46px;
    }
    #partner .yvn-partners-grid img.yvn-istc-logo {
      transform: scale(3);
    }
    #partner .yvn-partners-grid img.yvn-support-compact {
      transform: scale(.72);
    }
    #partner .yvn-partners-institution {
      margin-top: 20px;
      padding: 28px 34px 30px;
      background: var(--yvn-partners-coral);
      border: 1px solid rgba(255, 255, 255, .18);
      border-radius: 14px;
    }
    #partner .yvn-partners-institution-title {
      margin: 0 0 22px;
      color: #fff;
      font-size: 22px;
      font-weight: 800;
      text-align: center;
    }
    #partner .yvn-partners-institution-grid {
      grid-template-columns: repeat(2, 330px);
      justify-content: center;
      gap: 30px;
      margin: 0 auto;
    }
    #partner .yvn-institution-card {
      display: flex;
      width: 330px;
      height: 96px;
      align-items: center;
      justify-content: center;
    }
    #partner .yvn-institution-card img {
      width: 100%;
      height: 80px;
      object-fit: contain;
    }
    #partner .yvn-institution-card .yvn-ysu-logo {
      filter: brightness(0) invert(1);
    }
    #partner .yvn-institution-card .yvn-moescs-logo {
      filter: grayscale(1) contrast(8) brightness(.78);
      mix-blend-mode: screen;
      transform: scale(1.3);
    }
    #partner .yvn-partners-cta {
      display: block;
      width: max-content;
      margin: 30px auto 0;
      padding: 14px 28px;
      color: #fff;
      background: var(--yvn-partners-purple);
      border-radius: 999px;
      font-weight: 700;
      text-decoration: none;
    }
    #partner .yvn-partners-cta:hover {
      background: #5147aa;
    }
    @media (max-width: 800px) {
      #partner { padding: 20px 12px; }
      #partner .yvn-partners-shell { padding: 38px 18px; }
      #partner .yvn-partners-title { font-size: 34px; }
      #partner .yvn-partners-intro { font-size: 16px; }
      #partner .yvn-partners-lead,
      #partner .yvn-partners-institution-grid { grid-template-columns: 1fr; }
      #partner .yvn-partners-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      #partner .yvn-institution-card { width: 100%; }
    }
  `;

  var markup = `
    <section class="yvn-partners-shell" aria-labelledby="yvn-partners-title">
      <h2 class="yvn-partners-title" id="yvn-partners-title">Partners &amp; Sponsors</h2>
      <p class="yvn-partners-intro">Our research grows through a network of universities, foundations, companies, and supporters.</p>
      <div class="yvn-partners-lead">
        <a class="yvn-partner-link" href="https://revandrachel.org/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img src="/assets/rev-rachel-logo.jpg" alt="R&amp;R Foundation"></span></a>
        <a class="yvn-partner-link" href="https://www.jhmfoundation.org/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img class="yvn-jhm-logo" src="/assets/jhm-foundation-logo.png" alt=""><span class="yvn-partner-label">JHM Foundation</span></span></a>
        <a class="yvn-partner-link" href="https://yahall.am/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img src="/assets/yandex-logo.png" alt="Yandex Armenia"></span></a>
      </div>
      <div class="yvn-partners-grid">
        <a class="yvn-partner-link" href="https://sastic.org/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img src="/assets/sastic-logo.png" alt="SASTIC"></span></a>
        <a class="yvn-partner-link" href="https://asof.am/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img src="/assets/armenian-society-of-fellows-logo.png" alt="Armenian Society of Fellows"></span></a>
        <a class="yvn-partner-link" href="https://www.istc.am/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img class="yvn-istc-logo" src="/assets/istc-foundation-logo.jpeg" alt="ISTC Foundation"></span></a>
        <a class="yvn-partner-link" href="https://formula.vc/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img src="/assets/formula-vc-logo.png" alt="Formula VC"></span></a>
        <a class="yvn-partner-link" href="https://getglobally.org/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img src="/assets/globally-logo.png" alt="Globally"></span></a>
        <a class="yvn-partner-link" href="https://www.mayro.am/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img src="/assets/mayro-logo.png" alt="Mayro"></span></a>
        <a class="yvn-partner-link" href="https://layerswap.io/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img src="/assets/layerswap-logo.png" alt="Layerswap"></span></a>
        <a class="yvn-partner-link" href="/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img src="/assets/profholod-logo.png" alt="Profholod"></span></a>
        <a class="yvn-partner-link" href="https://www.nuvehome.com/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img class="yvn-support-compact" src="/assets/nuve-logo.png" alt="Nuve"></span></a>
        <a class="yvn-partner-link" href="/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img src="/assets/technun-club-logo.png" alt="Technun Club"></span></a>
        <a class="yvn-partner-link" href="https://nebius.com/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img class="yvn-support-compact" src="/assets/nebius-logo.png" alt="Nebius"></span></a>
        <a class="yvn-partner-link" href="https://www.cognaize.com/" target="_blank" rel="noreferrer"><span class="yvn-partner-card"><img class="yvn-support-compact" src="/assets/cognaize-logo.png" alt="Cognaize"></span></a>
      </div>
      <div class="yvn-partners-institution">
        <h3 class="yvn-partners-institution-title">Institutional Partners</h3>
        <div class="yvn-partners-institution-grid">
          <a class="yvn-institution-card" href="https://ysu.am/" target="_blank" rel="noreferrer"><img class="yvn-ysu-logo" src="/assets/yerevan-state-university-logo.png" alt="Yerevan State University"></a>
          <a class="yvn-institution-card" href="https://www.scs.am/" target="_blank" rel="noreferrer"><img class="yvn-moescs-logo" src="/assets/ra-moescs-logo.png" alt="RA MoESCS Higher Education and Science Committee"></a>
        </div>
      </div>
      <a class="yvn-partners-cta" href="/donate/">Partner with us &rarr;</a>
    </section>
  `;

  function installPartnerSection() {
    var partner = document.getElementById("partner");
    if (!partner) return;

    if (!document.getElementById("yvn-partners-v2-styles")) {
      var style = document.createElement("style");
      style.id = "yvn-partners-v2-styles";
      style.textContent = styles;
      document.head.appendChild(style);
    }

    partner.className = "yvn-partners-section";
    partner.innerHTML = markup;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installPartnerSection);
  } else {
    installPartnerSection();
  }
}());
