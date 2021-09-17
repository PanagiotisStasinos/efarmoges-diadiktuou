/*********************************************/
/*    this class is used only when           */
/*    creating categories collection         */
/*********************************************/


package DataClasses.Admin;

import com.mongodb.*;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.apache.commons.lang3.StringEscapeUtils;
import org.bson.Document;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

public class Category {
    private String Category;
    private String level;
    private String UpperCateg;

    public Category(){}

    public Category(String Category, String level, String UpperCateg){
        this.Category = StringEscapeUtils.escapeXml(Category);
        this.level = StringEscapeUtils.escapeXml(level);
        this.UpperCateg = StringEscapeUtils.escapeXml(UpperCateg);
    }


    public Boolean categ_exists(){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection = db.getCollection("categories");

        BasicDBObject whereQuery = new BasicDBObject();
        whereQuery.put("Category", this.Category);
        whereQuery.put("level", this.level);
        whereQuery.put("UpperCateg", this.UpperCateg);
        DBCursor cursor = collection.find(whereQuery);

        if(cursor.hasNext()){
            return true;
        }
        return false;
    }

    public Boolean insert_categ(String SubCat){
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection1 = db.getCollection("categories");


        String json = "{'Category' : '"+ this.Category+
                "' ,'level' : '"+ this.level+
                "' ,'UpperCateg' : '"+ this.UpperCateg+"'}";
        DBObject dbObject = (DBObject) JSON.parse(json);
        collection1.insert(dbObject);

        BasicDBObject newDocument = new BasicDBObject();
        JSONObject temp_object = new JSONObject();
        if( !SubCat.equals("NULL") ){
            temp_object.put("Category", StringEscapeUtils.escapeXml(SubCat));
        }
        newDocument.append("$push", new BasicDBObject().append("SubCategories", temp_object));
        BasicDBObject searchQuery = new BasicDBObject().append("Category", this.Category);
        collection1.update(searchQuery, newDocument);

        return true;
    }

    public Boolean update_categ(String SubCat) {
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection collection1 = db.getCollection("categories");

        BasicDBObject newDocument = new BasicDBObject();
        JSONObject temp_object = new JSONObject();
        temp_object.put("Category", StringEscapeUtils.escapeXml(SubCat));
        newDocument.append("$addToSet", new BasicDBObject().append("SubCategories", temp_object));
        BasicDBObject searchQuery = new BasicDBObject().append("Category", this.Category);
        searchQuery.append("UpperCateg", this.UpperCateg);
        collection1.update(searchQuery, newDocument);

        return true;
    }

    public String get_SubCategories(String mainCategory, String level) throws IOException {
        String jsonText = null;
        MongoClient mongoClient = new MongoClient("localhost", 27017);
        MongoDatabase database = mongoClient.getDatabase("ergasia");
        MongoCollection<Document> collection = database.getCollection("categories");

        List<Document> categories = collection.find().into(new ArrayList<Document>());
        for (Document categ : categories) {
            String temp_cat = (String) categ.get("Category");
            String temp_level = (String) categ.get("level");
            if(temp_cat.equals(mainCategory) && temp_level.equals( level )){
                JSONArray list = new JSONArray();
                List<Document> categList = (List<Document>) categ.get("SubCategories");
                for (Document doc : categList) {
                    JSONObject obj = new JSONObject();
                    String categ_str = doc.getString("Category");
                    if(categ_str != null) {
                        obj.put("Category", categ_str);
                        list.add(obj);
                    }
                }

                JSONObject mainObj = new JSONObject();
                mainObj.put("SubCategories", list);

                StringWriter out = new StringWriter();
                mainObj.writeJSONString(out);

                jsonText = out.toString();
                break;
            }
        }
        return jsonText;
    }
}