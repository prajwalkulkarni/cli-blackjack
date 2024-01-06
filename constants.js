import readline from "node:readline";
export const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const commonCards = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
export const chips = [
  50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000, 500000, 1000000,
];
