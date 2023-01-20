const Queue = require("../models/queue");
var qjobs = new require("qjobs");

module.exports = async () => {
  const queues = await Queue.find({
    done: false,
    job_type: "UPLOAD",
  })

  if (queues.length) {
    var q = new qjobs({ maxConcurrency: queues.length });
    var myjob = function (item, next) {
      //todos
      console.log(item);
      next();

    };

    queues.forEach((element) => {
      q.add(myjob, element);
    });

    q.on("start", function () {
      console.log("Starting ...");
    });

    q.on("end", function () {
      console.log("... All jobs done");
    });

    q.on("jobStart", function (item) {
      console.log("jobStart", item);
    });

    q.on("jobEnd", async function (item) {
      console.log("jobend", item);

      // If i'm jobId 10, then make a pause of 5 sec

      if (item._jobId == 10) {
        q.pause(true);
        setTimeout(function () {
          q.pause(false);
        }, 50000);
      }

      const queItem = await Queue.findById(item._id);
      queItem.done  = true;
      await queItem.save();
    });

    q.on("pause", function (since) {
      console.log("in pause since " + since + " milliseconds");
    });

    q.on("unpause", function () {
      console.log("pause end, continu ..");
    });

    q.run();
  }
};
