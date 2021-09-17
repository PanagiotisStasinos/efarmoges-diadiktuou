package ServletClasses.admin;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.*;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

// escape & in category
import org.apache.commons.lang3.StringEscapeUtils;


@WebServlet(name = "get_items")
public class get_items extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String type = null;

        BufferedReader buffer1 = request.getReader();
        String str = buffer1.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);

            type = (String)json.get("type");

            System.out.println("get_items> file type: "+ type );
        }catch(ParseException e){
            System.out.println("Error in the get_items Servlet!");
        }

        Process p = Runtime.getRuntime().exec("mongoexport --db ergasia --collection items --jsonArray --out C:\\Users\\Zisis\\IdeaProjects\\Project_11\\src\\main\\webapp\\WEB-INF\\resources\\test.json");

        // kapoies fores den evriske to file sto parse kai mallon den eixe dhmiourghthei to arxeio apo to mongoexport mexri tote
        try {
            p.waitFor();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        JSONParser parser = new JSONParser();
        JSONArray Item = new JSONArray();
        BufferedWriter writer = new BufferedWriter(new FileWriter("C:\\Users\\Zisis\\IdeaProjects\\Project_11\\src\\main\\webapp\\WEB-INF\\resources\\output.xml"));
        writer.write("<Items>\n");
        try {
            Object obj = parser.parse(new FileReader("C:\\Users\\Zisis\\IdeaProjects\\Project_11\\src\\main\\webapp\\WEB-INF\\resources\\test.json"));

            JSONArray jsonObjects =  (JSONArray) obj;

            int item=0;
            for (Object o : jsonObjects) {
                JSONObject Item_jsonObject = (JSONObject) o;
                Item.add(Item_jsonObject);

                // _ItemID
                String _ItemID = (String) Item_jsonObject.get("_ItemID");
                writer.write("  <Item ItemID=\""+_ItemID+"\">\n");

                // Name of item
                String Name = (String) Item_jsonObject.get("Name");
                String Escaped_Name = StringEscapeUtils.escapeXml(Name);
                writer.write("    <Name>"+Escaped_Name+"</Name>\n");

                // Categories of item
                JSONArray Category = (JSONArray)Item_jsonObject.get("Category");
                for(Object Temp_Category : Category)
                {
                    String EscapedUtils_Category = StringEscapeUtils.escapeXml(Temp_Category.toString());
                    writer.write("    <Category>"+EscapedUtils_Category+"</Category>\n");
                }

                // Currently price of item
                String Currently = (String) Item_jsonObject.get("Currently");
                writer.write("    <Currently>"+Currently+"</Currently>\n");

                // Buy_Price of item (if it exists)
                String Buy_Price = (String) Item_jsonObject.get("Buy_Price");
                if( Buy_Price != null) {
                    writer.write("    <Buy_Price>" + Buy_Price + "</Buy_Price>\n");
                }

                // First_Bid
                String First_Bid = (String) Item_jsonObject.get("First_Bid");
                writer.write("    <First_Bid>"+First_Bid+"</First_Bid>\n");

                // Number_of_Bids
                String Number_of_Bids = (String) Item_jsonObject.get("Number_of_Bids");
                writer.write("    <Number_of_Bids>"+Number_of_Bids+"</Number_of_Bids>\n");

                if( !Number_of_Bids.equals("0") ) {
                    writer.write("    <Bids>\n");
                    // Bids
                    JSONObject Bids = (JSONObject) Item_jsonObject.get("Bids");
                    JSONArray Bid = (JSONArray) Bids.get("Bid");
                    int i=0;
                    for (Object Temp_Object : Bid) {
                        writer.write("      <Bid>\n");
                        JSONObject Temp_Bid = (JSONObject) Temp_Object;
                        JSONObject Bidder = (JSONObject) Temp_Bid.get("Bidder");

                        String Location = (String) Bidder.get("Location");
                        String Escaped_Location = StringEscapeUtils.escapeXml(Location);
                        String Country = (String) Bidder.get("Country");
                        String Escaped_Country = StringEscapeUtils.escapeXml(Country);
                        String _Rating = (String) Bidder.get("_Rating");
                        String _UserID = (String) Bidder.get("_UserID");
                        writer.write("        <Bidder Rating=\""+_Rating+"\" UserID=\""+_UserID+"\">\n");
                        writer.write("          <Location>"+Escaped_Location+"</Location>\n");
                        writer.write("          <Country>"+Escaped_Country+"</Country>\n");
                        writer.write("        </Bidder>\n");

                        String Time = (String) Temp_Bid.get("Time");
                        writer.write("        <Time>"+Time+"</Time>\n");
                        String Amount = (String) Temp_Bid.get("Amount");
                        writer.write("        <Amount>"+Amount+"</Amount>\n");

                        writer.write("      </Bid>\n");
                        i++;
                    }

                    writer.write("    </Bids>\n");
                }
                else{
                    writer.write("    <Bids />\n");
                }

                // Location
                if(Item_jsonObject.get("Location") instanceof JSONObject){
                    JSONObject Location = (JSONObject) Item_jsonObject.get("Location");
                    String Longitude = (String) Location.get("_Longitude");
                    String Latitude = (String) Location.get("_Latitude");
                    String Loc= (String) Location.get("__text");
                    String Escaped_Location = StringEscapeUtils.escapeXml(Loc);
                    writer.write("    <Location Latidude=\""+Latitude+"\" Longitude=\""+Longitude+"\">"+Escaped_Location+"</Location>\n");
                }
                else{
                    String Location = (String) Item_jsonObject.get("Location");
                    String Escaped_Location = StringEscapeUtils.escapeXml(Location);
                    writer.write("    <Location>"+Escaped_Location+"</Location>\n");
                }

                // Started
                String Started = (String) Item_jsonObject.get("Started");
                writer.write("    <Started>"+Started+"</Started>\n");

                // Ends
                String Ends = (String) Item_jsonObject.get("Ends");
                writer.write("    <Ends>"+Ends+"</Ends>\n");

                // Seller of item
                JSONObject Seller = (JSONObject) Item_jsonObject.get("Seller");
                String _UserID = (String) Seller.get("_UserID");
                String _Rating = (String) Seller.get("_Rating");
                writer.write("    <Seller Rating=\""+_Rating+"\" UserID=\""+_UserID+"\" />\n");

                // Description
                String Description = (String) Item_jsonObject.get("Description");
                if(!Description.equals("")){
                    String EscapedUtils_Description = StringEscapeUtils.escapeXml(Description);
                    writer.write("    <Description>"+EscapedUtils_Description+"</Description>\n");
                }
                else{
                    writer.write("    <Description />\n");
                }

                // close Item tag
                writer.write("  </Item>\n");

//                if (item==1) break;
                item++;
            }

        } catch (FileNotFoundException e) {
            System.out.println("File not Found");
            e.printStackTrace();
        } catch (IOException e) {
            System.out.println("IOExeption");
            e.printStackTrace();
        } catch (ParseException e) {
            System.out.println("ParseExeption");
            e.printStackTrace();
        }

        writer.write("</Items>");
        writer.close();


        JSONObject Items = new JSONObject();
        Items.put("Item",Item);
        JSONObject json = new JSONObject();
        json.put("Items",Items);

        Files.write(Paths.get("C:\\Users\\Zisis\\IdeaProjects\\Project_11\\src\\main\\webapp\\WEB-INF\\resources\\output.json"), json.toJSONString().getBytes());


//        request.getRequestDispatcher("/admin.jsp").forward(request,response);

        String filePath = null;
        if(type.equals("json")){
            filePath = "C:\\Users\\Zisis\\IdeaProjects\\Project_11\\src\\main\\webapp\\WEB-INF\\resources\\output.json";

        }
        else{
            filePath = "C:\\Users\\Zisis\\IdeaProjects\\Project_11\\src\\main\\webapp\\WEB-INF\\resources\\output.xml";
        }
        File downloadFile = new File(filePath);
        FileInputStream inStream = new FileInputStream(downloadFile);

        // if you want to use a relative path to context root:
        String relativePath = getServletContext().getRealPath("");
        System.out.println("relativePath = " + relativePath);

        // obtains ServletContext
        ServletContext context = getServletContext();

        // gets MIME type of the file
        String mimeType = context.getMimeType(filePath);
        if (mimeType == null) {
            // set to binary type if MIME mapping not found
            mimeType = "application/octet-stream";
        }
        System.out.println("MIME type: " + mimeType);

        // modifies response
        response.setContentType(mimeType);
        response.setContentLength((int) downloadFile.length());

        // forces download
        String headerKey = "Content-Disposition";
        String headerValue = String.format("attachment; filename=\"%s\"", downloadFile.getName());
        response.setHeader(headerKey, headerValue);

        // obtains response's output stream
        OutputStream outStream = response.getOutputStream();

        byte[] buffer = new byte[4096];
        int bytesRead = -1;

        while ((bytesRead = inStream.read(buffer)) != -1) {
            outStream.write(buffer, 0, bytesRead);
        }

        outStream.flush();
        inStream.close();
        outStream.close();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);

        String type = null;

        BufferedReader buffer1 = request.getReader();
        String str = buffer1.lines().collect(Collectors.joining());
        try {
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(str);

            type = (String)json.get("type");

            System.out.println("get_items> file type: "+ type );
        }catch(ParseException e){
            System.out.println("Error in the get_items Servlet!");
        }

