<script lang="ts">
  import { subscribers, send } from "./WebSocket";
  import { images } from "./images";

  subscribers.push((message) => {
    if (message.data[0] === "[") {
      card = JSON.parse(message.data);
      numCards += 1;
    }
  });

  function pickSymbol(s: number) {
    send(JSON.stringify(s));
  }
  let card = [58, 58, 58, 58, 58, 58, 58, 58];
  let numCards = 0;
</script>

<p>Cards: {numCards}</p>
<div class="card">
  {#each card as symbol, i (symbol * 100 + i)}
    <img
      alt=""
      src={`svgs/${images[symbol]}`}
      class={`img${i} color${symbol % 8}`}
      on:click={() => pickSymbol(symbol)}
    />
  {/each}
</div>

<style>
  .center-text {
    text-align: center;
  }
  .card {
    max-height: 100%;
    max-width: 100%;
    max-height: 100%;
    width: min(70vh, 90vw);

    aspect-ratio: 1;
    padding: 0;
    transform: translateZ(0);
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    box-shadow: 0 0 100px -20px rgba(0, 0, 0, 0.25);
  }
  img {
    width: 23%;
    height: 23%;
    object-fit: contain;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
  }
  .img1 {
    left: 43.6%;
    top: 13.8%;
  }
  .img2 {
    left: 69.2%;
    top: 75.6%;
  }
  .img3 {
    left: 39.6%;
    top: 81.2%;
  }
  .img4 {
    left: 83.8%;
    top: 50.4%;
  }
  .img5 {
    left: 17.4%;
    top: 61.2%;
  }
  .img6 {
    left: 19%;
    top: 34%;
  }
  .img7 {
    left: 48.8%;
    top: 50.4%;
  }
  .img0 {
    left: 70.8%;
    top: 24.6%;
  }
  .color0 {
    filter: invert(50%) sepia(100%) saturate(1000%) hue-rotate(51deg)
      brightness(100%) contrast(100%);
  }
  .color1 {
    filter: invert(50%) sepia(100%) saturate(1000%) hue-rotate(103deg)
      brightness(100%) contrast(100%);
  }
  .color2 {
    filter: invert(50%) sepia(100%) saturate(1000%) hue-rotate(154deg)
      brightness(100%) contrast(100%);
  }
  .color3 {
    filter: invert(50%) sepia(100%) saturate(1000%) hue-rotate(206deg)
      brightness(100%) contrast(100%);
  }
  .color4 {
    filter: invert(50%) sepia(100%) saturate(1000%) hue-rotate(257deg)
      brightness(100%) contrast(100%);
  }
  .color5 {
    filter: invert(50%) sepia(100%) saturate(1000%) hue-rotate(309deg)
      brightness(100%) contrast(100%);
  }
  .color6 {
    filter: invert(50%) sepia(100%) saturate(1000%) hue-rotate(360deg)
      brightness(100%) contrast(100%);
  }
</style>
