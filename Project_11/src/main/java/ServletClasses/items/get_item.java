package ServletClasses.items;

import DataClasses.ItemData.Item;
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

@WebServlet(name = "get_item")
public class get_item extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String item_id = null,
                username = null,
                token = null;

        BufferedReader buffer1 = request.getReader();
        String str = buffer1.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);

            item_id = (String)json.get("ItemID");
            username = (String)json.get("username");
            token = (String)json.get("token");

            System.out.println("get_item> item_id: "+ item_id +
                    " username: "+username+
                    " token: "+token);
        }catch(ParseException e){
            System.out.println("Error in the get_item Servlet!");
        }

// get item
        Item item = new Item(item_id);
        String item_info = null;
        try {
            item_info = item.get_item();
        } catch (ParseException e) {
            e.printStackTrace();
        }

// read token and get username
        JsonWebToken t = new JsonWebToken();
        String name = "not signed token";
        if(!token.equals("null")) {
            name = t.JWT_get_ID(token);
        }
        System.out.println("Name: "+name);

// check if user and add item in its history
        if( !name.equals("not signed token") ){
            User user = new User(name);
            user.add_visited_item(item_id);
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.print(item_info);
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