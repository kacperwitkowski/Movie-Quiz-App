function gameRoutes(app) {
  let counter = 0;

  const questions = require("../questions.json");
  let randomQuestion = Math.floor(Math.random() * questions.length);

  app.get("/question", (req, res) => {
    const nextQuestion = questions[randomQuestion];
    const { question, answers } = nextQuestion;

    res.json({
      question,
      answers,
    });
  });

  app.post("/answer/:index", (req, res) => {
    const { index } = req.params;
    let question = questions[randomQuestion];
    const isGoodAnswer = question.goodAnswer === Number(index);

    if (counter === 3) {
      isWin = true;
      questions.splice(randomQuestion, 1);
      randomQuestion = Math.floor(Math.random() * questions.length);
      counter = 0;
    }

    if (isGoodAnswer) {
      questions.splice(randomQuestion, 1);
      randomQuestion = Math.floor(Math.random() * questions.length);
      counter++;
    } else {
      isGameOver = true;
      questions.splice(randomQuestion, 1);
      randomQuestion = Math.floor(Math.random() * questions.length);
      counter = 0;
    }

    res.json({
      correct: isGoodAnswer ? true : false,
      counter,
      isGameOver: isGoodAnswer ? false : true,
      isWin: counter === 3 ? true : false,
    });
  });

  app.get("/help/walter", (req, res) => {
    const knowAnswer = Math.random() < 0.8;
    const question = questions[randomQuestion];

    const possibleQuotes = [
      "I am the one who... calls or at least help my students, I would choose this one:",
      "Let's cook! I mean solve quiz together of course! I think the good answer is:",
      "You're in danger Jess... Oh i didn't see you there! Choose this answer and get out of here:",
    ];
    const randomNumber = Math.floor(Math.random() * possibleQuotes.length);

    res.json({
      text: knowAnswer
        ? `${possibleQuotes[randomNumber]} '${
            question.answers[question.goodAnswer]
          }'`
        : "You clearly don’t know who you’re talking to.",
    });
  });

  app.get("/help/batman", (req, res) => {
    const knowAnswer = Math.random() < 0.67;
    const question = questions[randomQuestion];

    const possibleQuotes = [
      "I like you' you seem nice. The correct answer is:",
      "#$@&%*! Why to the freaking hell you disturbing me!! Want an a answer for that simple question? Pathetic, but I will be kind this time: ",
      "Don't tell anyone I'm helping you, it could ruin my opinion. Your answer is:",
      "Are you not a fan   of the Joker?? If you lied to me... I will find you! Anyway the answer is:",
      "Superman is asking for my help? I knew this day would come! I have to tell this to Robin, he won't believe me. Your answer 'Super'man is:",
    ];
    const randomNumber = Math.floor(Math.random() * possibleQuotes.length);

    res.json({
      text: knowAnswer
        ? `${possibleQuotes[randomNumber]} '${
            question.answers[question.goodAnswer]
          }'`
        : "I'm too busy for this simple question, you have to handle it on your own",
    });
  });

  app.get("/help/half", (req, res) => {
    const question = questions[randomQuestion];
    const answerArrayCopy = question.answers.filter(
      (el, i) => i != question.goodAnswer
    );

    answerArrayCopy.splice(
      Math.floor(Math.random() * answerArrayCopy.length),
      1
    );

    res.json({
      answersToRemove: answerArrayCopy,
    });
  });

  app.get("/help/audience", (req, res) => {
    const charts = [10, 20, 30, 40];
    for (let i = charts.length - 1; i > 0; i--) {
      const change = Math.floor(Math.random() * 20 - 10);

      charts[i] += change;
      charts[i - 1] -= change;
    }

    const question = questions[randomQuestion];

    const { goodAnswer } = question;

    [charts[3], charts[goodAnswer]] = [charts[goodAnswer], charts[3]];

    res.json({
      chart: charts,
    });
  });
}
module.exports = gameRoutes;
