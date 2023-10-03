<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style>
  html, body, dialog {
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    font-size: var(--text-base-size);
    background-color: var(--contrast-gray-100);
    color: var(--contrast-foreground);
  }

  .app {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--space-md);
  }

  .app > * {
    flex-grow: 1;
  }

  @media(max-width: 400px){
    .app {
      padding: var(--space-xs);
    }
  }
</style>
