package DataClasses.ItemData;

public class Bid {
    private Bidder Bidder;
    private String Amount;
    private String Time;

    public Bid( String Amount, String Time, String _UserID, String _Rating, String Country, String Location){
        this.Amount = Amount;
        this.Time = Time;
    }

    public Bidder getBidder () {
        return Bidder;
    }

    public void setBidder (Bidder Bidder) {
        this.Bidder = Bidder;
    }

    public String getAmount () {
        return Amount;
    }

    public void setAmount (String Amount) {
        this.Amount = Amount;
    }

    public String getTime () {
        return Time;
    }

    public void setTime (String Time) {
        this.Time = Time;
    }

    @Override
    public String toString() {
        return "ClassBid [Bidder = "+Bidder+", Amount = "+Amount+", Time = "+Time+"]";
    }
}
