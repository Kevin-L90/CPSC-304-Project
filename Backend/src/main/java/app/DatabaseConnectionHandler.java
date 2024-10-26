package app;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import app.Util.Logger;
import app.model.*;
import oracle.jdbc.driver.OracleDriver;


public class DatabaseConnectionHandler {
    private static final String ORACLE_URL = "jdbc:oracle:thin:@dbhost.students.cs.ubc.ca:1522:stu";
    private static final String EXCEPTION_TAG = "[EXCEPTION]";
    private static final String WARNING_TAG = "[WARNING]";
    public Connection connection = null;
    public String user;

    public static DatabaseConnectionHandler self = null;

    private DatabaseConnectionHandler() {
        try {
            DriverManager.registerDriver(new OracleDriver());
        } catch (SQLException var2) {
            System.out.println("[EXCEPTION] " + var2.getMessage());
        }
    }

    public static DatabaseConnectionHandler GetInstance() {
        if (self == null) {
            self = new DatabaseConnectionHandler();
        }

        return self;
    }

    public void close() {
        try {
            if (this.connection != null) {
                this.connection.close();
                System.out.println("Database Connection Closed");
            }
        } catch (SQLException var2) {
            System.out.println("[EXCEPTION] " + var2.getMessage());
        }
    }

    public boolean login(String username, String password) {
        try {
            if (this.connection != null) {
                this.connection.close();
            }

            Logger.LogMessage("Getting Database Connection");
            this.connection = DriverManager.getConnection(ORACLE_URL, username, password);
            Logger.LogMessage("Connection Established");
            this.connection.setAutoCommit(false);
            this.user = username;
            System.out.println("\nConnected to Oracle!");
            return true;
        } catch (SQLException var4) {
            System.out.println("[EXCEPTION] " + var4.getMessage());
            return false;
        }
    }

    private void rollbackConnection() {
        try {
            this.connection.rollback();
        } catch (SQLException var2) {
            System.out.println("[EXCEPTION] " + var2.getMessage());
        }

    }

//    setup
    public void databaseSetup() {
        this.setupDecks();

    }

    public void setupDecks() {
        this.dropDeckTableIfExists();

        try {
            Statement stmt = this.connection.createStatement();
            stmt.executeUpdate("CREATE TABLE branch (branch_id integer PRIMARY KEY, branch_name varchar2(20) not null, branch_addr varchar2(50), branch_city varchar2(20) not null, branch_phone integer)");
            stmt.close();
        } catch (SQLException var3) {
            System.out.println("[EXCEPTION] " + var3.getMessage());
        }
    }

    private void dropDeckTableIfExists() {
        try {
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("select table_name from user_tables");

            while(rs.next()) {
                if(rs.getString(1).toLowerCase().equals("branch")) {
                    stmt.execute("DROP TABLE branch");
                    break;
                }
            }

            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.out.println(EXCEPTION_TAG + " " + e.getMessage());
        }
    }

    public CardModel getCard(int artId, String cardName, String setName) {
        CardModel model = null;
        
        try {
            PreparedStatement cardSelectionStatement = this.connection.prepareStatement("SELECT a.cardName as cardName, c.setName as setName, c.rarity as rarity, c.stats as stats, c.artID as artID, c.mana as mana FROM Card_With_Drawn_Art a, Components_Of_Card c WHERE a.artID = (?) AND c.setName = (?) AND a.artID = c.artID");
            cardSelectionStatement.setInt(1, artId);
            cardSelectionStatement.setString(2, setName);

            ResultSet rs = cardSelectionStatement.executeQuery();

            rs.next();

            model = new CardModel(rs.getString("cardName"),
                        rs.getString("setName"),
                        rs.getString("rarity"),
                        rs.getString("stats"),
                        rs.getInt("artID"),
                        rs.getInt("mana"));
        } catch (SQLException e) {
            this.handleException(e);
        }

        return model;
    }

