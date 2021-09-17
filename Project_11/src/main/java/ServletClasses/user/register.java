package ServletClasses.user;

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

@WebServlet(name = "register")
public class register extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);
        String Username = null, Password=null, Confirm_Password=null, surname=null, first_name=null,
                email=null, afm=null, phone_number=null,
                Location=null, Longitude=null, Latitude=null, Country=null;

        BufferedReader buffer1 = request.getReader();
        String str = buffer1.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);


            Username = (String)json.get("username");
            Password = (String)json.get("password");
            Confirm_Password = (String)json.get("conpassword");

            surname = (String)json.get("surname");
            first_name = (String)json.get("first_name");
            email = (String)json.get("email");
            afm = (String)json.get("afm");
            phone_number = (String)json.get("phone_number");

            Location = (String)json.get("Location");
            Longitude = (String)json.get("Longitude");
            Latitude = (String)json.get("Latitude");
            Country = (String)json.get("Country");

            System.out.println("Register> username: "+ Username
                    +"\n Password: " + Password
                    +"\n Confirm_password: " + Confirm_Password
                    +"\n surname: " + surname
                    +"\n first_name: " + first_name
                    +"\n email: " + email
                    +"\n afm: " + afm
                    +"\n phone_number: " + phone_number
                    +"\n Location: " + Location
                    +"\n Longitude: " + Longitude
                    +"\n Latitude: " + Latitude
                    +"\n Country: " + Country
            );

        }catch(ParseException e){
            System.out.println("Error in the insert_item Servlet!");
        }

        User user = new User(Username, Password, Username,
                surname, first_name, email, afm, phone_number,
                Location, Longitude, Latitude, Country, null, null);

        String result = user.ValidateRegistration(Username, Password, Confirm_Password);
        if( result.equals("OK")){
            /*Success message*/
            String message;
            JSONObject json = new JSONObject();
            json.put("body", result);
            message = json.toString();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();
            out.print(message);
            out.flush();
        }
        else{
            /*Success message*/
            String error_message;
            JSONObject json = new JSONObject();
            json.put("body", result);
            error_message = json.toString();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();
            out.print(error_message);
            out.flush();
        }
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