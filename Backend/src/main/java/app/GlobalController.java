package app;

import app.Util.Logger;
import app.model.*;

import org.springframework.web.bind.annotation.*;

import java.util.Random;

@CrossOrigin(origins = "http://127.0.0.1:5173")
@RestController
public class GlobalController {
    private static DatabaseConnectionHandler handler;

    public GlobalController() {
        Logger.LogMessage("Getting Database Connection Handler");
        handler = DatabaseConnectionHandler.GetInstance();
        Logger.LogMessage("Database Connection Handler Established");
        Logger.LogMessage("Logging into database");

        if (handler.login("ora_neilli01", "a22681720")) { 
            Logger.LogMessage("Database login successful");
        } else {
            Logger.LogMessage("Database login unsuccessful");
        }
    }

    @PostMapping("/login")
    public boolean login(@RequestParam(value = "username") String username,
                         @RequestParam(value = "password") String password) {
        Logger.ReceivedRequest("/login");
        return handler.login(username, password);
    }

    @PostMapping("/logout")
    public void login() {
        Logger.ReceivedRequest("/logout");
        handler.close();
    }

    @GetMapping("/creators")
    public String[] allCreators() {
        Logger.ReceivedRequest("/creators");
        return handler.getAllCreatorIDs();
    }

    @GetMapping("/cards")
    public CardModel[] card(@RequestParam(value = "queryType") String queryType,
                            @RequestParam(value = "input") String[] input) {
        Logger.ReceivedRequest("/cards");
        return handler.getCards(queryType, input);
    }

    @PostMapping(value = "/createCard", consumes = "application/json", produces = "application/json")
    public void createCard(@RequestBody CardModel card) {
        Logger.ReceivedRequest("/createCard");
        handler.insertCard(card);
    }

    @GetMapping("/card/{setName}/{cardName}/{artid}")
    public CardModel GetCard(@PathVariable("artid") int artid,
                           @PathVariable("cardName") String cardName,
                           @PathVariable("setName") String setName) 
    {
        Logger.ReceivedRequest("/card/"+setName+"/"+cardName+"/"+artid);

        CardModel[] res = handler.getCards("findCardOfID", new String[]{Integer.toString(artid), setName});

        if (res.length > 0) {
            return res[0];
        }

        return null;
    }

    @DeleteMapping("/card/{id}/{cardName}/{setName}")
    public void deleteCard(@PathVariable("id") int id,
                           @PathVariable("cardName") String cardName,
                           @PathVariable("setName") String setName) {
        Logger.ReceivedRequest("/card/" + id + "/" + cardName + "/" + setName);
        handler.deleteCard(id, cardName, setName);
    }

    @GetMapping("/decks")
    public DeckModel[] deck() {
        Logger.ReceivedRequest("/decks");
        return handler.getDecks();
    }

    @GetMapping("/userDecks")
    public DeckModel[] userDeck(@RequestParam(value = "creatorName") String creatorName) {
        Logger.ReceivedRequest("/userDecks");
        return handler.getUsersDecks(creatorName);
    }

    @GetMapping("/deckTypes")
    public String[] userTypes(@RequestParam(value = "creatorID") String creatorID) {
        Logger.ReceivedRequest("/deckTypes");
        return handler.generateOmnipresentTypes(creatorID);
    }

    @GetMapping("/deckCurve")
    public DeckModel[] deckCurve() {
        Logger.ReceivedRequest("/deckCurve");
        return handler.getLowestCurveDeck();
    }

    @PostMapping(value = "/createDeck", consumes = "application/json", produces = "application/json")
    public int createDeck(@RequestParam(value = "deckName") String deckName,
                           @RequestParam(value = "playFormat") String playFormat) {
        Logger.ReceivedRequest("/createDeck");
        int deckID = new Random().nextInt(1000000);
        DeckModel dm = new DeckModel(deckID, deckName, playFormat, handler.user);
        
        handler.insertDeck(dm);

        return deckID;
    }

    @PostMapping(value = "/putCard", consumes = "application/json", produces = "application/json")
    public void putCardInDeck(@RequestParam(value = "artId") int artId, 
                              @RequestParam(value = "setName") String setName, 
                              @RequestParam(value = "deckId") int deckId) {
        Logger.ReceivedRequest("/putCard");
        handler.putCardInDeck(artId, setName, deckId);
    }

    @PostMapping(value = "/removeCard", consumes = "application/json", produces = "application/json")
    public void removeCardFromDeck(@RequestParam(value = "artId") int artid,
                                   @RequestParam(value = "deckId") int deckid,
                                   @RequestParam(value = "setName") String setname) {
        Logger.ReceivedRequest("/removeCard");
        handler.removeCardFromDeck(artid, deckid, setname);
    }

    @PostMapping(value = "/updateDeckName", consumes = "application/json", produces = "application/json")
    public void updateDeckName(@RequestParam(value = "oldName") String oldName,
                               @RequestParam(value = "newName") String newName,
                               @RequestParam(value = "feature") String feature,
                               @RequestParam(value = "deckId") int deckid) {
        Logger.ReceivedRequest("/updateDeckName");
        handler.updateNonKeyString(oldName, newName, feature, deckid);
    }

    @PostMapping(value = "/updateCreatorName", consumes = "application/json", produces = "application/json")
    public void updateCreatorName(@RequestParam(value = "oldName") String oldName,
                                  @RequestParam(value = "newName") String newName)
    {
        Logger.ReceivedRequest("/updateCreatorName");
        handler.updateCreatorName(oldName, newName);
    }

    @DeleteMapping("/deck/{id}")
    public void deleteDeck(@PathVariable("id") int id) {
        Logger.ReceivedRequest("/deck/" + id);
        handler.deleteDeck(id);
    }

    @GetMapping("/deck/{id}")
    public DeckModel getDeck(@PathVariable("id") int id) {
        Logger.ReceivedRequest("/deck/" + id);
        return handler.getDeck(id);
    }

    @GetMapping("/listinginfo/{setname}/{artid}")
    public ListingInfo[] listing(@PathVariable(value = "artid") int artID,
                                 @PathVariable(value = "setname") String setName) 
    {
        Logger.ReceivedRequest("/listinginfo/" + setName + "/" + artID);
        return handler.getListings(artID, setName);
    }

    @GetMapping("/deck/cards/{id}")
    public CardModel[] getCardsInDeck(@PathVariable(value = "id") int deckID) {
        Logger.ReceivedRequest("/deck/cards/" + deckID);
        return handler.getCardsInDeck(deckID);
    }

    @GetMapping("/card/{artID}")
    public String getImageLink(@PathVariable(value = "artID") int artID) {
        Logger.ReceivedRequest("/card/" + artID);
        return handler.getImageLink(artID);
    }

    @GetMapping("/deck/thumbnail/{deckID}")
    public String getFirstCardImageLink(@PathVariable(value = "deckID") int deckID) {
        CardModel[] arr = handler.getCardsInDeck(deckID);

        return arr.length > 0 ? handler.getImageLink(arr[0].artID()) : "https://drive.google.com/file/d/1Sgb6VXXI95gTH3ewPMdKPdcxaoi0Uphq/view?usp=drive_link";
    }
}
