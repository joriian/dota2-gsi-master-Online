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
