<script>
  import HeroBans2 from "../components/HeroBans2.svelte";
  import HeroPick2 from "../components/HeroPick2.svelte";
  import io from "socket.io-client";

  const socket = io("http://localhost:3001");

  let DRAFT_ACTIVE_TIME_REMAINING = 0;
  let RADIANT_BONUS_TIME = 0;
  let DIRE_BONUS_TIME = 0;
  let activeTeam = "";
  let phase = "";
  let radiantPicks = Array(5).fill("none");
  let direPicks = Array(5).fill("none");
  let radiantBans = Array(7).fill("none");
  let direBans = Array(7).fill("none");

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  socket.on("newdata", (data) => {
    DRAFT_ACTIVE_TIME_REMAINING = data.draft.activeteam_time_remaining;
    RADIANT_BONUS_TIME = data.draft.radiant_bonus_time;
    DIRE_BONUS_TIME = data.draft.dire_bonus_time;

    activeTeam = data.draft.activeteam === 2 ? "radiant" : "dire";
    phase = data.draft.pick ? "picking" : "banning";

    const updatedRadiantBans = [];
    const updatedDireBans = [];
    for (let i = 0; i <= 6; i++) {
      updatedRadiantBans.push(data.draft.team2[`ban${i}_class`] || "none");
      updatedDireBans.push(data.draft.team3[`ban${i}_class`] || "none");
    }
    if (phase === "banning") {
      if (activeTeam === "radiant") {
        const idx = updatedRadiantBans.findIndex((b) => b === "none");
        if (idx !== -1) updatedRadiantBans[idx] = "banning";
      } else if (activeTeam === "dire") {
        const idx = updatedDireBans.findIndex((b) => b === "none");
        if (idx !== -1) updatedDireBans[idx] = "banning";
      }
    }
    radiantBans = updatedRadiantBans;
    direBans = updatedDireBans;

    const updatedRadiantPicks = [];
    const updatedDirePicks = [];
    for (let i = 0; i <= 4; i++) {
      updatedRadiantPicks.push(data.draft.team2[`pick${i}_class`] || "none");
      updatedDirePicks.push(data.draft.team3[`pick${i}_class`] || "none");
    }
    if (phase === "picking") {
      if (activeTeam === "radiant") {
        const idx = updatedRadiantPicks.findIndex((p) => p === "none");
        if (idx !== -1) updatedRadiantPicks[idx] = "picking";
      } else if (activeTeam === "dire") {
        const idx = updatedDirePicks.findIndex((p) => p === "none");
        if (idx !== -1) updatedDirePicks[idx] = "picking";
      }
    }
    radiantPicks = updatedRadiantPicks;
    direPicks = updatedDirePicks;
  });
</script>

<style>
  :global(body) {
    background: transparent;
  }

  .container {
    display: flex;
    height: 100vh;
    width: 100vw;
    background: transparent;
    color: white;
    user-select: none;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    justify-content: space-between;
  }

  .team-column {
    display: flex;
    flex-direction: row;
    width: 20%;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: transparent;
    border-radius: 20px;
    box-shadow: none;
  }

  .bans-vertical {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 60px;
    align-items: center;
  }

  .picks-vertical {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100px;
    align-items: center;
  }

  .time-box {
    font-weight: 700;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    padding: 6px 14px;
    border-radius: 12px;
    text-align: center;
    user-select: none;
    min-width: 120px;
  }

  .time-box.radiant {
    color: #00ff66;
    box-shadow: 0 0 10px #00ff6699, inset 0 0 5px #00ff6655;
    background: rgba(0, 255, 102, 0.1);
  }

  .time-box.dire {
    color: #ff4c4c;
    box-shadow: 0 0 10px #ff4c4c99, inset 0 0 5px #ff4c4c55;
    background: rgba(255, 76, 76, 0.1);
  }

  :global(.hero-ban), :global(.hero-pick) {
    border-radius: 12px;
    box-shadow: 0 4px 8px rgb(0 0 0 / 0.6), 0 0 10px #00ff66aa;
    transition: transform 0.2s ease;
    width: 20px;
    height: 20px;
  }

  :global(.hero-ban:hover), :global(.hero-pick:hover) {
    transform: scale(1.1);
    box-shadow: 0 6px 14px #00ff99cc, 0 0 15px #00ff99dd;
  }

  .camera-space {
    width: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<div class="container">
  <div class="team-column" style="flex-direction: row-reverse;">
    <div class="bans-vertical">
      {#each radiantBans as ban, idx}
        <HeroBans2 hero_name={ban} key={idx} class="hero-ban" />
      {/each}
    </div>
    <div class="picks-vertical">
      {#each radiantPicks as pick, idx}
        <HeroPick2 hero_name={pick} key={idx} class="hero-pick" />
      {/each}
    </div>
  </div>

  <div class="camera-space">
    <!-- Espaço reservado para a câmera no OBS -->
  </div>

  <div class="team-column">
    <div class="bans-vertical">
      {#each direBans as ban, idx}
        <HeroBans2 hero_name={ban} key={idx} class="hero-ban" />
      {/each}
    </div>
    <div class="picks-vertical">
      {#each direPicks as pick, idx}
        <HeroPick2 hero_name={pick} key={idx} class="hero-pick" />
      {/each}
    </div>
  </div>
</div>