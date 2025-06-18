<script>
  import io from "socket.io-client";
  import { onMount } from "svelte";

  const DOTA_RADIANT_PLAYER_COLORS = ["#3074F9", "#66FFC0", "#BD00B7", "#F8F50A", "#FF6901"];
  const DOTA_DIRE_PLAYER_COLORS = ["#FF88C5", "#A2B349", "#63DAFA", "#01831F", "#9F6B00"];

  let players = [];

  // Inputs do usuário para nome e logo dos times
  let teamRadiantName = "Iluminados";
  let teamRadiantLogo = "";
  let teamDireName = "Temidos";
  let teamDireLogo = "";

  let socket;
  onMount(() => {
    socket = io("https://dota2-gsi-master-online.onrender.com/");
    socket.on("newdata", (data) => {
      updatePlayers(data);
    });

    return () => socket.disconnect();
  });

  function updatePlayers(data) {
    const newPlayers = [];
    for (let team = 2; team <= 3; team++) {
      const start = team === 2 ? 0 : 5;
      const end = team === 2 ? 4 : 9;

      for (let playerIndex = start; playerIndex <= end; playerIndex++) {
        const playerData = data.player[`team${team}`]?.[`player${playerIndex}`];
        const heroData = data.hero[`team${team}`]?.[`player${playerIndex}`];
        const abilitiesData = data.abilities[`team${team}`]?.[`player${playerIndex}`];
        const itemsData = data.items[`team${team}`]?.[`player${playerIndex}`];

        if (playerData && heroData) {
          newPlayers.push({
            id: `${team}-${playerIndex}`,
            name: playerData.name,
            hero: heroData.name,
            hero_stats: heroData,
            player_stats: playerData,
            hero_abilities: abilitiesData,
            hero_items: itemsData,
            net_worth: playerData.net_worth,
            gpm: playerData.gpm,
            xpm: playerData.xpm,
            hero_damage: playerData.hero_damage,
            hero_healing: playerData.hero_healing,
          });
        }
      }
    }
    players = newPlayers;
  }

  function formatHeroName(hero) {
    return hero?.split("_").slice(3).join("_") || "";
  }

  function formatNumber(num) {
    return num?.toLocaleString("en-US") || "0";
  }

  function setItem(slot) {
    if (!slot || slot.name === "empty") return "";

    if (slot.name === "item_bottle") {
      if (slot.contains_rune && slot.contains_rune !== "empty") {
        return `assets/items/item_bottle_${slot.contains_rune}.png`;
      }
      switch (slot.charges) {
        case 3: return "assets/items/item_bottle.png";
        case 2: return "assets/items/item_bottle_2.png";
        case 1: return "assets/items/item_bottle_1.png";
        default: return "assets/items/item_bottle_empty.png";
      }
    }

    return `assets/items/${slot.name}.png`;
  }
</script>

<!-- CONTROLES DOS TIMES -->
<div class="flex justify-between items-center p-2 bg-gray-800 text-white text-shadow">
  <div class="flex gap-2 items-center">
    <input type="text" bind:value={teamRadiantName} placeholder="Nome dos Iluminados" class="bg-black border px-2 py-1" />
    <input type="file" accept="image/*" on:change={(e) => {
      const file = e.target.files[0];
      if (file) teamRadiantLogo = URL.createObjectURL(file);
    }} />
  </div>
  <div class="flex gap-2 items-center">
    <input type="text" bind:value={teamDireName} placeholder="Nome dos Temidos" class="bg-black border px-2 py-1" />
    <input type="file" accept="image/*" on:change={(e) => {
      const file = e.target.files[0];
      if (file) teamDireLogo = URL.createObjectURL(file);
    }} />
  </div>
</div>

