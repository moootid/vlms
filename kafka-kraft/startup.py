import os
import platform
import subprocess
import socket
import argparse
import requests


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
from dotenv import load_dotenv

def check_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        result = sock.connect_ex(('localhost', port))
        return result == 0


def update_env_file(env, value):
    env_file = '.env'
    env_line_found = False
    lines = []
    # Read the current .env file
    try:
        with open(env_file, 'r') as file:
            lines = file.readlines()
    except FileNotFoundError:
        pass

    # Update the port line if found
    for i, line in enumerate(lines):
        if line.startswith(f'{env}='):
            env_line_found = True
            lines[i] = f'{env}={value}\n'

    # If the port line was not found, add it
    if not env_line_found:
        lines.append(f'{env}={value}\n')

    # Write the updated lines back to the .env file
    with open(env_file, 'w') as file:
        file.writelines(lines)
# API_KEY = os.getenv('API_KEY')
# API_SECRET = os.getenv('API_SECRET')
# DOMAIN = os.getenv('DOMAIN')
# RECORD_NAME = os.getenv('RECORD_NAME')
# NEW_IP = os.getenv('NEW_IP')
# def get_headers():
#     return {
#         'Authorization': f'sso-key {API_KEY}:{API_SECRET}',
#         'Content-Type': 'application/json'
#     }

# def update_dns_record():
#     url = f'https://api.godaddy.com/v1/domains/{DOMAIN}/records/A/{RECORD_NAME}'
#     data = [{
#         'data': NEW_IP,
#         'ttl': 600
#     }]
#     response = requests.put(url, headers=get_headers(), json=data)
#     if response.status_code == 200:
#         print('DNS record updated successfully')
#     else:
#         print('Failed to update DNS record')
#         print('Response:', response.text)

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
            print(f"domain is set to {domain}. You must open ports 9092, 9093, 9094 for {domain} from your firewall settings.")
        except ValueError:
            print("Invalid input. Please enter an integer value.")
            return
    else:
        domain = args.domain
    update_env_file("DOMAIN", domain)
    # Use the domain value (for demonstration, we just print it)
    print(f"domain is set to {domain}")


def run_script():
    os_type = platform.system()
    if os_type == "Windows":
        script = os.path.join(os.path.dirname(
            os.path.abspath(__file__)), "build_and_run.bat")
        print(f"Running {script}")
        command = [script]
    else:
        script = "./build_and_run.sh"
        command = ["bash", script]

    if os.path.exists(script):
        try:
            subprocess.run(command, check=True)
            print(f"Successfully ran {script}.")
        except subprocess.CalledProcessError as e:
            print(f"Failed to run {script}. Error: {e}")
    else:
        print(f"Script {script} does not exist.")

def check_service_status():
    ports = [8081, 9092, 9093, 9094]
  
    for port in ports:
        if check_port_in_use(port):
            print(f"OK: Port {port} is in use.")
        else:
            print(f"ERROR: Port {port} is not in use. Please check the service.")
            return
    print(f"Service is running successfully.")

def run():
    parse_domain()
    ports = [8081, 9092, 9093, 9094]
    is_ports_in_use = False
    for port in ports:
        if check_port_in_use(port):
            print(f"Port {port} is in use.")
            print(f"Please free up port {port} and try again.")
            is_ports_in_use = True
            break
    if not is_ports_in_use:
        run_script()
        check_service_status()



if __name__ == "__main__":
    run()
