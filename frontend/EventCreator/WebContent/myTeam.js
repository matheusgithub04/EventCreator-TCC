var modalAddParticipant = document.querySelector('.modalAddParticipant')
var modalSearch = document.querySelector('.container-modal-add')
var closeModal = document.querySelector('.closeModal')

modalAddParticipant.addEventListener('click', (e) => {
    modalAddParticipant.style.display = 'none'
    modalSearch.style.display = 'none'
    closeModal.style.display = 'none'
})

document.querySelector('.divBack').addEventListener('click', () => {
    window.history.back();
})

closeModal.addEventListener('click', (e) => {
    modalAddParticipant.style.display = 'none'
    modalSearch.style.display = 'none'
    closeModal.style.display = 'none'
})

var addPlus = document.querySelector('.addPlus')

addPlus.addEventListener('click', (e) => {
    modalAddParticipant.style.display = 'flex'
    modalSearch.style.display = 'flex'
    closeModal.style.display = 'flex'
})

var time = null
var arrayGlobal = []

document.addEventListener('keypress', (key) => {
    if(modalAddParticipant.style.display == 'flex') {
        clearTimeout(time);
        time = null
        
        time = setTimeout(() => {
            addParticipante()
        }, 600);
    }
})

window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', async function() {
        if (this.files && this.files[0]) {
            var img = document.querySelector('.image');  // $('img')[0]
            var url = URL.createObjectURL(this.files[0])
            img.style.backgroundImage = `url('${url}')`
            alert('Infelizmente a alteracao de foto esta funcionando apenas no aplicativo.')
            // var dataForm = new FormData()   

            // dataForm.append('cpf', 45555)
            // dataForm.append('file', {
            //     uri : String(url),
            //     type: this.files[0].type,
            //     name: this.files[0].name,
            // });
            //     console.log(dataForm)

            // for (var key of dataForm.entries()) {
            //     console.log(key[0] + ', ' + key[1])
            // }
        }
    });
  });

async function addParticipante(){
    var inputSearch = document.querySelector('.input-add-participantes')
    var usuarios = []
    var myInit = {  
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({   
                query: inputSearch.value,
                type: !Number(inputSearch.value) ? "name": "CPF"
            })
        };
        
    await fetch('http://'+ip+':3516/listParticipants', myInit).then(blob => blob.json())
    .then(data => usuarios = data)

    console.log(usuarios)

    document.querySelector('.scrollview-participantes').innerHTML=''

    usuarios.map(user => {
        var divParticipante = document.createElement('div')
        divParticipante.id = `participante`
        divParticipante.className = user.id_users
    
        var divImage = document.createElement('div')
        divImage.className = 'image-participante'
        divImage.id = user.id_users
        divImage.style.backgroundImage = "url('http://"+ip+":3516/files/"+user.uri+"')"
    
        var viewConjuct = document.createElement('div')
        viewConjuct.className = 'view-conjuct'
        viewConjuct.id = user.id_users
    
        var cpf = document.createElement('div')
        cpf.innerHTML = user.cpf
        cpf.id = user.id_users
    
        var name = document.createElement('div')
        name.innerHTML = user.nome
        name.id = user.id_users

        viewConjuct.appendChild(cpf)
        viewConjuct.appendChild(name)

        divParticipante.appendChild(divImage)
        divParticipante.appendChild(viewConjuct)
        document.querySelector('.scrollview-participantes').appendChild(divParticipante)

        divParticipante.addEventListener('click', (e) => {
            if(!arrayGlobal.includes(e.target.id)){
                arrayGlobal.push(e.target.id)
                document.getElementsByClassName(e.target.id)[0].style.border = '2px solid #0f0'
                console.log(arrayGlobal)
            }else if(arrayGlobal.includes(e.target.id)){
                document.getElementsByClassName(e.target.id)[0].style.border = '1px solid black'
                arrayGlobal = arrayGlobal.filter(item => item != e.target.id)
                console.log(arrayGlobal)
            }
        })
    })

    document.querySelector('.btSubmitAdd').addEventListener('click', async () => {
        if(arrayGlobal.length == 0){
            return alert('Selecione algum usuario.')
        }
        
        var myInit = {  
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({   
                participantes: arrayGlobal,
                id_team: idTeam
            })
        };
        
        await fetch('http://'+ip+':3516/cadParticipant', myInit).then(blob => blob.json())
        .then(data => {
            document.querySelector('.participantes').innerHTML = `
            <div class="addPlus" id="addParticipante">
                <i class="fa fa-plus-circle add w3-xxxlarge" aria-hidden="true"></i>
            </div>
            `
            document.querySelector('.scrollview-participantes').innerHTML=''
            arrayGlobal = []
            loadTeam()
            modalAddParticipant.style.display = 'none'
            modalSearch.style.display = 'none'
            closeModal.style.display = 'none'
            document.location.reload(true);
        })
    })
}

// const {data} = await api.post('/cadParticipant', {
//     participantes: addParticipant,
//     id_team: IdEvento //MUDAR
// })

// if(data.length != 0){
//     setAddParticipant(new Array())
//     handleSearchUsers()
//     setValueOfRequest('')
//     if(data.erro){
//         return alert(data.erro)
//     }
//     setModalSearch(false)
//     setParticipantes(data)
// }