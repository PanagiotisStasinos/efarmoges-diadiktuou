package ServletClasses.items;

import DataClasses.ItemData.Item;
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

@WebServlet(name = "search")
public class search extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String  Name=null,
                upper_category=null,
                level=null,
                Category = null,
                Max_Price=null,
                Min_Price=null,
                Description=null,
                number_of_page=null,
                number_of_items=null,
                Location=null,
                Latitude=null,
                Longitude=null ,
                Country=null,
                next_skipped_items=null;

        int lvl=0, p=1, n=10, s=0;
        BufferedReader buffer1 = request.getReader();
        String str = buffer1.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);

            Name = (String)json.get("Name");
            upper_category = (String)json.get("upper_category");
            level =(String)json.get("level");
            lvl = Integer.parseInt(level);
            Category = (String)json.get("Category");
            Max_Price = (String)json.get("Max_Price");
            Min_Price = (String)json.get("Min_Price");
            Description = (String)json.get("Description");
            number_of_page = (String)json.get("number_of_page");
            p = Integer.parseInt(number_of_page);
            number_of_items = (String)json.get("number_of_items");
            n = Integer.parseInt(number_of_items);
            Location = (String)json.get("Location");
            Country = (String)json.get("Country");
            Longitude = (String)json.get("Longitude");
            Latitude = (String)json.get("Latitude");

            next_skipped_items = (String)json.get("next_skipped_items");
            s = Integer.parseInt(next_skipped_items);


            System.out.println("Serach> Name: "+ Name
                    +"\n upper_category: " + upper_category
                    +"\n level: " + level
                    +"\n Category: " + Category
                    +"\n Max_price: " + Max_Price
                    +"\n Min_price: " + Min_Price
                    +"\n Description: " + Description
                    +"\n number_of_page: " + number_of_page
                    +"\n number_of_items: " + number_of_items
                    +"\n Location: " + Location
                    +"\n Latitude: |" + Latitude
                    +"|\n Longitude: |" + Longitude
                    +"|\n Country: " + Country
                    +"|\n next_skipped_items: " + next_skipped_items
            );
        }catch(ParseException e){
            System.out.println("Error in the insert_item Servlet!");
        }

// search items
        Item item = new Item();
        String items = null;
        try {
            items = item.search_items(Name, upper_category, Category, lvl,
                    Max_Price, Min_Price, Description, p, n,
                    Location, Country, Longitude, Latitude, s);
        } catch (ParseException e) {
            e.printStackTrace();
        }
// return items
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.print(items);
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