-- Table Setup
CREATE TABLE Platform(
    platformName varchar(64),
    platformLink varchar(256),
    PRIMARY KEY (platformName)
);

CREATE TABLE Artist(
    artistName varchar(32),
    artistSite varchar(256),
    fanNumber integer,
    PRIMARY KEY(artistName)
);

CREATE TABLE Sets
(
    setName varchar(64),
    releaseYear integer,
    PRIMARY KEY(setName)
);

CREATE TABLE Type(
    typeName varchar(20),
    playSpeed varchar(1),
    PRIMARY KEY(typeName)
);

CREATE TABLE Creator(
    creatorID varchar(64),
    creatorRating double precision,
    PRIMARY KEY(creatorID)
);

CREATE TABLE Card_With_Drawn_Art(
    cardName varchar(64),
    cardArt varchar(128),
    artID integer,
    artistName varchar(32),
    PRIMARY KEY(artID),
    FOREIGN KEY(artistName) REFERENCES Artist
        ON DELETE CASCADE
);

CREATE TABLE Components_Of_Card(
    setName varchar(64),
    artID integer,
    rarity varchar(1) NOT NULL,
    mana integer,
    Stats varchar(7),
    PRIMARY KEY(setName, artID),
    FOREIGN KEY(setName) REFERENCES Sets
        ON DELETE CASCADE,
    FOREIGN KEY(artID) REFERENCES Card_With_Drawn_Art
        ON DELETE CASCADE
);

CREATE TABLE Card_Listing(
    listingID integer,
    Seller varchar(32),
    artID integer NOT NULL,
    setName varchar(64) NOT NULL,
    PRIMARY KEY (listingID),
    FOREIGN KEY (setName, artID) REFERENCES Components_Of_Card
        ON DELETE CASCADE
);

CREATE TABLE Listings_On_Platforms(
    platformName varchar(64) NOT NULL,
    listingID integer,
    PRIMARY KEY (platformName, listingID),
    FOREIGN KEY (platformName) REFERENCES Platform
        ON DELETE SET NULL,
    FOREIGN KEY (listingID) REFERENCES Card_Listing
        ON DELETE CASCADE
);

CREATE TABLE Types_of_Card(
    artID integer NOT NULL,
    setName varchar(64) NOT NULL,
    typeName varchar(20) NOT NULL,
    PRIMARY KEY(artID, setName, typeName),
    FOREIGN KEY(typeName) REFERENCES Type
        ON DELETE CASCADE,
    FOREIGN KEY(setName, artID) REFERENCES Components_Of_Card
        ON DELETE CASCADE
);

CREATE TABLE Deck_From_Creator(
    deckID integer,
    deckName varchar(64),
    playFormat varchar(4),
    creatorID varchar(64),
    PRIMARY KEY(deckID),
    FOREIGN KEY(creatorID) REFERENCES Creator
        ON DELETE SET NULL
);

CREATE TABLE Card_In_Deck(
    deckID integer NOT NULL,
    artID integer NOT NULL,
    setName varchar(64) NOT NULL,
    PRIMARY KEY(deckID, artID, setName),
    FOREIGN KEY(deckID) REFERENCES Deck_From_Creator,
    FOREIGN KEY(setName, artID) REFERENCES Components_Of_Card
);


-- Insert tuples
-- Platforms
INSERT INTO		PLATFORM
VALUES	        ('MTGGoldfish', 'https://www.mtggoldfish.com/');

INSERT INTO     PLATFORM
VALUES          ('401 Games', 'https://store.401games.ca/');

INSERT INTO     PLATFORM
VALUES          ('TCGplayer', 'https://www.tcgplayer.com/');

INSERT INTO     PLATFORM
VALUES          ('Card Kingdom', 'https://www.cardkingdom.com/');

INSERT INTO     PLATFORM
VALUES          ('Face to Face Games', 'https://www.facetofacegames.com/');

-- Artist
INSERT INTO     ARTIST
VALUES          ('Kekai Kotaki', 'http://www.kekaiart.com/', 7670);

INSERT INTO     ARTIST
VALUES          ('Ryan Alexander Lee', 'https://www.ryanleeart.com/', 91656);

INSERT INTO     ARTIST
VALUES          ('Jim Nelson', 'https://jimnelsonart.com/', 926);

INSERT INTO     ARTIST
VALUES          ('Dave Allsop', 'https://www.artstation.com/daveallsop', 4507);

INSERT INTO     ARTIST
VALUES          ('Vincent Christiaens', 'https://vincentchristiaens.pb.online/', 5810);

INSERT INTO     ARTIST
VALUES          ('Justyna Dura', 'https://www.artstation.com/justynadura', 10278);

INSERT INTO     ARTIST
VALUES          ('L J Koh', 'https://www.artstation.com/kheljay', 4126);