    // statement area
    public void deleteCard(int artID, String cardName, String setName) {
        try {
            PreparedStatement cardArtStatement = this.connection.prepareStatement("DELETE FROM Card_With_Drawn_Art WHERE artId = (?) AND cardName = (?)");
            cardArtStatement.setInt(1, artID);
            cardArtStatement.setString(2, cardName);
            int artRowCount = cardArtStatement.executeUpdate();
            if (artRowCount == 0) {
                System.out.println("[WARNING] Card " + artID + " does not exist!");
            }

            this.connection.commit();
            cardArtStatement.close();

            PreparedStatement cardComponentsStatement = this.connection.prepareStatement("DELETE FROM Components_Of_Card WHERE artId = (?) AND setName = (?)");
            cardComponentsStatement.setInt(1, artID);
            cardComponentsStatement.setString(2, setName);
            int compRowCount = cardComponentsStatement.executeUpdate();
            if (compRowCount == 0) {
                System.out.println("[WARNING] Card " + artID + " does not exist!");
            }

            this.connection.commit();
            cardComponentsStatement.close();
        } catch (SQLException var4) {
            System.out.println("[EXCEPTION] " + var4.getMessage());
            this.rollbackConnection();
        }

    }

    public void insertCard(CardModel model) {
        try {
//            card of art
            PreparedStatement cardArtStatement = connection.prepareStatement("INSERT INTO Card_With_Drawn_Art VALUES (?,?, ?, ?)");
            cardArtStatement.setString(1, model.cardName());
            cardArtStatement.setInt(2, model.artID());
            cardArtStatement.executeUpdate();
            connection.commit();

            cardArtStatement.close();

//            card components
            PreparedStatement cardComponentsStatement = connection.prepareStatement("INSERT INTO Components_Of_Card VALUES (?,?,?,?,?)");
            cardComponentsStatement.setString(1, model.setName());
            cardComponentsStatement.setInt(2, model.artID());
            cardComponentsStatement.setString(3, model.rarity());
            cardComponentsStatement.setInt(4, model.mana());
            cardComponentsStatement.setString(5, model.stats());

            cardComponentsStatement.executeUpdate();
            connection.commit();

            cardComponentsStatement.close();
        } catch (SQLException e) {
            handleException(e);
        }
    }

    public void handleException(SQLException e) {
        System.out.println(EXCEPTION_TAG + " " + e.getMessage());
        rollbackConnection();
    }

    public void insertDeck(DeckModel model) {
        try {
            PreparedStatement deckStatement = connection.prepareStatement("INSERT INTO Deck_From_Creator VALUES (?,?,?,?)");
            deckStatement.setInt(1, model.deckID());
            deckStatement.setString(2, model.deckName());
            deckStatement.setString(3, model.playFormat());
            deckStatement.setString(4, model.creatorID());

            deckStatement.executeUpdate();
            connection.commit();

            deckStatement.close();

            Logger.LogMessage("Inserted New Deck: " + model.deckName());
        } catch (SQLException e) {
            handleException(e);
        }
    }

    public DeckModel getDeck(int deckID) {
        DeckModel model = null;

        try {
            PreparedStatement deckStatement = this.connection.prepareStatement("SELECT * FROM Deck_From_Creator WHERE deckID = (?)");
            deckStatement.setInt(1, deckID);
            ResultSet rs = deckStatement.executeQuery(); 

            rs.next();

            model = new DeckModel(rs.getInt("deckID"),
                                  rs.getString("deckName"),
                                  rs.getString("playFormat"),
                                  rs.getString("creatorID"));
        } catch (SQLException e) {
            this.handleException(e);
        }

        return model;
    }

    public void deleteDeck(int deckID) {
        try {
            PreparedStatement cardDeckStatement = this.connection.prepareStatement("DELETE FROM Card_In_Deck WHERE deckID = (?)");
            cardDeckStatement.setInt(1, deckID);
            cardDeckStatement.executeUpdate();
            this.connection.commit();
            cardDeckStatement.close();

            PreparedStatement deckStatement = this.connection.prepareStatement("DELETE FROM Deck_From_Creator WHERE deckID = (?)");
            deckStatement.setInt(1, deckID);
            int artRowCount = deckStatement.executeUpdate();
            this.connection.commit();
            if (artRowCount == 0) {
                System.out.println("[WARNING] Card " + deckID + " does not exist!");
            }
            deckStatement.close();
        } catch (SQLException var4) {
            System.out.println("[EXCEPTION] " + var4.getMessage());
            this.rollbackConnection();
        }

    }

    public void putCardInDeck(int artId, String setName, int deckId) {
        try {
            PreparedStatement deckStatement = connection.prepareStatement("INSERT INTO Card_In_Deck VALUES (?,?,?)");
            deckStatement.setInt(1, deckId);
            deckStatement.setInt(2, artId);
            deckStatement.setString(3, setName);

            deckStatement.executeUpdate();
            connection.commit();

            deckStatement.close();
        } catch (SQLException e) {
            handleException(e);
        }
    }

