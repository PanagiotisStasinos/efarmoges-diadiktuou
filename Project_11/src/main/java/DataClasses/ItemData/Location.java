package DataClasses.ItemData;

public class Location {
    private String _Latitude;
    private String _Longitude;
    private  String __text;

    public Location(){}

    public void set_Latitude(String _Latitude) {
        this._Latitude = _Latitude;
    }
    public void set_Longitude(String _Longitude) {
        this._Longitude = _Longitude;
    }
    public void set__text(String __text) {
        this.__text = __text;
    }

    public String get_Latitude() {
        return _Latitude;
    }
    public String get_Longitude() {
        return _Longitude;
    }
    public String get__text() {
        return __text;
    }
}
