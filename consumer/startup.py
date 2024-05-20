import subprocess
import os
import platform
from .consumerserver import startup as consumer_server
from .vlmsconsumer import startup as web_consumer


def run(domain="mokh32.com"):
    path = os.path.join(os.path.dirname(
        os.path.abspath(__file__)), "consumerserver")
    print("Changing directory to consumerserver:")
    print(path)
    os.chdir(path)
    ws_port = consumer_server.run(domain)
    print(f"Websocket server running on port {ws_port}")
    path = os.path.join(os.path.dirname(
        os.path.abspath(__file__)), "vlmsconsumer")
    print("Changing directory to vlmsconsumer:")
    print(path)
    os.chdir(path)
    web_consumer.run(ws_port)


if __name__ == "__main__":
    run()
