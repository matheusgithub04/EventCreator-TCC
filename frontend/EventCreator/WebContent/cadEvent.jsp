<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="UTF-8"
    import="java.net.*"
    import="java.io.*"
    import="org.json.*"
    import="java.lang.Object.*"
%>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>Cadastro de evento</title>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="jQuery Mask/jquery.mask.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">
<link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link rel="shortcut icon" type="image/x-icon" href="img/ico.png">
<style>
    @import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

    #navbar {
        background-color: #ff1040;
    }

    .body {
        background-color: #333333;
        padding: 0%;
        font-family: sans-serif;
        background-size: cover;
    }

    .login-box {
        width: 980px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: black;
    }

    .login-box h1 {
        float: left;
        font-size: 40px;
        border-bottom: 6px solid #ff1040;
        color: white;
        margin-bottom: 50px;
        padding: 13px 0;
        display: block;
        width: 100%;
        margin-bottom: 4px;
        flex-grow: 1;
        flex-direction: column;
    }

    .textbox {
        width: 100%;
        overflow: hidden;
        font-size: 20px;
        padding: 8px 0;
        margin: 8px 0;
        border-bottom: 1px solid #ff1040;
    }

    i {
        color: white;
        height: 20px;
        text-align: center;

    }
    .secondCont input {
        border: none;
        outline: none;
        background: none;
        color: white;
        font-size: 18px;
        margin: 0 10px;
    }
    .threeCont input {
        border: none;
        outline: none;
        background: none;
        color: white;
        font-size: 18px;
        margin: 0 10px;
    }
    .firstCont input {
        border: none;
        outline: none;
        background: none;
        color: white;
        font-size: 18px;
        margin: 0 10px;
    }

    .btn {
        width: 60%;
        text-align: center;
        background: none;
        border: 2px solid #ff1040;
        color: white;
        padding: 5px;
        font-size: 18px;
        cursor: pointer;
        margin-top: 7%;
    }

    .container-my {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    form .login-box { width:60%; }
    form .login-box .textbox { position:relative; float:left; width:33.33333%; }
    label { display:block; }
    input[type="text"] { display:block; }

    h1 {
        margin: 0 0 0.25em;
    }

    select {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    appearance: none;
    outline: 0;
    box-shadow: none;
    border: 0 !important;
    background:  #333333;
    background-image: none;
    }

    select::-ms-expand {
    display: none;
    }

    .select {
    position: relative;
    display: flex;
    width: 20em;
    height: 3em;
    line-height: 3;
    background:  #ff1040;
    overflow: hidden;
    border-radius: .25em;
    }

    select {
    flex: 1;
    padding: 0 .5em;
    color: #fff;
    cursor: pointer;
    border-bottom: 2px solid #ff1040;

    }

    .select::after {
    content: '\25BC';
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 0em;
    background:  #333333;
    cursor: pointer;
    pointer-events: none;
    -webkit-transition: .25s all ease;
    -o-transition: .25s all ease;
    transition: .25s all ease;

    }

    .select:hover::after {
    color:  #ff1040;
    }
	
	a:link{
		text-decoration: none;
	}
	
	a:hover {
		color: white;
	}

    .title-my{
        font-size: 40px;
        border-bottom: 6px solid #ff1040;
        color: white;
        width: 50%;
    }

    .firstCont {
        margin-top: 50px;
        display: flex;
        flex-direction: row;
        height: 60px;
        width: 50%;
        align-items: center;
        border-bottom: 2px solid #ff1040;
    }
    .secondCont {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        width: 50%;
        height: 60px;
        justify-content: space-between;
        border-bottom: 2px solid #ff1040;
        align-items: center;
    }
    .threeCont {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        height: 60px;
        width: 50%;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #ff1040;
    }
    @media only screen and (max-width: 1320px) {
        .threeCont {
            width: 80%;
        }
        .secondCont {
            width: 80%;
        }
        .firstCont {
            width: 80%;
        }
    }
    @media only screen and (max-width: 860px) {
        .title-my {
            width: 100%;
        }
        .threeCont {
            width: 100%;
            justify-content: space-evenly;
        }
        .secondCont {
            width: 100%;
            justify-content: space-evenly;
        }
        .firstCont {
            width: 100%;
            justify-content: space-evenly;
        }
    }
</style>

</head>
<body class="body">
<% 	String whois = (session.getAttribute("user") == null) ? "nobody" : session.getAttribute("user").toString();%>

	<% 
		String result = request.getParameter("result");
	%>
	
	<% 	if(result != null){
			if(result.equals("wrong")){
	%>
			<script>alert("Verifique as informações, se as mesmas estão corretas.")</script>
	<%			
			}
		}
	%>
	<nav class="navbar navbar-expand-lg navbar-light" id="navbar">
        <a class="navbar-brand" href="home.jsp" style="width: 30%; height: 20%;" >
            <svg  viewBox="0 0 636 116" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
                <desc>Created with Lunacy</desc>
                <g id="EventCreator" fill="#FFFFFF">
                  <path d="M41.808 18.112Q23.664 18.112 22.944 18.976Q22.368 19.552 22.368 49.072L22.512 78.448L41.52 78.592L49.728 78.592Q60.528 78.592 61.104 78.016Q61.968 77.44 61.968 73.264Q61.968 69.52 61.248 68.8Q60.384 67.936 46.704 67.936L33.024 67.936L33.024 60.736Q33.024 54.256 32.592 52.528Q32.304 51.52 30.72 51.52L29.136 51.52L29.136 71.824L58.224 71.824L58.224 74.992L26.112 74.992L26.112 49.648Q31.728 49.504 42.96 49.504Q54.192 49.504 59.808 49.36L60.096 47.632L60.24 45.904L26.112 45.904L26.112 21.856L43.392 21.856Q60.816 21.856 61.104 20.848Q61.392 19.984 61.392 19.84Q61.392 18.688 57.864 18.4Q54.336 18.112 41.808 18.112ZM298.704 18.4Q295.68 18.4 294.528 18.688Q283.44 20.704 276.384 29.056Q269.328 37.408 269.328 48.208Q269.328 49.648 269.616 52.528Q271.2 64.048 279.696 71.392Q288.192 78.736 299.424 78.736Q303.744 78.736 307.344 77.728Q312.096 76.576 316.848 73.408Q321.6 70.24 321.6 68.368Q321.6 67.216 318.936 64.48Q316.272 61.744 315.264 61.744Q314.4 61.744 312.24 63.472Q306.192 68.224 299.568 68.224Q294.96 68.224 290.496 65.92Q286.464 64.048 283.512 59.656Q280.56 55.264 280.128 50.944Q279.696 46.624 277.824 46.624Q277.392 46.624 277.104 46.768Q276.096 47.2 276.096 49.072Q276.096 49.36 276.168 50.008Q276.24 50.656 276.24 51.088Q276.816 58.864 282.36 64.552Q287.904 70.24 296.4 71.824Q298.416 72.112 299.568 72.112Q305.472 72.112 311.952 68.512Q314.688 67.072 315.408 67.072Q315.696 67.072 316.272 67.36Q316.622 67.6603 316.66 67.9954Q316.729 68.6244 315.696 69.376Q314.112 70.672 309.936 72.544Q304.896 74.848 299.424 74.848Q290.208 74.848 282.792 68.584Q275.376 62.32 273.504 52.24Q273.072 50.08 273.072 48.064Q273.072 37.84 281.064 29.992Q289.056 22.144 299.568 22.144Q301.296 22.144 304.464 22.72Q311.52 24.16 316.848 28.912Q318.72 30.64 320.592 30.64Q321.316 30.64 321.636 30.2805Q321.888 29.9965 321.888 29.488Q321.888 28.624 320.88 27.184Q319.296 25.312 315.408 22.864Q311.52 20.416 308.784 19.696Q304.464 18.4 298.704 18.4ZM232.032 21.856Q232.176 20.992 235.92 20.992Q240.096 20.992 241.104 22Q241.68 22.864 241.68 25.456L241.68 26.608Q241.536 29.2 241.32 29.704Q241.104 30.208 239.952 30.208Q238.944 30.208 238.656 29.776Q238.368 29.344 238.224 27.472Q238.08 24.88 236.784 24.88Q235.488 24.88 235.488 49.936L235.488 75.136L243.12 75.136Q248.304 75.136 249.456 74.92Q250.608 74.704 250.608 73.84Q250.608 72.976 249.744 72.832Q248.88 72.688 244.56 72.544L238.368 72.256L238.368 49.072L241.392 48.928Q244.416 48.784 244.416 47.488Q244.416 46.192 242.256 46.192Q239.52 46.192 238.8 45.616Q238.08 45.04 238.08 42.736Q238.08 40.144 239.088 39.712Q239.952 39.424 240.888 40Q241.824 40.576 241.824 41.584Q241.824 42.304 244.848 42.592L247.872 42.736L248.016 46.768L248.016 48.496Q248.016 50.944 247.224 51.736Q246.432 52.528 244.272 52.528L241.824 52.528L241.824 68.8L248.016 68.944L254.064 69.232L254.064 78.592L232.032 78.592L231.888 50.656Q231.888 22.288 232.032 21.856ZM497.28 20.992Q493.536 20.992 493.392 21.856Q493.248 22.288 493.248 50.656L493.392 78.592L515.424 78.592L515.424 69.232L509.376 68.944L503.184 68.8L503.184 52.528L505.632 52.528Q507.792 52.528 508.584 51.736Q509.376 50.944 509.376 48.496L509.376 46.768L509.232 42.736L506.208 42.592Q503.184 42.304 503.184 41.584Q503.184 40.576 502.248 40Q501.312 39.424 500.448 39.712Q499.44 40.144 499.44 42.736Q499.44 45.04 500.16 45.616Q500.88 46.192 503.616 46.192Q505.776 46.192 505.776 47.488Q505.776 48.784 502.752 48.928L499.728 49.072L499.728 72.256L505.92 72.544Q510.24 72.688 511.104 72.832Q511.968 72.976 511.968 73.84Q511.968 74.704 510.816 74.92Q509.664 75.136 504.48 75.136L496.848 75.136L496.848 49.936Q496.848 24.88 498.144 24.88Q499.44 24.88 499.584 27.472Q499.728 29.344 500.016 29.776Q500.304 30.208 501.312 30.208Q502.464 30.208 502.68 29.704Q502.896 29.2 503.04 26.608L503.04 25.456Q503.04 22.864 502.464 22Q501.456 20.992 497.28 20.992ZM140.016 36.544Q142.896 35.824 145.2 35.824Q153.264 35.824 159.528 41.44Q165.792 47.056 166.368 54.976L166.512 59.008L136.272 59.008L136.272 56.128Q136.272 54.256 136.488 53.824Q136.704 53.392 137.856 53.392Q139.44 53.392 139.728 54.256Q140.016 55.264 151.536 55.264L162.768 55.264L162.336 53.392Q160.752 47.056 156 43.528Q151.248 40 145.488 40Q140.304 40 135.912 42.736Q131.52 45.472 129.216 50.8Q127.92 53.824 127.92 56.992Q127.92 61.888 130.512 66.28Q133.104 70.672 137.712 72.976Q140.448 74.416 145.056 74.416Q149.952 74.416 153.12 72.832Q154.992 71.824 155.28 71.464Q155.568 71.104 154.992 70.528Q154.416 69.952 153.696 69.952Q152.832 69.952 149.808 70.96Q146.64 71.968 145.056 71.968Q144.624 71.968 142.608 71.68Q136.272 70.096 132.816 64.768Q130.944 61.744 130.944 57.136Q130.944 53.824 131.232 52.6Q131.52 51.376 132.96 49.36Q137.136 43.024 143.76 43.024Q145.2 43.024 145.704 43.096Q146.208 43.168 146.424 43.456Q146.64 43.744 146.64 44.464Q146.64 45.472 146.136 45.832Q145.632 46.192 143.616 46.624Q139.584 47.488 136.992 50.44Q134.4 53.392 134.4 57.136Q134.4 59.584 135.912 62.248Q137.424 64.912 139.584 66.208Q142.896 68.08 145.488 68.08Q148.08 68.08 150.96 66.208Q153.264 64.624 154.128 64.624Q154.848 64.624 157.8 67.72Q160.752 70.816 160.752 71.536Q160.752 72.976 154.56 76.288Q150.816 78.16 145.344 78.16Q139.44 78.16 136.272 76.576Q130.368 73.696 127.2 68.512Q124.032 63.328 124.032 57.424Q124.032 50.368 128.208 44.536Q132.384 38.704 140.016 36.544ZM399.648 35.824Q397.344 35.824 394.464 36.544Q386.832 38.704 382.656 44.536Q378.48 50.368 378.48 57.424Q378.48 63.328 381.648 68.512Q384.816 73.696 390.72 76.576Q393.888 78.16 399.792 78.16Q405.264 78.16 409.008 76.288Q415.2 72.976 415.2 71.536Q415.2 70.816 412.248 67.72Q409.296 64.624 408.576 64.624Q407.712 64.624 405.408 66.208Q402.528 68.08 399.936 68.08Q397.344 68.08 394.032 66.208Q391.872 64.912 390.36 62.248Q388.848 59.584 388.848 57.136Q388.848 53.392 391.44 50.44Q394.032 47.488 398.064 46.624Q400.08 46.192 400.584 45.832Q401.088 45.472 401.088 44.464Q401.088 43.744 400.872 43.456Q400.656 43.168 400.152 43.096Q399.648 43.024 398.208 43.024Q391.584 43.024 387.408 49.36Q385.968 51.376 385.68 52.6Q385.392 53.824 385.392 57.136Q385.392 61.744 387.264 64.768Q390.72 70.096 397.056 71.68Q399.072 71.968 399.504 71.968Q401.088 71.968 404.256 70.96Q407.28 69.952 408.144 69.952Q408.864 69.952 409.44 70.528Q410.016 71.104 409.728 71.464Q409.44 71.824 407.568 72.832Q404.4 74.416 399.504 74.416Q394.896 74.416 392.16 72.976Q387.552 70.672 384.96 66.28Q382.368 61.888 382.368 56.992Q382.368 53.824 383.664 50.8Q385.968 45.472 390.36 42.736Q394.752 40 399.936 40Q405.696 40 410.448 43.528Q415.2 47.056 416.784 53.392L417.216 55.264L405.984 55.264Q394.464 55.264 394.176 54.256Q393.888 53.392 392.304 53.392Q391.152 53.392 390.936 53.824Q390.72 54.256 390.72 56.128L390.72 59.008L420.96 59.008L420.816 54.976Q420.24 47.056 413.976 41.44Q407.712 35.824 399.648 35.824ZM450.48 37.696Q453.072 36.688 456.96 36.688Q462.576 36.688 465.888 38.416Q468.48 39.568 468.624 39.568Q469.056 39.568 469.2 38.272Q469.344 37.264 470.064 37.048Q470.784 36.832 474.096 36.832L478.848 36.832L478.848 79.024L474.096 79.024Q470.64 79.024 469.992 78.808Q469.344 78.592 469.2 77.296L469.056 75.712L466.032 77.008Q462.144 78.592 456.816 78.592Q452.928 78.592 450.336 77.728Q444 75.712 440.04 69.952Q436.08 64.192 436.08 57.568Q436.08 54.976 436.656 52.816Q439.392 41.728 450.48 37.696ZM337.296 37.984Q338.16 37.408 341.616 37.408Q344.352 37.408 345.36 37.984Q346.368 38.56 346.656 40.144Q346.8 40.576 346.872 40.72Q346.944 40.864 347.304 40.72Q347.664 40.576 348.384 40Q348.528 39.856 348.672 39.784Q348.816 39.712 348.96 39.568Q351.264 37.984 352.704 37.984Q354.144 37.984 354.144 39.424Q354.144 40.432 352.776 41.728Q351.408 43.024 349.248 44.536Q347.088 46.048 346.8 46.192Q345.216 47.344 344.352 47.344Q342.768 47.344 342.768 44.032Q342.768 41.152 341.472 41.152Q341.04 41.152 340.824 41.296Q340.608 41.44 340.464 42.448Q340.32 43.456 340.32 45.256L340.32 71.032Q340.32 72.832 340.464 73.84Q340.608 74.848 340.824 74.992Q341.04 75.136 341.472 75.136Q341.904 75.136 342.12 74.92Q342.336 74.704 342.552 73.408Q342.768 72.112 342.768 69.952L342.768 51.52L351.12 45.184Q360.912 37.84 362.208 37.84Q363.504 37.84 363.504 41.584Q363.504 42.16 363.432 43.456Q363.36 44.752 363.36 45.616L363.216 52.816L358.608 52.96L356.016 52.96Q353.856 52.96 353.712 52.24Q353.568 51.952 353.568 51.664Q353.568 49.36 357.312 49.36L359.76 49.36L359.76 43.6L357.312 45.472Q356.016 46.48 350.832 50.368L346.656 53.392L346.368 66.064L346.224 78.592L336.864 78.592L336.576 58.576L336.576 51.52Q336.576 38.416 337.296 37.984ZM591.6 37.408Q588.144 37.408 587.28 37.984Q586.56 38.416 586.56 51.52L586.56 58.576L586.848 78.592L596.208 78.592L596.352 66.064L596.64 53.392L600.816 50.368Q606 46.48 607.296 45.472L609.744 43.6L609.744 49.36L607.296 49.36Q603.552 49.36 603.552 51.664Q603.552 51.952 603.696 52.24Q603.84 52.96 606 52.96L608.592 52.96L613.2 52.816L613.344 45.616Q613.344 44.752 613.416 43.456Q613.488 42.16 613.488 41.584Q613.488 37.84 612.192 37.84Q610.896 37.84 601.104 45.184L592.752 51.52L592.752 69.952Q592.752 72.112 592.536 73.408Q592.32 74.704 592.104 74.92Q591.888 75.136 591.456 75.136Q591.024 75.136 590.808 74.992Q590.592 74.848 590.448 73.84Q590.304 72.832 590.304 71.032L590.304 45.256Q590.304 43.456 590.448 42.448Q590.592 41.44 590.808 41.296Q591.024 41.152 591.456 41.152Q592.752 41.152 592.752 44.032Q592.752 47.344 594.336 47.344Q595.2 47.344 596.784 46.192Q597.072 46.048 599.232 44.536Q601.392 43.024 602.76 41.728Q604.128 40.432 604.128 39.424Q604.128 37.984 602.688 37.984Q601.248 37.984 598.944 39.568Q598.8 39.712 598.656 39.784Q598.512 39.856 598.368 40Q597.648 40.576 597.288 40.72Q596.928 40.864 596.856 40.72Q596.784 40.576 596.64 40.144Q596.352 38.56 595.344 37.984Q594.336 37.408 591.6 37.408ZM107.904 37.552Q106.752 37.264 106.176 38.128Q105.744 38.704 100.704 56.848L95.664 74.56Q94.656 74.56 92.568 74.416Q90.48 74.272 89.472 74.272L85.296 58.144Q80.832 42.16 80.832 42.016L82.128 41.872L82.416 41.872Q83.28 41.872 84 43.96Q84.72 46.048 87.744 57.568Q89.904 65.488 90.552 67Q91.2 68.512 92.208 68.512Q93.936 68.512 93.936 67.36Q93.936 65.488 90.192 52.24Q86.448 38.992 85.728 38.56Q84.864 37.984 81.408 37.984Q77.808 37.984 77.232 39.136L77.088 39.424L77.088 39.712Q77.088 41.872 81.408 58.576Q86.016 76.432 86.736 77.44Q87.456 78.304 92.784 78.304L98.4 78.304L99.696 73.984Q109.056 42.736 109.056 38.992Q109.056 37.84 107.904 37.552ZM186.96 38.272Q181.632 38.272 181.344 38.992Q181.2 39.424 181.2 59.296L181.344 78.736L186.384 79.024L191.136 79.168L191.136 64.336Q191.136 49.648 190.128 49.36Q189.264 49.072 189.12 49.072Q187.968 49.072 187.68 51.736Q187.392 54.4 187.392 63.184Q187.392 75.8703 186.122 75.9987Q186.109 76 186.096 76Q185.088 76 184.944 73.696Q184.8 71.392 184.8 58.864L184.8 42.016L195.456 42.16Q203.376 42.304 205.032 42.52Q206.688 42.736 208.272 44.032Q210.432 45.76 212.016 48.064Q213.024 49.792 213.24 51.88Q213.456 53.968 213.6 63.184L213.888 76L210.72 76L210.576 66.352L210.288 56.848L207.264 56.848L207.264 78.736L217.2 78.736L217.488 65.92L217.488 61.888Q217.488 53.104 216.912 50.224Q215.184 43.6 209.568 40.288Q207.408 38.992 205.464 38.776Q203.52 38.56 194.16 38.416Q192.432 38.416 190.128 38.344Q187.824 38.272 186.96 38.272ZM545.232 38.992Q547.248 38.416 550.848 38.416L552.288 38.416Q559.776 38.704 564.888 43.168Q570 47.632 571.584 55.264Q572.016 57.28 572.016 59.008Q572.016 64.768 568.776 69.952Q565.536 75.136 560.208 77.584Q556.176 79.6 551.28 79.6Q545.52 79.6 540.552 76.576Q535.584 73.552 532.848 68.08Q530.832 64.336 530.832 58.144Q530.832 54.688 531.696 52.384Q535.296 42.304 545.232 38.992ZM467.616 44.032Q461.856 40.432 456.672 40.432Q453.936 40.432 451.344 41.44Q442.848 44.752 440.4 53.824Q439.968 55.84 439.968 57.712Q439.968 64.48 445.008 69.664Q450.048 74.848 457.104 74.848Q462.288 74.848 467.616 71.248Q470.064 69.664 471.216 69.664Q472.944 69.664 472.944 73.12Q472.944 75.1242 473.716 75.4875Q473.887 75.568 474.096 75.568Q475.104 75.568 475.248 73.192Q475.392 70.816 475.392 57.856Q475.392 44.896 475.248 42.592Q475.104 40.288 474.24 40.288Q472.944 40.288 472.8 42.88Q472.512 45.76 471.216 45.76Q470.208 45.76 467.616 44.032ZM558.768 43.744Q555.6 42.16 550.704 42.16Q547.248 42.16 545.664 42.88Q540.768 44.752 537.6 49.216Q534.432 53.68 534.432 58.864Q534.432 60.592 534.864 62.32Q537.024 71.824 546.816 75.136Q548.688 75.856 551.28 75.856Q557.76 75.856 563.016 70.672Q568.272 65.488 568.272 58.864Q568.272 56.848 567.984 55.84Q566.256 47.776 558.768 43.744ZM453.504 43.6Q455.952 42.88 456.672 42.88Q457.392 42.88 458.256 43.456Q458.976 43.744 458.976 44.608Q458.976 46.048 456.096 46.912Q449.76 48.784 447.6 53.248Q446.448 55.552 446.448 57.856Q446.448 61.6 449.184 64.624Q451.92 67.648 456.24 68.512Q457.824 68.8 458.256 69.16Q458.688 69.52 458.688 70.528Q458.688 71.68 458.256 71.896Q457.824 72.112 455.664 71.968Q450.336 71.824 446.52 67.36Q442.704 62.896 442.704 57.28Q442.704 56.272 442.992 54.544Q443.568 51.088 446.664 47.92Q449.76 44.752 453.504 43.6ZM544.656 46.624Q547.536 45.184 549.984 45.184Q552.576 45.184 552.576 46.624Q552.576 47.776 549.12 48.928Q545.376 50.08 543.144 52.888Q540.912 55.696 540.912 58.864Q540.912 62.752 544.08 65.92Q546.384 68.224 548.544 68.8Q551.424 69.376 552.072 69.664Q552.72 69.952 552.72 70.672Q552.72 72.832 550.272 72.832Q547.824 72.832 544.512 71.032Q541.2 69.232 539.472 66.64Q538.032 64.624 537.744 63.472Q537.456 62.32 537.456 59.008Q537.456 55.696 537.816 54.472Q538.176 53.248 539.616 51.088Q541.776 48.208 544.656 46.624Z" />
                </g>
            </svg>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
    </nav>
    <form class="container-my" method="POST" action="process">
        <div class="title-my"><hi>Cadastro de Eventos</hi></div>
        <div class="firstCont">
            <i class="fas fa-volleyball-ball"></i>
            <input type="text" placeholder="Rua" name="rua" id="input" required>
            
            <i class="fas fa-baseball-ball"></i>
            <input type="text" placeholder="Número" name="numero" required>

            <i class="fas fa-football-ball"></i>
            <input type="text" placeholder="Complemento" name="complemento">
        </div>
        <div class="secondCont">
            <i class="fas fa-futbol"></i>
            <input type="text" placeholder="Bairro" name="bairro" required>

            <i class="fas fa-hockey-puck"></i>
            <input type="text" placeholder="Cidade" name="cidade" required>

            
            <div class="select mr-auto">
				<select name="estado" id="slct" name="estado" required="true" required>
					<option selected disabled>Estado</option>
					<option value="AC">Acre</option>
					<option value="AL">Alagoas</option>
					<option value="AP">Amapá</option>
					<option value="AM">Amazonas</option>
					<option value="BA">Bahia</option>
					<option value="CE">Ceará</option>
					<option value="DF">Distrito Federal</option>
					<option value="ES">Espírito Santo</option>
					<option value="GO">Goiás</option>
					<option value="MA">Maranhão</option>
					<option value="MT">Mato Grosso</option>
					<option value="MS">Mato Grosso do Sul</option>
					<option value="MG">Minas Gerais</option>
					<option value="PA">Pará</option>
					<option value="PB">Paraìba</option>
					<option value="PR">Paraná</option>
					<option value="PE">Pernambuco</option>
					<option value="PI">Piauí­</option>
					<option value="RJ">Rio de Janeiro</option>
					<option value="RN">Rio Grande do Norte</option>
					<option value="RS">Rio Grande do Sul</option>
					<option value="RO">Rondônia</option>
					<option value="RR">Roraima</option>
					<option value="SC">Santa Catarina</option>
					<option value="SP">Sâo Paulo</option>
					<option value="SE">Sergipe</option>
					<option value="TO">Tocantins</option>
                </select>
            </div>

        </div>
        <div class="threeCont">
            <i class="fas fa-swimmer"></i>
            <input type="text" placeholder="Data de início do evento" name="datainicio" id="datainicio" required minlength="10">
            
            <i class="fas fa-skiing"></i>
            <input type="text" placeholder="Data final do evento" name="datafinal" id="datafinal" required minlength="10"> 
            
            <i class="fas fa-bowling-ball"></i>
            <input type="text" placeholder="Hora do evento" name="horaevento" id="inp" required minlength="5">
        </div>
        <div class="threeCont">
            <select name="modalidade" id="slct" required>
                <option selected disabled>Modalidade</option>
                <option value="LUTA">Luta</option>
                <option value="FUTEBOL">Futebol</option>
            </select>

			<%if(!whois.equals("nobody")){ 
				JSONObject ob = new JSONObject(whois);
				JSONObject obj = new JSONObject(ob.get("Users").toString());
			%>
            	<input type="hidden" placeholder="ID do organizador" name="id_org" value="<%=obj.getInt("id_users") %>">
			<%}else{ %>
            	<input type="hidden" placeholder="ID do organizador" name="id_org" value="0">
			<%} %>

            <select name="qtdParticipantes" required>
                <option selected disabled>Quantidade de participantes</option>
                <option value="2">1x1</option>
                <option value="4">2x2</option>
                <option value="8">4x4</option>
                <option value="16">8x8</option>
            </select>
        </div>
        <%if(!whois.equals("nobody")){ %>	
	        <input type="hidden" name="action" value="cadEvent">
	        <button class="btn" type="submit">Cadastrar</button>
        <%} %>
    </form>
    <script>
        var e = document.querySelector('.container-my')
        e.style.height = (screen.height/100)*75 + 'px'
        document.querySelector('body').style.height = '100%'
        if(screen.width < 500){
        document.querySelector('body').style.width = (screen.width/100)*140 + 'px'
        }
    </script>
	<script src="cadjs.js"></script>
</body>
</html>