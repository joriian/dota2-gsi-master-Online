<script>
  export let hero_name;
</script>

{#if hero_name == "banning" && hero_name != "none"}
  <div class="relative w-full h-full bg-red-600 animate-fade-in rounded-[12px] overflow-hidden">
    <div class="banning-inner-shadow absolute inset-0 bg-red-600 opacity-60"></div>
    <img
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[80%] h-[28px] pulse"
      src="https://dota2-gsi-master-online.onrender.com/assets/cross.png"
      alt="cross"
      onerror="this.style.display='none'"
    />
    <p class="banning-font tracking-[.25em] absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center mb-[4px] text-white text-[10px] font-bold pulse">
      BANNING
    </p>
  </div>
{:else if hero_name == "none" && hero_name != "banning"}
  <div class="relative w-full h-full bg-red-600 animate-fade-in rounded-[12px] overflow-hidden">
    <img class="h-[55px] w-full grayscale"
      src="https://dota2-gsi-master-online.onrender.com/portraits/black_image.png"
      alt=""
    />
    <div class="absolute inset-0 bg-red-950 opacity-60 rounded-[12px]"></div>
  </div>
{:else}
  <div class="relative w-full h-full bg-red-600 rounded-[12px] overflow-hidden">
    <img
      class="h-[55px] w-full grayscale contrast-125 animate-fade-in"
      src={`https://dota2-gsi-master-online.onrender.com/assets/portraits/${hero_name}.png`}
      alt=""
    />
    <div class="slash"></div>
    <div class="inner-shadow absolute inset-0 bg-red-600 opacity-30 rounded-[12px]"></div>
  </div>
{/if}

<style>
  .inner-shadow {
    box-shadow: inset 0 0 24px 10px #000000;
  }
  .banning-inner-shadow {
    box-shadow: inset 0 0 24px 10px #000000;
  }

  .slash::before {
    content: "";
    position: absolute;
    top: -28px;
    right: 48px;
    height: 110px;
    width: 4px;
    background: red;
    transform: rotate(65deg);
    animation: slash-animation 5s forwards;
  }

  @keyframes slash-animation {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }

  @keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }

  .animate-fade-in {
    animation: fadeIn 0.2s ease-in;
  }

  @keyframes fadeIn {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  .banning-font {
    font-family: "Radiance_regular", sans-serif;
  }
</style>
