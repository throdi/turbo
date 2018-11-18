const G = require('gizoogle');

module.exports = {
    name: 'homie',
    description: 'Gizoogle some text',
    execute(message, args) {
      let sentence = args.join(' ');
      G.string(sentence, function(error, translation) {
          message.channel.send(translation);
      });
      return;
    },
};