    public void removeCardFromDeck(int artid, int deckid, String setname) {
            try {
                PreparedStatement deckStatement = this.connection.prepareStatement("DELETE FROM Card_In_Deck WHERE deckID = (?) AND artID = (?) AND setName = (?)");
                deckStatement.setInt(1, deckid);
                deckStatement.setInt(2, artid);
                deckStatement.setString(3, setname);
                int artRowCount = deckStatement.executeUpdate();
                if (artRowCount == 0) {
                    System.out.println("[WARNING] Card " + deckid + setname + " does not exist!");
                }

                this.connection.commit();
                deckStatement.close();
            } catch (SQLException var4) {
                System.out.println("[EXCEPTION] " + var4.getMessage());
                this.rollbackConnection();
            }
    }

    public void updateCreatorName(String oldName, String newName) {
        try {
//            String updateCardInDeckNullQuery = "UPDATE Deck_From_Creator" +
//                    " SET creatorID = NULL WHERE creatorID = (?)";
//            PreparedStatement updateCardInDeckNullStatement = this.connection.prepareStatement(updateCardInDeckNullQuery);
//
//            updateCardInDeckNullStatement.setString(1, oldName);
//
//            if (updateCardInDeckNullStatement.executeUpdate() == 0) {
//                System.out.println("[WARNING] Deck " + oldName + " does not exist!");
//            }
//
//            this.connection.commit();
//            updateCardInDeckNullStatement.close();
//
//            String updateCreatorQuery = "UPDATE Creator" +
//                    " SET creatorID = (?)" +
//                    " WHERE creatorID = (?)";
//            PreparedStatement creatorStatement = this.connection.prepareStatement(updateCreatorQuery);
//
//            creatorStatement.setString(1, newName);
//            creatorStatement.setString(2, oldName);
//
//            int cardInDeckCount = creatorStatement.executeUpdate();
//            if (cardInDeckCount == 0) {
//                System.out.println("[WARNING] Deck " + oldName + " does not exist!");
//            }
//            this.connection.commit();
//            creatorStatement.close();

            String updateCardInDeckQuery = "UPDATE Deck_From_Creator" +
                    " SET creatorID = (?)" +
                    " WHERE creatorID = (?)";
            PreparedStatement deckFromCreatorStatement = this.connection.prepareStatement(updateCardInDeckQuery);

            deckFromCreatorStatement.setString(1, newName);
            deckFromCreatorStatement.setString(2, oldName);

            int cardInDeckCount = deckFromCreatorStatement.executeUpdate();
            if (cardInDeckCount == 0) {
                System.out.println("[WARNING] Deck " + oldName + " does not exist!");
            }
            this.connection.commit();
            deckFromCreatorStatement.close();
        } catch (SQLException e) {
            System.out.println("[EXCEPTION] " + e.getMessage());
            this.rollbackConnection();
        }
    }
    
    public void updateNonKeyString(String oldName, String newName, String feature, Integer deckID) {
        try {
            String updateCardInDeckQuery = "UPDATE Deck_From_Creator" +
                    " SET " + feature + " = (?)" +
                    " WHERE " + feature + " = (?) AND deckID = (?)";

            PreparedStatement deckStatement = this.connection.prepareStatement(updateCardInDeckQuery);

            deckStatement.setString(1, newName);
            deckStatement.setString(2, oldName);
            deckStatement.setInt(3, deckID);


            int deckRowCount = deckStatement.executeUpdate();
            if (deckRowCount == 0) {
                System.out.println("[WARNING] Deck " + oldName + " does not exist!");
            }
            this.connection.commit();
            deckStatement.close();
        } catch (SQLException e) {
            System.out.println("[EXCEPTION] " + e.getMessage());
            this.rollbackConnection();
        }
    }

    public ListingInfo[] getListings(Integer artID, String setName) {
        ArrayList<ListingInfo> result = new ArrayList<ListingInfo>();
        try {
            PreparedStatement cardSearchStatement = this.connection.prepareStatement("SELECT c.seller, p.platformName, p.platformLink " +
                    "FROM Platform p, Listings_On_PlatForms l, Card_Listing c " +
                    "WHERE p.platformName = l.platformName AND c.listingID = l.listingID AND c.artID = (?) AND c.setName = (?)");
            cardSearchStatement.setInt(1, artID);
            cardSearchStatement.setString(2, setName);

            ResultSet rs = cardSearchStatement.executeQuery();
            while(rs.next()) {
                ListingInfo deck = new ListingInfo(rs.getString("seller"),
                        rs.getString("platformName"),
                        rs.getString("platformLink"));
                result.add(deck);
            }

            rs.close();
            cardSearchStatement.close();
        } catch (SQLException e) {
            this.handleException(e);
        }
        return result.toArray(new ListingInfo[result.size()]);
    }


