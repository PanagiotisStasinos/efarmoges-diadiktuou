package DataClasses.communication;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.Mongo;

public class message {
    String text;
    String Other_UserID;
    String time;
    String message_id;

    public message(String text, String Other_UserID, String time, String message_id){
        this.Other_UserID = Other_UserID;
        this.text = text;
        this.time = time;
        this.message_id = message_id;
    }

    public void insert_sended_message(String _UserID){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("messages");

        BasicDBObject message_object = new BasicDBObject();
        message_object.put("Other_UserID", this.Other_UserID);
        message_object.put("text", this.text);
        message_object.put("time", this.time);
        message_object.put("message_id", this.message_id);

        BasicDBObject newDocument = new BasicDBObject();
        newDocument.append("$push", new BasicDBObject().append("outbox", message_object));
        BasicDBObject searchQuery = new BasicDBObject().append("_UserID", _UserID);
        collection.update(searchQuery, newDocument);
    }

    public void insert_received_message(String _UserID){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("messages");

        BasicDBObject message_object = new BasicDBObject();
        message_object.put("Other_UserID", this.Other_UserID);
        message_object.put("text", this.text);
        message_object.put("time", this.time);
        message_object.put("message_id", this.message_id);
        message_object.put("type","unread");

        BasicDBObject newDocument = new BasicDBObject();
        newDocument.append("$push", new BasicDBObject().append("inbox", message_object));
        BasicDBObject searchQuery = new BasicDBObject().append("_UserID", _UserID);
        collection.update(searchQuery, newDocument);
    }
}