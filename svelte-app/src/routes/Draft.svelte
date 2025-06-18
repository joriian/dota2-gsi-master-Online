<script>
  import HeroBans2 from "../components/HeroBans2.svelte";
  import HeroPick2 from "../components/HeroPick2.svelte";
  import io from "socket.io-client";
  import { writable } from "svelte/store";

  const socket = io("https://dota2-gsi-master-online.onrender.com");

  const DRAFT_ACTIVE_TIME_REMAINING = writable(0);
  const RADIANT_BONUS_TIME = writable(0);
  const DIRE_BONUS_TIME = writable(0);
  const activeTeam = writable("");
  const phase = writable("");
  const radiantPicks = writable(Array(5).fill("none"));
  const direPicks = writable(Array(5).fill("none"));
  const radiantBans = writable(Array(7).fill("none"));
  const direBans = writable(Array(7).fill("none"));

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  socket.on("newdata", (data) => {
    if (!data?.draft) return;

    DRAFT_ACTIVE_TIME_REMAINING.set(data.draft.activeteam_time_remaining);
    RADIANT_BONUS_TIME.set(data.draft.radiant_bonus_time);
    DIRE_BONUS_TIME.set(data.draft.dire_bonus_time);

    activeTeam.set(data.draft.activeteam === 2 ? "radiant" : "dire");
    phase.set(data.draft.pick ? "picking" : "banning");

    const updatedRadiantBans = [];
    const updatedDireBans = [];
    for (let i = 0; i <= 6; i++) {
      updatedRadiantBans.push(data.draft.team2 ? data.draft.team2[`ban${i}_class`] || "none" : "none");
      updatedDireBans.push(data.draft.team3 ? data.draft.team3[`ban${i}_class`] || "none" : "none");
    }

    if (data.draft.pick == null) {
      const active = data.draft.activeteam === 2 ? updatedRadiantBans : updatedDireBans;
      const idx = active.findIndex((b) => b === "none");
      if (idx !== -1) active[idx] = "banning";
    }

    radiantBans.set(updatedRadiantBans);
    direBans.set(updatedDireBans);

    const updatedRadiantPicks = [];
    const updatedDirePicks = [];
    for (let i = 0; i <= 4; i++) {
      updatedRadiantPicks.push(data.draft.team2 ? data.draft.team2[`pick${i}_class`] || "none" : "none");
      updatedDirePicks.push(data.draft.team3 ? data.draft.team3[`pick${i}_class`] || "none" : "none");
    }

    if (data.draft.pick != null) {
      const active = data.draft.activeteam === 2 ? updatedRadiantPicks : updatedDirePicks;
      const idx = active.findIndex((p) => p === "none");
      if (idx !== -1) active[idx] = "picking";
    }

    radiantPicks.set(updatedRadiantPicks);
    direPicks.set(updatedDirePicks);
  });
</script>

<div class="container">
  <div class="team-column" style="align-items: flex-end;">
    <div class="time-box radiant">Tempo Total: {$RADIANT_BONUS_TIME ? formatTime($RADIANT_BONUS_TIME) : "--:--"}</div>
    <div class="time-box radiant">
      Tempo Atual: {$activeTeam === "radiant" ? formatTime($DRAFT_ACTIVE_TIME_REMAINING) : "--:--"}
    </div>
    <div class="row-team" style="flex-direction: row-reverse;">
      <div class="bans-vertical">
        {#each $radiantBans as ban, idx}
          <HeroBans2 hero_name={ban} key={idx} class="hero-ban" />
        {/each}
      </div>
      <div class="picks-vertical">
        {#each $radiantPicks as pick, idx}
          <HeroPick2 hero_name={pick} key={idx} class="hero-pick" />
        {/each}
      </div>
    </div>
  </div>

  <div class="camera-space"></div>

  <div class="team-column" style="align-items: flex-start;">
    <div class="time-box dire">Tempo Total: {$DIRE_BONUS_TIME ? formatTime($DIRE_BONUS_TIME) : "--:--"}</div>
    <div class="time-box dire">
      Tempo Atual: {$activeTeam === "dire" ? formatTime($DRAFT_ACTIVE_TIME_REMAINING) : "--:--"}
    </div>
    <div class="row-team">
      <div class="bans-vertical">
        {#each $direBans as ban, idx}
          <HeroBans2 hero_name={ban} key={idx} class="hero-ban" />
        {/each}
      </div>
      <div class="picks-vertical">
        {#each $direPicks as pick, idx}
          <HeroPick2 hero_name={pick} key={idx} class="hero-pick" />
        {/each}
      </div>
    </div>
  </div>
</div>
