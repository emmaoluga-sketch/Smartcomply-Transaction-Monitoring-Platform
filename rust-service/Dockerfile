FROM rust:1-alpine AS builder
WORKDIR /app
COPY Cargo.toml ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release --target x86_64-unknown-linux-musl
RUN rm -rf src
COPY src ./src
RUN cargo build --release --target x86_64-unknown-linux-musl

FROM alpine:3.18
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/smartcomply-hasher /usr/local/bin/smartcomply-hasher

# Start the server in the background and keep the container alive
CMD ["/bin/sh", "-c", "/usr/local/bin/smartcomply-hasher & tail -f /dev/null"]