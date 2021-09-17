package ServletClasses.items;

import DataClasses.ItemData.Item;
import DataClasses.JWToken.JsonWebToken;
import org.json.simple.parser.ParseException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import java.io.PrintWriter;
import java.util.stream.Collectors;

@WebServlet(name = "insert_bid")
public class insert_bid extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String username = null,
                token=null,
                item_id=null,
                amount = null;

        BufferedReader buffer1 = request.getReader();
        String str = buffer1.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);

            username = (String)json.get("username");
            token = (String)json.get("token");
            item_id = (String)json.get("ItemID");
            amount = (String)json.get("amount");

            System.out.println("Insert_Bid> username: "+ username
                    +"\n token: "+ token
                    +"\n ItemID: " + item_id
                    +"\n Amount: " + amount
            );
        }catch(ParseException e){
            System.out.println("Error in the insert_bid Servlet!");
        }
        float Amount = Float.parseFloat(amount);

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

// insert bid
        Item item = new Item(item_id);
        String message = null;
        try {
            message = item.insert_bid(amount, Amount, name);
        } catch (ParseException e) {
            System.out.println("Error");
            e.printStackTrace();
        }

        /*Success message*/
        JSONObject obj = new JSONObject();
        obj.put("message",message);
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
        response.setHeader("Access-Control-Allow-Methods", "POST");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type");
        response.addHeader("Access-Control-Allow-Headers", "Accept");
    }
}