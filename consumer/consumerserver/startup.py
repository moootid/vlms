import argparse
import os
import platform
import subprocess
import socket


def parse_domain(domain):
    if domain is not None and domain != "":
        pass
    else:
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
    print(f"domain is set to {domain}")


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


def run_script():
    os_type = platform.system()
    if os_type == "Windows":
        # script = "build_and_run.bat"
        script = os.path.join(os.path.dirname(
            os.path.abspath(__file__)), "build_and_run.bat")
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


def run(domain="mokh32.com"):
    port = 8080
    while True:
        print(f"Checking port {port}...")
        if check_port_in_use(port):
            print(f"Port {port} is in use.")
            port += 1
        else:
            print(f"Port {port} is not in use.")
            update_env_file("PORT",port)
            parse_domain(domain)
            run_script()
            break
    return port


if __name__ == "__main__":
    run()
