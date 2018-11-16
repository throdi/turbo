const fs = require("fs");
existingIdentifiers = [];

module.exports = {
  name: "quote",
  usage: "@<mention> quote <quote_id | add | remove> (quote that follows add or id to remove)",
  description: "Add your own quote or hear random stuff",
  execute(message, args) {
    reloadData();

    // ex: @Turbo quote
    if (args.length == 0) return message.channel.send(randomQuote());

    const mainArg = args.shift().toLowerCase();

    if (mainArg === "add") {
      // @Turbo quote add <args>
      if (args.length == 0) {
        //No args, nothing to add, scold the user
        return message.channel.send("WHAT DO YOU WANT ME TO ADD?!?!?");
      } else {
        const identifier = args.shift().toLowerCase();

        if (!identifierExists(identifier)) {
          return message.channel.send("Sorry, that already exists!");
        }

        if (args.length == 0) {
          //The user clearly doesn't know how to use this command, explain the usage
          return message.channel.send("add WHAT?!?!?"); // I'm too lazy.
        } else {
          const quote = args.join(" ");
          message.channel.send("Gotcha fam, I grow smarter.");
          saveFile(message, identifier, quote);
        }
      }
    } else if (mainArg == "remove") {
      // todo
    } else {
      if (!identifierExists(mainArg)) {
        let content = fs.readFileSync("./quotes/" + mainArg + ".json");
        const quoteData = JSON.parse(content);
        return message.channel.send(quoteData.quote);
      } else {
        return message.channel.send("Such quote doesn't exist you dingus");
      }
    }
  }
};

const identifierExists = identifier => {
  if (existingIdentifiers.indexOf(identifier) > -1) return false;
  return true;
};

const saveFile = (message, identifier, quote) => {
  const jsonObj = {
    owner: message.author.id,
    date: new Date(),
    name: identifier,
    quote: quote
  };

  fs.writeFile(
    "./quotes/" + identifier + ".json",
    JSON.stringify(jsonObj),
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log(`The quote ${quote} was saved!`);
    }
  );
};

const reloadData = () => {
  const identifiers = fs
    .readdirSync("./quotes")
    .filter(file => file.endsWith(".json"));
  existingIdentifiers = [];
  for (const file of identifiers) {
    existingIdentifiers.push(file.substring(0, file.length - 5));
  }
};

const randomQuote = () => {
  let randomId =
    existingIdentifiers[Math.floor(Math.random() * existingIdentifiers.length)];
  let content = fs.readFileSync("./quotes/" + randomId + ".json");
  let quoteData = JSON.parse(content);
  return quoteData.quote;
};
