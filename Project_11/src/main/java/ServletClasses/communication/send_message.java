package ServletClasses.communication;

import DataClasses.JWToken.JsonWebToken;
import DataClasses.communication.user_message_box;
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

@WebServlet(name = "send_message")
public class send_message extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String user_id=null,
                message=null,
                other_user_id=null,
                token=null;

        BufferedReader buffer1 = request.getReader();
        String str = buffer1.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);
            json.toString();

            user_id = (String)json.get("_UserID");
            message = (String)json.get("text");
            other_user_id = (String)json.get("Other_UserID");
            token = (String)json.get("token");

            System.out.println("send_message> sender user_id: "+ user_id
                    + "\n  token: "+ token
                    +"\n text: " + message
                    +"\n receiver: " + other_user_id);
        }catch(ParseException e){
            System.out.println("Error in the send_message Servlet!");
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



        // success
        JSONObject obj = new JSONObject();
        obj.put("message","success");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.print(obj.toJSONString());
        out.flush();

        // send message
        user_message_box box = new user_message_box(name);
        box.insert_message(message, other_user_id);

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
