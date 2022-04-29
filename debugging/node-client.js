// NOTE: This client is used for debugging the node gRPC server WITHOUT the
// Envoy proxy. It does not use the gRPC-Web protocol.

var PROTO_PATH = __dirname + '/../todo.proto';

var async = require('async');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var todo = protoDescriptor.todo;
var client = new todo.TodoTracker('localhost:9090',
                                    grpc.credentials.createInsecure());

/**
 * @param {function():?} callback
 */
function runCreateTodo(callback) {
  client.createTodo({title: 'Run createTodo'}, {}, (err, response) => {
    console.log(response.todo_id);
    callback();
  });
}


/**
 * Run all of the demos in order
 */
function main() {
  async.series([
    runCreateTodo,
  ]);
}

if (require.main === module) {
  main();
}