//        String type = request.getParameter("type");

        // reads input file from an absolute path
        String filePath = null;
        if(type.equals("json")){
            filePath = "C:\\Users\\Zisis\\IdeaProjects\\Project_11\\src\\main\\webapp\\WEB-INF\\resources\\output.json";
        }
        else{
            filePath = "C:\\Users\\Zisis\\IdeaProjects\\Project_11\\src\\main\\webapp\\WEB-INF\\resources\\output.xml";
        }
        File downloadFile = new File(filePath);
        FileInputStream inStream = new FileInputStream(downloadFile);

        // if you want to use a relative path to context root:
        String relativePath = getServletContext().getRealPath("");
        System.out.println("relativePath = " + relativePath);

        // obtains ServletContext
        ServletContext context = getServletContext();

        // gets MIME type of the file
        String mimeType = context.getMimeType(filePath);
        if (mimeType == null) {
            // set to binary type if MIME mapping not found
            mimeType = "application/octet-stream";
        }
        System.out.println("MIME type: " + mimeType);

        // modifies response
        response.setContentType(mimeType);
        response.setContentLength((int) downloadFile.length());

        // forces download
        String headerKey = "Content-Disposition";
        String headerValue = String.format("attachment; filename=\"%s\"", downloadFile.getName());
        response.setHeader(headerKey, headerValue);

        // obtains response's output stream
        OutputStream outStream = response.getOutputStream();

        byte[] buffer = new byte[4096];
        int bytesRead = -1;

        while ((bytesRead = inStream.read(buffer)) != -1) {
            outStream.write(buffer, 0, bytesRead);
        }

        inStream.close();
        outStream.close();
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

        response.addHeader("Access-Control-Allow-Headers", "Content-Length");


    }
}