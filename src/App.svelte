<script> 
  import ErrorPage from './components/ErrorPage.svelte';
  import LoadingPage from './components/LoadingPage.svelte';
  import MainPage from './components/MainPage.svelte';
  // @ts-ignore
  import { config, notifier, sourceCanvas } from './lib/data'
  
  const loadingPromises = [config, notifier, sourceCanvas]
</script>

{#await Promise.all(loadingPromises)}
  <LoadingPage/>
{:then}
  <MainPage/>
{:catch error}
  <ErrorPage/>
{/await}