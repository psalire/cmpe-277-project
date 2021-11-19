
import Server from "./Server";
import { ArgumentParser } from "argparse";

const argparser = new ArgumentParser({});
argparser.add_argument('-p', '--port', { help: 'Port to run server on' });
argparser.add_argument('--api', { help: 'Which reverse geocode API to use (MapBox, BigDataCloud,)', default: "mapbox" });
const args = argparser.parse_args();

Server.start();
