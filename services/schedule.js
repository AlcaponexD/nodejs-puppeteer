const nodeSchedule = require("node-schedule");

//Executa a cada min
const job = nodeSchedule.scheduleJob("*/1 * * * *", () => {
  console.log(new Date());
});
console.log(job.nextInvocation());
