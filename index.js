const readline = require("node:readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const commonCards = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

const map = new Map();

map.set(0, "SPADES");
map.set(1, "CLUBS");
map.set(2, "HEARTS");
map.set(3, "DIAMONDS");
const Deck = {
  SPADES: [...commonCards],
  CLUBS: [...commonCards],
  HEARTS: [...commonCards],
  DIAMONDS: [...commonCards],
};
class Card {
  constructor() {
    this.cards = structuredClone(Deck);
  }

  serveCard() {
    const suit = Math.round(0 + 3 * Math.random());
    const card = Math.round(0 + 12 * Math.random());

    const cardToServe = this.cards[map.get(suit)][card];

    if (!cardToServe) {
      return this.serveCard();
    }
    this.cards[map.get(suit)].splice(card, 1);
    return { suit: map.get(suit), card: cardToServe };
  }

  getDeckCount() {
    return Object.keys(this.cards).reduce((accumulator, value) => {
      accumulator += this.cards[value].length;
      return accumulator;
    }, 0);
  }
}

const restart = Symbol("restart");
const gameOver = Symbol("gameOver");
class Game extends Card {
  constructor() {
    super();
    this.playerCardSummation = 0;
    this.dealerCardSummation = 0;
    this.playerHasAce = false;
    this.playerAceUsed = false;
    this.dealerHasAce = false;
    this.dealerAceUsed = false;
    this.isPlayerTurn = true;
    this.playerCards = [];
    this.dealerCards = [];
    this.gameOver = false;
  }

  hit() {
    let summationValue = 0;
    const drawnCard = this.playCard(1);
    if (this.isPlayerTurn) {
      this.computeCardSummationBasedOnAceCard(drawnCard, true);
      summationValue = this.playerCardSummation;
    } else {
      this.computeCardSummationBasedOnAceCard(drawnCard);
      summationValue = this.dealerCardSummation;
    }
    if (this.checkIfOver21(summationValue)) {
      console.log("Game over");
      this[gameOver]();
      return;
    }
    this.continueGame();
  }

  stand() {
    this.isPlayerTurn = false;
    const [card, suit] = this.dealerCards[this.dealerCards.length - 1];
    console.log(`${card} of ${suit}`);
    this.checkForAces();
    this.checkIfOver21(this.dealerCardSummation);
    this.continueGame();
  }

  continueGame() {
    if (this.isPlayerTurn) {
      this.getInput();
    } else {
      if (this.dealerCardSummation <= this.playerCardSummation) {
        this.hit();
      } else if (
        this.dealerCardSummation > this.playerCardSummation &&
        this.dealerCardSummation <= 21
      ) {
        console.log("Dealer wins");
        this[gameOver]();
      } else {
        this.hit();
      }
    }
  }

  getInput() {
    readline.question(
      `Hit or stand?
      Hit = 1, Stand = 2\n`,
      (input) => {
        switch (+input) {
          case 1:
            this.hit();
            break;
          case 2:
            this.stand();
            break;
          default:
            console.log("Invalid input entered, please try again");
            this.getInput();
            break;
        }
      }
    );
  }

  playFaceDownCard() {
    let cardValueSummation = 0;
    const { suit, card } = this.serveCard();
    const cardValue = commonCards.findIndex((item) => item === card) + 1;
    if (cardValue === 1) {
      cardValueSummation += 11;
    } else {
      cardValueSummation += cardValue >= 10 ? 10 : cardValue;
    }
    this.dealerCards.push([card, suit]);
    this.dealerCardSummation += cardValueSummation;
  }

  checkIfOver21(value) {
    console.log("Current value:", value);
    if (value > 21) {
      console.log("Bust");
      return true;
    }
    return false;
  }

  playCard(count = 0, isPlayerPlaying = true) {
    let cardValueSummation = 0;
    for (let i = 0; i < count; ++i) {
      const { suit, card } = this.serveCard();
      const cardValue = commonCards.findIndex((item) => item === card) + 1;
      if (cardValue === 1) {
        cardValueSummation += 11;
      } else {
        cardValueSummation += cardValue >= 10 ? 10 : cardValue;
      }
      console.log(`${card} of ${suit}`);
      isPlayerPlaying
        ? this.playerCards.push([card, suit])
        : this.dealerCards.push([card, suit]);
    }

    return cardValueSummation;
  }

  checkForAces(player = true) {
    if (player) {
      const includesAce = this.playerCards.flat().includes("A");
      if (includesAce) {
        this.playerHasAce = true;
      }
    } else {
      const includesAce = this.dealerCards.flat().includes("A");
      if (includesAce) {
        this.dealerHasAce = true;
      }
    }
  }

  computeCardSummationBasedOnAceCard(drawnCard, isPlayerPlaying = false) {
    switch (isPlayerPlaying) {
      case true:
        if (drawnCard === 11) {
          this.playerCardSummation += drawnCard;
          this.playerCardSummation =
            this.playerCardSummation > 21
              ? this.playerCardSummation - 10
              : this.playerCardSummation;
          this.playerHasAce = true;
        } else {
          this.playerCardSummation += drawnCard;
          this.playerCardSummation =
            this.playerCardSummation > 21 &&
            this.playerHasAce &&
            !this.playerAceUsed
              ? this.playerCardSummation - 10
              : this.playerCardSummation;
        }
        break;
      case false:
        if (drawnCard === 11) {
          this.dealerCardSummation += drawnCard;
          this.dealerCardSummation =
            this.dealerCardSummation > 21
              ? this.dealerCardSummation - 10
              : this.dealerCardSummation;
          this.dealerHasAce = true;
        } else {
          this.dealerCardSummation += drawnCard;
          this.dealerCardSummation =
            this.dealerCardSummation > 21 &&
            this.dealerHasAce &&
            !this.dealerAceUsed
              ? this.dealerCardSummation - 10
              : this.dealerCardSummation;

          this.dealerAceUsed = true;
        }
        break;
      default:
        if (drawnCard === 11) {
          this.dealerCardSummation += drawnCard;
          this.dealerCardSummation =
            this.dealerCardSummation > 21
              ? this.dealerCardSummation - 10
              : this.dealerCardSummation;
          this.dealerHasAce = true;
        } else {
          this.dealerCardSummation += drawnCard;
          this.dealerCardSummation =
            this.dealerCardSummation > 21 &&
            this.dealerHasAce &&
            !this.dealerAceUsed
              ? this.dealerCardSummation - 10
              : this.dealerCardSummation;
          this.dealerAceUsed = true;
        }
        break;
    }
  }

  [gameOver]() {
    readline.question(`Play Again = 1, Exit = 2\n`, (input) => {
      switch (+input) {
        case 1:
          this[restart]();
          break;
        case 2:
          process.exit();
          break;
        default:
          console.log("Invalid input entered, please try again");
          this[gameOver]();
          break;
      }
    });
  }
  [restart]() {
    this.playerCardSummation = 0;
    this.dealerCardSummation = 0;
    this.playerHasAce = false;
    this.dealerHasAce = false;
    this.isPlayerTurn = true;
    this.playerCards = [];
    this.dealerCards = [];
    this.gameOver = false;
    this.cards = structuredClone(Deck);
    this.playerCardSummation = this.playCard(2);
    this.checkForAces();
    console.log("Dealers Card");
    this.dealerCardSummation = play.playCard(1, false);
    this.checkForAces();
    console.log("Face down card");
    this.playFaceDownCard();

    this.getInput();
  }
}

const play = new Game();

play.playerCardSummation = play.playCard(2);
play.checkForAces();
console.log("Dealers Card");
play.dealerCardSummation = play.playCard(1, false);
play.checkForAces(false);
console.log("Face down card");
play.playFaceDownCard();

play.getInput();