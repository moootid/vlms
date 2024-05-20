import os
import platform
import subprocess
import argparse

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
def parse_interval():
    # Set up command line argument parser
    parser = argparse.ArgumentParser(description='Process some input.')
    parser.add_argument('--interval', type=int, help='Interval in milliseconds')
    # Parse the arguments
    args = parser.parse_args()

    # If the interval is not provided in the command line arguments, prompt the user
    if args.interval is None:
        interval = input("Interval in ms (integer): ")
        try:
            if interval == "":
                interval = 1000
            interval = int(interval)
        except ValueError:
            print("Invalid input. Please enter an integer value.")
            return
    else:
        interval = args.interval
    update_env_file("INTERVAL",interval)
    # Use the interval value (for demonstration, we just print it)
    print(f"Interval is set to {interval} ms")
def parse_keys():
    # Set up command line argument parser
    parser = argparse.ArgumentParser(description='Process some input.')
    parser.add_argument('--keys', type=int, help='keys in number')

    # Parse the arguments
    args = parser.parse_args()

    # If the keys is not provided in the command line arguments, prompt the user
    if args.keys is None:
        keys = input("Number of cars (integer): ")
        try:
            if keys == "":
                keys = 100
            keys = int(keys)
        except ValueError:
            print("Invalid input. Please enter an integer value.")
            return
    else:
        keys = args.keys
    update_env_file("NUMBER_OF_KEYS",keys)
    # Use the keys value (for demonstration, we just print it)
    print(f"Number of cars is set to {keys}")
def parse_coordinates():
    # Set up command line argument parser
    parser = argparse.ArgumentParser(description='Process some input.')
    parser.add_argument('--coordinates', type=str, help='coordinates in string')

    # Parse the arguments
    args = parser.parse_args()

    # If the coordinates is not provided in the command line arguments, prompt the user
    if args.coordinates is None:
        coordinates = input("Coordinates [MAX_LAT,MIN_LAT,MAX_LONG,MIN_LONG] (float): ")
    else:
        coordinates = args.coordinates

    # Convert the coordinates string to a list of floats
    try:
        if coordinates == "":
            coordinates = "1.00,-0.01,53.10,51.01"
        coordinates = [float(coord) for coord in coordinates.split(',')]
    except ValueError:
        print("Invalid input. Please enter comma-separated float values.")
        return

    # Check if the coordinates list has exactly 4 values
    if len(coordinates) != 4:
        print("Invalid input. Please enter 4 float values.")
        return

    # Update the environment variables with the coordinates
    update_env_file("MAX_LAT", str(coordinates[0]))
    update_env_file("MIN_LAT", str(coordinates[1]))
    update_env_file("MAX_LONG", str(coordinates[2]))
    update_env_file("MIN_LONG", str(coordinates[3]))

    # Use the coordinates value (for demonstration, we just print it)
    print(f"Coordinates are set to {coordinates}")
def run_script():
    os_type = platform.system()
    if os_type == "Windows":
        script = "build_and_run.bat"
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

if __name__ == "__main__":
    parse_interval()
    parse_keys()
    parse_coordinates()
    run_script()
