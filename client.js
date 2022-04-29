const {CreateTodoRequest, GetTodoRequest} = require('./todo_pb.js');
const {TodoTrackerClient} = require('./todo_grpc_web_pb.js');

var client = new TodoTrackerClient('http://' + window.location.hostname + ':8080',
                               null, null);

var createTodoRequest = new CreateTodoRequest();
createTodoRequest.setTitle('Make a gRPC-web demo');

client.createTodo(createTodoRequest, {}, (err, response) => {
  if (err) {
    console.log(`Unexpected error for createTodo: code = ${err.code}` +
                `, message = "${err.message}"`);
  } else {
    const getTodoRequest = new GetTodoRequest();
    getTodoRequest.setTodoId(response.getTodoId());
    client.getTodo(getTodoRequest, {}, (err, response) => {
      if (err) {
        console.log(`Unexpected error for createTodo: code = ${err.code}` +
        `, message = "${err.message}"`);
      } else {
        console.log(`Got todo: title: ${response.getTodo().getTitle()}, isComplete: ${response.getTodo().getIsComplete()}`);
      }
    })
  }
});
