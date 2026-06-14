const API_URL = "https://rentalmoto.myqnapcloud.com/api/high-scores";
const PLAYER_NAME = "SGC";
const GAME_ID = "forge_in_the_hell";

export async function fetchHighScores(limit = 10) {
  const r = await fetch(`${API_URL}?game=${GAME_ID}&limit=${limit}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json(); // [{name, score}]
}

export async function submitScore(score) {
  const r = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: PLAYER_NAME,
      score,
      game: GAME_ID,
    }),
  });

  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}