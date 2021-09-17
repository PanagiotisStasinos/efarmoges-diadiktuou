package DataClasses.ItemData;

public class Seller {
    private String _UserID;
    private String _Rating;

    public Seller(){}
    public Seller(String _UserID, String _Rating){
        this._Rating = _Rating;
        this._UserID = _UserID;
    }

    public String get_UserID () {
        return _UserID;
    }
    public void set_UserID (String _UserID) {
        this._UserID = _UserID;
    }

    public String get_Rating () {
        return _Rating;
    }
    public void set_Rating (String _Rating) {
        this._Rating = _Rating;
    }

    @Override
    public String toString() {
        return "ClassSeller [_UserID = "+_UserID+", _Rating = "+_Rating+"]";
    }
}