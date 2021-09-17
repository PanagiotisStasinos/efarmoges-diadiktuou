package DataClasses.ItemData;

import DataClasses.UserData.User;
import com.mongodb.*;
import org.json.simple.parser.JSONParser;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class Item {
    private String Currently;
    private String Started;
    private String[] Category;
    private String Description;
    private Bid[] Bids;
    private String Buy_Price;
    private String First_Bid;
    private String Number_of_Bids;
    private String Name;
    private String Country;
    private String Ends;
    private Seller Seller;
    private String _ItemID;
    private Location Location;

    public String getCurrently () {
        return Currently;
    }
    public void setCurrently (String Currently)
    {
        this.Currently = Currently;
    }

    public String getStarted ()
    {
        return Started;
    }
    public void setStarted (String Started)
    {
        this.Started = Started;
    }

    public String[] getCategory ()
    {
        return Category;
    }
    public void setCategory (String[] Category)
    {
        this.Category = Category;
    }

    public String getDescription ()
    {
        return Description;
    }
    public void setDescription (String Description)
    {
        this.Description = Description;
    }

    public Bid[] getBids ()
    {
        return Bids;
    }

    public void setFirst_Bid (String First_Bid) {
        this.First_Bid = First_Bid;
    }

    public String getNumber_of_Bids () {
        return Number_of_Bids;
    }
    public void setNumber_of_Bids (String Number_of_Bids) {
        this.Number_of_Bids = Number_of_Bids;
    }

    public String getName () {
        return Name;
    }
    public void setName (String Name) {
        this.Name = Name;
    }

    public String getCountry () {
        return Country;
    }
    public void setCountry (String Country) {
        this.Country = Country;
    }

    public String getEnds () {
        return Ends;
    }
    public void setEnds (String Ends) {
        this.Ends = Ends;
    }

    public Seller getSeller () {
        return Seller;
    }
    public void setSeller (Seller Seller) {
        this.Seller = Seller;
    }

    public String get_ItemID () {
        return _ItemID;
    }
    public void set_ItemID (String _ItemID) {
        this._ItemID = _ItemID;
    }

    @Override
    public String toString() {
        return "ClassItem [Currently = "+Currently+", Started = "+Started+", Category = "+Category+", Description = "+Description+", Bids = "+Bids+", First_Bid = "+First_Bid+", Number_of_Bids = "+Number_of_Bids+", Name = "+Name+", Country = "+Country+", Ends = "+Ends+", Seller = "+Seller+", _ItemID = "+_ItemID+", Location = "+Location+"]";
    }

    public Item( String Currently, String Description){
        this.Description = Description;
    }
    public Item(){}
    public Item(String Name, String Category,
                String Buy_Price, String First_Bid,
                String Location, String Latitude, String Longitude,String Country,
                String Description,
                String Seller_Rating, String _UserID,
                String Started, String Ends) throws ParseException {
        this.Name = Name;
// Category array
        JSONParser parser = new org.json.simple.parser.JSONParser();
        JSONArray CategoryArray = (JSONArray) parser.parse(Category);
        this.Category = new String[CategoryArray.size()];
        int i=0;
        for(Object o : CategoryArray) {
            this.Category[i] = (String)o;
            i++;
        }

        this.First_Bid = "$"+First_Bid;
        this.Currently = "$"+First_Bid;
        this.Buy_Price = "$" + Buy_Price;
        this.Number_of_Bids = "0";


        this.Location = new Location();
        this.Location.set__text(Location);
        this.Location.set_Latitude(Latitude);
        this.Location.set_Longitude(Longitude);
        this.Country = Country;

//        SimpleDateFormat sdf = new SimpleDateFormat("MMM-dd-yy hh:mm:ss", Locale.ENGLISH);
        SimpleDateFormat sdf = new SimpleDateFormat("MMM-dd-yy HH:mm:ss", Locale.ENGLISH);
        Calendar cal1 = Calendar.getInstance();
        try {
            cal1.setTime(sdf.parse(Ends));
        } catch (java.text.ParseException e) {
            e.printStackTrace();
        }
//        SimpleDateFormat sdf1 = new SimpleDateFormat("MMM-dd-yy kk:mm:ss", Locale.ENGLISH);
        SimpleDateFormat sdf1 = new SimpleDateFormat("MMM-dd-yy HH:mm:ss", Locale.ENGLISH);
        Calendar calendar1 = new GregorianCalendar(cal1.get(Calendar.YEAR),cal1.get(Calendar.MONTH),cal1.get(Calendar.DAY_OF_MONTH),
                cal1.get(Calendar.HOUR_OF_DAY),cal1.get(Calendar.MINUTE),cal1.get(Calendar.SECOND));
        System.out.println("Ends: " + sdf1.format(calendar1.getTime())+"\n");
        this.Ends = sdf1.format(calendar1.getTime());

        Calendar cal2 = Calendar.getInstance();
        try {
            cal2.setTime(sdf.parse(Started));
        } catch (java.text.ParseException e) {
            e.printStackTrace();
        }
        Calendar calendar2 = new GregorianCalendar(cal2.get(Calendar.YEAR),cal2.get(Calendar.MONTH),cal2.get(Calendar.DAY_OF_MONTH),
                cal2.get(Calendar.HOUR_OF_DAY),cal2.get(Calendar.MINUTE),cal2.get(Calendar.SECOND));
        this.Started = sdf1.format(calendar2.getTime());

        this.Seller = new Seller();
        this.Seller.set_Rating(Seller_Rating);
        this.Seller.set_UserID(_UserID);

        this.Description = Description;
    }
    public Item(String _ItemID){
        this._ItemID = _ItemID;
    }   // used by servlet get_item

    public boolean insert(){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");

// update info collection
        DBCollection col = db.getCollection("info");
        BasicDBObject Query = new BasicDBObject();
        Query.put("name", "items");
        DBCursor cursor = col.find(Query);
        String count="0";
        if (cursor.hasNext()) {
            cursor.next();
            count = (String)cursor.curr().get("count");
        }
        int Count = Integer.parseInt(count);
        BasicDBObject newDocument = new BasicDBObject();
        newDocument.append("$set", new BasicDBObject().append("count", String.valueOf(Integer.parseInt(count)+1)));
        BasicDBObject searchQuery = new BasicDBObject().append("name", "items");
        col.update(searchQuery, newDocument);



        DBCollection collection = db.getCollection("items");

        JSONArray Category = new JSONArray();
        for(int i=0; i<this.Category.length; i++) {
            Category.add(this.Category[i]);
        }

        JSONObject Seller = new JSONObject();
        Seller.put("_UserID", this.Seller.get_UserID());
        Seller.put("_Rating", this.Seller.get_Rating());

        BasicDBObject item = new BasicDBObject();
        item.put("Name",this.Name);
        item.put("Category", Category);
        item.put("Currently",this.Currently);
        if( !this.Buy_Price.equals("$") ) {
            item.put("Buy_Price", this.Buy_Price);
        }
        item.put("First_Bid",this.First_Bid);
        item.put("Number_of_Bids",this.Number_of_Bids);
        if(this.Location.get_Latitude().equals("")) {
            item.put("Location", this.Location.get__text());
        }
        else {
            JSONObject Location = new JSONObject();

            Location.put("_Latitude", this.Location.get_Latitude());
            Location.put("_Longitude", this.Location.get_Longitude());
            Location.put("__text", this.Location.get__text());

            item.put("Location", Location);
        }
        item.put("Country",this.Country);
        item.put("Started",this.Started);
        item.put("Ends",this.Ends);
        item.put("Seller", Seller);
        item.put("Description",this.Description);
        item.put("_ItemID",String.valueOf(Count+1));

        collection.insert(item);


// update user
        DBCollection col1 = db.getCollection("user");

        JSONObject temp_sold_obj = new JSONObject();
        temp_sold_obj.put("Category", Category);
        temp_sold_obj.put("_ItemID", String.valueOf(Count+1));
        BasicDBObject newDocument2 = new BasicDBObject();
        newDocument2.append("$push", new BasicDBObject().append("SoldItems", temp_sold_obj));
        BasicDBObject searchQuery2 = new BasicDBObject().append("_UserID", this.Seller.get_UserID());
        col1.update(searchQuery2, newDocument2);



        return true;
    }

    public String get_items(String upper_Categ, String Categ, String level, int n, int number_of_page){
        System.out.println(upper_Categ+" "+Categ+" "+level+" "+n+" "+number_of_page);
        int count=0;
        JSONArray array = new JSONArray();
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("items");

        BasicDBObject Query = new BasicDBObject();
        if(upper_Categ==null || upper_Categ.equals("")) {
            String Category_key = "Category." + level;
            Query.put(Category_key, Categ);
        }
        else {
            List<BasicDBObject> obj = new ArrayList<BasicDBObject>();
            String Category_key = "Category." + level;
            obj.add(new BasicDBObject(Category_key, Categ));
            String upperCategory_key = "Category." + (Integer.parseInt(level) - 1);
            obj.add(new BasicDBObject(upperCategory_key, upper_Categ));
            Query.put("$and", obj);

            System.out.println(Query.toString());
        }


        DBCursor cursor = collection.find(Query);
        cursor.skip(n*(number_of_page-1));
        while (cursor.hasNext()) {
            System.out.println(cursor.next());

            JSONObject temp_item = new JSONObject();
            temp_item.put("Name",cursor.curr().get("Name"));
            temp_item.put("_ItemID",cursor.curr().get("_ItemID"));
            temp_item.put("Currently",cursor.curr().get("Currently"));
            temp_item.put("First_Bid",cursor.curr().get("First_Bid"));
            temp_item.put("Number_of_Bids",cursor.curr().get("Number_of_Bids"));
            temp_item.put("Started",cursor.curr().get("Started"));
            temp_item.put("Ends",cursor.curr().get("Ends"));
            array.add(temp_item);

            count++;
            if (count == n) { break; }
        }


        DBCursor cursor1 = collection.find(Query);
        int total_items = cursor1.length();

        JSONObject result = new JSONObject();
        result.put("n", count);
        result.put("total_items", total_items);
        result.put("items",array);

        return result.toJSONString();

//        return array.toJSONString();
    }

    public String search_items(String Name, String upper_category, String Category, int level,
                               String Max_Price, String Min_Price, String Description, int number_of_page, int number_of_items,
                               String Location, String Country, String Longitude, String Latitude, int next_skipped_items) throws ParseException {
        float min=0, max=0;
        if( !Min_Price.equals("") ) {
            min = Float.parseFloat(Min_Price);
            System.out.println("min "+min);
        }
        if( !Max_Price.equals("") ) {
            max = Float.parseFloat(Max_Price);
            System.out.println("max "+max);
        }

        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("items");
        BasicDBObject Query = new BasicDBObject();
        List<BasicDBObject> obj = new ArrayList<BasicDBObject>();
        if ( !Name.equals("")){
            obj.add(new BasicDBObject("Name",
                    new BasicDBObject("$regex", Name)));
        }
        if( !Description.equals("")){
            Query.put("Description",
                    new BasicDBObject("$regex", Description));
        }
        if( !upper_category.equals("")){
            String Category_key = "Category." + (level-1);
            obj.add(new BasicDBObject(Category_key, upper_category));
        }
        if( !Category.equals("")){
            String Category_key = "Category." + level;
            obj.add(new BasicDBObject(Category_key, Category));
        }
        if( !Country.equals("")){
            obj.add(new BasicDBObject("Country", Country));
        }

        Query.put("$and", obj);
        System.out.println(Query.toString());
        DBCursor cursor = collection.find(Query);
        int count=0;
        JSONArray array = new JSONArray();
//        cursor.skip(number_of_items*(number_of_page-1));
        cursor.skip(next_skipped_items);

        int count1=next_skipped_items;   // number to skip next time
        int total=0;
        while (cursor.hasNext()) {
            System.out.println(cursor.next());

            String Loc = null;
            if(cursor.curr().get("Location") instanceof String) {
                Loc = (String) cursor.curr().get("Location");
            }
            else {
                String Loc_obj_str = cursor.curr().get("Location").toString();
                JSONParser parser = new org.json.simple.parser.JSONParser();
                JSONObject Loc_obj = (JSONObject) parser.parse(Loc_obj_str);
                Loc = (String)Loc_obj.get("__text");
            }

            if(!Min_Price.equals("") && !Max_Price.equals("") && ( Loc.contains(Location) || Location.equals("") )) {    // min, max, location
                String price = (String) cursor.curr().get("Currently");
                price = price.substring(1);
                float Price = Float.parseFloat(price);
                if (Price <= max && Price >= min) {
                    if (count < number_of_items) {
                        JSONObject temp_item = new JSONObject();
                        temp_item.put("Name", cursor.curr().get("Name"));
                        temp_item.put("_ItemID", cursor.curr().get("_ItemID"));
                        temp_item.put("Currently", cursor.curr().get("Currently"));
                        temp_item.put("First_Bid", cursor.curr().get("First_Bid"));
                        temp_item.put("Number_of_Bids", cursor.curr().get("Number_of_Bids"));
                        temp_item.put("Started", cursor.curr().get("Started"));
                        temp_item.put("Ends", cursor.curr().get("Ends"));
                        array.add(temp_item);

                        count++;
                    }
                    total++;
                }
            }
            else if (!Min_Price.equals("") && ( Loc.contains(Location) || Location.equals("") )){    // min, location
                String price = (String) cursor.curr().get("Currently");
                price = price.substring(1);
                float Price = Float.parseFloat(price);
                if (Price >= min) {
                    if (count < number_of_items) {
                        JSONObject temp_item = new JSONObject();
                        temp_item.put("Name", cursor.curr().get("Name"));
                        temp_item.put("_ItemID", cursor.curr().get("_ItemID"));
                        temp_item.put("Currently", cursor.curr().get("Currently"));
                        temp_item.put("First_Bid", cursor.curr().get("First_Bid"));
                        temp_item.put("Number_of_Bids", cursor.curr().get("Number_of_Bids"));
                        temp_item.put("Started", cursor.curr().get("Started"));
                        temp_item.put("Ends", cursor.curr().get("Ends"));
                        array.add(temp_item);

                        count++;
                    }
                    total++;
                }
            }
            else if(!Max_Price.equals("") && ( Loc.contains(Location) || Location.equals("") )){     // max, location
                String price = (String) cursor.curr().get("Currently");
                price = price.substring(1);
                float Price = Float.parseFloat(price);
                if (Price < max) {
                    if (count < number_of_items) {
                        JSONObject temp_item = new JSONObject();
                        temp_item.put("Name", cursor.curr().get("Name"));
                        temp_item.put("_ItemID", cursor.curr().get("_ItemID"));
                        temp_item.put("Currently", cursor.curr().get("Currently"));
                        temp_item.put("First_Bid", cursor.curr().get("First_Bid"));
                        temp_item.put("Number_of_Bids", cursor.curr().get("Number_of_Bids"));
                        temp_item.put("Started", cursor.curr().get("Started"));
                        temp_item.put("Ends", cursor.curr().get("Ends"));
                        array.add(temp_item);

                        count++;
                    }
                    total++;
                }
            }
            else if( Loc.contains(Location) || Location.equals("") ) {   // location
                if (count < number_of_items) {
                    JSONObject temp_item = new JSONObject();
                    temp_item.put("Name", cursor.curr().get("Name"));
                    temp_item.put("_ItemID", cursor.curr().get("_ItemID"));
                    temp_item.put("Currently", cursor.curr().get("Currently"));
                    temp_item.put("First_Bid", cursor.curr().get("First_Bid"));
                    temp_item.put("Number_of_Bids", cursor.curr().get("Number_of_Bids"));
                    temp_item.put("Started", cursor.curr().get("Started"));
                    temp_item.put("Ends", cursor.curr().get("Ends"));
                    array.add(temp_item);

                    count++;
                }
                total++;
            }


            if (total <= number_of_items) {
                count1++;
            }
        }

        JSONObject result = new JSONObject();
        result.put("n", count);
        result.put("total_items", total);
        result.put("next_skipped_items", count1);
        result.put("items",array);

        return result.toJSONString();
    }

    public String get_item() throws ParseException {
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("items");

        BasicDBObject Query = new BasicDBObject();
        Query.put("_ItemID", this._ItemID);
        DBCursor cursor = collection.find(Query);
        if (cursor.hasNext()) {
            cursor.next();
            JSONObject obj = new JSONObject();
            obj.put("Name",cursor.curr().get("Name"));
            obj.put("Category",cursor.curr().get("Category"));
            obj.put("Currently",cursor.curr().get("Currently"));
            obj.put("First_Bid",cursor.curr().get("First_Bid"));
            obj.put("Number_of_Bids",cursor.curr().get("Number_of_Bids"));
            if(cursor.curr().get("Bids") != null){
                obj.put("Bids",cursor.curr().get("Bids"));
            }
//Location
            if (cursor.curr().get("Location") instanceof String) {
                obj.put("Location",cursor.curr().get("Location"));
                obj.put("_Longitude","");
                obj.put("_Latitude","");
            }
            else{
                String Location_info = cursor.curr().get("Location").toString();
                JSONParser parser = new org.json.simple.parser.JSONParser();
                JSONObject Location= (JSONObject) parser.parse(Location_info);
                obj.put("Location",Location.get("__text"));
                obj.put("_Longitude",Location.get("_Longitude"));
                obj.put("_Latitude",Location.get("_Latitude"));
            }

            obj.put("Country",cursor.curr().get("Country"));
            obj.put("Started",cursor.curr().get("Started"));
            obj.put("Ends",cursor.curr().get("Ends"));
            obj.put("Seller",cursor.curr().get("Seller"));
            obj.put("Description",cursor.curr().get("Description"));
            obj.put("_ItemID",cursor.curr().get("_ItemID"));
            return obj.toJSONString();
//            return cursor.curr().toString();
        }
        return null;
    }

/****************************************************/
    /*              check if user exists                */
    /*              find bidder's info                  */
    /*              check Number_of_Bids                */
    /*      check if Amount is greater than Currently   */
    /*              get current day                     */
    /*              insert bid in Bids array            */
    /*              update Number_of_Bids +1            */
    /*              update Currently                    */
    /*         add bid to Bidder's bidItems array       */
    /****************************************************/
    public String insert_bid(String str_amount, float float_ammount, String username) throws ParseException {
// user exists
        User user = new User(username);
        if(user.name_exists().equals("name doesn't exist")){
            return "name doesn't exist";
        }

// find bidder's info
        String user_info = user.get_user();
        JSONParser parser = new org.json.simple.parser.JSONParser();
        JSONObject Bidder = (JSONObject) parser.parse(user_info);

// find number of bids
        String str_item = this.get_item();
        JSONObject temp_item = (JSONObject) parser.parse(str_item);
        // number of bids
        String number_of_bids_str = (String) temp_item.get("Number_of_Bids");
        int num_of_bids = Integer.parseInt(number_of_bids_str);
        num_of_bids++;
        // category
        JSONArray Category_list = (JSONArray) temp_item.get("Category");
        String ItemID = (String) temp_item.get("_ItemID");

// check if currently is less than amount
        String currently = (String) temp_item.get("Currently");
        currently = currently.substring(1);
        float cur = Float.parseFloat(currently);
        if(cur>=float_ammount){
            return  "amount <= currently";
        }

        // displaying date in mm-dd-yyyy HH:mm:ss format
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM-dd-yy HH:mm:ss", Locale.ENGLISH);
        LocalDateTime now = LocalDateTime.now();
        String Time = dtf.format(now);

// get ends date
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("items");
        BasicDBObject whereQuery = new BasicDBObject();
        whereQuery.put("_ItemID", this._ItemID);
        DBCursor cursor = collection.find(whereQuery);
        if(cursor.hasNext()){
            cursor.next();
            String item_info = cursor.curr().toString();
            // create item object
            JSONParser parser1 = new org.json.simple.parser.JSONParser();
            JSONObject item = (JSONObject) parser1.parse(item_info);
            String date_str = (String)item.get("Ends");
            LocalDateTime ends = LocalDateTime.parse(date_str, dtf);
// check if auction has expired
            if (ends.compareTo(now) < 0) {
                return "auction has expired";
            }
        }

// upadate items
        JSONObject temp_bidder = new JSONObject();
        System.out.println(Bidder.get("Location").getClass().getSimpleName());
        if (Bidder.get("Location") instanceof JSONObject) {
            JSONObject Loc = (JSONObject)Bidder.get("Location");
            temp_bidder.put("Location",Loc.get("__text"));
        }
        else{
            temp_bidder.put("Location",Bidder.get("Location"));
        }
        temp_bidder.put("Country",Bidder.get("Country"));
        temp_bidder.put("_Rating",Bidder.get("Bidder_Rating"));
        temp_bidder.put("_UserID",Bidder.get("_UserID"));

        JSONObject temp_bid = new JSONObject();
        temp_bid.put("Time", Time);
        temp_bid.put("Amount", "$"+str_amount);
        temp_bid.put("Bidder",temp_bidder);

        BasicDBObject newDocument = new BasicDBObject();
        newDocument.append("$push", new BasicDBObject().append("Bids.Bid", temp_bid));
        BasicDBObject searchQuery = new BasicDBObject().append("_ItemID", this._ItemID);
        collection.update(searchQuery, newDocument);
// update number of_bids
        BasicDBObject newDocument1 = new BasicDBObject();
        newDocument1.append("$set", new BasicDBObject().append("Number_of_Bids", String.valueOf(num_of_bids)));
        BasicDBObject searchQuery1 = new BasicDBObject().append("_ItemID", this._ItemID);
        collection.update(searchQuery1, newDocument1);
// update Currently
        BasicDBObject newDoc1 = new BasicDBObject();
        newDoc1.append("$set", new BasicDBObject().append("Currently", "$"+str_amount));
        BasicDBObject Query1 = new BasicDBObject().append("_ItemID", this._ItemID);
        collection.update(Query1, newDoc1);

// update user bidItems
        JSONObject temp_bid_obj = new JSONObject();
        temp_bid_obj.put("Category", Category_list);
        temp_bid_obj.put("_ItemID", this._ItemID);
        DBCollection collection1 = db.getCollection("user");
        BasicDBObject newDocument2 = new BasicDBObject();
        newDocument2.append("$push", new BasicDBObject().append("BidsItems", temp_bid_obj));
        BasicDBObject searchQuery2 = new BasicDBObject().append("_UserID", username);
        collection1.update(searchQuery2, newDocument2);

        return "OK!";
    }

    // 7.3
    public String update_item(String item_id, String cat_jsonarray_str) throws ParseException {
        this._ItemID = item_id;
        String item_info = this.get_item();
        JSONParser parser1 = new org.json.simple.parser.JSONParser();
        JSONObject item = (JSONObject) parser1.parse(item_info);

        String prev_Name = (String)item.get("Name");
        String prev_Currently = (String)item.get("Currently");
        String prev_First_Bid = (String)item.get("First_Bid");
        String prev_Country = (String)item.get("Country");
        String prev_Started = (String)item.get("Started");
        String prev_Ends = (String)item.get("Ends");
        String prev_Description = (String)item.get("Description");
        String prev_Buy_Price = (String)item.get("Buy_Price");

// Location
        String prev_Location, prev_Latitude, prev_Longitude;
        JSONObject Loc_obj = new JSONObject();
        if( item.get("Location") instanceof String){
            prev_Location = (String)item.get("Location");

            if( prev_Location.equals(this.Location.get__text())) {
                Loc_obj.put("__text", prev_Location);
            }
            else {
                Loc_obj.put("__text", this.Location.get__text());
            }

            if ( !this.Location.get_Latitude().equals("") || !this.Location.get_Longitude().equals("")) {
                Loc_obj.put("_Latitude",this.Location.get_Latitude());
                Loc_obj.put("_Longitude",this.Location.get_Longitude());
            }
            else {
                Loc_obj.put("_Latitude", "null");
                Loc_obj.put("_Longitude", "null");
            }
        }
        else{
            String Location_info = item.get("Location").toString();
            JSONParser parser2= new org.json.simple.parser.JSONParser();
            JSONObject Loc = (JSONObject) parser2.parse(Location_info);

            prev_Location = (String)Loc.get("__text");
            prev_Longitude = (String)Loc.get("_Longitude");
            prev_Latitude = (String)Loc.get("_Latitude");

            Loc_obj.put("__text",prev_Location);
            Loc_obj.put("_Latitude",prev_Longitude);
            Loc_obj.put("_Longitude",prev_Latitude);
        }



        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("items");

        BasicDBObject newDocument = new BasicDBObject();
// Name
        if( ! prev_Name.equals(this.Name) ){ newDocument.put("Name", this.Name); }
        else{ newDocument.put("Name", item.get("Name")); }
// Currently
        if( ! prev_Currently.equals(this.Currently) ) { newDocument.put("Currently", this.Currently); }
        else { newDocument.put("Currently", item.get("Currently")); }
// First_Bid
        if( ! prev_First_Bid.equals(this.First_Bid)) { newDocument.put("First_Bid", this.First_Bid); }
        else{ newDocument.put("First_Bid", item.get("First_Bid")); }
// Country
        if( ! prev_Country.equals(this.Country)) { newDocument.put("Country", this.Country); }
        else{ newDocument.put("Country", item.get("Country")); }
// Started
        if( ! prev_Started.equals(this.Started)) { newDocument.put("Started", this.Started); }
        else { newDocument.put("Started", item.get("Started")); }
// Ends
        if( ! prev_Ends.equals(this.Ends)) { newDocument.put("Ends", this.Ends); }
        else{ newDocument.put("Ends", item.get("Ends")); }
// Description
        if( ! prev_Description.equals(this.Description)) { newDocument.put("Description", this.Description); }
        else{ newDocument.put("Description", item.get("Description")); }
// Buy_Price
        if( prev_Buy_Price==null && !this.Buy_Price.equals("")){
            newDocument.put("Buy_Price", this.Buy_Price);
        }
        else if( !this.Buy_Price.equals("") ){
            newDocument.put("Buy_Price", item.get("Buy_Price"));
        }
// Category list
        if( ! cat_jsonarray_str.equals(((JSONArray)item.get("Category")).toJSONString())){
            JSONParser parser3= new org.json.simple.parser.JSONParser();
            JSONArray cat_array = (JSONArray) parser3.parse(cat_jsonarray_str);
            newDocument.put("Category", cat_array);
        }else{
            newDocument.put("Category", item.get("Category"));
        }
// Location
        newDocument.put("Location", Loc_obj);


        // those fields don t change
        newDocument.put("Seller", item.get("Seller"));
        newDocument.put("_ItemID", item_id);
        newDocument.put("Number_of_Bids","0");
        BasicDBObject searchQuery = new BasicDBObject().append("_ItemID", item_id);

        collection.update(searchQuery, newDocument);
        return newDocument.toString();
    }
    // 7.3
    public String delete_item(String user_id){
// delete item
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("items");
        BasicDBObject document = new BasicDBObject();
        document.put("_ItemID", this._ItemID);
        collection.remove(document);

// delete sold item from user
        User user = new User(user_id);
        String del_sold_item = user.delete_sold_item(this._ItemID);

// send success message
        JSONObject obj = new JSONObject();
        obj.put("delete_item_from_items","OK!");
        obj.put("delete_item_from_SoldItems",del_sold_item);
        return obj.toJSONString();
    }
}