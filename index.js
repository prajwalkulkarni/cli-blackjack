const readline = require("node:readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const commonCards = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
const chips = [
  50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000, 500000, 1000000,
];
const map = new Map();

let splitOp;
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
    this.cash = 2000;
    this.stake = 0;
    this.firstServe = true;
    this.isPlayingDoubleDown = false;
    this.isPlayingSplit = false;
    this.standAfterPlayingSplit = false;
    this.firstSetSummationFromSplit = 0;
  }

  getBalance() {
    return this.cash;
  }

  hasSufficientBalance() {
    return this.getBalance() > 0;
  }

  generateBetOptions() {
    if (this.hasSufficientBalance()) {
      const balance = this.getBalance();

      if (balance <= 500) {
        return chips.slice(0, 2);
      }

      let highestDenomination = chips[0];
      chips.forEach((chip) => {
        if (balance > chip) {
          highestDenomination = chip;
        }
      });

      const chipIndex = chips.findIndex((chip) => chip === highestDenomination);
      return chips.slice(chipIndex - 2, chipIndex + 1);
    }
  }

  #serveInitialCards() {
    this.playerCardSummation = this.playCard(2);
    this.checkForAces();
    console.log("Dealers Card");
    this.dealerCardSummation = this.playCard(1, false);
    this.checkForAces(false);
    console.log("Face down card");
    this.playFaceDownCard();

    this.getInput();
  }

  placeBets() {
    if (this.getBalance() === 0) {
      console.log("You are broke. Starting a new game\n");
      this.gameOver();
    }
    console.log(
      "Place your bets, your current balance is: " + this.getBalance()
    );
    const betOptions = this.generateBetOptions();
    readline.question(`${betOptions.toString()}\n`, (input) => {
      switch (+input) {
        case 1:
          this.stake = betOptions[0];
          this.cash -= this.stake;
          this.#serveInitialCards();
          break;
        case 2:
          this.stake = betOptions[1];
          this.cash -= this.stake;
          this.#serveInitialCards();
          break;
        case 3:
          this.stake = betOptions[2];
          this.cash -= this.stake;
          this.#serveInitialCards();
          break;
        default:
          console.log("Invalid input entered, please try again");
          this.placeBets();
          break;
      }
    });
  }

  hit() {
    let summationValue = 0;
    const drawnCard = this.playCard(1);
    if (this.isPlayerTurn) {
      this.computeCardSummationBasedOnAceCard(drawnCard, true);
      summationValue = this.isPlayingSplit
        ? this.firstSetSummationFromSplit
        : this.playerCardSummation;
    } else {
      this.computeCardSummationBasedOnAceCard(drawnCard);
      summationValue = this.dealerCardSummation;
    }
    if (this.checkIfOver21(summationValue)) {
      if (!this.isPlayerTurn) {
        console.log("You Win");
        this.cash += 2 * this.stake;
        this.stake = 0;
      } else {
        this.stake = 0;
        this.isPlayingSplit
          ? (() => {
              splitOp.call(this);
              return;
            })()
          : null;
      }

      // this.standAfterPlayingSplit ? this.continueGame() : null;
      // this.isPlayingSplit
      //   ? (() => {
      //       splitOp.call(this);
      //     })()
      //   : function () {
      //       console.log('Game over');
      //       this[gameOver]();
      //     }.call(this);
      console.log("Game over");
      this[gameOver]();

      return;
    }
    if (!this.isPlayingDoubleDown) {
      this.continueGame();
    }
  }

  stand() {
    this.isPlayerTurn = false;
    const [card, suit] = this.dealerCards[this.dealerCards.length - 1];
    console.log(`${card} of ${suit}`);
    this.checkForAces(false);
    this.checkIfOver21(this.dealerCardSummation);
    this.continueGame();
  }

  continueGame() {
    if (this.isPlayerTurn) {
      this.getInput();
    } else {
      if (this.standAfterPlayingSplit) {
        if (
          this.dealerCardSummation <
          Math.min(this.firstSetSummationFromSplit, this.playerCardSummation)
        ) {
          this.hit();
        } else if (
          this.dealerCardSummation === this.firstSetSummationFromSplit &&
          this.dealerCardSummation >= 17 &&
          this.dealerCardSummation <= 21
        ) {
          console.log("Push");
          this.cash += this.stake;
          this.stake /= 2;
          this.standAfterPlayingSplit = false;
          this.continueGame();
        } else if (
          this.dealerCardSummation > this.firstSetSummationFromSplit &&
          this.dealerCardSummation <= 21
        ) {
          console.log("Dealer wins");
          this.stake /= 2;
          this.standAfterPlayingSplit = false;
          this.continueGame();
          // this[gameOver]();
        } else if (
          this.dealerCardSummation > this.firstSetSummationFromSplit ||
          (this.dealerCardSummation > this.playerCardSummation &&
            this.dealerCardSummation > 21)
        ) {
          this[gameOver]();
        } else {
          this.hit();
        }
      }
      if (this.dealerCardSummation < this.playerCardSummation) {
        this.hit();
      } else if (
        this.dealerCardSummation === this.playerCardSummation &&
        this.dealerCardSummation >= 17 &&
        this.dealerCardSummation <= 21
      ) {
        console.log("Push");
        this.cash += this.stake;
        this[gameOver]();
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
    const hasSufficientBalanceForDoubleDown = this.getBalance() >= this.stake;
    const canDoubleDown = this.firstServe && hasSufficientBalanceForDoubleDown;

    const hasSufficientBalanceForSplit = this.getBalance() >= this.stake;
    const canSplit =
      (this.firstServe &&
        hasSufficientBalanceForSplit &&
        commonCards.findIndex((card) => card === this.playerCards[0][0]) >= 9 &&
        commonCards.findIndex((card) => card === this.playerCards[1][0]) >=
          9) ||
      (this.firstServe &&
        commonCards.findIndex((card) => card === this.playerCards[0][0]) ===
          commonCards.findIndex((card) => card === this.playerCards[1][0]));
    readline.question(
      `Hit or stand?
      Hit = 1, Stand = 2 ${canDoubleDown ? "Double = 3" : ""} ${
        canSplit ? "Split = 4" : ""
      }\n`,
      (input) => {
        switch (+input) {
          case 1:
            this.hit();
            break;
          case 2:
            if (this.isPlayingSplit) {
              splitOp.call(this);
              break;
            }
            this.stand();
            break;
          case 3:
            if (canDoubleDown) {
              this.isPlayingDoubleDown = true;
              this.cash -= this.stake;
              this.stake *= 2;
              this.hit();
              this.stand();
              break;
            }
          case 4:
            if (canSplit) {
              this.cash -= this.stake;
              this.stake *= 2;
              splitOp = this.#playSplit();
              break;
            }

          default:
            console.log("Invalid input entered, please try again");
            this.getInput();
            break;
        }
      }
    );
    this.firstServe = false;
  }

  #playSplit() {
    this.isPlayingSplit = true;
    const secondSetCard = this.playerCards[1];
    const firstSetCard = this.playerCards[0];
    this.firstSetSummationFromSplit = 0;
    const cardValue =
      commonCards.findIndex((card) => card === firstSetCard[0]) + 1;
    if (cardValue === 1) {
      this.firstSetSummationFromSplit += 11;
    } else {
      this.firstSetSummationFromSplit += cardValue >= 10 ? 10 : cardValue;
    }
    this.hit();
    this.getInput();

    return function () {
      const firstSetSummation = this.firstSetSummationFromSplit;
      console.log(firstSetSummation);
      this.playerCardSummation = 0;
      const cardValue =
        commonCards.findIndex((card) => card === secondSetCard[0]) + 1;
      if (cardValue === 1) {
        this.playerCardSummation += 11;
      } else {
        this.playerCardSummation += cardValue >= 10 ? 10 : cardValue;
      }
      this.isPlayingSplit = false;
      this.hit();
      this.standAfterPlayingSplit = true;
      this.getInput();
    };
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
          if (this.isPlayingSplit) {
            this.firstSetSummationFromSplit += drawnCard;
            this.firstSetSummationFromSplit =
              this.firstSetSummationFromSplit > 21
                ? this.firstSetSummationFromSplit - 10
                : this.firstSetSummationFromSplit;
          } else {
            this.playerCardSummation += drawnCard;
            this.playerCardSummation =
              this.playerCardSummation > 21
                ? this.playerCardSummation - 10
                : this.playerCardSummation;
          }

          this.playerHasAce = true;
          this.playerAceUsed = true;
        } else {
          if (this.isPlayingSplit) {
            this.firstSetSummationFromSplit += drawnCard;
            if (
              this.firstSetSummationFromSplit > 21 &&
              this.playerHasAce &&
              !this.playerAceUsed
            ) {
              this.firstSetSummationFromSplit -= 10;
              this.playerAceUsed = true;
            }
          } else {
            this.playerCardSummation += drawnCard;

            if (
              this.playerCardSummation > 21 &&
              this.playerHasAce &&
              !this.playerAceUsed
            ) {
              this.playerCardSummation -= 10;
              this.playerAceUsed = true;
            }
          }
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
          this.dealerAceUsed = true;
        } else {
          this.dealerCardSummation += drawnCard;
          if (
            this.dealerCardSummation > 21 &&
            this.dealerHasAce &&
            !this.dealerAceUsed
          ) {
            this.dealerCardSummation -= 10;
            this.dealerAceUsed = true;
          }
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
          this.dealerAceUsed = true;
        } else {
          this.dealerCardSummation += drawnCard;
          if (
            this.dealerCardSummation > 21 &&
            this.dealerHasAce &&
            !this.dealerAceUsed
          ) {
            this.dealerCardSummation -= 10;
            this.dealerAceUsed = true;
          }
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
    this.playerAceUsed = false;
    this.dealerAceUsed = false;
    this.isPlayerTurn = true;
    this.playerCards = [];
    this.dealerCards = [];
    this.gameOver = false;
    this.firstServe = true;
    this.isPlayingDoubleDown = false;
    this.isPlayingSplit = false;
    this.firstSetSummationFromSplit = 0;
    this.standAfterPlayingSplit = false;
    this.cards = structuredClone(Deck);
    this.placeBets();
    // this.playerCardSummation = this.playCard(2);
    // this.checkForAces();
    // console.log('Dealers Card');
    // this.dealerCardSummation = play.playCard(1, false);
    // this.checkForAces();
    // console.log('Face down card');
    // this.playFaceDownCard();

    // this.getInput();
  }
}

const play = new Game();

play.placeBets();
// play.playerCardSummation = play.playCard(2);
// play.checkForAces();
// console.log('Dealers Card');
// play.dealerCardSummation = play.playCard(1, false);
// play.checkForAces(false);
// console.log('Face down card');
// play.playFaceDownCard();

// play.getInput();
