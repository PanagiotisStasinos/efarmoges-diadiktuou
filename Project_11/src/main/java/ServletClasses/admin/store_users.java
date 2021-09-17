package ServletClasses.admin;

import DataClasses.UserData.User;
import com.mongodb.*;
import org.apache.commons.lang3.StringEscapeUtils;
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;

import com.mongodb.util.JSON;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

@WebServlet(name = "store_users")
public class store_users extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String f = request.getParameter("file");

        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("info");

        BasicDBObject newDoc = new BasicDBObject();
        JSONObject temp_obj = new JSONObject();
        temp_obj.put("numbers", f);
        newDoc.append("$push", new BasicDBObject().append("numbers", temp_obj));

        BasicDBObject searchQuery1 = new BasicDBObject().append("name", "files");
        collection.update(searchQuery1, newDoc);

        DBCollection collection1 = db.getCollection("user");


        JSONParser parser = new JSONParser();
//        String path = "C:\\Users\\panai\\Desktop\\ebay-data\\json_with_top_level_root\\items-"+f+".json";
            String path = "C:\\Users\\Zisis\\Desktop\\json\\\\items-"+f+".json";
        try {
            Object obj = parser.parse(new FileReader(path));

            JSONObject Obj = (JSONObject) obj;
            JSONObject items = (JSONObject) Obj.get("Items");
            JSONArray item = (JSONArray) items.get("Item");

            int i = 0;
            int j = 0;
            for (Object o : item) {
                JSONObject Item_jsonObject = (JSONObject) o;

                // -1- // Checking bids for new users (or for users that already exist to update their bids)
                String Number_of_Bids = (String) Item_jsonObject.get("Number_of_Bids");
                if (!Number_of_Bids.equals("0")) { //uparxoun bids
                    JSONObject Bids = (JSONObject) Item_jsonObject.get("Bids");
                    JSONArray Bid = (JSONArray) Bids.get("Bid");
                    for (Object Temp_Object : Bid) {
                        JSONObject Temp_Bid = (JSONObject) Temp_Object;
                        String Amount = (String) Temp_Bid.get("Amount");
                        JSONObject Bidder = (JSONObject) Temp_Bid.get("Bidder");
                        String Location = (String) Bidder.get("Location");
                        String Escaped_Location = StringEscapeUtils.escapeXml(Location);
                        String Country = (String) Bidder.get("Country");
                        String Escaped_Country = StringEscapeUtils.escapeXml(Country);
                        String _Rating = (String) Bidder.get("_Rating");
                        String _UserID = (String) Bidder.get("_UserID");

                        User temp_user = new User(_UserID, "1", _UserID, null, null, null, null, null, Escaped_Location, null, null, Escaped_Country, _Rating, null);
                        if (temp_user.name_exists().equals("name already exists")) {
                            //                            System.out.println("Bidder "+temp_user.get_username()+" already exists");
                            BasicDBObject newDocument = new BasicDBObject();

                            JSONObject temp_object = new JSONObject();
                            temp_object.put("Category", Item_jsonObject.get("Category"));
                            temp_object.put("_ItemID", Item_jsonObject.get("_ItemID"));
                            temp_object.put("Amount", Amount);
                            newDocument.append("$push", new BasicDBObject().append("BidItems", temp_object));

                            BasicDBObject searchQuery = new BasicDBObject().append("username", temp_user.get_username());
                            collection1.update(searchQuery, newDocument);

                            j++;
                        } else {
                            //                            System.out.println("Bidder "+temp_user.get_username()+" doesn't exist");
                            String json = "{'username' : '" + temp_user.get_username() +
                                    "' ,'password' : '" + temp_user.get_password() +
                                    "' ,'surname' : 'null" +
                                    "' ,'first_name' : 'null" +
                                    "' ,'afm' : 'null" +
                                    "' ,'email' : 'null" +
                                    "' ,'phone_number' : 'null" +
                                    "' ,'verified' : 'true" +
                                    "' ,'Location' : '" + temp_user.get_Location() +
                                    "' ,'Country' : '" + temp_user.get_Country() +
                                    "' ,'_UserID' : '" + temp_user.get_UserID() +
                                    "' ,'Bidder_Rating' : '" + temp_user.get_Bidder_Rating() +
                                    "' ,'Seller_Rating' : '" + temp_user.get_Seller_Rating() + "'}";

                            DBObject dbObject = (DBObject) JSON.parse(json);
                            collection1.insert(dbObject);

                            BasicDBObject newDocument = new BasicDBObject();

                            JSONObject temp_object = new JSONObject();
                            temp_object.put("Category", Item_jsonObject.get("Category"));
                            temp_object.put("_ItemID", Item_jsonObject.get("_ItemID"));
                            temp_object.put("Amount", Amount);
                            newDocument.append("$push", new BasicDBObject().append("BidItems", temp_object));

                            BasicDBObject searchQuery = new BasicDBObject().append("username", temp_user.get_username());
                            collection1.update(searchQuery, newDocument);
                            i++;
                        }
                    }
                }

                // -2- // Checking Seller for new users
                JSONObject Seller = (JSONObject) Item_jsonObject.get("Seller");
                String _UserID = (String) Seller.get("_UserID");
                String _Rating = (String) Seller.get("_Rating");
                String Country = (String) Item_jsonObject.get("Country");
                String Location=null, Latitude=null, Longitude=null, Escaped_Location=null;
                if( Item_jsonObject.get("Location") instanceof  String){
                    Location = (String) Item_jsonObject.get("Location");
                    Escaped_Location = StringEscapeUtils.escapeXml(Location);
                }
                else {
                    try {
                        String Location_info = Item_jsonObject.get("Location").toString();
                        JSONParser parser2 = new org.json.simple.parser.JSONParser();
                        JSONObject Loc = (JSONObject) parser2.parse(Location_info);

                        Location = (String) Loc.get("__text");
                        Escaped_Location = StringEscapeUtils.escapeXml(Location);
                        Longitude = (String) Loc.get("_Longitude");
                        Latitude = (String) Loc.get("_Latitude");
                    }catch(ParseException e){
                        System.out.println("Error in the user_auctions Servlet!");
                    }
                }
                User temp_user = new User(_UserID, "1", _UserID,null, null, null, null, null, Escaped_Location, Longitude, Latitude, Country, null,_Rating);
                if (temp_user.name_exists().equals("name already exists")) {
                    j++;
                } else {   //new user seller
                    //                    System.out.println("Seller "+temp_user.get_username()+" doesn't exist");
                    String json = "{'username' : '" + temp_user.get_username() +
                            "' ,'password' : '" + temp_user.get_password() +
                            "' ,'surname' : 'null" +
                            "' ,'first_name' : 'null" +
                            "' ,'afm' : 'null" +
                            "' ,'email' : 'null" +
                            "' ,'phone_number' : 'null" +
                            "' ,'verified' : 'true" +
                            "' ,'Location' : '" + temp_user.get_Location() +
                            "' ,'Country' : '" + temp_user.get_Country() +
                            "' ,'_UserID' : '" + temp_user.get_UserID() +
                            "' ,'Bidder_Rating' : '" + temp_user.get_Bidder_Rating() +
                            "' ,'Seller_Rating' : '" + temp_user.get_Seller_Rating() + "'}";

                    DBObject dbObject = (DBObject) JSON.parse(json);
                    collection1.insert(dbObject);

                    i++;
                }
                BasicDBObject newDocument1 = new BasicDBObject();
                JSONObject temp_object = new JSONObject();
                temp_object.put("Category", Item_jsonObject.get("Category"));
                temp_object.put("_ItemID", Item_jsonObject.get("_ItemID"));
                newDocument1.append("$push", new BasicDBObject().append("SoldItems", temp_object));
                BasicDBObject searchQuery = new BasicDBObject().append("username", temp_user.get_username());
                collection1.update(searchQuery, newDocument1);
            }
            System.out.println(i + " new users");
            System.out.println(j + " users updated" +f);

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        request.getRequestDispatcher("/admin.jsp").forward(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("info");

        BasicDBObject Query = new BasicDBObject();
//        String key = "name";
        Query.put("name", "files");
        DBCursor cursor = collection.find(Query);

        JSONObject result = new JSONObject();
        if (cursor.hasNext()) {
            cursor.next();
            result.put("numbers",cursor.curr().get("numbers"));
            result.put("name",cursor.curr().get("name"));
        }

        String list = result.get("numbers").toString();
        request.setAttribute("files",list);
        request.getRequestDispatcher("/admin.jsp").forward(request,response);

        /*list*/

//            response.setContentType("application/json");
//            response.setCharacterEncoding("UTF-8");
//            PrintWriter out = response.getWriter();
//            out.print(list);
//            out.flush();
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