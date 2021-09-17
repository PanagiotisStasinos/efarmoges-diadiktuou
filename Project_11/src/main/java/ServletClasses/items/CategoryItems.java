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

@WebServlet(name = "CategoryItems")
public class CategoryItems extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String upper_category= null,
                category = null,
                level = null,
                number_of_items = null,
                number_of_page = null;

        BufferedReader buffer = request.getReader();
        String str = buffer.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);

            upper_category = (String)json.get("upper_category");
            category = (String)json.get("category");
            level = (String)json.get("level");
            number_of_items = (String)json.get("number_of_items");
            number_of_page = (String)json.get("number_of_page");

        }catch(ParseException e){
            System.out.println("Error in CategoryItems Servlet! ");
        }

        int n = Integer.parseInt(number_of_items);
        int p = Integer.parseInt(number_of_page);
        System.out.println(upper_category+" "+category+" "+level+" "+number_of_items+" "+p);
// get items
        Item item = new Item();
        String items = item.get_items(upper_category, category, level, n, p);
// send items to front end
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