export function renderHome(): string {
  return `
    <section class="home-screen" aria-labelledby="home-title">
      <div class="home-screen__content">
        <p class="home-screen__eyebrow">It’s play time.</p>
        <h1 id="home-title" class="home-screen__title">Ready to play?</h1>
        <button class="play-button" id="play-button" type="button" aria-label="Open game settings">
          <img src="./img/logo/play-button.png" alt="Play">
        </button>
      </div>
    </section>
  `;
}
