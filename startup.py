import argparse
import sys
from pick import pick
import subprocess
from consumer import startup as _consumer
from producerclient import startup as _producer_client
import os
import platform
from kafkakraft import startup as _kafkakraft

def install_dependencies():
    os_type = platform.system()
    if os_type == "Windows":
        script = os.path.join(os.path.dirname(
            os.path.abspath(__file__)), "install_dep.bat")
        print(f"Running {script}")
        command = [script]
    else:
        script = "./install_dep.sh"
        command = ["bash", script]
    if os.path.exists(script):
        try:
            subprocess.run(command, check=True)
            print(f"Successfully ran {script}.")
        except subprocess.CalledProcessError as e:
            print(f"Failed to run {script}. Error: {e}")
    else:
        print(f"Script {script} does not exist.")


install_dependencies()


def choose_run_mode():
    title = 'Please choose the run mode: '
    options = ['Consumer & Producer (Recommended)',
               'On Cloud (No Installation)', 'Fully local (Not recommended)']
    option, index = pick(options, title)
    print(f"Selected mode: {option}")
    return index


def parse_domain():
    # Set up command line argument parser
    parser = argparse.ArgumentParser(description='Process some input.')
    parser.add_argument('--domain', type=int,
                        help='domain to use for the application (default: mokh32.com)')
    # Parse the arguments
    args = parser.parse_args()

    # If the domain is not provided in the command line arguments, prompt the user
    if args.domain is None:
        domain = input("domain (default: mokh32.com): ")
        try:
            if domain == "":
                domain = "mokh32.com"
            domain = str(domain)
            print(f"domain is set to {domain}. You must open ports 9092, 9093, 9094 for {
                domain} from your firewall settings.")
        except ValueError:
            print("Invalid input. Please enter an integer value.")
            return
    else:
        domain = args.domain
    print(f"domain is set to {domain}")
    return domain


# def run_script(domain="mokh32.com"):

def run_consumer(domain="mokh32.com"):
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "consumer")
    os.chdir(path)
    _consumer.run(domain)


def run_producer(domain="mokh32.com"):
    path = os.path.join(os.path.dirname(
        os.path.abspath(__file__)), "producerclient")
    os.chdir(path)
    return _producer_client.run(domain)

def run_kafkakraft(domain="mokh32.com"):
    path = os.path.join(os.path.dirname(
        os.path.abspath(__file__)), "kafkakraft")
    os.chdir(path)
    return _kafkakraft.run(domain)

def open_browser(url):
    if sys.platform =='win32':
        os.startfile(url)
    elif sys.platform =='darwin':
        subprocess.Popen(['open', url])
    else:
        try:
            subprocess.Popen(['xdg-open', url])
        except OSError:
            print ('Please open a browser on: '+url)

if __name__ == "__main__":
    # ['Consumer & Producer (Recommended)','On Cloud', 'Fully local (Not recommended)']
    mode = choose_run_mode()
    if mode == 0:
        if run_producer():
            run_consumer()
    elif mode == 1:
        open_browser(f"https://vlms.mokh32.com")
    elif mode == 2:
        domain = parse_domain()
        run_kafkakraft(domain)
        if run_producer(domain):
            run_consumer(domain)
