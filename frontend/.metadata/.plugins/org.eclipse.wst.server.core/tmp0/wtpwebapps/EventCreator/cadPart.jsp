<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Time</title>
<link href="./myTeam.css" rel="stylesheet" />
<link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">
<link rel="stylesheet" href="./font-awesome-4.7.0/css/font-awesome.min.css">
</head>
<body>
    <div class="divBack">
        <div class="btBack">Voltar</div>
    </div>
    <div class="container">
        <div class="nameTeam">
            
        </div>
        <div class="imageTeam">
            <label class="image"><input type='file' class="input-file" /></label>
            <div class="wins">
                <div class="numberWin">0</div>
                <div class="textVictory">Vitórias</div>
            </div>
        </div>
        <div class="nameOrg">
        </div>
        <div class="borders"></div>
        <div class="participantes">
            <div class="addPlus" id="addParticipante">
                <i class="fa fa-plus-circle add w3-xxxlarge" aria-hidden="true"></i>
            </div>
        </div>
    </div>

    <div class="modalAddParticipant"></div>
    <div class="container-modal-add">
        <div class="input-add-participante" >
            <input class="input-add-participantes" type="text">
            <i class="fa fa-search w3-xlarge search" aria-hidden="true"></i>
        </div>

        <div class="scrollview-participantes">
            <!-- <div id="participante">
                <div class="image-participante"></div>
                <div class="view-conjuct">
                    <div>455.230.078-46</div>
                    <div>David Tolentino Alves Frota</div>
                </div>
            </div>
            <div id="participante">
                <div class="image-participante"></div>
                <div class="view-conjuct">
                    <div>455.230.078-46</div>
                    <div>David Tolentino Alves Frota</div>
                </div>
            </div>
             -->
        </div>

        <div class="btSubmitAdd">
            Adicionar participantes
        </div>
    </div>
    <div class="closeModal">
        <i class="fa fa-chevron-left w3-xxxlarge" aria-hidden="true"></i>
    </div>
    <script>
        var idTeam = 1
        var jsp = <%= (session.getAttribute("user") != null) ? session.getAttribute("user").toString() : "{Users{id_users: 1}" %>
        var usuario = jsp.Users.id_users
        var ip = "187.111.222.107"
        var dono = false
    </script>
    <script src="myTeam.js"></script>
    <script src="myTeamRequests.js"></script>
</body>
</html>