<!-- HEADER DE TIMES -->
<div class="flex justify-around bg-blue-transparent p-2 text-white text-shadow">
  <div class="flex items-center gap-2">
    {#if teamRadiantLogo}
      <img src={teamRadiantLogo} class="h-20" alt="Radiant Logo" />
    {/if}
    <span>{teamRadiantName}</span>
  </div>
  <div class="flex items-center gap-2">
    <span>{teamDireName}</span>
    {#if teamDireLogo}
      <img src={teamDireLogo} class="h-20" alt="Dire Logo" />
    {/if}
  </div>
</div>

<!-- SCOREBOARD -->
<div class="flex flex-row my-2 gap-4 text-white text-shadow">
  <!-- RADIANT -->
  <div class="flex flex-col w-full">
    {#each players.slice(0, 5) as player (player.id)}
      <div class="flex flex-row items-center gap-3 my-1">
        <div class="w-[256px] flex justify-end" style="background-color: {DOTA_RADIANT_PLAYER_COLORS[+player.id.split('-')[1] % 5]}">
          <img class="pl-3 w-[256px]" src={`/portraits/${formatHeroName(player.hero)}.png`} alt={player.hero} />
        </div>

        <div class="flex flex-col w-[200px] ml-2 justify-center">
          <h1 class="font-bold">{player.name}</h1>
          <h1>LVL {player.hero_stats.level} {formatHeroName(player.hero).toUpperCase()}</h1>
        </div>

        <div class="flex flex-col m-2 text-center">
          <h1>PLJ</h1>
          <span>{formatNumber(player.net_worth)}</span>
          <h1>Ouro</h1>
          <span>{formatNumber(player.player_stats.gold)}</span>
        </div>

        <div class="flex flex-col m-2 text-center">
          <h1>FIN/NEG</h1>
          <span>{player.player_stats.last_hits}/{player.player_stats.denies}</span>
        </div>

        <div class="flex flex-col m-2 text-center">
          <h1>OPM</h1>
          <span>{formatNumber(player.gpm)}</span>
          <h1>EXP</h1>
          <span>{formatNumber(player.xpm)}</span>
        </div>

        <!-- ITENS EM GRID -->
        <div class="grid grid-cols-3 grid-rows-2 gap-1 m-2">
          {#each [0,1,2,3,4,5] as slot}
            {#if setItem(player.hero_items[`slot${slot}`])}
              <img class="h-[48px] w-[64px] border bg-black" src={setItem(player.hero_items[`slot${slot}`])} alt="item" />
            {/if}
          {/each}
        </div>

        <!-- ITEM NEUTRO -->
        {#if setItem(player.hero_items.neutral0)}
          <img class="h-[48px] w-[48px] rounded-full bg-black object-cover" src={setItem(player.hero_items.neutral0)} alt="neutral item" />
        {/if}
      </div>
    {/each}
  </div>

  <!-- DIRE -->
  <div class="flex flex-col w-full">
    {#each players.slice(5, 10) as player (player.id)}
      <div class="flex flex-row items-center gap-3 my-1">
        <div class="w-[256px] flex justify-end" style="background-color: {DOTA_DIRE_PLAYER_COLORS[+player.id.split('-')[1] % 5]}">
          <img class="pl-3 w-[256px]" src={`/portraits/${formatHeroName(player.hero)}.png`} alt={player.hero} />
        </div>

        <div class="flex flex-col w-[200px] ml-2 justify-center">
          <h1 class="font-bold">{player.name}</h1>
          <h1>LVL {player.hero_stats.level} {formatHeroName(player.hero).toUpperCase()}</h1>
        </div>

        <div class="flex flex-col m-2 text-center">
          <h1>PLJ</h1>
          <span>{formatNumber(player.net_worth)}</span>
          <h1>Ouro</h1>
          <span>{formatNumber(player.player_stats.gold)}</span>
        </div>

        <div class="flex flex-col m-2 text-center">
          <h1>FIN/NEG</h1>
          <span>{player.player_stats.last_hits}/{player.player_stats.denies}</span>
        </div>

        <div class="flex flex-col m-2 text-center">
          <h1>OPM</h1>
          <span>{formatNumber(player.gpm)}</span>
          <h1>EXP</h1>
          <span>{formatNumber(player.xpm)}</span>
        </div>

        <!-- ITENS EM GRID -->
        <div class="grid grid-cols-3 grid-rows-2 gap-1 m-2">
          {#each [0,1,2,3,4,5] as slot}
            {#if setItem(player.hero_items[`slot${slot}`])}
              <img class="h-[48px] w-[64px] border bg-black" src={setItem(player.hero_items[`slot${slot}`])} alt="item" />
            {/if}
          {/each}
        </div>

        <!-- ITEM NEUTRO -->
        {#if setItem(player.hero_items.neutral0)}
          <img class="h-[48px] w-[48px] rounded-full bg-black object-cover" src={setItem(player.hero_items.neutral0)} alt="neutral item" />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .text-shadow {
    text-shadow: 1px 1px 3px black;
  }
</style>
