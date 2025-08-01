const btn = document.querySelector(".btn");
    btn.addEventListener('mouseover', (event)=>{
        const x = event.pageX - btn.offsetLeft;
            const y = event.pageY - btn.offsetTop;

        btn.style.setProperty('--x', x + 'px');
        btn.style.setProperty('--y', y + 'px');
    })