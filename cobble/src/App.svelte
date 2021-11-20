<script lang="ts">
  import { onMount } from "svelte";
  import { subscribers, send } from "./WebSocket";
  let showStartButton = false;

  import Card from "./card.svelte";
  onMount(() => {
    const isRoom = window.location.hash.endsWith("room");
    if (isRoom) {
      send("addRoom");
    } else {
      send("addPlayer");
    }
    showStartButton = isRoom;
  });
  subscribers.push((message) => {
    if (!isNaN(parseInt(message.data, 10))) {
      numPlayers = parseInt(message.data, 10);
    }
    if (message.data[0] === "[") {
      showStartButton = false;
    }
  });
  function startGame() {
    send("start");
  }
  let numPlayers = 0;
</script>

<div class="center">
  {#if showStartButton}
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
