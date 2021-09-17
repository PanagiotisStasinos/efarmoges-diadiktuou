/*********************************************/
/*    this servlet is used only when         */
/*    creating categories collection         */
/*********************************************/

package ServletClasses.admin;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import DataClasses.Admin.Category;
import com.mongodb.*;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "find_categories")
public class find_categories extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        List<String> categ_array = new ArrayList<>();
        MongoClient mongoC = new MongoClient("localhost", 27017);
        DB database = mongoC.getDB("ergasia");
        DBCollection collec1 = database.getCollection("items");

        int max=-1;     //megisto plithos upokathgoriwn
        int loops=0;    //number of items
        int[] c = {0, 0, 0, 0, 0, 0};
        for( DBObject dock : collec1.find() ) {
            List<String> categ = (List<String>) dock.get( "Category" );

            // Do Something...
            c[categ.size()-1]++;

            if (max<categ.size()){
                max = categ.size();
            }
            if (!categ_array.contains(categ.get(0))) {
                categ_array.add(categ.get(0));
            }
            if(categ.size()==3){
                for(int i=0; i<3; i++){
                    System.out.printf("%s ",categ.get(i));
                }
                System.out.println("");
            }
            loops++;
        }
        for(int i=0; i<6; i++){
            System.out.println("[category "+i+", "+c[i]+"]");
        }
        System.out.println("max"+max);


        loops=0;
        for( DBObject dock : collec1.find() ) {
            List<String> categ = (List<String>) dock.get( "Category" );

            if( categ.size()>1 ) {
                Category temp_categ = new Category(categ.get(0), "0", "NULL");
                if (!temp_categ.categ_exists()) {   // categ doesn t exist
                    temp_categ.insert_categ(categ.get(1));
                } else {   //update existing category
                    temp_categ.update_categ(categ.get(1));
                }

                for(int i=1; i<categ.size()-1; i++){
                    Category temp_categ1 = new Category(categ.get(i), String.valueOf(i), categ.get(i-1));
                    if (!temp_categ1.categ_exists()) {   // categ doesn t exist
                        temp_categ1.insert_categ(categ.get(i+1));
                    } else {   //update existing category
                        temp_categ1.update_categ(categ.get(i+1));
                    }
                }

                int level = categ.size()-1;
                Category temp_categ2 = new Category(categ.get(level), String.valueOf(level), categ.get(level-1));
                if (!temp_categ2.categ_exists()) {   // categ doesn t exist
                    temp_categ2.insert_categ("NULL");
                }

            }
            else if( categ.size()==1 ){
                Category temp_categ = new Category(categ.get(0), "0", "NULL");
                if (!temp_categ.categ_exists()) {   // categ doesn t exist
                    temp_categ.insert_categ("NULL");
                }
            }

            loops++;
//            if(loops==5){break;}
            System.out.println(" ------------ loop: "+loops);
        }
        System.out.println(" ------------ loops: "+loops);
        JSONArray list = new JSONArray();
        for (String s : categ_array) {
            System.out.println(s);

            JSONObject obj = new JSONObject();
            obj.put("Category", s);
            list.add(obj);
        }

        JSONObject mainObj = new JSONObject();
        mainObj.put("Categories", list);

        StringWriter out = new StringWriter();
        mainObj.writeJSONString(out);

        String jsonText = out.toString();
        System.out.print(jsonText);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out1 = response.getWriter();
        out1.print(jsonText);
        out1.flush();
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