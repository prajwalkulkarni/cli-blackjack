#!/usr/bin/env node
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
import "core-js/modules/web.dom-exception.constructor.js";
import "core-js/modules/web.dom-exception.stack.js";
import "core-js/modules/web.dom-exception.to-string-tag.js";
import "core-js/modules/web.structured-clone.js";
import "core-js/modules/es.array.push.js";
import "core-js/modules/es.error.cause.js";
import { readLine, commonCards, chips } from "./constants.js";
const map = new Map();
let splitSecondHand;
map.set(0, "♤");
map.set(1, "♣");
map.set(2, "♡");
map.set(3, "♦");
const Deck = {
  "♦": [...commonCards],
  "♣": [...commonCards],
  "♡": [...commonCards],
  "♤": [...commonCards]
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
    return {
      suit: map.get(suit),
      card: cardToServe
    };
  }
  getDeckCount() {
    return Object.keys(this.cards).reduce((accumulator, value) => {
      accumulator += this.cards[value].length;
      return accumulator;
    }, 0);
  }
}
var _getBalance = /*#__PURE__*/new WeakSet();
var _hasSufficientBalance = /*#__PURE__*/new WeakSet();
var _generateBetOptions = /*#__PURE__*/new WeakSet();
var _serveInitialCards = /*#__PURE__*/new WeakSet();
var _continueGame = /*#__PURE__*/new WeakSet();
var _canSplit = /*#__PURE__*/new WeakSet();
var _canDoubleDown = /*#__PURE__*/new WeakSet();
var _playSplit = /*#__PURE__*/new WeakSet();
var _playFaceDownCard = /*#__PURE__*/new WeakSet();
var _checkIfOver = /*#__PURE__*/new WeakSet();
var _playCard = /*#__PURE__*/new WeakSet();
var _checkForAces = /*#__PURE__*/new WeakSet();
var _computeCardSummationBasedOnAceCard = /*#__PURE__*/new WeakSet();
var _gameOver = /*#__PURE__*/new WeakSet();
var _restart = /*#__PURE__*/new WeakSet();
class Game extends Card {
  constructor() {
    super();
    _classPrivateMethodInitSpec(this, _restart);
    _classPrivateMethodInitSpec(this, _gameOver);
    _classPrivateMethodInitSpec(this, _computeCardSummationBasedOnAceCard);
    _classPrivateMethodInitSpec(this, _checkForAces);
    _classPrivateMethodInitSpec(this, _playCard);
    _classPrivateMethodInitSpec(this, _checkIfOver);
    _classPrivateMethodInitSpec(this, _playFaceDownCard);
    _classPrivateMethodInitSpec(this, _playSplit);
    _classPrivateMethodInitSpec(this, _canDoubleDown);
    _classPrivateMethodInitSpec(this, _canSplit);
    _classPrivateMethodInitSpec(this, _continueGame);
    _classPrivateMethodInitSpec(this, _serveInitialCards);
    _classPrivateMethodInitSpec(this, _generateBetOptions);
    _classPrivateMethodInitSpec(this, _hasSufficientBalance);
    _classPrivateMethodInitSpec(this, _getBalance);
    this.playerCardSummation = 0;
    this.dealerCardSummation = 0;
    this.playerHasAce = false;
    this.playerAceUsed = false;
    this.dealerHasAce = false;
    this.dealerAceUsed = false;
    this.isPlayerTurn = true;
    this.playerCards = [];
    this.dealerCards = [];
    this.cash = 2000;
    this.stake = 0;
    this.firstServe = true;
    this.isPlayingDoubleDown = false;
    this.isPlayingSplit = false;
    this.standAfterPlayingSplit = false;
    this.firstSetSummationFromSplit = 0;
  }
  startGame() {
    if (_classPrivateMethodGet(this, _getBalance, _getBalance2).call(this) === 0) {
      console.log("You are broke. Starting a new game\n");
      _classPrivateMethodGet(this, _gameOver, _gameOver2).call(this);
    }
    console.log("Place your bets, your current balance is: $" + _classPrivateMethodGet(this, _getBalance, _getBalance2).call(this));
    const betOptions = _classPrivateMethodGet(this, _generateBetOptions, _generateBetOptions2).call(this);
    readLine.question(`${betOptions.map((bet, index) => index + 1 + ". $" + bet)}\n[Press 1 to select $${betOptions[0]}, 2 to select $${betOptions[1]} ${betOptions[2] ? ", 3 to select $" + betOptions[2] : ""}]\n`, input => {
      switch (+input) {
        case 1:
          this.stake = betOptions[0];
          this.cash -= this.stake;
          _classPrivateMethodGet(this, _serveInitialCards, _serveInitialCards2).call(this);
          break;
        case 2:
          this.stake = betOptions[1];
          this.cash -= this.stake;
          _classPrivateMethodGet(this, _serveInitialCards, _serveInitialCards2).call(this);
          break;
        case 3:
          if (_classPrivateMethodGet(this, _getBalance, _getBalance2).call(this) <= 500) {
            console.log("Invalid input entered, please try again");
            this.startGame();
            return;
          } else {
            this.stake = betOptions[2];
            this.cash -= this.stake;
            _classPrivateMethodGet(this, _serveInitialCards, _serveInitialCards2).call(this);
            break;
          }
        default:
          console.log("Invalid input entered, please try again");
          this.startGame();
          break;
      }
    });
  }
  hit() {
    let summationValue = 0;
    const drawnCard = _classPrivateMethodGet(this, _playCard, _playCard2).call(this, 1);
    if (this.isPlayerTurn) {
      _classPrivateMethodGet(this, _computeCardSummationBasedOnAceCard, _computeCardSummationBasedOnAceCard2).call(this, drawnCard, true);
      summationValue = this.isPlayingSplit ? this.firstSetSummationFromSplit : this.playerCardSummation;
    } else {
      _classPrivateMethodGet(this, _computeCardSummationBasedOnAceCard, _computeCardSummationBasedOnAceCard2).call(this, drawnCard);
      summationValue = this.dealerCardSummation;
    }
    if (_classPrivateMethodGet(this, _checkIfOver, _checkIfOver2).call(this, summationValue)) {
      if (!this.isPlayerTurn) {
        console.log("You Win");
        this.cash += this.standAfterPlayingSplit && (this.playerCardSummation > 21 || this.firstSetSummationFromSplit > 21) ? this.stake : 2 * this.stake;
      } else {
        this.isPlayingSplit ? (() => {
          splitSecondHand.call(this);
          return;
        })() : null;
        this.playerCardSummation > 21 && this.standAfterPlayingSplit ? this.stand() : null;
      }
      console.log("Game over");
      _classPrivateMethodGet(this, _gameOver, _gameOver2).call(this);
      return;
    }
    if (!this.isPlayingDoubleDown || this.isPlayingDoubleDown && !this.isPlayerTurn) {
      _classPrivateMethodGet(this, _continueGame, _continueGame2).call(this);
    }
  }
  stand() {
    console.log("Dealer's Turn\n");
    this.isPlayerTurn = false;
    const [card, suit] = this.dealerCards[this.dealerCards.length - 1];
    console.log(`Face down card:${card} of ${suit}`);
    _classPrivateMethodGet(this, _checkForAces, _checkForAces2).call(this, false);
    _classPrivateMethodGet(this, _checkIfOver, _checkIfOver2).call(this, this.dealerCardSummation);
    _classPrivateMethodGet(this, _continueGame, _continueGame2).call(this);
  }
  getInput() {
    const canDoubleDown = _classPrivateMethodGet(this, _canDoubleDown, _canDoubleDown2).call(this);
    const canSplit = _classPrivateMethodGet(this, _canSplit, _canSplit2).call(this);
    readLine.question(`Hit or stand?\nHit = 1, Stand = 2 ${canDoubleDown ? "Double = 3" : ""} ${canSplit ? "Split = 4" : ""}\n`, input => {
      switch (+input) {
        case 1:
          this.hit();
          break;
        case 2:
          if (this.isPlayingSplit) {
            splitSecondHand.call(this);
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
            if (this.playerCardSummation <= 21) {
              this.stand();
            }
            break;
          }
        case 4:
          if (canSplit) {
            this.cash -= this.stake;
            this.stake *= 2;
            splitSecondHand = _classPrivateMethodGet(this, _playSplit, _playSplit2).call(this);
            break;
          }
        default:
          console.log("Invalid input entered, please try again");
          this.getInput();
          break;
      }
    });
    this.firstServe = false;
  }
}
function _getBalance2() {
  return this.cash;
}
function _hasSufficientBalance2() {
  return _classPrivateMethodGet(this, _getBalance, _getBalance2).call(this) > 0;
}
function _generateBetOptions2() {
  if (_classPrivateMethodGet(this, _hasSufficientBalance, _hasSufficientBalance2).call(this)) {
    const balance = _classPrivateMethodGet(this, _getBalance, _getBalance2).call(this);
    if (balance <= 500) {
      return chips.slice(0, 2);
    }
    let highestDenomination = chips[0];
    chips.forEach(chip => {
      if (balance > chip) {
        highestDenomination = chip;
      }
    });
    const chipIndex = chips.findIndex(chip => chip === highestDenomination);
    return chips.slice(chipIndex - 2, chipIndex + 1);
  }
}
function _serveInitialCards2() {
  this.playerCardSummation = _classPrivateMethodGet(this, _playCard, _playCard2).call(this, 2);
  _classPrivateMethodGet(this, _checkForAces, _checkForAces2).call(this);
  console.log("\nDealers Card");
  this.dealerCardSummation = _classPrivateMethodGet(this, _playCard, _playCard2).call(this, 1, false);
  _classPrivateMethodGet(this, _checkForAces, _checkForAces2).call(this, false);
  console.log("Face down card\n");
  _classPrivateMethodGet(this, _playFaceDownCard, _playFaceDownCard2).call(this);
  this.getInput();
}
function _continueGame2() {
  if (this.isPlayerTurn) {
    this.getInput();
  } else {
    if (this.standAfterPlayingSplit) {
      if (this.dealerCardSummation < 17) {
        this.hit();
        return;
      }
      const dealerAlive = this.dealerCardSummation >= 17 && this.dealerCardSummation <= 21;
      if (!dealerAlive && this.firstSetSummationFromSplit <= 21 && this.playerCardSummation <= 21) {
        console.log("You win both hands");
        this.cash += 2 * this.stake;
      }
      if (this.dealerCardSummation > this.firstSetSummationFromSplit || this.firstSetSummationFromSplit > 21) {
        console.log("Dealer wins against 1st hand");
      }
      if (this.dealerCardSummation > this.playerCardSummation || this.playerCardSummation > 21) {
        console.log("Dealer wins against 2nd hand");
      }
      if (this.dealerCardSummation === this.firstSetSummationFromSplit) {
        console.log("Push - 1st hand");
        this.cash += this.stake / 2;
      }
      if (this.dealerCardSummation === this.playerCardSummation) {
        console.log("Push - 2nd hand");
        this.cash += this.stake / 2;
      }
      if (this.firstSetSummationFromSplit > this.dealerCardSummation && this.firstSetSummationFromSplit <= 21 || !dealerAlive) {
        console.log("You win the 1st hand");
        this.cash += this.stake;
      }
      if (this.playerCardSummation > this.dealerCardSummation && this.playerCardSummation <= 21 || !dealerAlive) {
        console.log("You win the 2nd hand");
        this.cash += this.stake;
      }
      _classPrivateMethodGet(this, _gameOver, _gameOver2).call(this);
    } else {
      if (this.dealerCardSummation < 17) {
        this.hit();
      } else if (this.dealerCardSummation === this.playerCardSummation && this.dealerCardSummation >= 17 && this.dealerCardSummation <= 21) {
        console.log("Push");
        this.cash += this.stake;
        _classPrivateMethodGet(this, _gameOver, _gameOver2).call(this);
      } else if (this.dealerCardSummation > this.playerCardSummation && this.dealerCardSummation <= 21) {
        console.log("Dealer wins");
        _classPrivateMethodGet(this, _gameOver, _gameOver2).call(this);
      } else {
        console.log("You win");
        this.cash += 2 * this.stake;
        _classPrivateMethodGet(this, _gameOver, _gameOver2).call(this);
      }
    }
  }
}
function _canSplit2() {
  const hasSufficientBalanceForSplit = _classPrivateMethodGet(this, _getBalance, _getBalance2).call(this) >= this.stake;
  return this.firstServe && hasSufficientBalanceForSplit && commonCards.findIndex(card => card === this.playerCards[0][0]) >= 9 && commonCards.findIndex(card => card === this.playerCards[1][0]) >= 9 || this.firstServe && commonCards.findIndex(card => card === this.playerCards[0][0]) === commonCards.findIndex(card => card === this.playerCards[1][0]);
}
function _canDoubleDown2() {
  const hasSufficientBalanceForDoubleDown = _classPrivateMethodGet(this, _getBalance, _getBalance2).call(this) >= this.stake;
  return this.firstServe && hasSufficientBalanceForDoubleDown;
}
function _playSplit2() {
  this.isPlayingSplit = true;
  const secondSetCard = this.playerCards[1];
  const firstSetCard = this.playerCards[0];
  this.firstSetSummationFromSplit = 0;
  const cardValue = commonCards.findIndex(card => card === firstSetCard[0]) + 1;
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
    const cardValue = commonCards.findIndex(card => card === secondSetCard[0]) + 1;
    if (cardValue === 1) {
      this.playerCardSummation += 11;
    } else {
      this.playerCardSummation += cardValue >= 10 ? 10 : cardValue;
    }
    this.isPlayingSplit = false;
    this.standAfterPlayingSplit = true;
    this.hit();
    this.getInput();
  };
}
function _playFaceDownCard2() {
  let cardValueSummation = 0;
  const {
    suit,
    card
  } = this.serveCard();
  const cardValue = commonCards.findIndex(item => item === card) + 1;
  if (cardValue === 1) {
    cardValueSummation += 11;
  } else {
    cardValueSummation += cardValue >= 10 ? 10 : cardValue;
  }
  this.dealerCards.push([card, suit]);
  this.dealerCardSummation += cardValueSummation;
}
function _checkIfOver2(value) {
  console.log("Current value:", value);
  if (value > 21) {
    console.log("Bust");
    return true;
  }
  return false;
}
function _playCard2(count = 0, isPlayerPlaying = true) {
  let cardValueSummation = 0;
  for (let i = 0; i < count; ++i) {
    const {
      suit,
      card
    } = this.serveCard();
    const cardValue = commonCards.findIndex(item => item === card) + 1;
    if (cardValue === 1) {
      cardValueSummation += 11;
    } else {
      cardValueSummation += cardValue >= 10 ? 10 : cardValue;
    }
    console.log(`${card} of ${suit}`);
    isPlayerPlaying ? this.playerCards.push([card, suit]) : this.dealerCards.push([card, suit]);
  }
  return cardValueSummation;
}
function _checkForAces2(player = true) {
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
function _computeCardSummationBasedOnAceCard2(drawnCard, isPlayerPlaying = false) {
  switch (isPlayerPlaying) {
    case true:
      if (drawnCard === 11) {
        if (this.isPlayingSplit) {
          this.firstSetSummationFromSplit += drawnCard;
          this.firstSetSummationFromSplit = this.firstSetSummationFromSplit > 21 ? this.firstSetSummationFromSplit - 10 : this.firstSetSummationFromSplit;
        } else {
          this.playerCardSummation += drawnCard;
          this.playerCardSummation = this.playerCardSummation > 21 ? this.playerCardSummation - 10 : this.playerCardSummation;
        }
        this.playerHasAce = true;
        this.playerAceUsed = true;
      } else {
        if (this.isPlayingSplit) {
          this.firstSetSummationFromSplit += drawnCard;
          if (this.firstSetSummationFromSplit > 21 && this.playerHasAce && !this.playerAceUsed) {
            this.firstSetSummationFromSplit -= 10;
            this.playerAceUsed = true;
          }
        } else {
          this.playerCardSummation += drawnCard;
          if (this.playerCardSummation > 21 && this.playerHasAce && !this.playerAceUsed) {
            this.playerCardSummation -= 10;
            this.playerAceUsed = true;
          }
        }
      }
      break;
    case false:
    default:
      if (drawnCard === 11) {
        this.dealerCardSummation += drawnCard;
        this.dealerCardSummation = this.dealerCardSummation > 21 ? this.dealerCardSummation - 10 : this.dealerCardSummation;
        this.dealerHasAce = true;
        this.dealerAceUsed = true;
      } else {
        this.dealerCardSummation += drawnCard;
        if (this.dealerCardSummation > 21 && this.dealerHasAce && !this.dealerAceUsed) {
          this.dealerCardSummation -= 10;
          this.dealerAceUsed = true;
        }
      }
      break;
  }
}
function _gameOver2() {
  readLine.question(`Play Again = 1, Exit = 2\n`, input => {
    switch (+input) {
      case 1:
        _classPrivateMethodGet(this, _restart, _restart2).call(this);
        break;
      case 2:
        process.exit();
      default:
        console.log("Invalid input entered, please try again");
        _classPrivateMethodGet(this, _gameOver, _gameOver2).call(this);
        break;
    }
  });
}
function _restart2() {
  this.playerCardSummation = 0;
  this.dealerCardSummation = 0;
  this.playerHasAce = false;
  this.dealerHasAce = false;
  this.playerAceUsed = false;
  this.dealerAceUsed = false;
  this.isPlayerTurn = true;
  this.playerCards = [];
  this.dealerCards = [];
  this.firstServe = true;
  this.isPlayingDoubleDown = false;
  this.isPlayingSplit = false;
  this.firstSetSummationFromSplit = 0;
  this.standAfterPlayingSplit = false;
  this.cards = structuredClone(Deck);
  this.stake = 0;
  this.startGame();
}
const play = new Game();
play.startGame();
