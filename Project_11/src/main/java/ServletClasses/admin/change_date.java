package ServletClasses.admin;

import com.mongodb.*;
import org.json.simple.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;

@WebServlet(name = "change_date")
public class change_date extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("items");
        DBCursor cursor = collection.find();
        while(cursor.hasNext()) {
            cursor.next();

            String date_str = (String)cursor.curr().get("Ends");
            System.out.println(date_str);

            Calendar cal = Calendar.getInstance();
            SimpleDateFormat sdf = new SimpleDateFormat("MMM-dd-yy HH:mm:ss", Locale.ENGLISH);
            try {
                cal.setTime(sdf.parse(date_str));// all done
            } catch (ParseException e) {
                e.printStackTrace();
            }

            SimpleDateFormat sdf1 = new SimpleDateFormat("MMM-dd-yy HH:mm:ss", Locale.ENGLISH);
            Calendar calendar1 = new GregorianCalendar(2020,cal.get(Calendar.MONTH),cal.get(Calendar.DAY_OF_MONTH),
                    cal.get(Calendar.HOUR_OF_DAY),cal.get(Calendar.MINUTE),cal.get(Calendar.SECOND));
            System.out.println("#2. " + sdf1.format(calendar1.getTime())+"\n");

            BasicDBObject newDocument = new BasicDBObject();
            newDocument.append("$set", new BasicDBObject().append("Ends", sdf1.format(calendar1.getTime())));
            BasicDBObject searchQuery = new BasicDBObject().append("_ItemID", cursor.curr().get("_ItemID"));
            collection.update(searchQuery, newDocument);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

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
//        response.setHeader("Access-Control-Allow-Methods", "POST");

//        response.setHeader("Access-Control-Allow-Credentials" ,"true");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type");
        response.addHeader("Access-Control-Allow-Headers", "Accept");
    }
}