# openlawnz-parser

## Parsers Quick Start for Openlaw NZ volunteers

1. Ask for a copy of the OpenLaw NZ DB in the Slack channel for your own PostgreSQL server setup
    * If you're interested in volunteering please get in touch!
2. Follow "[General requirements](#general-requirements)", "[env](#env)" and "[Installing](#installing)" steps below
3. Look at the [Database Setup](#database-setup) section
3. Look at the [Parser](#parser) section

## General requirements

- Yarn
- Rename `.env.sample` to .env.`env` (e.g. `.env.local`) and fill in with PostgreSQL details.
   ```bash
   cp .env.sample .env
   ```
- Docker

## env

Where you see the `env` option in a command, it will look for the corresponding ".env.`env`" file in the root of the project. You could have `.env.local` and `.env.dev`, for example.

## Installing

```bash
yarn install
```

## Database Setup

There are 2 schemas:

- `pipeline_cases`: this is populated by running the pipeline and is not affected by the parsers
- `cases`: this is populated and mutated by running the parsers

To setup a docker environment, you can find `docker.sh` at [openlawnz-orchestration](https://github.com/openlawnz/openlawnz-orchestration). Run the bash script.

And check if it has correctly restored SQL dump file.
```bash
# see all containers available
docker ps -a
# open psql cli
docker exec -it [container-name/id] psql -U <username> -d <db-name>
```

To see tables
```bash
# in psql cli
\dt *.*
```

To use `docker-compose`, you may find this page [Getting started with Docker](https://github.com/openlawnz/openlawnz-api/wiki/%F0%9F%9B%B3%EF%B8%8F-Getting-started-with-Docker) useful.

## Parser

- Each time a full run of the parsers is started the `cases` database is emptied and filled with the `pipeline_cases` data before running through each parser
- Each script can be run individually

### Running example

```bash
cd parser
node parseCaseToCase.js --env=<env>
```

- To run all the scripts
```bash
node index.js --env=<env>
```

### Testing
- When you make a pull request, `yarn test` will automatically start via Github Action. To run locally, use `yarn test` in your local terminal

## NOTICE

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
