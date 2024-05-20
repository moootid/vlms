import subprocess
from consumerserver.startup import run as run_consumer_server
from vlmsconsumer.startup import run as run_web_consumer
import os
import platform

if __name__ == "__main__":
    os_type = platform.system()
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "consumerserver")
    print("Changing directory to consumerserver:")
    print(path)
    os.chdir(path)
    ws_port = run_consumer_server()
    print(f"Websocket server running on port {ws_port}")
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vlmsconsumer")
    print("Changing directory to vlmsconsumer:")
    print(path)
    os.chdir(path)
    run_web_consumer(ws_port)