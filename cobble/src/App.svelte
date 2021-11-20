<script lang="ts">
  import { onMount } from "svelte";
  import { subscribers, send } from "./WebSocket";
  let isRoom = false;

  import Card from "./card.svelte";
  onMount(() => {
    isRoom = window.location.hash.endsWith("room");
  });
  subscribers.push((message) => {
    if (!isNaN(parseInt(message.data, 10))) {
      numPlayers = parseInt(message.data, 10);
    }
  });
  function startGame() {
    send("start");
    isRoom = false;
  }
  let numPlayers = 0;
</script>

<div class="center">
  {#if isRoom}
    <div class="center-text">
      <p>{numPlayers} devices connected</p>
      <button on:click={startGame}>Start game!</button>
    </div>
  {/if}
  <Card />
</div>

<style>
  .center-text {
    text-align: center;
  }
  .center {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
