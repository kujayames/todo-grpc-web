This is an example todo list web application using gRPC-Web as a backend
adapted from the [`helloworld` example](https://github.com/grpc/grpc-web/tree/35284bfe156fc41bbcdd554ac423a587d93ff8da/net/grpc/gateway/examples/helloworld)
in the grpc-web repository.

## Install Dependencies and Build Protos
```
./compile_protos.sh
npm install
npx webpack client.js
```
## Run the Example!

We are ready to run the Todo example. The following set of commands will
run the 3 processes all in the background.

 1. Run the NodeJS gRPC Service. This listens at port `:9090`.

 ```sh
 $ node server.js &
 ```

 2. Run the Envoy proxy. The `envoy.yaml` file configures Envoy to listen to
 browser requests at port `:8080`, and forward them to port `:9090` (see
 above).

 ```sh
 $ docker run -d -v "$(pwd)"/envoy.yaml:/etc/envoy/envoy.yaml:ro \
     --network=host envoyproxy/envoy:v1.22.0
 ```

> NOTE: As per [this issue](https://github.com/grpc/grpc-web/issues/436):
> if you are running Docker on Mac/Windows, remove the `--network=host` option:
>
> ```sh
> $ docker run -d -v "$(pwd)"/envoy.yaml:/etc/envoy/envoy.yaml:ro \
>     -p 8080:8080 -p 9901:9901 envoyproxy/envoy:v1.22.0
>  ```

 3. Run the simple Web Server. This hosts the static file `index.html` and
 `dist/main.js` we generated earlier.

 ```sh
 $ python3 -m http.server 8081 &
 ```

When these are all ready, you can open a browser tab and navigate to

```
localhost:8081
```

Open up the developer console and you should see the following printed out:

```
Hello! World
```
