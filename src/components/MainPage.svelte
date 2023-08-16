<script>
    import { getLocationFromOldScale, getRelativeLocationFromAbsolute, getAbsoluteLocationFromRelative, isOnCanvas } from '../lib/calculator'
    // @ts-ignore
    import { sourceCanvas, config, notifier } from '../lib/data'
    import { onMount } from 'svelte';

    let canvas

    let location = {x: 0, y: 0}

    let scale = 1
    let scalePoint = {x: 150, y: 100}

    async function render(){
        var ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const boardWidth = scale * ((await config).minDisplay.width)
        const boardHeight = scale * ((await config).minDisplay.height)

        ctx.drawImage(await sourceCanvas, 
            location.x,
            location.y,
            boardWidth,
            boardHeight
        )

        const {x, y} = getActivePixal()

        ctx.strokeStyle = 'orange'
        ctx.lineWidth = 2
        ctx.beginPath();
        ctx.rect(x, y, (scale/10) - 2, (scale/10) - 2);
        ctx.stroke();
    }

    async function updatePixel(event){
        var ctx = (await sourceCanvas).getContext("2d");

        const {location, value} = JSON.parse(event.data)

        ctx.fillStyle = `rgb(${value.r}, ${value.g}, ${value.b})`

        console.log('update')

        ctx.beginPath();
        ctx.rect(location.x, location.y, 1, 1);
        ctx.fill();

        render()
    }
    

    function getActivePixal(){
        return getAbsoluteLocationFromRelative(
            Math.floor(scalePoint.x * 10) / 10,
            Math.floor(scalePoint.y * 10) / 10,
            scale, location
        )
    }

    function zoom(e){
        e.preventDefault()

        const direction = Math.sign(e.deltaY)
        const multiplyer = scale * 0.05;
        
        if(direction > 0){//Out
        if(scale < 1)
            return
        
        location = getLocationFromOldScale(scale - multiplyer, scale, location, scalePoint)
        scale -= multiplyer

        }else{//In
        if(scale >= 750)
            return

        location = getLocationFromOldScale(scale + multiplyer, scale, location, scalePoint)
        scale += multiplyer
        }

        render()
    }

    function startDrag({clientX, clientY, originalTarget}){
        var startVertical = clientY - (canvas.offsetTop + location.y);
        var startHorizontal = clientX - (canvas.offsetLeft + location.x);

        canvas.style.cursor = 'grabbing'

        function calcMove({clientX: x, clientY: y}){
            x -= canvas.offsetLeft + startHorizontal
            y -= canvas.offsetTop + startVertical

            location = {x, y}

            render()
        }

        originalTarget.addEventListener('mousemove', calcMove)
        window.addEventListener('mouseup', () => {

        canvas.style.cursor = ''
        originalTarget.removeEventListener('mousemove', calcMove)

        }, {once: true})
    }

    async function handleClick({clientX, clientY}){
        if(!isOnCanvas(clientX, clientY, scale, location, (await config).minDisplay))
        return

        let {x, y} = getRelativeLocationFromAbsolute(clientX, clientY, scale, location)

        x *= 10
        y *= 10

        x = Math.floor(x)
        y = Math.floor(y)


        fetch(`http://localhost:80/update?x=${x}&y=${y}&red=255&green=0&blue=0`, {method: "post"})
    }

    function handleMouseEvents(e){
        let dragTimer;

        dragTimer = setTimeout(() => {
            dragTimer = null
            startDrag(e)
        }, 200);


        window.addEventListener('mouseup', () => {
            if(dragTimer === null)return

            clearTimeout(dragTimer)
            handleClick(e)
        }, {once: true})
    }

    async function updateScalePoint({clientX, clientY}){
        if(!isOnCanvas(clientX, clientY, scale, location, (await config).minDisplay))
        return

        scalePoint = getRelativeLocationFromAbsolute(clientX, clientY, scale, location)
        render()
    }


    onMount(async () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight 

        location.x = (window.innerWidth/2) - (150 * scale);
        location.y = (window.innerHeight/2) - (100 * scale);

        (await notifier).addEventListener("message", updatePixel);

        render()
    })
  
</script>

<svelte:window on:resize={() => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight 

    render()
}}/>

<canvas bind:this={canvas} on:mousemove={updateScalePoint} on:wheel={zoom} on:mousedown={handleMouseEvents}></canvas>

<style lang="scss">
    :global(body){
        overflow: hidden;
    }
</style>