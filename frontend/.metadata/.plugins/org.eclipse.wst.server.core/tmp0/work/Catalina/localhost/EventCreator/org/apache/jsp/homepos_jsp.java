/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/8.5.24
 * Generated at: 2020-07-17 11:01:35 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class homepos_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent,
                 org.apache.jasper.runtime.JspSourceImports {

  private static final javax.servlet.jsp.JspFactory _jspxFactory =
          javax.servlet.jsp.JspFactory.getDefaultFactory();

  private static java.util.Map<java.lang.String,java.lang.Long> _jspx_dependants;

  private static final java.util.Set<java.lang.String> _jspx_imports_packages;

  private static final java.util.Set<java.lang.String> _jspx_imports_classes;

  static {
    _jspx_imports_packages = new java.util.HashSet<>();
    _jspx_imports_packages.add("javax.servlet");
    _jspx_imports_packages.add("javax.servlet.http");
    _jspx_imports_packages.add("javax.servlet.jsp");
    _jspx_imports_classes = null;
  }

  private volatile javax.el.ExpressionFactory _el_expressionfactory;
  private volatile org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public java.util.Map<java.lang.String,java.lang.Long> getDependants() {
    return _jspx_dependants;
  }

  public java.util.Set<java.lang.String> getPackageImports() {
    return _jspx_imports_packages;
  }

  public java.util.Set<java.lang.String> getClassImports() {
    return _jspx_imports_classes;
  }

  public javax.el.ExpressionFactory _jsp_getExpressionFactory() {
    if (_el_expressionfactory == null) {
      synchronized (this) {
        if (_el_expressionfactory == null) {
          _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
        }
      }
    }
    return _el_expressionfactory;
  }

  public org.apache.tomcat.InstanceManager _jsp_getInstanceManager() {
    if (_jsp_instancemanager == null) {
      synchronized (this) {
        if (_jsp_instancemanager == null) {
          _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
        }
      }
    }
    return _jsp_instancemanager;
  }

  public void _jspInit() {
  }

  public void _jspDestroy() {
  }

  public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
      throws java.io.IOException, javax.servlet.ServletException {

    final java.lang.String _jspx_method = request.getMethod();
    if (!"GET".equals(_jspx_method) && !"POST".equals(_jspx_method) && !"HEAD".equals(_jspx_method) && !javax.servlet.DispatcherType.ERROR.equals(request.getDispatcherType())) {
      response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED, "JSPs only permit GET POST or HEAD");
      return;
    }

    final javax.servlet.jsp.PageContext pageContext;
    javax.servlet.http.HttpSession session = null;
    final javax.servlet.ServletContext application;
    final javax.servlet.ServletConfig config;
    javax.servlet.jsp.JspWriter out = null;
    final java.lang.Object page = this;
    javax.servlet.jsp.JspWriter _jspx_out = null;
    javax.servlet.jsp.PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html; charset=ISO-8859-1");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\r\n");
      out.write("<!DOCTYPE html>\r\n");
      out.write("<html>\r\n");
      out.write("<head>\r\n");
      out.write("<meta charset=\"ISO-8859-1\">\r\n");
      out.write("<title>Página inicial</title>\r\n");
      out.write("<link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"img/ico.png\">\r\n");
      out.write("<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Raleway\">\r\n");
      out.write("<script src=\"js\\jquery.min.js\"></script>\r\n");
      out.write("<script src=\"https://code.jquery.com/jquery-3.4.1.js\"></script>\r\n");
      out.write("<link rel=\"stylesheet\" href=\"bootstrap\\css\\bootstrap.min.css\" />\r\n");
      out.write("<script src=\"bootstrap\\js\\bootstrap.min.js\"></script>\r\n");
      out.write("<link rel='stylesheet' href='csss.css' />\r\n");
      out.write("<script>\r\n");
      out.write("\t$(document).ready(function () {\r\n");
      out.write("    \tsetTimeout(function () {\r\n");
      out.write("        $('.wrapper').addClass('loaded');\r\n");
      out.write("        }, 3000);\r\n");
      out.write("    });\r\n");
      out.write("    jQuery(function () {\r\n");
      out.write("    \t$(window).load(function () {\r\n");
      out.write("        \t$('.wrapper').removeClass('preload');\r\n");
      out.write("        });\r\n");
      out.write("\r\n");
      out.write("    });\r\n");
      out.write("</script>\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\t");
 	String whois = (session.getAttribute("user") == null) ? "nobody" : session.getAttribute("user").toString(); 
		String result = request.getParameter("result");
	
      out.write("\r\n");
      out.write("\t\r\n");
      out.write("\t");
 	if(result != null){
			if(result.equals("right")){
	
      out.write("\r\n");
      out.write("\t\t\t<div class=\"alert alert-danger\" align=\"center\">\r\n");
      out.write("\t\t\t\tParabéns, evento cadastro com sucesso!\r\n");
      out.write("\t\t\t</div>\r\n");
      out.write("\t");
			
			}else{
	
      out.write("\t\t\t\r\n");
      out.write("\t\t\t<script>\r\n");
      out.write("\t\t \t\talert(\"Erro ao cadastrar, informações preenchidas incorretamente.\");\r\n");
      out.write("\t\t \t\twindow.location.href = \"http://localhost:8080/EventCreator/cadEvent.jsp\";\r\n");
      out.write("\t\t\t</script>\r\n");
      out.write("\t");
			
			}
		}
	
      out.write('\r');
      out.write('\n');
      out.write('	');
 if(!whois.equals("nobody")){ 
      out.write("\r\n");
      out.write("\t<form method=\"POST\" action=\"process\">\r\n");
      out.write("    \t<input type=\"hidden\" name=\"action\" value=\"auth\" />\r\n");
      out.write("    \t<input type=\"hidden\" name=\"log\" value=\"false\" />\r\n");
      out.write("    \t<button class=\"container-fluid col-2 btn btn-outline-light\" style=\"color: white; font-size: 2vw;\" type=\"submit\">Sair</button>\r\n");
      out.write("    </form>\r\n");
      out.write("    <a class=\"container-fluid col-2 btn btn-outline-light\" style=\"color: white; font-size: 2vw;\" href=\"profile.jsp\">Ver perfil</a>\r\n");
      out.write("    \r\n");
      out.write("    <section id=\"sectioncards\">\r\n");
      out.write("        <header id=\"headercards\" style=\"text-align: center;\">\r\n");
      out.write("\t\t\t\r\n");
      out.write("            <div id=\"carouseldiv\">\r\n");
      out.write("                <img class=\"d-block w-100\" src=\"img/logoBranco.svg\" max-height=\"900px\">\r\n");
      out.write("            </div>\r\n");
      out.write("\r\n");
      out.write("            <h6 style=\"color: #fff; font-size: 25px; line-height: 1.2; text-align: center;\">Para começar a utilizar\r\n");
      out.write("                escolha uma das duas opções abaixo.</h6>\r\n");
      out.write("        </header>\r\n");
      out.write("        <div class=\"container\" style=\"padding-top: 3rem; margin-top: 3rem;\">\r\n");
      out.write("            <div class=\"box\">\r\n");
      out.write("                <div class=\"imgBx\">\r\n");
      out.write("                    <img src=\"img/terno.jpg\">\r\n");
      out.write("                </div>\r\n");
      out.write("                <div class=\"content\" style=\"font-weight: bold;\">\r\n");
      out.write("                    <h3 style=\"font-weight: bold;\">Criar Eventos</h3><br>\r\n");
      out.write("                    <p>O EventCreator permite que o usuário crie campenatos sejam eles em grupo ou individuais, o\r\n");
      out.write("                        chaviamento e sorteio de partidas fica por nossa conta.</p>\r\n");
      out.write("                    <div style=\"border-bottom: 5rem solid transparent;\"></div>\r\n");
      out.write("                    <button class=\"back\"><a style=\"color: white; cursor: pointer; border: none; text-decoration: none;\" href=\"cadEvent.jsp\">CRIAR UM EVENTO</a></button>\r\n");
      out.write("\r\n");
      out.write("                </div>\r\n");
      out.write("            </div>\r\n");
      out.write("            <div class=\"box\">\r\n");
      out.write("                <div class=\"imgBx\">\r\n");
      out.write("                    <img src=\"img/friends123.jpg\">\r\n");
      out.write("                </div>\r\n");
      out.write("                <div class=\"content\">\r\n");
      out.write("                    <h3 style=\"font-weight: bold;\">Participe de um evento</h3><br>\r\n");
      out.write("                    <p>Veja os eventos disponiveis e participe do evento que mais chamou sua atenção.</p>\r\n");
      out.write("                    <div style=\"border-bottom: 5rem solid transparent;\"></div>\r\n");
      out.write("                    <button class=\"back\"><a style=\"color: white; cursor: pointer;text-decoration: none;\"\r\n");
      out.write("                            href=\"partEvent.jsp\">PARTICIPAR DE EVENTO</a></button>\r\n");
      out.write("                </div>\r\n");
      out.write("            </div>\r\n");
      out.write("        </div>\r\n");
      out.write("    </section>\r\n");
      out.write("\r\n");
      out.write("    <section>\r\n");
      out.write("        <div id=\"carouseldiv\">\r\n");
      out.write("            <div id=\"carousel\">\r\n");
      out.write("                <div class=\"carousel-inner img-responsive\">\r\n");
      out.write("                    <div class=\"carousel-item active\">\r\n");
      out.write("                        <img class=\"d-block w-100\" src=\"img/tduo..jpg\" max-height=\"900px\">\r\n");
      out.write("                    </div>\r\n");
      out.write("                </div>\r\n");
      out.write("            </div>\r\n");
      out.write("        </div>\r\n");
      out.write("    </section>\r\n");
      out.write("\r\n");
      out.write("    <footer class=\"footer\" style=\"background-color:white; padding-top: 5rem;\">\r\n");
      out.write("        <div class=\"container\">\r\n");
      out.write("            <div class=\"row\">\r\n");
      out.write("                <img class=\"d-block w-100\" src=\"img/logot.svg\" max-height=\"900px\">\r\n");
      out.write("                <div class=\"col-sm-12 col-md-6\" style=\"margin-right: 25%; padding-top: 5rem;\">\r\n");
      out.write("                    <h6 style=\"font-weight: bold; color: #ff1040;\">Sobre</h6>\r\n");
      out.write("                    <p class=\"text-justify;\" style=\"color: #ff1040;\">O sistema Event Creator funciona da seguinte maneira. O usuário irá se\r\n");
      out.write("                        cadastrar e terá sua própria conta, visualizando os tipos de torneio e o número de participantes\r\n");
      out.write("                        do grupo para a realização deste evento, poderá também monitorar a situação de seu time, se está\r\n");
      out.write("                        sendo uma equipe imbatível, mediana ou perdedora. E os novos jogos que ocorrerá futuramente.</p>\r\n");
      out.write("                </div>\r\n");
      out.write("                \r\n");
      out.write("                <div style=\"border-bottom: 400px solid transparent; \"></div>\r\n");
      out.write("                <button class=\"backfooter\"><a style=\"color: #ff1040; cursor: pointer;text-decoration: none; padding-top: 5rem;\"\r\n");
      out.write("                    href=\"#sectioncards\">Voltar ao topo</a></button>\r\n");
      out.write("            </div>\r\n");
      out.write("        </div>\r\n");
      out.write("    </footer>\r\n");
      out.write("    ");
}else{ 
      out.write("\r\n");
      out.write("    \tString urlP = \"ca4f395fba8a.ngrok.io\";\r\n");
      out.write("    \t<script>alert(\"Você precisa estar logado para acessar essa página.\");\r\n");
      out.write("    \t\t\twindow.location.href = \"http://localhost:8080/EventCreator/login.jsp\";\r\n");
      out.write("    \t</script>\r\n");
      out.write("    ");
} 
      out.write("\r\n");
      out.write("</body>\r\n");
      out.write("</html>");
    } catch (java.lang.Throwable t) {
      if (!(t instanceof javax.servlet.jsp.SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try {
            if (response.isCommitted()) {
              out.flush();
            } else {
              out.clearBuffer();
            }
          } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
