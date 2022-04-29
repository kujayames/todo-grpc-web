var PROTO_PATH = __dirname + '/todo.proto';

var assert = require('assert');
var async = require('async');
var _ = require('lodash');
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
var { Todo } = require('./todo_pb.js');
var todo = protoDescriptor.todo;

var todos = [];

/**
 * @param {!Object} call
 * @param {function():?} callback
 */
function doCreateTodo(call, callback) {
  const todo = new Todo();
  todo.setTitle(call.request.title);
  todos.push(todo)
  callback(null, {todo_id: (todos.length - 1).toString()});
}

function doGetTodo(call, callback) {
  const todo = todos[call.request.todo_id];
  callback(null, {todo: todo.toObject()});
}

/**
 * @return {!Object} gRPC server
 */
function getServer() {
  var server = new grpc.Server();
  server.addService(todo.TodoTracker.service, {
    createTodo: doCreateTodo,
    getTodo: doGetTodo
  });
  return server;
}

if (require.main === module) {
  var server = getServer();
  server.bindAsync(
    '0.0.0.0:9090', grpc.ServerCredentials.createInsecure(), (err, port) => {
      assert.ifError(err);
      console.log("Starting server!");
      server.start();
  });
}

exports.getServer = getServer;
