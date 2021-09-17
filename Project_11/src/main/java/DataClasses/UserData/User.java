package DataClasses.UserData;

import DataClasses.ItemData.Item;
import DataClasses.ItemData.Location;
import com.mongodb.*;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import com.mongodb.client.MongoCollection;

import com.mongodb.util.JSON;

import java.io.*;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class User {
    private String username;    //gia tous users apo ta .xml arxeia einai idio me to _UserID
    private String password;    //gia tous users apo ta .xml arxeia einai "1" gia olous
    private String _UserID;
    private String verified;

    private String surname;
    private String first_name;

    private String email;
    private String afm;
    private String phone_number;

    private DataClasses.ItemData.Location Location;
    private String Country;

    private String Bidder_Rating;
    private String Seller_Rating;

    public User() {
        this.username = null;
        this.password = null;
    }
    public User(String sUserName, String sUserPassword) {
        this.username = sUserName;
        this.password = sUserPassword;
    }
    public User(String sUserName) {
        this.username = sUserName;
    }
    public User(String sUserName, String sUserPassword, String _UserID,
                String surname, String first_name, String email, String afm, String phone_number,
                String Location, String Longitude, String Latitude,String Country,
                String Bidder_Rating, String Seller_Rating){
        this.username = sUserName;
        this.password = sUserPassword;
        this._UserID = _UserID;
        this.verified = "false";

        this.surname = surname;
        this.first_name = first_name;
        this.email = email;
        this.afm = afm;
        this.phone_number = phone_number;

        this.Location = new Location();
        this.Location.set__text(Location);
        this.Location.set_Latitude(Latitude);
        this.Location.set_Longitude(Longitude);
        this.Country = Country;

        this.Bidder_Rating = Bidder_Rating;
        this.Seller_Rating = Seller_Rating;
    }

    // used in user login
    public boolean isValidUserCredentials(String sUserName, String sUserPassword){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("user");

        BasicDBObject query = new BasicDBObject();;
        query.put("username", sUserName);
        query.put("password", sUserPassword);
        query.put("verified", "true");
        DBCursor cursor = collection.find(query);
        if (cursor.hasNext()) {
            cursor.next();
            System.out.println(cursor.curr().toString());
            return true;
        }
        // username doesn't exists
        return false;
    }
    // used in user login  to see if existing user is verified
    public boolean UserVerified(String sUserName, String sUserPassword){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("user");

        BasicDBObject query = new BasicDBObject();;
        query.put("username", sUserName);
        query.put("password", sUserPassword);
        query.put("verified", "false");
        DBCursor cursor = collection.find(query);
        if (cursor.hasNext()) {
            cursor.next();
            System.out.println(cursor.curr().toString());
            return true;
        }
        // username doesn't exists
        return false;
    }
    // register a user
    public String ValidateRegistration(String sUserName, String sUserPassword, String sConPassword){
        MongoClient mongoClient = new MongoClient("localhost", 27017);
        MongoDatabase database = mongoClient.getDatabase("ergasia");
        MongoCollection<Document> collection = database.getCollection("user");

        List<Document> users = collection.find().into(new ArrayList<Document>());
        //elegxos egkurothtas kwdikou
        if(!sUserPassword.equals(sConPassword)){ //failare to confirm password
            return "Confirmation Error";
        }

        //prepei na brei ean yparxei xrhsths me idio name
        if(this.name_exists().equals("name already exists")){
            return "name already exists";
        }

        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection1 = db.getCollection("user");

        BasicDBObject user = new BasicDBObject();
        user.put("username",this.username);
        user.put("password", this.password);
        user.put("verified",this.verified);

        user.put("surname",this.surname);
        user.put("first_name",this.first_name);

        user.put("email",this.email);
        user.put("afm",this.afm);
        user.put("phone_number",this.phone_number);

        if(this.Location.get_Latitude().equals("")) {
            user.put("Location", this.Location.get__text());
        }
        else {
            JSONObject Location = new JSONObject();

            Location.put("_Latitude", this.Location.get_Latitude());
            Location.put("_Longitude", this.Location.get_Longitude());
            Location.put("__text", this.Location.get__text());

            user.put("Location", Location);
        }
        user.put("Country",this.Country);

        user.put("Seller_Rating",this.Seller_Rating);
        user.put("Bidder_Rating",this.Bidder_Rating);
        user.put("_UserID", this._UserID);

        collection1.insert(user);

        return "OK";
    }

    public String GetUsers() throws IOException {
        MongoClient mongoClient = new MongoClient("localhost", 27017);
        MongoDatabase database = mongoClient.getDatabase("ergasia");
        MongoCollection<Document> collection = database.getCollection("user");

        List<Document> users = collection.find().into(new ArrayList<Document>());
        JSONArray list = new JSONArray();
        for (Document user : users) {
            JSONObject obj = new JSONObject();
            obj.put("_id",user.getObjectId("_id"));
            obj.put("username",user.getString("username"));
            obj.put("password",user.getString("password"));

            list.add(obj);
        }

        JSONObject mainObj = new JSONObject();
        mainObj.put("users", list);

        StringWriter out = new StringWriter();
        mainObj.writeJSONString(out);

        String jsonText = out.toString();
        System.out.print(jsonText);
        return jsonText;
    }
    // used in user register form to check if given name exists
    public String name_exists(){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("user");

        BasicDBObject query = new BasicDBObject();
        query.put("username", this.username);
        DBCursor cursor = collection.find(query);

        if (cursor.hasNext()){
            return "name already exists";
        }

        return "name doesn't exist";
    }

    public String get_username(){
        return this.username;
    }
    public  String get_UserID(){
        return this._UserID;
    }
    public  String get_password(){
        return this.password;
    }
    public  String get_Location(){
        return this.Location.get__text();
    }
    public  String get_Country(){
        return this.Country;
    }
    public  String get_Bidder_Rating(){
        return this.Bidder_Rating;
    }
    public  String get_Seller_Rating(){
        return this.Seller_Rating;
    }
    // find current user's _UserID, null if it doesn't exist
    public  String find_UserID(){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("user");

        BasicDBObject Query = new BasicDBObject();
        Query.put("username", this.username);
        DBCursor cursor = collection.find(Query);
        if (cursor.hasNext()) {
            System.out.println(cursor.next());
            return (String)(cursor.curr().get("_UserID"));
        }
        return null;
    }
    // find current user's Seller_Rating, null if it doesn't exist
    public  String find_Seller_Rating(){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("user");

        BasicDBObject Query = new BasicDBObject();
        Query.put("username", this.username);
        DBCursor cursor = collection.find(Query);
        if (cursor.hasNext()) {
            System.out.println(cursor.next());
            return (String)(cursor.curr().get("Seller_Rating"));
        }
        return null;
    }
    // returns user's info in json format
    public String get_user(){
        //check if user exists
        if(this.name_exists().equals("name doesn't exist")){
            JSONObject obj = new JSONObject();
            obj.put("error", "name doesn't exist");
            return obj.toJSONString();
        }

        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("user");

        BasicDBObject query = new BasicDBObject();
        query.put("username", this.username);
        DBCursor cursor = collection.find(query);

        JSONObject user = new JSONObject();
        if (cursor.hasNext()){
            cursor.next();

            user.put("username",cursor.curr().get("username"));
            user.put("password",cursor.curr().get("password"));
            user.put("_UserID",cursor.curr().get("_UserID"));
            user.put("verified",cursor.curr().get("verified"));

            user.put("surname",cursor.curr().get("surname"));
            user.put("first_name",cursor.curr().get("first_name"));

            user.put("email",cursor.curr().get("email"));
            user.put("afm",cursor.curr().get("afm"));
            user.put("phone_number",cursor.curr().get("phone_number"));

            user.put("Location",cursor.curr().get("Location"));
//            user.put("",cursor.curr().get(""));   // Latitude
//            user.put("",cursor.curr().get(""));   // Longitude
            user.put("Country",cursor.curr().get("Country"));

            user.put("Seller_Rating",cursor.curr().get("Seller_Rating"));
            user.put("Bidder_Rating",cursor.curr().get("Bidder_Rating"));
        }

        return user.toJSONString();
    }
    // verifies user and returns it's info
    public String verify_user(){
        //check if user exists
        if(this.name_exists().equals("name doesn't exist")){
            JSONObject obj = new JSONObject();
            obj.put("error", "name doesn't exist");
            return obj.toJSONString();
        }

        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("user");


        BasicDBObject newDocument = new BasicDBObject();
        JSONObject temp_object = new JSONObject();
        temp_object.put("username", this.username);
        newDocument.append("$set", new BasicDBObject().append("verified", "true"));
        BasicDBObject searchQuery = new BasicDBObject().append("username", this.username);
        collection.update(searchQuery, newDocument);

        JSONObject obj = new JSONObject();
        obj.put("message", "ok");
        return obj.toJSONString();
    }

    public String users_paging(int page, int n, String Verified) throws ParseException {
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("user");

        int count=0;
        JSONArray array = new JSONArray();
        BasicDBObject Query = new BasicDBObject();
        Query.put("username", new BasicDBObject("$ne", "admin"));

        if( Verified.equals("Yes") ){
            Query.put("verified", "true");
        }
        else if( Verified.equals("No") ){
            Query.put("verified", "false");
        }
        DBCursor cursor = collection.find(Query);

        cursor.skip(n*(page-1));
        while(cursor.hasNext()) {
            System.out.println(cursor.next());

            JSONObject temp_user = new JSONObject();
            temp_user.put("username", cursor.curr().get("username"));
            temp_user.put("verified", cursor.curr().get("verified"));
            temp_user.put("first_name", cursor.curr().get("first_name"));
            temp_user.put("surname", cursor.curr().get("surname"));

            this.username = (String)cursor.curr().get("username");
            String user_info = this.get_user();
            JSONParser parser = new org.json.simple.parser.JSONParser();
            System.out.println(user_info);
            JSONObject user_obj = (JSONObject) parser.parse(user_info);
            if (user_obj.get("Location") instanceof JSONObject) {
                JSONObject Loc = (JSONObject)user_obj.get("Location");
                temp_user.put("Location",Loc.get("__text"));
            }
            else{
                temp_user.put("Location",user_obj.get("Location"));
            }
            temp_user.put("Country", cursor.curr().get("Country"));
            array.add(temp_user);
            count++;
            if (count == n) { break; }
        }
        JSONObject result = new JSONObject();
        result.put("n", count);
        result.put("items",array);

        return result.toJSONString();
//        return array.toJSONString();
    }
    // return user's auctions
    public String get_auctions(String active) throws ParseException {
        int n=0;
        int count=0;

        //check if user exists
        if(this.name_exists().equals("name doesn't exist")){
            return "name doesn't exist";
        }

// get current date
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM-dd-yy HH:mm:ss", Locale.ENGLISH);
        LocalDateTime now = LocalDateTime.now();

        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("user");

        BasicDBObject query = new BasicDBObject();
        query.put("username", this.username);
        DBCursor cursor = collection.find(query);

        JSONArray items_array = new JSONArray();
        if (cursor.hasNext()) {
            cursor.next();

            if(cursor.curr().get("SoldItems")!=null){
                String sold_items = cursor.curr().get("SoldItems").toString();
                JSONParser parser = new org.json.simple.parser.JSONParser();
                JSONArray SoldItems = (JSONArray) parser.parse(sold_items);
                n = SoldItems.size();
                for (Object o : SoldItems){
                    JSONObject sold_item_obj = (JSONObject)o;
                    // find item
                    String item_id = (String)sold_item_obj.get("_ItemID");
                    Item temp_item = new Item(item_id);
                    String item_info = temp_item.get_item();
                    // create item object
                    JSONParser parser1 = new org.json.simple.parser.JSONParser();
                    JSONObject item = (JSONObject) parser1.parse(item_info);

                    JSONObject temp_item_obj = new JSONObject();
                    temp_item_obj.put("Name",item.get("Name"));
                    temp_item_obj.put("Category",item.get("Category"));
                    temp_item_obj.put("Currently",item.get("Currently"));
                    if( item.get("Buy_Price") != null ) {
                        temp_item_obj.put("Buy_Price", item.get("Buy_Price"));
                    }
                    else{
                        temp_item_obj.put("Buy_Price", "null");
                    }
                    temp_item_obj.put("First_Bid",item.get("First_Bid"));
                    temp_item_obj.put("Number_of_Bids",item.get("Number_of_Bids"));
                    if( item.get("Bids") != null ) {
                        temp_item_obj.put("Bids", item.get("Bids"));
                    }
                    temp_item_obj.put("Location",item.get("Location"));
                    temp_item_obj.put("Country",item.get("Country"));
                    temp_item_obj.put("Started",item.get("Started"));
                    temp_item_obj.put("Ends",item.get("Ends"));
                    temp_item_obj.put("Seller",item.get("Seller"));
                    temp_item_obj.put("Description",item.get("Description"));
                    temp_item_obj.put("_ItemID",item.get("_ItemID"));

// compare dates, active inactive
                    String date_str = (String)item.get("Ends");
                    LocalDateTime ends = LocalDateTime.parse(date_str, dtf);

                    if (ends.compareTo(now) > 0) {
                        temp_item_obj.put("active","true");
                        System.out.println("ends > now");
                        if(active.equals("true") || active.equals("All")){
                            items_array.add(temp_item_obj);
                            count++;
                        }
                    } else if (ends.compareTo(now) < 0) {
                        temp_item_obj.put("active","false");
                        System.out.println("ends > now");
                        if(active.equals("false") || active.equals("All")){
                            items_array.add(temp_item_obj);
                            count++;
                        }
                    } else if (ends.compareTo(now) == 0) {
                        temp_item_obj.put("active","false");
                        System.out.println("ends == now");
                        if(active.equals("false") || active.equals("All")){
                            items_array.add(temp_item_obj);
                            count++;
                        }
                    }
                }
            }
        }
        JSONObject obj = new JSONObject();
        obj.put("SoldItems",items_array);
        obj.put("n",String.valueOf(n));     // total number
        obj.put("count",String.valueOf(count)); // number of asked type
        return obj.toJSONString();
    }
    // deletes item with item_id from SoldItems array
    public String delete_sold_item(String item_id){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("user");

        BasicDBObject newDocument = new BasicDBObject();
        JSONObject temp_object = new JSONObject();
        temp_object.put("_ItemID", item_id);
        newDocument.append("$pull", new BasicDBObject().append("SoldItems", temp_object));
        BasicDBObject searchQuery = new BasicDBObject().append("username", this.username);
        collection.update(searchQuery, newDocument);

        return  "OK!";
    }
    // adds visited items to an array, to use them in RecommendedItems Servlet
    public void add_visited_item(String item_id){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("user");

// update user VisitedItems
        JSONObject temp_obj = new JSONObject();
        temp_obj.put("_ItemID", item_id);
        BasicDBObject newDocument = new BasicDBObject();
        newDocument.append("$push", new BasicDBObject().append("VisitedItems", temp_obj));
        BasicDBObject searchQuery = new BasicDBObject().append("_UserID", this.username);
        collection.update(searchQuery, newDocument);
    }
}
