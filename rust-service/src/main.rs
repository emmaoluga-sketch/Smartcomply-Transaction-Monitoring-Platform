use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};

fn handle_client(mut stream: TcpStream) {
    let mut buffer = [0; 512];
    let _ = stream.read(&mut buffer);
    let response = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"hash\":\"static-hash-12345\"}";
    let _ = stream.write(response.as_bytes());
}

fn main() {
    let listener = TcpListener::bind("0.0.0.0:8080").expect("Failed to bind to port 8080");
    eprintln!("Rust hasher running on port 8080");
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                std::thread::spawn(|| handle_client(stream));
            }
            Err(e) => eprintln!("Connection failed: {}", e),
        }
    }
}