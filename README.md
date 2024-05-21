# Vehicle Location Management System (VLMS)

## Overview
The Vehicle Location Management System (VLMS) is a distributed real-time vehicle tracking system designed to efficiently manage and process vehicle location data across a network. The system uses Apache Kafka in Kraft mode for high availability and fault tolerance, and Docker to containerize the application components for easy deployment and scalability.

## Features
- **High Availability**: Ensures continuous operation with a fault-tolerant Kafka setup.
- **Scalability**: Easily scales to handle increasing data volumes and user demand.
- **Real-Time Processing**: Achieves low-latency data processing essential for real-time applications.
- **Platform Flexibility**: Supports running on different platforms including Windows _(Tested)_, Debian Linux _(Tested)_, WSL Ubuntu _(Tested)_ , and MacOS _(Tested)_.

## System Components
1. **Producers (Vehicles)**: Send location and timestamp data.
2. **Kafka in Kraft Mode**: Distributes logs using Raft consensus.
3. **Consumers**: Receive, process, and update vehicle information.
4. **User Interface (UI)**: Displays vehicle locations on a map using React.

## Setup Options
- **Hybrid Setup**: Kafka in the cloud, producers and consumers locally.
- **Full Cloud Setup**: All components running in the cloud.
- **Full Local Setup**: All components running locally (requires manual network setup).

## Installation

### Prerequisites
- Docker and Docker Compose
- Python 3.x
- Python pick package (pip install pick)

### Step-by-Step Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/moootid/vlms.git
   cd vlms

## Usage

### Running the Application

#### Select the Run Mode
Upon running `startup.py`, choose the desired setup mode:
- **Consumer & Producer (Recommended)** Kafka in the cloud, producers and consumers locally.
- **On Cloud (No Installation)** All components running in the cloud.
- **Fully Local (Not Recommended)** All components running locally (requires manual network setup).

#### Select the Running Speed
You will also be prompted to choose the running speed:
- **Demo**: Light mode for demonstration purposes.
- **Test**: Medium load for testing.
- **Chios**: Heavy load, high resource consumption.
- **Custom**: Define your own custom settings.

#### Access the UI
Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) (or the assigned port).
You can also use [https://vlms.mokh32.com](https://vlms.mokh32.com) if you are using **Consumer & Producer (Recommended)** or **On Cloud (No Installation)**.

### Environment Variables
- **DOMAIN**: Set the domain for Kafka brokers (default: `vlms.mokh32.com`).
- **INTERVAL**: Set the interval for producers to send location data (default: `1000` ms).
- **NUMBER_OF_KEYS**: Number of vehicles to simulate (default: `100`).
- **MIN_LAT, MAX_LAT, MIN_LONG, MAX_LONG**: Set the range for random coordinates.

### Configuration
Modify the `.env` file in the root directory to configure environment-specific settings.

## Future Work
- Enhance fault tolerance and scalability.
- Implement advanced geospatial querying capabilities.
- Integrate with external APIs for additional data sources.

## Acknowledgements
Special thanks to **Dr. Ayaz ul Hassan Khan** at **KFUPM** COE 523 course for providing the foundational knowledge and support.
