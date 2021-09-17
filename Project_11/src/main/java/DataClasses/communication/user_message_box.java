package DataClasses.communication;

import com.mongodb.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class user_message_box {
    String _UserID;
    message inbox[];
    message outbox[];

    public user_message_box(String _UserID){
        this._UserID = _UserID;
    }

    public void insert_message(String text, String other_user_id){
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM-dd-yy kk:mm:ss", Locale.ENGLISH);
        LocalDateTime now = LocalDateTime.now();
        String date = dtf.format(now);

        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("messages");

// sender box
        String s_count;
        BasicDBObject Query = new BasicDBObject();
        Query.put("_UserID", this._UserID);
        DBCursor cursor = collection.find(Query);
        if (cursor.hasNext()) {
            System.out.println(this._UserID);
            System.out.println(cursor.next());
            s_count = (String)cursor.curr().get("count");
        }
        else{
            this.new_box(this._UserID);
            s_count = "0";
        }
        message sender_message = new message(text, other_user_id, date, s_count);
        sender_message.insert_sended_message(this._UserID);

// receiver box
        String r_count;
        BasicDBObject Query1 = new BasicDBObject();
        Query1.put("_UserID", other_user_id);
        DBCursor cursor1 = collection.find(Query1);
        if (cursor1.hasNext()) {
            System.out.println(other_user_id);
            System.out.println(cursor1.next());
            r_count = (String)cursor1.curr().get("count");
        }
        else{
            this.new_box(other_user_id);
            r_count = "0";
        }
        message receiver_message = new message(text, this._UserID, date, r_count);
        receiver_message.insert_received_message(other_user_id);

// count++ for sender box
        BasicDBObject newDocument1 = new BasicDBObject();
        newDocument1.append("$set", new BasicDBObject().append("count", String.valueOf(Integer.parseInt(s_count)+1)));
        BasicDBObject searchQuery1 = new BasicDBObject().append("_UserID", this._UserID);
        collection.update(searchQuery1, newDocument1);

// count++ for receiver box
        BasicDBObject newDocument2 = new BasicDBObject();
        newDocument2.append("$set", new BasicDBObject().append("count", String.valueOf(Integer.parseInt(r_count)+1)));
        BasicDBObject searchQuery2 = new BasicDBObject().append("_UserID", other_user_id);
        collection.update(searchQuery2, newDocument2);
    }

    public void new_box(String user_id){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("messages");

        BasicDBObject document = new BasicDBObject();
        document.put("_UserID", user_id);
        document.put("count", "0");
        collection.insert(document);
    }

    public String get_inbox(){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("messages");

        JSONObject obj = new JSONObject();
        obj.put("UserID", this._UserID);

        BasicDBObject Query = new BasicDBObject();
        Query.put("_UserID", this._UserID);
        DBCursor cursor = collection.find(Query);
        if (cursor.hasNext()) {
            cursor.next();
            obj.put("inbox",cursor.curr().get("inbox"));
        }
        return obj.toJSONString();
    }

    public String get_outbox(){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("messages");

        JSONObject obj = new JSONObject();
        obj.put("UserID", this._UserID);

        BasicDBObject Query = new BasicDBObject();
        Query.put("_UserID", this._UserID);
        DBCursor cursor = collection.find(Query);
        if (cursor.hasNext()) {
            cursor.next();
            obj.put("outbox",cursor.curr().get("outbox"));
        }
        return obj.toJSONString();
    }

    public String delete_message(String message_id){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("messages");

        JSONObject temp_object = new JSONObject();
        temp_object.put("message_id", message_id);
// inbox
        BasicDBObject newDocument = new BasicDBObject();
        newDocument.append("$pull", new BasicDBObject().append("inbox", temp_object));
        BasicDBObject searchQuery = new BasicDBObject().append("_UserID", this._UserID);
        collection.update(searchQuery, newDocument);
// outbox
        BasicDBObject newDocument1 = new BasicDBObject();
        newDocument1.append("$pull", new BasicDBObject().append("outbox", temp_object));
        BasicDBObject searchQuery1 = new BasicDBObject().append("_UserID", this._UserID);
        collection.update(searchQuery1, newDocument1);

        return "ok!";
    }

    public int get_number_of_unread_messages() throws ParseException {
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("messages");

        BasicDBObject Query = new BasicDBObject();
        Query.put("_UserID", this._UserID);
        DBCursor cursor = collection.find(Query);
        int count=0;
        while (cursor.hasNext()) {
            System.out.println(cursor.next());

            if( cursor.curr().get("inbox") != null ) {
                BasicDBList array = (BasicDBList) cursor.curr().get("inbox");
                String inbox_str = array.toString();
                JSONParser parser = new org.json.simple.parser.JSONParser();
                System.out.println(inbox_str);
                JSONArray inbox_array = (JSONArray) parser.parse(inbox_str);

                for (Object o : inbox_array) {
                    JSONObject obj = (JSONObject) o;

                    String type = (String) obj.get("type");
                    if (type.equals("unread")) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    public String read_message(String message_id) throws ParseException {
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("messages");

        BasicDBObject Query = new BasicDBObject();
        Query.put("_UserID", this._UserID);
        DBCursor cursor = collection.find(Query);

        while (cursor.hasNext()) {
            System.out.println(cursor.next());

            BasicDBList array = (BasicDBList) cursor.curr().get("inbox");
            String inbox_str = array.toString();
            JSONParser parser = new org.json.simple.parser.JSONParser();
            System.out.println(inbox_str);
            JSONArray inbox_array = (JSONArray) parser.parse(inbox_str);

            for (Object o: inbox_array){
                JSONObject obj = (JSONObject) o;

                String msg_id = (String) obj.get("message_id");
                if(message_id.equals(msg_id)){
                    System.out.println(obj.toJSONString());

                    JSONObject message_object = new JSONObject();
                    message_object.put("Other_UserID", obj.get("Other_UserID"));
                    message_object.put("text", obj.get("text"));
                    message_object.put("time", obj.get("time"));
                    message_object.put("message_id", obj.get("message_id"));
                    message_object.put("type", "read");

                    // inbox
                    JSONObject temp_object = new JSONObject();
                    temp_object.put("message_id", message_id);
                    BasicDBObject newDocument = new BasicDBObject();
                    newDocument.append("$pull", new BasicDBObject().append("inbox", temp_object));
                    BasicDBObject searchQuery = new BasicDBObject().append("_UserID", this._UserID);
                    collection.update(searchQuery, newDocument);

                    BasicDBObject newDocument1 = new BasicDBObject();
                    newDocument1.append("$push", new BasicDBObject().append("inbox", message_object));
                    BasicDBObject searchQuery1 = new BasicDBObject().append("_UserID", _UserID);
                    collection.update(searchQuery1, newDocument1);

                    return message_object.toJSONString();
                }
            }
        }

        return null;
    }
}