    public DeckModel[] getDecks() {
        ArrayList<DeckModel> result = new ArrayList<DeckModel>();
        try {
            PreparedStatement cardSearchStatement = this.connection.prepareStatement("SELECT deckID, deckName, playFormat, creatorID FROM Deck_From_Creator ORDER BY deckName, creatorID");
            ResultSet rs = cardSearchStatement.executeQuery();

            while(rs.next()) {
                DeckModel deck = new DeckModel(rs.getInt("deckID"),
                        rs.getString("deckName"),
                        rs.getString("playFormat"),
                        rs.getString("creatorID"));
                result.add(deck);
            }
            cardSearchStatement.close();
            rs.close();
        } catch (SQLException e) {
        
            this.handleException(e);
        }
        return result.toArray(new DeckModel[result.size()]);
    }

    public DeckModel[] getUsersDecks(String Creator) {
        ArrayList<DeckModel> result = new ArrayList<DeckModel>();
        try {
            PreparedStatement cardSearchStatement = this.connection.prepareStatement("SELECT deckID, deckName, playFormat, creatorID FROM Deck_From_Creator WHERE creatorID = (?) ORDER BY deckName");
            cardSearchStatement.setString(1, Creator);
            ResultSet rs = cardSearchStatement.executeQuery();

            while(rs.next()) {
                DeckModel deck = new DeckModel(rs.getInt("deckID"),
                        rs.getString("deckName"),
                        rs.getString("playFormat"),
                        rs.getString("creatorID"));
                result.add(deck);
            }
            cardSearchStatement.close();
            rs.close();
        } catch (SQLException e) {
            this.handleException(e);
        }
        return result.toArray(new DeckModel[result.size()]);
    }

    public CardModel[] getCardsInDeck(Integer deckID) {
        ArrayList<CardModel> result = new ArrayList<CardModel>();
        try {
            String query = "SELECT a.cardName as cardName, c.setName as setName, c.rarity as rarity, c.stats as stats, c.artID as artID, c.mana as mana" +
                    " FROM Card_With_Drawn_Art a, Components_Of_Card c, Card_In_Deck d" +
                    " WHERE a.artID = c.artID AND d.artID = a.artID AND c.setName = d.setName AND d.deckId = " + deckID;
            PreparedStatement cardSearchStatement = this.connection.prepareStatement(query);
            ResultSet rs = cardSearchStatement.executeQuery();

            while(rs.next()) {
                CardModel card = new CardModel(rs.getString("cardName"),
                        rs.getString("setName"),
                        rs.getString("rarity"),
                        rs.getString("stats"),
                        rs.getInt("artID"),
                        rs.getInt("mana"));
                result.add(card);
            }

            cardSearchStatement.close();
            rs.close();
        } catch (SQLException e) {
            this.handleException(e);
        }
        return result.toArray(new CardModel[result.size()]);
    }

