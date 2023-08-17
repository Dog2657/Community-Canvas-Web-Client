<script lang="ts">
    let element: HTMLDialogElement

    let input: HTMLInputElement

    let X = 0
    let Y = 0

    export function show(x: number, y: number, rgb: Array<number>){
        X = x
        Y = y

        const r = rgb[0].toString(16)
        const g = rgb[1].toString(16)
        const b = rgb[2].toString(16)

        input.value = `#${ (r == '0')? '00':r }${ (g == '0')? '00':g }${ (b == '0')? '00':b }`

        element.showModal()
    }

    function onPlace(){

        const color = input.value

        var red = parseInt(color[1] + color[2], 16);
        var green = parseInt(color[3] + color[4],16);
        var blue = parseInt(color[5] + color[6],16);

        fetch(`http://localhost:80/update?x=${X}&y=${Y}&red=${red}&green=${green}&blue=${blue}`, {method: "post"})
    }
</script>

<dialog bind:this={element}>
    <button on:click={() => { element.close() }}>Exit</button>
    
    <input bind:this={input} type="color" name="" id="">

    <form method="dialog" on:submit={onPlace}>
      <button>Place pixel</button>
    </form>
</dialog>

<style lang="scss">
    dialog{
        border-radius: 25px;
        min-height: 300px;
        max-height: 100vh;
        max-width: 100vw;
        min-width: 300px;
        border: none;

        &::backdrop {
            background-color: rgba(0, 0, 0, 0.491);
        }
    }
</style>