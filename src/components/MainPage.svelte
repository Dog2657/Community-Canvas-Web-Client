<script>
    import { sourceCanvas, notifier } from '../lib/data'

    let canvas
</script>

<canvas bind:this={canvas}></canvas>

<style lang="scss">
    :global(body){
        overflow: hidden;
    }

    canvas{
        margin: 0;
        inset: 0;
        width: 100vw;
        height: 100vh;
    }
</style>