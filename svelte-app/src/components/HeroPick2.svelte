<script>
  export let hero_name;
  export let width = 147;
  export let height = 100;
  export let class: className = "";

  let videoExists = true;

  const baseUrl = "https://dota2-gsi-master-online.onrender.com";
  const heroVideoSrc = `${baseUrl}/videos/npc_dota_hero_${hero_name}.webm`;
  const pickingVideoSrc = `${baseUrl}/assets/dota2_logo_animated.mp4`;
  const fallbackImageSrc = `${baseUrl}/assets/dota2_logo_static.png`;

  function handleVideoError() {
    videoExists = false;
  }

  function handleVideoCanPlay() {
    videoExists = true;
  }
</script>

{#if hero_name !== "none" && hero_name !== "picking" && videoExists}
  <div class={`media-container ${className}`} style="width: {width}px; height: {height}px;">
    <video
      autoplay
      muted
      loop
      playsinline
      on:error={handleVideoError}
      on:canplay={handleVideoCanPlay}
      class="media-video fade-in"
      style="width: {width}px; height: {height}px;"
    >
      <source src={heroVideoSrc} type="video/webm" />
    </video>
  </div>
{:else if hero_name === "picking"}
  <div class={`media-container ${className}`} style="width: {width}px; height: {height}px;">
    <video
      autoplay
      muted
      loop
      playsinline
      class="media-video fade-in"
      style="width: {width}px; height: {height}px;"
    >
      <source src={pickingVideoSrc} type="video/mp4" />
    </video>
  </div>
{:else}
  <div class={`media-container ${className}`} style="width: {width}px; height: {height}px;">
    <img
      src={fallbackImageSrc}
      alt="Fallback Dota2 Logo"
      class="media-image fade-in"
      style="width: {width}px; height: {height}px;"
    />
  </div>
{/if}

<style>
  .media-container {
    background-color: black;
    border-radius: 12px;
    overflow: hidden;
    user-select: none;
  }

  .media-video,
  .media-image {
    display: block;
    object-fit: cover;
    border-radius: 12px;
    width: 100%;
    height: 100%;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in forwards;
  }
</style>
