package DataClasses.ItemData;

public class Bidder {
    private String _UserID;
    private String _Rating;
    private String Country;
    private String Location;

    public Bidder(String _UserID, String _Rating, String Country, String Location){
        this._UserID = _UserID;
        this._Rating = _Rating;
        this.Country = Country;
        this.Location = Location;
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

    public String getCountry () {
        return Country;
    }

    public void setCountry (String Country) {
        this.Country = Country;
    }

    public String getLocation () {
        return Location;
    }

    public void setLocation (String Location) {
        this.Location = Location;
    }

    @Override
    public String toString() {
        return "ClassBidder [_UserID = "+_UserID+", _Rating = "+_Rating+", Country = "+Country+", Location = "+Location+"]";
    }
}
