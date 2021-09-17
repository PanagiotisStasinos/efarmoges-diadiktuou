package DataClasses.LSHNearestNeighbour;

import DataClasses.ItemData.Item;
import com.mongodb.*;
import info.debatty.java.lsh.LSHSuperBit;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.util.*;

import org.apache.commons.math3.ml.distance.EuclideanDistance;

public class LSH {
    static int stages = 2;
    static int buckets = 4;
    static int K = 6;
    public LSH(){}

    public String lsh(String username) throws ParseException {
        final long startTime = System.currentTimeMillis();
        Mongo mongo = new Mongo("localhost", 27017);
        DB db = mongo.getDB("ergasia");
        DBCollection col_users = db.getCollection("user");
        DBCollection col_items = db.getCollection("items");
// count all users that have done at least one bid
        BasicDBObject whereQuery = new BasicDBObject();
        whereQuery.put("BidItems", new BasicDBObject("$ne", null));
        DBCursor cursor = col_users.find(whereQuery);
        int count = cursor.length();
// count items with at least one bid
        BasicDBObject where_query = new BasicDBObject();
        where_query.put("Number_of_Bids", new BasicDBObject("$ne", "0"));
        DBCursor c = col_items.find(where_query);
        int vector_len = c.length();
        System.out.println( count+" users/vectors , "+vector_len+" items/vector_len");
// array with all items id, map(item_id, index), map(item_id, Currently)
        String[] items_id_array = new String[vector_len];
        DBCursor cursor_items1 = col_items.find(where_query);
        int item_index = 0;
        HashMap<String, Integer> map = new HashMap<>();
        HashMap<String, String> currently_map = new HashMap<>();
        while(cursor_items1.hasNext()) {
            cursor_items1.next();
            items_id_array[item_index] = (String) cursor_items1.curr().get("_ItemID");
            map.put((String) cursor_items1.curr().get("_ItemID"), item_index);
            currently_map.put((String) cursor_items1.curr().get("_ItemID"), (String) cursor_items1.curr().get("Currently"));
            item_index++;
        }
// vectors
        double[][] vectors = new double[count][vector_len];
        double[] main_vector = new double[vector_len];

        int flag = 0;       // 0 visited_items, 1 sold_items
        int i=0;
        final long startLoopTime = System.currentTimeMillis();
        System.out.println("Total execution time 1 : " + (startLoopTime - startTime));
        DBCursor users_cursor = col_users.find(whereQuery);
        while(users_cursor.hasNext()) {     // loop for every user
            users_cursor.next();
            String user_id = (String)users_cursor.curr().get("_UserID");
            BasicDBList array_bids = (BasicDBList) users_cursor.curr().get("BidItems");
            String array_bids_str = array_bids.toString();
            JSONParser parser = new org.json.simple.parser.JSONParser();
            JSONArray bids_json_array = (JSONArray) parser.parse(array_bids_str);

            for (Object o : bids_json_array) {      // loop for every item that user made a bid for
                JSONObject obj = (JSONObject) o;
                String bid_item_id = (String) obj.get("_ItemID");
                int index = map.get(bid_item_id);
                String Currently = currently_map.get(bid_item_id);
                double currently = Float.parseFloat((Currently.substring(1)).replace(",",""));
                String Amount = (String) obj.get("Amount");
                double amount = Float.parseFloat((Amount.substring(1)).replace(",",""));
                vectors[i][index] = amount/currently;
                if (username.equals(user_id)) {
                    flag=1;
                    main_vector[index] = vectors[i][index];
                }
            }
            i++;
        }
        final long endLoopTime = System.currentTimeMillis();
        System.out.println("Total execution time 2 : " + (endLoopTime - startTime));

        if(flag==0){
            System.out.println("visitedItems");
            BasicDBObject whereQuery1 = new BasicDBObject();
            whereQuery1.put("username", username);
            whereQuery1.put("VisitedItems", new BasicDBObject("$ne", null));
            DBCursor cursor1 = col_users.find(whereQuery1);
            int l = cursor1.length();
            System.out.println(l);
            if(l==0){
                System.out.println("No visited Items, zero-vector");
            }
            else if(l==1){
                System.out.println("User has visited Items");
                BasicDBObject whereQuery2 = new BasicDBObject();
                whereQuery2.put("username", username);
                whereQuery2.put("VisitedItems", new BasicDBObject("$ne", null));
                DBCursor cursor2 = col_users.find(whereQuery2);
                cursor2.next();
                BasicDBList array_visited = (BasicDBList) cursor2.curr().get("VisitedItems");
                String array_visited_str = array_visited.toString();
                JSONParser parser = new org.json.simple.parser.JSONParser();
                JSONArray visited_json_array = (JSONArray) parser.parse(array_visited_str);
                for (Object o : visited_json_array ) {      // loop for every item that user made a bid for
                    JSONObject obj = (JSONObject) o;
                    String bid_item_id = (String) obj.get("_ItemID");
                    if(map.get(bid_item_id) != null) {
                        int index = map.get(bid_item_id);
                        main_vector[index] = 0.5;
                    }
                }
            }
        }
        System.out.println("main_vector :");
        for (int r=0; r<vector_len; r++){
            System.out.printf("%.2f ",main_vector[r]);
        }
        System.out.printf("\n");

//  only for printing/debugging
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
/*        double[] sums = new double[count];
        int zeros=0;
        for (int k=0; k<count; k++){
            System.out.printf("%d) ",k);
            double vector_sum = 0.0;
            for (int r=0; r<vector_len; r++){
                System.out.printf("%.2f ",vectors[k][r]);
                vector_sum += vectors[k][r];
                sums[k] += vectors[k][r];
            }
            if (sums[k] == 0.0){
                zeros++;
            }
            System.out.printf(" %.2f zeros:%d\n", vector_sum, zeros);
            zeros=0;
        }
        zeros=0;
        for (int k=0; k<count; k++){
            System.out.printf("%.2f ",sums[k]);
            if( sums[k]==0.0 ){
                zeros++;
            }
        }
        System.out.printf(" zeros %d\n",zeros);*/
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


//      stages: 2,  buckets: 4, 2 HashTables with 4 Buckets each
        List<double[]>[][] list = new ArrayList[stages][buckets];   //list of HashTables
        for (int s=0; s<stages; s++){
            for (int b=0; b<buckets; b++){
                list[s][b] = new ArrayList<double[]>();
            }
        }

        LSHSuperBit lsh = new LSHSuperBit(stages, buckets, vector_len);

        // Compute a SuperBit signature, and a LSH hash
        for (int k = 0; k < count; k++) {
            double[] vector = vectors[k];
            int[] hash = lsh.hash(vector);

// only for printing/debugging
/*            System.out.printf("%d) ",k);
            for (double v : vector) {
                System.out.printf("%.2f ", v);
            }
            for( int h : hash ) {
                System.out.printf("%d ",h);
            }
            System.out.print("\n");*/
//  - -   //

            for (int s=0; s<stages; s++){
                list[s][hash[s]].add(vector);
            }

        }

// only for printing/debugging
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
/*        for (int s=0; s<stages; s++){
            for (int b=0; b<buckets; b++){
                System.out.println("HashTable"+s+" Bucket"+b+" - "+list[s][b].size());
            }
        }*/
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// compute final bucket
        int[] hash = lsh.hash(main_vector);
        System.out.println("hash[0]: "+hash[0]+" hash[1]: "+hash[1]);
        ArrayList<double[]> final_bucket = new ArrayList();
        for (int s=0; s<stages; s++){
            System.out.println("HT: "+s+"  Bucket: "+hash[s]);
            for (double[] x : list[s][hash[s]]){
                if (!final_bucket.contains(x)) {
                    final_bucket.add(x);
                }
            }
        }

// compute distances
        int n = final_bucket.size();
        double[] distances = new double[n];
        EuclideanDistance distance = new EuclideanDistance();
        for (int k=0; k<n; k++) {
            distances[k] = distance.compute(main_vector, final_bucket.get(k));
            // System.out.println("Distance "+k+":"+distances[k]);
        }
        System.out.println("hash[0]: "+hash[0]+" hash[1]: "+hash[1]+" - FinalBucket : "+final_bucket.size());

// sort distances
        int[] indexes = new int[distances.length];
        for (int k=0; k<distances.length; k++){
            indexes[k] = k;
        }
        sort_min_to_max(distances, indexes);

// get the K closest vectors
        double[] sum_vector = new double[vector_len];
        int start = 0;
        if(flag==1){
            start = 1;
        }
        for (int k=start; k<distances.length; k++){
            double dist = distances[k];
            int index = indexes[k];
            // System.out.println("Index: "+index+" - Distance: "+dist+" - vector:");
            for( int p=0; p<vector_len; p++){
                // System.out.printf("%.2f ",vectors[index][p]);
                sum_vector[p] += (1.0/dist)*(vectors[index][p]);
            }
            // System.out.printf("\n");
            if(k==K){break;}
        }

//        print sum vector only for printing/debugging
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
/*        System.out.println("Sum Vector ");
        for( int p=0; p<vector_len; p++){
            System.out.printf("%.2f ",sum_vector[p]);
        }
        System.out.printf("\n");*/
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

// sort sum vector and find max K
        int[] ind = new int[vector_len];
        for( int p=0; p<vector_len; p++){
            ind[p] = p;
        }
        sort_max_to_min(sum_vector, ind);

// print sorted sum vector only for printing/debugging
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
/*        for( int p=0; p<vector_len; p++){
            System.out.printf("(%d,%.2f) ",ind[p],sum_vector[p]);
        }
        System.out.printf("\n");*/
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

        JSONArray items = new JSONArray();
        for( int p=0; p<K; p++){
            Item item = new Item(items_id_array[ind[p]]);
//            System.out.printf("[ %d, %s]\n",ind[p],items_id_array[ind[p]]);
            String item_json_str = item.get_item();
            JSONParser parser = new org.json.simple.parser.JSONParser();
            JSONObject item_obj = (JSONObject) parser.parse(item_json_str);
            items.add(item_obj);
        }
        JSONObject result = new JSONObject();
        result.put("items",items);
        result.put("n",String.valueOf(K));


        final long endTime = System.currentTimeMillis();
        System.out.println("Total execution time 3 : " + (endTime - startTime));

        return result.toJSONString();
    }

