package ServletClasses.items;

import DataClasses.ItemData.Item;
import DataClasses.JWToken.JsonWebToken;
import DataClasses.UserData.User;
import org.json.simple.JSONArray;
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
//import java.text.ParseException;
import java.util.stream.Collectors;

@WebServlet(name = "insert_item")
public class insert_item extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String username = null,
                token=null,
                Name=null,
                Category = null,
                Buy_Price=null,
                First_Bid=null,
                Location=null,
                Latitude=null,
                Longitude=null ,
                Country=null,
                Started = null,
                Ends = null,
                Description=null;


        BufferedReader buffer1 = request.getReader();
        String str = buffer1.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);

            Name = (String)json.get("Name");
            JSONArray CategoryArray = (JSONArray) json.get("Category");     Category = CategoryArray.toJSONString();

            Buy_Price = (String)json.get("Buy_Price");
            First_Bid = (String)json.get("First_Bid");

            Location = (String)json.get("Location");
            Latitude = (String)json.get("Latitude");
            Longitude = (String)json.get("Longitude");
            Country = (String)json.get("Country");

            Started = (String)json.get("Started");
            Ends = (String)json.get("Ends");

            Description = (String)json.get("Description");

            username = (String)json.get("username");
            token = (String)json.get("token");


            System.out.println("Insert_Item> username: "+ username
                    +"\n token: "+ token
                    +"\n Category: " + Category
                    +"\n Buy_Price: " + Buy_Price
                    +"\n First_Bid: " + First_Bid
                    +"\n Location: " + Location
                    +"\n Latitude: |" + Latitude
                    +"|\n Longitude: |" + Longitude
                    +"|\n Country: " + Country
                    +"\n Started: " + Started
                    +"\n Enda: " + Ends
                    +"\n Description: " + Description
            );
        }catch(ParseException e){
            System.out.println("Error in the insert_item Servlet!");
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

// insert item
        User user = new User(name);
        String Seller_Rating = user.find_Seller_Rating();
        Item item = null;
        try {
            item = new Item(Name, Category,
                    Buy_Price, First_Bid,
                    Location, Latitude, Longitude, Country,
                    Description,
                    Seller_Rating, name,
                    Started, Ends);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        item.insert();

        /*Success message*/
        String message;
        JSONObject json = new JSONObject();
        json.put("body", "Success");
        message = json.toString();
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
