window.onload = async () => {
    loadTeam()
    
}

async function loadTeam() {
    var participantes = []
    var team = []
    
    var myInit = {  
        method: 'GET',
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    };
    sim = false
    await fetch('http://'+ip+':3516/searchTeam/'+usuario, myInit).then(blob => blob.json())
    .then(data => {
        if(data && !data.erro){
            console.log(data)
            participantes = data.Participants
            team = data.Teams
            idTeam = team.id_time
            sim = true
        }else{
            sim = false
            alert('Voce nao possui um time.')
            let container = document.querySelector('.container')
            var containerInitial = container.innerHTML
            container.style.justifyContent = 'center'
            container.style.border = '1px solid white'
            container.innerHTML = `
                <div class="nmTime">Nome do time</div>
                <input class="nmTeam"/>
                <div class="createTeam">Criar time</div>
            `

            document.querySelector('.createTeam').addEventListener('click', async () => {
                var myInit = {  
                    method: 'POST',
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                        nome_time: document.querySelector('.nmTeam').value, 
                        id_part: usuario, 
                        id_event: null,
                        modalidade: "futebol",
                        ver: 3
                    })
                };
                
                await fetch(`http://${ip}:3516/cadTeam`, myInit).then(blob => blob.json())
                .then(data => {
                    if(data){
                        let container = document.querySelector('.container')
                        container.innerHTML = containerInitial
                        loadTeam()
                        document.location.reload(true);
                    }
                })
            })
        }
    })

    if(sim){
        document.querySelector('.numberWin').innerHTML = team.wins

        document.querySelector('.image').style.backgroundImage = "url('http://"+ip+":3516/files/"+team.uri+"')"
        document.querySelector('.nameTeam').innerHTML = team.nome_time
        
        const org = participantes.filter(item => item.id_part == team.id_part);

        if(org[0].id_part == usuario){
            dono = true
            document.querySelector('.nameTeam').innerHTML = team.nome_time+ '     ' + '<i class="fa fa-pencil-square-o altName" style="cursor: pointer;" aria-hidden="true"></i>'
        }

        document.querySelector('.nameOrg').innerHTML = org[0].user.nome

        var divParticipantes = document.querySelector('.participantes')
        var divAdd = document.querySelector('.addPlus')
        
        participantes.map(part => {
            var div = document.createElement('div')
            div.className='participante'
            div.style.backgroundImage = "url('http://"+ip+":3516/files/"+part.user.uri+"')"
            divParticipantes.appendChild(div)
        })

        divParticipantes.removeChild(divAdd)
        divParticipantes.appendChild(divAdd)
        
        if(dono == false) {
            divParticipantes.removeChild(divAdd)
        }else{
            divParticipantes.appendChild(divAdd)
        }   

        alterName()

        function alterName(){
            document.querySelector('.altName').addEventListener('click', () => {
                document.querySelector('.nameTeam').innerHTML = '<input class="alterNameTeam" />'
                document.querySelector('.nameTeam').addEventListener('keydown', async (e) => {
                    if(e.key == 'Enter'){
                        clearTimeout(time);
                        time = null
                        var myInit = {  
                            method: 'GET',
                            mode: "cors",
                            headers: {
                                "Content-Type": "application/json; charset=utf-8",
                            },
                        };
                        let nome = document.querySelector('.alterNameTeam').value
                        var nomeAlterado = ''
                        await fetch(`http://${ip}:3516/team/${idTeam}/${nome}`, myInit).then(blob => blob.json())
                        .then(data => {
                            if(data){
                                nomeAlterado = data.nome_time
                            }
                        })
                        document.querySelector('.nameTeam').innerHTML = nomeAlterado+ '     ' + '<i class="fa fa-pencil-square-o altName" style="cursor: pointer;" aria-hidden="true"></i>'
                        alterName()
                    }else {
                        clearTimeout(time);
                        time = null
                        
                        time = setTimeout(async () => {
                            
                            var myInit = {  
                                method: 'GET',
                                mode: "cors",
                                headers: {
                                    "Content-Type": "application/json; charset=utf-8",
                                },
                            };
                            let nome = document.querySelector('.alterNameTeam').value
                            var nomeAlterado = ''
                            await fetch(`http://${ip}:3516/team/${idTeam}/${nome}`, myInit).then(blob => blob.json())
                            .then(data => {
                                if(data){
                                    nomeAlterado = data.nome_time
                                }
                            })

                            document.querySelector('.nameTeam').innerHTML = nomeAlterado+ '     ' + '<i class="fa fa-pencil-square-o altName" style="cursor: pointer;" aria-hidden="true"></i>'
                            alterName()
                        }, 1000);
                    }
                })
            })
        }
    }
}