INSERT INTO     ARTIST
VALUES          ('Michael Bierek', 'https://www.artstation.com/michael-bierek', 3516);

INSERT INTO     ARTIST
VALUES          ('James Ryman', 'https://jamesryman.bigcartel.com/', 10438);

INSERT INTO     ARTIST
VALUES          ('Daarken', 'https://www.daarken.com/', 71293);

INSERT INTO     ARTIST
VALUES          ('Livia Prima', 'https://www.artstation.com/dopaprime', 41978);

-- Sets
INSERT INTO     SETS
VALUES          ('March of the Machine', 2023);

INSERT INTO     SETS
VALUES          ('Commander 2016', 2016);

INSERT INTO     SETS
VALUES          ('Dominaria Remastered', 2023);

INSERT INTO     SETS
VALUES          ('Eventide', 2008);

INSERT INTO     SETS
VALUES          ('Wilds of Eldraine', 2023);

INSERT INTO     SETS
VALUES          ('Lord of the Rings Commander', 2023);

INSERT INTO     SETS
VALUES          ('Commander Legends: Battle for Baldurs Gate', 2022);

INSERT INTO     SETS
VALUES          ('Warhammer 40000 Commander', 2022);

INSERT INTO     SETS
VALUES          ('GateCrash', 2013);

-- Type
INSERT INTO     TYPE
VALUES          ('Battle', 'S');

INSERT INTO     TYPE
VALUES          ('Artifact', 'S');

INSERT INTO     TYPE
VALUES          ('Sorcery', 'S');

INSERT INTO     TYPE
VALUES          ('Creature', 'S');

INSERT INTO     TYPE
VALUES          ('Instant', 'I');

-- Creator
INSERT INTO     CREATOR
VALUES          ('Darth_Zharlner', 1.99);

INSERT INTO     CREATOR
VALUES          ('Hatsu', 2.45);

INSERT INTO     CREATOR
VALUES          ('Pariah462', 3.20);

INSERT INTO     CREATOR
VALUES          ('sumdumname', 4.90);

INSERT INTO     CREATOR
VALUES          ('Anonymous', 2.78);

INSERT INTO     CREATOR
VALUES          ('ora_neilli01', 0.00);

-- Card with Drawn Art
INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Invasion of Kamigawa', 'https://drive.google.com/file/d/1T2RUbzMrLEEAJrg9D-QTCBmqrSmWse_v/view?usp=drive_link', 872019, 'Kekai Kotaki');

INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Realmbreaker, the Invasion Tree', 'https://drive.google.com/file/d/1Sr7BUqNUO2HI6dman09R3yYmuq5My74h/view?usp=drive_link', 781273, 'Kekai Kotaki');

INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Decimate', 'https://drive.google.com/file/d/1ZS-tgvpSPdk7WTwESWeIBgBa6EES_7xY/view?usp=drive_link', 301982, 'Kekai Kotaki');

INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Commander’s Sphere', 'https://drive.google.com/file/d/1NK6AwVNrjR9pp8moXzBK8rHBUOOPu7-v/view?usp=drive_link', 550603, 'Ryan Alexander Lee');

INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Obsessive Search', 'https://drive.google.com/file/d/1MqEOqGGNEtwXzz4nO_3HbyEae3bbzMPE/view?usp=drive_link', 921559, 'Jim Nelson');

INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Slippery Bogle', 'https://drive.google.com/file/d/15ixq9yuaKLx6mO0UBklKZp6N6JMYDStk/view?usp=drive_link', 687437, 'Dave Allsop');

INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Plunge into Winter', 'https://drive.google.com/file/d/17vfMQTV32Ul5DnFiUJbt7JbsbBlt22Jq/view?usp=drive_link', 621525, 'Vincent Christiaens');

INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Commander’s Sphere', 'https://drive.google.com/file/d/1CEm6_rEJ4ofuov0sd-txlO_wyUUo1BL-/view?usp=drive_link', 109274, 'Justyna Dura');

INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Sol Ring', 'https://drive.google.com/file/d/1DHS2rLhQR_SsMtP6Ng7NPyOfzEHWTOio/view?usp=drive_link', 137981, 'L J Koh');

INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Sol Ring', 'https://drive.google.com/file/d/1oYVnhGPm_Q3oHRhNYdC-NKzRXB2l5ITK/view?usp=drive_link', 493175, 'Michael Bierek');

INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Cartel Aristocrat', 'https://drive.google.com/file/d/136xja4pkqGxIzVERdMRFgnT_X1kTQ4P3/view?usp=drive_link', 943789, 'James Ryman');

INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Belakor, the Dark Master', 'https://drive.google.com/file/d/1Sgb6VXXI95gTH3ewPMdKPdcxaoi0Uphq/view?usp=drive_link', 666666, 'Daarken');

INSERT INTO     CARD_WITH_DRAWN_ART
VALUES          ('Raphael, Fiendish Savior', 'https://drive.google.com/file/d/1D4BN76Gby2O-Ih6GAWszKiLNRXlPzJkg/view?usp=drive_link', 999999, 'Livia Prima');

-- Components of Card
INSERT INTO     COMPONENTS_OF_CARD
VALUES          ('March of the Machine', 872019, 'U', 4, NULL);

INSERT INTO     COMPONENTS_OF_CARD
VALUES          ('March of the Machine', 781273, 'R', 3, NULL);

INSERT INTO     COMPONENTS_OF_CARD
VALUES          ('Commander 2016', 550603, 'C', 3, NULL);

INSERT INTO     COMPONENTS_OF_CARD
VALUES          ('Dominaria Remastered', 921559, 'C', 1, NULL);

INSERT INTO     COMPONENTS_OF_CARD
VALUES          ('Dominaria Remastered', 493175, 'U', 1, NULL);

INSERT INTO     COMPONENTS_OF_CARD
VALUES          ('Dominaria Remastered', 301982, 'R', 4, NULL);

INSERT INTO     COMPONENTS_OF_CARD
VALUES          ('Eventide', 687437, 'C', 1, '1/1');

INSERT INTO     COMPONENTS_OF_CARD
VALUES          ('Wilds of Eldraine', 621525, 'C', 2, NULL);

INSERT INTO     COMPONENTS_OF_CARD
VALUES          ('Lord of the Rings Commander', 109274, 'C', 3, NULL);

INSERT INTO     COMPONENTS_OF_CARD
VALUES          ('Lord of the Rings Commander', 137981, 'U', 1, NULL);

INSERT INTO     COMPONENTS_OF_CARD
VALUES          ('Wilds of Eldraine', 493175, 'U', 1, NULL);

INSERT INTO     Components_Of_Card
VALUES          ('GateCrash', 943789, 'U', 2, '2/2');

INSERT INTO     Components_Of_Card
VALUES          ('Warhammer 40000 Commander', 666666, 'M', 6, '6/5');

INSERT INTO     Components_Of_Card
VALUES          ('Commander Legends: Battle for Baldurs Gate', 999999, 'R', 5, '4/4');

-- Card Listing
INSERT INTO     CARD_LISTING
VALUES          (211965, 'Pedram', 872019, 'March of the Machine');

INSERT INTO     CARD_LISTING
VALUES          (689028, 'Alkiviadis', 550603, 'Commander 2016');

INSERT INTO     CARD_LISTING
VALUES          (171228, 'Sham’a', 921559, 'Dominaria Remastered');

INSERT INTO     CARD_LISTING
VALUES          (567164, 'Hel', 687437, 'Eventide');

INSERT INTO     CARD_LISTING
VALUES          (896019, 'Ultán', 621525, 'Wilds of Eldraine');

-- Listings on Platform
INSERT INTO     LISTINGS_ON_PLATFORMS
VALUES          ('MTGGoldfish', 211965);

INSERT INTO     LISTINGS_ON_PLATFORMS
VALUES          ('401 Games', 689028);

INSERT INTO     LISTINGS_ON_PLATFORMS
VALUES          ('TCGplayer', 171228);

INSERT INTO     LISTINGS_ON_PLATFORMS
VALUES          ('Card Kingdom', 567164);

INSERT INTO     LISTINGS_ON_PLATFORMS
VALUES          ('Face to Face Games', 896019);

-- Types of Card
INSERT INTO     TYPES_OF_CARD
VALUES          (872019, 'March of the Machine', 'Battle');

INSERT INTO     TYPES_OF_CARD
VALUES          (781273, 'March of the Machine', 'Artifact');

INSERT INTO     TYPES_OF_CARD
VALUES          (550603, 'Commander 2016', 'Artifact');

INSERT INTO     TYPES_OF_CARD
VALUES          (921559, 'Dominaria Remastered', 'Sorcery');

INSERT INTO     TYPES_OF_CARD
VALUES          (301982, 'Dominaria Remastered', 'Sorcery');

INSERT INTO     TYPES_OF_CARD
VALUES          (493175, 'Dominaria Remastered', 'Artifact');

INSERT INTO     TYPES_OF_CARD
VALUES          (687437, 'Eventide', 'Creature');

INSERT INTO     TYPES_OF_CARD
VALUES          (621525, 'Wilds of Eldraine', 'Instant');

INSERT INTO     TYPES_OF_CARD
VALUES          (109274, 'Lord of the Rings Commander', 'Artifact');

