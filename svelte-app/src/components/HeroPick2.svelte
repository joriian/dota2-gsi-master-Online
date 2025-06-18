<script>
  export let hero_name;
  export let width = 147;
  export let height = 100;
</script>

{#if hero_name != "none" && hero_name != "picking"}
  <div class="w-full h-full bg-black rounded-video">
    <video
      autoplay
      muted
      loop
      class="object-fill animate-fade-in video-rounded"
      style="width: {width}px; height: {height}px;"
    >
      <source src={`public/videos/npc_dota_hero_${hero_name}.webm`} type="video/webm" />
    </video>
  </div>
{:else if hero_name == "picking"}
  <div class="w-full h-full bg-black rounded-video">
    <video
      autoplay
      muted
      loop
      class="object-fill transition ease-in-out video-rounded"
      style="width: {width}px; height: {height}px;"
    >
      <source src="assets/dota2_logo_animated.mp4" type="video/webm" />
    </video>
  </div>
{:else}
  <div class="w-full h-full bg-black rounded-video">
    <video
      autoplay
      muted
      loop
      class="object-fill transition grayscale ease-in-out video-rounded"
      style="width: {width}px; height: {height}px;"
    >
      <source src="assets/dota2_logo_animated.mp4" type="video/webm" />
    </video>
  </div>
{/if}

<style>
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-in;
  }

  .video-rounded {
    border-radius: 12px;
    overflow: hidden;
  }

  .rounded-video {
    border-radius: 12px;
    overflow: hidden;
  }
</style>
