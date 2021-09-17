package ServletClasses.user;

import DataClasses.JWToken.JsonWebToken;
import DataClasses.UserData.User;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

@WebServlet(name = "login")
public class login extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String password=null, username = null;

        BufferedReader buffer1 = request.getReader();
        String str = buffer1.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);

            password = (String)json.get("password");
            username = (String)json.get("username");

            System.out.println("login> username: "+ username +"\n password: " + password);
        }catch(ParseException e){
            System.out.println("Error in the login Servlet!");
        }

        User userObject = new User();

        JSONObject obj = new JSONObject();
        if(userObject.isValidUserCredentials(username, password)){
            JsonWebToken jwt_object = new JsonWebToken();
//            String jwt = jwt_object.CreateJsonWebToken(username, "yes", null, 30000);
//            String jwt = jwt_object.CreateJsonWebToken(username, "yes", null, 1000000);
            String jwt = jwt_object.CreateJsonWebToken(username, "yes", null, 86400000 /*one day*/);
            if(username.equals("admin")) {
                obj.put("type","admin");
            }
            else {
                obj.put("type", "verified");
            }
            obj.put("token",jwt);
        }
        else{
            if(userObject.UserVerified(username, password)){
                obj.put("type","unverified");
                obj.put("token","null");
            }
            else {
                obj.put("type", "null");
                obj.put("token", "null");
            }
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.print(obj.toJSONString());
        out.flush();
    }


    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setAccessControlHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void setAccessControlHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET");
        response.setHeader("Access-Control-Allow-Methods", "POST");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type");
        response.addHeader("Access-Control-Allow-Headers", "Accept");
    }
}