    public String getImageLink(Integer ArtID) {
        ArrayList<String> result = new ArrayList<String>();

        try{
            PreparedStatement stmt = this.connection.prepareStatement("SELECT cardArt FROM Card_With_Drawn_Art WHERE artID = (?)");
            stmt.setInt(1, ArtID);
            ResultSet rs = stmt.executeQuery();
            while(rs.next()) {
                result.add(rs.getString("cardArt"));
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            this.handleException(e);
        }
        return result.get(0);
    }

    public String[] getAllCreatorIDs() {
        ArrayList<String> result = new ArrayList<String>();
        try {
            PreparedStatement stmt = this.connection.prepareStatement("SELECT CreatorID FROM Creator");
            ResultSet rs = stmt.executeQuery();

            while(rs.next()) {
                result.add(rs.getString("CreatorID"));
            }

            rs.close();
            stmt.close();
        } catch (SQLException e) {
            this.handleException(e);
        }
        return result.toArray(new String[result.size()]);
    }

    public CardModel[] getCards(String queryType, String[] input) {
        ArrayList<CardModel> result = new ArrayList<CardModel>();
        try {
            PreparedStatement cardSearchStatement = this.connection.prepareStatement(generateCardQuery(queryType, input));
            ResultSet rs = cardSearchStatement.executeQuery();
            

            while(rs.next()) {
                CardModel card = new CardModel(rs.getString("cardName"),
                        rs.getString("setName"),
                        rs.getString("rarity"),
                        rs.getString("stats"),
                        rs.getInt("artID"),
                        rs.getInt("mana"));
                result.add(card);
            }

            rs.close();
            cardSearchStatement.close();
        } catch (SQLException e) {
            this.handleException(e);
        }
        return result.toArray(new CardModel[result.size()]);
    }

    public String generateCardQuery(String queryType, String[] input) throws SQLException {
        String query = "SELECT a.cardName as cardName, c.setName as setName, c.rarity as rarity, c.stats as stats, c.artID as artID, c.mana as mana" +
                " FROM Card_With_Drawn_Art a, Components_Of_Card c" +
                " WHERE a.artID = c.artID";

//        querying
        if (queryType.contains("findCardOfName")) {
            query += (" AND (");

            for (int i = 0; i < input.length; i++) {
                if (i > 0) {
                    query += " OR";
                }

                query += " a.cardName = \'" + input[i] + "\'";

                if (i == input.length - 1) {
                    query += ")";
                }
            }
        } else if (queryType.contains("findCardOfID")) {
            query += " AND a.artID = " + input[0] + " AND c.setName = '" + input[1] + "'";
        } else if (queryType.contains("multiplePrinting")) {
            query += " AND a.cardName IN (SELECT a2.cardName" +
                    " FROM Card_With_Drawn_Art a2" +
                    " GROUP BY a2.cardName HAVING COUNT(*) > 1)";
        }

        //        ordering
        if(queryType.contains("alphabetOrdering")) {
            query += " ORDER BY a.cardName, c.mana";
        } else if (queryType.contains("numericOrdering")) {
            query += " ORDER BY c.mana, a.cardName";
        }

        return query;
    }

    public String[] generateOmnipresentTypes(String Creator) {
        ArrayList<String> result = new ArrayList<String>();
        try {
            PreparedStatement stmt = this.connection.prepareStatement("SELECT t.typeName as type " +
                    "FROM Type t " +
                    "WHERE NOT EXISTS " +
                    "((SELECT d.deckName " +
                    "FROM Deck_From_Creator d " +
                    "WHERE d.creatorID = (?)) " +
                    "MINUS " +
                    "(SELECT d.deckName " +
                    "FROM Card_In_Deck c, Types_of_Card ct, Deck_From_Creator d " +
                    "WHERE c.deckID = d.deckID AND ct.artID = c.artID AND ct.typeName = t.typeName))");
            stmt.setString(1, Creator);

            ResultSet rs = stmt.executeQuery();

            while(rs.next()) {
                result.add(rs.getString("type"));
            }

            rs.close();
            stmt.close();
        } catch (SQLException e) {
            this.handleException(e);
        }
        return result.toArray(new String[result.size()]);
    }

    public DeckModel[] getLowestCurveDeck() {
        List<DeckModel> result = new ArrayList<DeckModel>();
        try {
            Statement stmt = this.connection.createStatement();

            ResultSet rs = stmt.executeQuery("SELECT d.deckID as deckID, d.deckName as deckName, d.playFormat as playFormat, d.creatorID as creatorID " +
                    "FROM Deck_From_Creator d, Components_Of_Card c, Card_In_Deck cd " +
                    "WHERE d.deckID = cd.deckID AND c.artID = cd.artID AND c.setName = cd.setName " +
                    "GROUP BY d.deckID, d.deckName, d.playFormat, d.creatorID " +
                    "HAVING avg(c.mana) <= all(SELECT AVG(c2.mana) " +
                    "FROM Deck_From_Creator d2, Components_Of_Card c2, Card_In_Deck cd2 " +
                    "WHERE d2.deckID = cd2.deckID AND c2.artID = cd2.artID AND c2.setName = cd2.setName " +
                    "GROUP BY d2.deckID)");

            while(rs.next()) {
                DeckModel deck = new DeckModel(rs.getInt("deckID"),
                        rs.getString("deckName"),
                        rs.getString("playFormat"),
                        rs.getString("creatorID"));
                result.add(deck);
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            this.handleException(e);
        }
        return result.toArray(new DeckModel[result.size()]);
    }
}