var event = {}
var matches = []
var vencedor = {}

window.onload = () => {
    var buttonsModal = document.querySelectorAll('#infobutton')
    var closeModal = document.querySelector('.closeModal')

    closeModal.addEventListener('click', open => {modal(false)})

    for(let i = 0; i < buttonsModal.length; i++){
        buttonsModal[i].addEventListener('click', (e) => {
            var btTarget = e.path[1]

            id_event = btTarget.innerHTML.split('<')
            if(id_event[2].includes('label')){
                id_event = "<"+id_event[11]+"</p>"
            }else{
                id_event = "<"+id_event[9]+"</p>"
            }

            function contains(target, pattern){
                var value = ""
                for(var i = 0; i < target.length; i++) {
                    for(var j = 0; j < pattern.length; j++) {
                        if(!target[i].includes(pattern[j])){
                            if(Number(target[i]) || Number(target[i]) == 0){
                                value = value +''+ target[i]
                                j = pattern.length
                            }
                        }
                    }
                }
                
                return value
            }
            pattern = ['p', '<', 'h', 'i', 'd', '/']
            id_event = contains(id_event, pattern)

            requestEvent(id_event)
        })
    }
}

function modal(type){
    var opc = document.querySelector('.opcModal')
    var Modal = document.querySelector('.Modal')
    var closeModal = document.querySelector('.closeModal')

    if(type){
        opc.style.display = 'flex'
        closeModal.style.display = 'flex'
        Modal.style.display = 'flex'
    }else{
        opc.style.display = 'none'
        closeModal.style.display = 'none'
        Modal.style.display = 'none'
    }
}

async function requestEvent(id) {
    var myInit = {  
        method: 'POST',
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({})
    };
    
    await fetch(`http://${ip}:3516/event/matches/${id}`, myInit).then(blob => blob.json())
    .then(data => {
        if(data){
            console.log(data)
            event = data.Events
            matches = data.Matches
            vencedor = data.Vencedor
            modalidade = data.Events.modalidade
            modal(true)
        }
    })

    if(event){
        var nomeOrg = event.users.nome
        var urlImg = event.users.uri

        var img = document.querySelector('.orgImage')
        img.style.backgroundImage = `url('http://${ip}:3516/files/${urlImg}')`

        var name = document.querySelector('.nameOrg')
        name.innerHTML = nomeOrg

        boxControl = document.querySelectorAll('#boxControlAct')

        boxControl[0].addEventListener('click', handleLogin)
        boxControl[1].addEventListener('click', handleDelete)

        dono = event.id_org
        
        if(dono == id_user){
            stopFunc(boxControl[0], boxControl[0])
            startFunc(boxControl[1], boxControl[1], 'delete')
            boxControl[0].style.display = 'none'
            return
        }else{
            boxControl[0].style.display = 'flex'
        }

        if(matches.length >= (event.qtdParticipantes/2)){
            stopFunc(boxControl[0], boxControl[1])
            return
        }

        if(vencedor) {
            stopFunc(boxControl[0], boxControl[1])
            return
        }
        boxControl[0].style.cursor= 'pointer'
        boxControl[1].style.cursor= 'pointer'
        boxControl[0].style.display = 'flex'


        await fetch(`http://${ip}:3516/team/${id}`, {method: 'GET'}).then(blob => blob.json())
        .then(data => {
            if(data){
                if(data.length == 0){
                    stopFunc(boxControl[1], boxControl[1])
                    return
                }
    
                const newArray = data.filter(item => item.id_part == id_user);
    
                if(newArray.length != 0){
                    stopFunc(boxControl[0], boxControl[0])
                }else{
                    stopFunc(boxControl[1], boxControl[1])
                }
            }
        })

    }
}

async function handleLogin() {
    if(!confirm('Deseja entrar no evento?')){
        return
    }
    if(modalidade == 'LUTA'){
        var myInit = {  
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                nome_time: "roi?", 
                id_part: id_user, 
                id_event: id_event,
                modalidade: 'luta',
                ver: 1
            })
        };
        
        await fetch(`http://${ip}:3516/cadTeam`, myInit).then(blob => blob.json())
        .then(data => {
            if(data){
                console.log(data)
                stopFunc(boxControl[0], boxControl[1])
                startFunc(boxControl[0], boxControl[1], 'delete')
            }
        })
    }else{
        var myInit = {  
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                id: id_user,
                id_event: id_event,
                modalidade: 'Futebol'
            })
        };
        
        await fetch(`http://${ip}:3516/verification/team`, myInit).then(blob => blob.json())
        .then(data => {
            if(data.erro){
                return alert(data.erro)
            }

            if(data.error){
                return alert(data.error)
            }

            if(data){
                console.log(data)
                stopFunc(boxControl[0], boxControl[1])
                startFunc(boxControl[0], boxControl[1], 'delete')
            }
        })
    }
}

async function handleDelete() {
    if(dono == id_user) {
        if(!confirm('Tem certeza que quer deletar este evento?')){
            return
        }

        var myInit = {  
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                id_org: id_user
            })
        };
        
        await fetch(`http://${ip}:3516/event/delete/${id_event}`, myInit).then(blob => blob.json())
        .then(data => {
            if(data === null) {
                document.location.reload(true);
            }else{
                alert('Não foi possivel deletar')
            }
        })

        if(data === null) {
            navigation.goBack()
        }else{
            alert('Não foi possivel deletar')
        }

    }else{
        if(modalidade == 'LUTA') {
            if(!confirm('Deseja sair do evento?')){
                return
            }
            var myInit = {  
                method: 'POST',
                mode: "cors",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    modalidade: 'luta'
                })
            };
            
            await fetch(`http://${ip}:3516/team/delete/${id_user}/${id_event}`, myInit).then(blob => blob.json())
            .then(data => {
                if(data){
                    console.log(data)
                    stopFunc(boxControl[0], boxControl[1])
                    startFunc(boxControl[0], boxControl[1], 'login')
                }
            })
        }else{
            if(!confirm('Deseja sair do evento?')){
                return
            }
            var myInit = {  
                method: 'POST',
                mode: "cors",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    modalidade: 'luta'
                })
            };

            id_event = id_event.replace(' ', '')
            await fetch(`http://${ip}:3516/team/futebol/${id_user}/${id_event}`, myInit).then(blob => blob.json())
            .then(data => {
                if(data){
                    console.log(data)
                    stopFunc(boxControl[0], boxControl[1])
                    startFunc(boxControl[0], boxControl[1], 'login')
                }
            })
        }
    }
}

function stopFunc(log, del){
    log.style.cursor= 'default'
    del.style.cursor= 'default'
    log.removeEventListener('click', handleLogin)
    del.removeEventListener('click', handleDelete)
}

function startFunc(log, del, type = 6){
    if(type == 'login'){
        log.style.cursor= 'pointer'
        log.addEventListener('click', handleLogin)
    }else if(type == 'delete'){
        del.style.cursor= 'pointer'
        del.addEventListener('click', handleDelete)
    }else{
        log.style.cursor= 'pointer'
        log.addEventListener('click', handleLogin)
        del.style.cursor= 'pointer'
        del.addEventListener('click', handleDelete)
    }
}