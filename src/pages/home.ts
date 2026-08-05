export function renderHome(): string {
  return `
    <section class="home-screen" aria-labelledby="home-title">
      <div class="home-screen__content">
        <img class="home-screen__logo" src="./img/logo/memory-logo.png" alt="Memory game">
        <p class="home-screen__eyebrow">It’s play time.</p>
        <h1 id="home-title" class="home-screen__title">Ready to play?</h1>
        <button class="play-button play-button--animated" id="play-button" type="button">
          <span class="play-button__icon" aria-hidden="true">▣</span>
          <strong>Play</strong>
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div class="home-screen__controller" aria-hidden="true">🎮</div>
    </section>
  `;
}
