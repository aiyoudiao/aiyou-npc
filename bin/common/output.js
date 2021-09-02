
var figlet = require ('figlet');
const chalk = require ('chalk');

function out (text) {
  figlet (
    text || 'aiyou-npc',
    {
      // font: 'Graffiti',
      font: 'Jacky',
      // font: 'Alpha',
      horizontalLayout: 'full',
      verticalLayout: 'full',
      // font: 'Standard',
      // horizontalLayout: 'fitted',
      // verticalLayout: 'universal smushing',
    },
    function (err, text) {
      if (err) {
        console.log (chalk.red (`\noutput aiyou *** bad.\r\n`));
        console.dir (err);
        return;
      }
      console.log (chalk.rgb (128, 0, 128) (`${text}\r\n`));
    }
  );
}

function outError (text = 'bad') {
  figlet (
    text || 'aiyou-npc',
    {
      // font: 'Graffiti',
      font: 'Jacky',
      // font: 'Alpha',
      horizontalLayout: 'full',
      verticalLayout: 'full',
    },
    function (err, text) {
      if (err) {
        console.log (chalk.red (`output bad.\r\n`));
        console.dir (err);
        return;
      }
      console.log (chalk.red (`${text}\r\n`));
    }
  );
}

function outSuccess (text = 'success') {
  figlet (
    text || 'aiyou-npc',
    {
      font: 'Jacky',
      horizontalLayout: 'full',
      verticalLayout: 'full',
    },
    function (err, text) {
      if (err) {
        console.log (chalk.red (`\noutput bad.\r\n`));
        console.dir (err);
        return;
      }
      console.log (chalk.green (`${text}\r\n`));
    }
  );
}

module.exports = {
  out,
  outError,
  outSuccess,
};
