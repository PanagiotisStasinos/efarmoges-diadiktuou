package ServletClasses.user;

import DataClasses.Admin.Category;
import DataClasses.JWToken.JsonWebToken;
import DataClasses.LSHNearestNeighbour.LSH;
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

@WebServlet(name = "RecommendedItems")
public class RecommendedItems extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String username=null,
                token = null;

        BufferedReader buffer1 = request.getReader();
        String str = buffer1.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);

            username = (String)json.get("username");
            token = (String)json.get("token");

            System.out.println("RecommendedItems> username: "+ username + " token: "+token);
        }catch(ParseException e){
            System.out.println("Error in the RecommendedItems Servlet!");
        }

// read token and get username
        JsonWebToken t = new JsonWebToken();
        String name = t.JWT_get_ID(token);
        System.out.println("Name: "+name);
        if(name.equals("not signed token")){
            JSONObject obj = new JSONObject();
            obj.put("error","not signed token");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();
            out.print(obj.toJSONString());
            out.flush();

            return;     // not valid token, no user to use in lsh, exit
        }

// get recommended items
        String result=null;
        LSH lsh = new LSH();
        try {
            result = lsh.lsh(name);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.print(result);
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
        response.setHeader("Access-Control-Allow-Methods", "POST");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type");
        response.addHeader("Access-Control-Allow-Headers", "Accept");
    }
}