INSERT INTO     TYPES_OF_CARD
VALUES          (137981, 'Lord of the Rings Commander', 'Artifact');

INSERT INTO     TYPES_OF_CARD
VALUES          (493175, 'Wilds of Eldraine', 'Artifact');

INSERT INTO     TYPES_OF_CARD
VALUES          (943789, 'GateCrash', 'Creature');

INSERT INTO     TYPES_OF_CARD
VALUES          (666666, 'Warhammer 40000 Commander', 'Creature');

INSERT INTO     TYPES_OF_CARD
VALUES          (999999, 'Commander Legends: Battle for Baldurs Gate', 'Creature');

-- Deck from Creator
INSERT INTO     DECK_FROM_CREATOR
VALUES          (296753, 'Ninja Tribal', 'STAN', 'Darth_Zharlner');

INSERT INTO     DECK_FROM_CREATOR
VALUES          (99275, 'Trap Cards', 'COMM', 'Hatsu');

INSERT INTO     DECK_FROM_CREATOR
VALUES          (977177, 'Madness Discard', 'PAUP', 'Pariah462');

INSERT INTO     DECK_FROM_CREATOR
VALUES          (931273, 'Propagate', 'PAUP', 'Pariah462');

INSERT INTO     DECK_FROM_CREATOR
VALUES          (261092, 'Modern Tap Down', 'MDRN', 'Anonymous');

INSERT INTO     DECK_FROM_CREATOR
VALUES          (864695, 'Keyword Soup', 'COMM', 'sumdumname');

INSERT INTO     DECK_FROM_CREATOR
VALUES          (878789, 'Aristocrats', 'COMM', 'sumdumname');

INSERT INTO     DECK_FROM_CREATOR
VALUES          (123412, 'Demon Tribal', 'COMM', 'sumdumname');

-- Card in Deck
-- Ninja Tribal Deck
INSERT INTO     CARD_IN_DECK
VALUES          (296753, 872019, 'March of the Machine');

INSERT INTO     CARD_IN_DECK
VALUES          (296753, 137981, 'Lord of the Rings Commander');

INSERT INTO     CARD_IN_DECK
VALUES          (864695, 109274, 'Lord of the Rings Commander');

-- Trap Card Deck
INSERT INTO     CARD_IN_DECK
VALUES          (99275, 550603, 'Commander 2016');

INSERT INTO     CARD_IN_DECK
VALUES          (99275, 493175, 'Dominaria Remastered');

-- Madness Discard Deck
INSERT INTO     CARD_IN_DECK
VALUES          (977177, 550603, 'Commander 2016');

INSERT INTO     CARD_IN_DECK
VALUES          (977177, 921559, 'Dominaria Remastered');

INSERT INTO     CARD_IN_DECK
VALUES          (977177, 493175, 'Dominaria Remastered');

-- Propagate Deck
INSERT INTO     CARD_IN_DECK
VALUES          (931273, 550603, 'Commander 2016');

INSERT INTO     CARD_IN_DECK
VALUES          (931273, 493175, 'Dominaria Remastered');

INSERT INTO     CARD_IN_DECK
VALUES          (931273, 109274, 'Lord of the Rings Commander');

-- Keyword Soup Deck
INSERT INTO     CARD_IN_DECK
VALUES          (864695, 550603, 'Commander 2016');

INSERT INTO     CARD_IN_DECK
VALUES          (864695, 687437, 'Eventide');

INSERT INTO     CARD_IN_DECK
VALUES          (864695, 999999, 'Commander Legends: Battle for Baldurs Gate');

-- Aristocrats Deck
INSERT INTO     CARD_IN_DECK
VALUES          (878789, 550603, 'Commander 2016');

INSERT INTO     CARD_IN_DECK
VALUES          (878789, 493175, 'Dominaria Remastered');

INSERT INTO     CARD_IN_DECK
VALUES          (878789, 943789, 'GateCrash');

-- Demon Tribal Deck
INSERT INTO     CARD_IN_DECK
VALUES          (123412, 550603, 'Commander 2016');

INSERT INTO     CARD_IN_DECK
VALUES          (123412, 493175, 'Dominaria Remastered');

INSERT INTO     CARD_IN_DECK
VALUES          (123412, 666666, 'Warhammer 40000 Commander');

INSERT INTO     CARD_IN_DECK
VALUES          (123412, 999999, 'Commander Legends: Battle for Baldurs Gate');

-- Modern Tap Down Deck
INSERT INTO     CARD_IN_DECK
VALUES          (261092, 550603, 'Commander 2016');

INSERT INTO     CARD_IN_DECK
VALUES          (261092, 621525, 'Wilds of Eldraine');

INSERT INTO     CARD_IN_DECK
VALUES          (261092, 493175, 'Dominaria Remastered');