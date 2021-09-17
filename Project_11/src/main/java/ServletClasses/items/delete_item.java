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

@WebServlet(name = "delete_item")
public class delete_item extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String item_id=null,
                username = null,
                token=null;

        BufferedReader buffer1 = request.getReader();
        String str = buffer1.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);

            item_id = (String)json.get("ItemID");
            username = (String)json.get("username");
            token = (String)json.get("token");


            System.out.println("delete_item> username: "+ username
                    +"\n token: "+token
                    +"\n _ItemID: " + item_id
            );
        }catch(ParseException e){
            System.out.println("Error in the delete_item Servlet!");
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

            return;     // not valid token, no user get its auctions, exit
        }

// delete item
        Item item = new Item(item_id);
        String message = item.delete_item(name);
// return success message
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.print(message);
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