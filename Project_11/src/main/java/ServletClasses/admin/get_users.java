package ServletClasses.admin;
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

@WebServlet(name = "get_users")
public class get_users extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String page_number=null,
                number_of_users_per_page=null,
                Verified=null,
                token=null;

        BufferedReader buffer1 = request.getReader();
        String str = buffer1.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);

            page_number = (String)json.get("page_number");
            number_of_users_per_page = (String)json.get("number_of_users_per_page");
            Verified = (String)json.get("Verified");
            token = (String)json.get("token");

            System.out.println("get_users> page_number: "+ page_number
                    +"\n number_of_users_per_page: " + number_of_users_per_page
                    +"\n Verified: " + Verified
                    +"\n token: " + token
            );
        }catch(ParseException e){
            System.out.println("Error in the get_users Servlet!");
        }
/*
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
        else if(!name.equals("admin")){
            JSONObject obj = new JSONObject();
            obj.put("error","not admin");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();
            out.print(obj.toJSONString());
            out.flush();

            return;     // user is not admin, exit
        }
*/

// read number and size of page
        int p = Integer.parseInt(page_number);
        int n = Integer.parseInt(number_of_users_per_page);
        System.out.println("p : "+p+", n : "+n+", verified : "+Verified);

        User user = new User();
        String result = null;      // string with users info in json format
        try {
            result = user.users_paging(p, n, Verified);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        /*result*/
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