    private void sort_min_to_max(double[] distances, int[] indexes){
// me kapoio tropo feugei to 0.0 (to theloume den 3erw pws ginetai)
        for (int i=0; i<distances.length-1; i++){
            for (int j=distances.length-1; j>i; j--){
                double d1 = distances[j];
                double d2 = distances[j-1];
                double temp;
                int temp_index;
                if( d1 < d2 ) {
                    temp = distances[j];
                    distances[j] = distances[j-1];
                    distances[j-1] = temp;

                    temp_index = indexes[j];
                    indexes[j] = indexes[j-1];
                    indexes[j-1] = temp_index;
                }
            }
        }

/*        for (int i=0; i<distances.length-1; i++){
            System.out.println(i+" Index: "+indexes[i]+" - Distance: "+distances[i]);
        }*/
    }

    private void sort_max_to_min(double[] sum_vector, int[] indexes){
        for (int i=0; i<sum_vector.length-1; i++){
            for (int j=sum_vector.length-1; j>i; j--) {
                double d1 = sum_vector[j];
                double d2 = sum_vector[j - 1];
                double temp;
                int temp_index;
                if (d1 > d2) {
                    temp = sum_vector[j];
                    sum_vector[j] = sum_vector[j - 1];
                    sum_vector[j - 1] = temp;

                    temp_index = indexes[j];
                    indexes[j] = indexes[j - 1];
                    indexes[j - 1] = temp_index;
                }
            }
        }


/*        for (int i=0; i<sum_vector.length-1; i++){
            System.out.println(i+" Index: "+indexes[i]+" - Distance: "+sum_vector[i]);
        }*/
    }
}